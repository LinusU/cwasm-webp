/* eslint-env mocha */

const assert = require('assert')
const fs = require('fs')

const ImageData = require('@canvas/image-data')
const lodepng = require('lodepng')

const webp = require('./')

describe('WebP', () => {
  it('decodes "test.webp"', async () => {
    const referenceSource = fs.readFileSync('fixtures/test_ref.png')
    const reference = await lodepng.decode(referenceSource)

    const source = fs.readFileSync('fixtures/test.webp')
    const result = webp.decode(source)

    assert(result instanceof ImageData)
    assert.strictEqual(result.width, reference.width)
    assert.strictEqual(result.height, reference.height)
    assert.deepStrictEqual(result.data, new Uint8ClampedArray(reference.data))
  })

  it('decodes "1.webp"', async () => {
    const source = fs.readFileSync('fixtures/1.webp')
    const result = webp.decode(source)

    assert(result instanceof ImageData)
    assert.strictEqual(result.width, 550)
    assert.strictEqual(result.height, 368)
  })
})
