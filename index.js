/* global WebAssembly */

const fs = require('fs')
const path = require('path')

const ImageData = require('@canvas/image-data')

const stubs = {
  fd_close () { throw new Error('Syscall fd_close not implemented') },
  fd_seek () { throw new Error('Syscall fd_seek not implemented') },
  fd_write () { throw new Error('Syscall fd_write not implemented') }
}

const code = fs.readFileSync(path.join(__dirname, 'webp.wasm'))
const wasmModule = new WebAssembly.Module(code)
const instance = new WebAssembly.Instance(wasmModule, { wasi_snapshot_preview1: stubs })

exports.decode = function (input) {
  // Allocate memory to hand over the input data to WASM
  const inputPointer = instance.exports.malloc(input.byteLength)
  const targetView = new Uint8Array(instance.exports.memory.buffer, inputPointer, input.byteLength)

  // Copy input data into WASM readable memory
  targetView.set(input)

  // Allocate metadata (width & height)
  const metadataPointer = instance.exports.malloc(8)

  // Decode input data
  const outputPointer = instance.exports.WebPDecodeRGBA(inputPointer, input.byteLength, metadataPointer, metadataPointer + 4)

  // Free the input data in WASM land
  instance.exports.free(inputPointer)

  // Guard return value for NULL pointer
  if (outputPointer === 0) {
    instance.exports.free(metadataPointer)
    throw new Error('Failed to decode WebP image')
  }

  // Read returned metadata
  const metadata = new Uint32Array(instance.exports.memory.buffer, metadataPointer, 2)
  const [width, height] = metadata

  // Free the metadata in WASM land
  instance.exports.free(metadataPointer)

  // Create an empty buffer for the resulting data
  const outputSize = (width * height * 4)
  const output = new Uint8ClampedArray(outputSize)

  // Copy decoded data from WASM memory to JS
  output.set(new Uint8Array(instance.exports.memory.buffer, outputPointer, outputSize))

  // Free WASM copy of decoded data
  instance.exports.free(outputPointer)

  // Return decoded image as raw data
  return new ImageData(output, width, height)
}
