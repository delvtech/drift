#!/bin/bash
cp README.md packages/drift/README.md
yarn build
yarn changeset publish