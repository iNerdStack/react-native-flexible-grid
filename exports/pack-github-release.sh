#!/bin/bash

# Navigate to the project root directory; assumes the script is run from the exports directory
cd ..

# Fetch package name and version directly from package.json
version=$(npm pkg get version | tr -d '"')
name=$(npm pkg get name | tr -d '"')

# Sanitize package name for use in filename
sanitizedName=$(echo "$name" | sed 's/@//;s/\//-/')

# Define output filename base, saving archives in the exports directory
outputFilename="exports/${sanitizedName}-${version}"

# Create .tar.gz archive
tar --exclude='node_modules' \
    --exclude='.git' \
    --exclude='exports' \
    --exclude='.expo' \
    --exclude='.vscode' \
    --exclude='temp' \
    --exclude='.yarn/cache' \
    --exclude='.yarn/install-state.gz' \
    --exclude='*.zip' \
    --exclude='*.tar.gz' \
    -cvzf "${outputFilename}.tar.gz" .

# Create .zip archive
zip -r "${outputFilename}.zip" . \
    -x '*node_modules*' \
    -x '*.expo*' \
    -x '.vscode' \
    -x '*.git*' \
    -x 'exports/*' \
    -x 'temp/*' \
    -x '.yarn/cache/*' \
    -x '.yarn/install-state.gz' \
    -x '*.zip' \
    -x '*.tar.gz'
