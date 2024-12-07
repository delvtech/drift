#!/bin/bash
set -e

# Clones the ethereum/execution-apis repo and generates types from the open-rpc schema.
#
# Usage: $0 [branch] [repo_url]
#
# branch:    The branch to clone. (default: $default_branch)
# repo_url:  The url of the git repository to clone. (default: $default_repo_url)

# SETTINGS
default_branch="main"
default_repo_url="git@github.com:ethereum/execution-apis.git"
schema_doc="refs-openrpc.json"
src_dir="generated/execution-apis"

if [ ! -d "$src_dir" ]; then
  branch=${1:-$default_branch}
  repo_url=${2:-$default_repo_url}
  temp_dir=$(mktemp -d "execution-apis_temp.XXXXXX")

  # Echo settings
  echo "Branch: $branch"
  echo "Repo URL: $repo_url"
  echo ""

  git clone --depth 1 "$repo_url" --branch "$branch" "$temp_dir"

  echo "Installing dependencies and generating OpenRPC schema..."
  (
    cd "$temp_dir"
    npm i ci
    npm run build
  )
  cp "$temp_dir/$schema_doc" openrpc.json

  echo "Deleting temp clone..."
  rm -rf "$temp_dir"
fi

echo "Generating types..."
if [ -d "$src_dir" ]; then
  (
    cd "$src_dir"
    rm -rf ./*
  )
else
  mkdir -p "$src_dir"
fi
npx open-rpc-typings --output-ts "$src_dir"
