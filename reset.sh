#!/bin/bash
set -e

rm -rf node_modules
rm -rf ./**/node_modules
yarn cache clean
yarn
