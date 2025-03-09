#!/bin/bash
set -e
cp README.md packages/drift/README.md
yarn build
yarn changeset publish
