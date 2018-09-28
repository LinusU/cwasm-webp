# WebP

WebP decoding for Node.js, using [libwebp][libwebp] compiled to [WebAssembly][WebAssembly].

## Installation

```sh
npm install --save @cwasm/webp
```

## Usage

```js
const fs = require('fs')
const webp = require('@cwasm/webp')

const source = fs.readFileSync('image.webp')
const image = webp.decode(source)

console.log(image)
// { width: 128,
//   height: 128,
//   data:
//    Uint8ClampedArray [ ... ] }
```

## API

### `decode(source: Uint8Array): ImageData`

Decodes raw WebP data into an [`ImageData`][ImageData] object.

[ImageData]: https://developer.mozilla.org/en-US/docs/Web/API/ImageData
[libwebp]: https://developers.google.com/speed/webp/docs/api
[WebAssembly]: https://webassembly.org
