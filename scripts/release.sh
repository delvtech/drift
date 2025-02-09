#!/bin/bash
cp README.md packages/drift/README.md
turbo build
changeset publish