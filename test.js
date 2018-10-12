/* eslint-env mocha */

const assert = require('assert')
const fs = require('fs')

const lodepng = require('lodepng')

const webp = require('./')

describe('WebP', () => {
  it('decodes "test.webp"', async () => {
    const referenceSource = fs.readFileSync('fixtures/test_ref.png')
    const reference = await lodepng.decode(referenceSource)

    const source = fs.readFileSync('fixtures/test.webp')
    const result = webp.decode(source)

    assert.strictEqual(result.width, reference.width)
    assert.strictEqual(result.height, reference.height)
    assert.deepStrictEqual(result.data, new Uint8ClampedArray(reference.data))
  })
})