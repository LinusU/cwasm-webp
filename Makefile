.PHONY: test

webp.wasm: Dockerfile
	docker build .
	sh -c 'docker run --rm -it $$(docker build -q .) | base64 --decode > webp.wasm'

test: webp.wasm index.js test.js
	@node_modules/.bin/mocha
