FROM ubuntu:18.04

#########################
# Install prerequisites #
#########################

RUN \
  apt-get update && \
  apt-get install -y ca-certificates curl git

########################
# Install WASI SDK 8.0 #
########################

RUN curl -L https://github.com/CraneStation/wasi-sdk/releases/download/wasi-sdk-8/wasi-sdk-8.0-linux.tar.gz | tar xz --strip-components=1 -C /

#####################
# Build actual code #
#####################

WORKDIR /code

RUN git clone https://chromium.googlesource.com/webm/libwebp && cd libwebp && git checkout v1.0.3

# Relase build
RUN clang --sysroot=/share/wasi-sysroot --target=wasm32-unknown-wasi -Ilibwebp/ -flto -Oz     -o webp.wasm -nostartfiles -fvisibility=hidden -Wl,--no-entry,--demangle,--export=malloc,--export=free,--export=WebPDecodeRGBA,--strip-all -- libwebp/src/dec/*.c libwebp/src/dsp/*.c libwebp/src/demux/*.c libwebp/src/enc/*.c libwebp/src/mux/*.c libwebp/src/utils/*.c

# Debug build
# RUN clang --sysroot=/share/wasi-sysroot --target=wasm32-unknown-wasi -Ilibwebp/ -flto -O0 -g3 -o webp.wasm -nostartfiles -fvisibility=hidden -Wl,--no-entry,--demangle,--export=malloc,--export=free,--export=WebPDecodeRGBA             -- libwebp/src/dec/*.c libwebp/src/dsp/*.c libwebp/src/demux/*.c libwebp/src/enc/*.c libwebp/src/mux/*.c libwebp/src/utils/*.c

CMD base64 --wrap=0 webp.wasm
