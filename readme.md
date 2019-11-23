# WebP

WebP decoding for Node.js, using [libwebp][libwebp] compiled to [WebAssembly][WebAssembly].

[libwebp]: https://developers.google.com/speed/webp/docs/api
[WebAssembly]: https://webassembly.org

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

### `decode(source)`

- `source` ([`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), required) - The WEBP data
- returns [`ImageData`](https://developer.mozilla.org/en-US/docs/Web/API/ImageData) - Decoded width, height and pixel data
