#!/bin/bash
set -e

# Clones the ethereum/execution-apis repo and generates types from the open-rpc schema.
#
# Usage: $0 [branch] [repo_url]
#
# branch:    The branch to clone. (default: $default_branch)
# repo_url:  The url of the git repository to clone. (default: $default_repo_url)

# SETTINGS
default_repo_url="git@github.com:ethereum/execution-apis.git"
default_branch="main"
schema_doc="refs-openrpc.json"
out_schema_doc="openrpc.json"
src_dir="src"
src_name="execution-apis"
out_file="$src_dir/$src_name".ts

if [ ! -f "$out_schema_doc" ]; then
  branch=${1:-$default_branch}
  repo_url=${2:-$default_repo_url}
  temp_dir=$(mktemp -d "execution-apis_temp.XXXXXX")

  echo "Repo URL: $repo_url"
  echo "Branch: $branch"
  echo ""

  git clone --depth 1 "$repo_url" --branch "$branch" "$temp_dir"

  echo "Installing dependencies and generating OpenRPC schema..."
  (
    cd "$temp_dir"
    npm i ci
    npm run build
  )
  cp "$temp_dir/$schema_doc" "$out_schema_doc"

  echo "Deleting temp clone..."
  rm -rf "$temp_dir"
fi

echo "Generating types..."
npx open-rpc-typings -d "$out_schema_doc" --output-ts "$src_dir" --name-ts "$src_name"

# Convert source name to PascalCase
pascal_src_name=$(echo "$src_name" |
  sed 's/-/ /g' |
  awk '{
      for (i=1; i<=NF; i++) {
        $i = toupper(substr($i,1,1)) substr($i,2)
      }
      print
    }' |
  sed 's/ //g')

{
  echo "/* eslint-disable */"
  echo "/* @ts-nocheck */"
  echo ""
  echo "// This file was generated from the ethereum/execution-apis repo."
  echo "// See https://github.com/ethereum/execution-apis for more information."
  echo "//"
  echo "// Changes to this file may cause incorrect behavior and will be lost if"
  echo "// the code is regenerated."
  echo ""
  echo ""
  echo "export namespace $pascal_src_name {"
  cat "$out_file"
  echo "}"
} >"$out_file.tmp"
mv "$out_file.tmp" "$out_file"
