#!/bin/sh
# Rebuild "São José" from scratch: events → score → mix → frames → master.
set -e
LIB=/Users/yurimatos/lemo-opuscar
export LIB
HERE=$(cd "$(dirname "$0")" && pwd)
mkdir -p "$HERE/out"
cd "$LIB"
node core/render/events.mjs "$HERE"
"$LIB/.venv/bin/python" "$HERE/score.py"
"$LIB/.venv/bin/python" "$HERE/mix.py"
node core/render/video.mjs "$HERE" --fps 24 --workers 4 --out "$HERE/out/video.mp4"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/sao-jose.mp4" 24 0
