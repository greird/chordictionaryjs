#!/usr/bin/env sh

# abort on errors
set -e

tar -czvf chordictionary.tar.gz build/
zip -r chordictionary.zip build/