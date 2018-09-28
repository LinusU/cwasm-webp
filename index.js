/* global WebAssembly */

const fs = require('fs')
const path = require('path')

const env = {
  __syscall0 (n) { throw new Error(`Syscall ${n} not implemented`) },
  __syscall1 (n, a) { throw new Error(`Syscall ${n} not implemented`) },
  __syscall2 (n, a, b) { throw new Error(`Syscall ${n} not implemented`) },
  __syscall3 (n, a, b, c) { throw new Error(`Syscall ${n} not implemented`) },
  __syscall4 (n, a, b, c, d) { throw new Error(`Syscall ${n} not implemented`) },
  __syscall5 (n, a, b, c, d, e) { throw new Error(`Syscall ${n} not implemented`) }
}

const code = fs.readFileSync(path.join(__dirname, 'webp.wasm'))
const wasmModule = new WebAssembly.Module(code)
const instance = new WebAssembly.Instance(wasmModule, { env })

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
  return { width, height, data: output }
}
