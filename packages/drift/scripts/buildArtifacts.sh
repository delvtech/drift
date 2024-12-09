#!/bin/bash
set -e

max_file_size=1000000 # 1MB
contracts_dir="../../contracts"
out_dir="$contracts_dir/out"
artifacts_dir="src/artifacts"

if [ ! -d "$artifacts_dir" ]; then
  mkdir -p "$artifacts_dir"
fi

if [ ! -d "$out_dir" ]; then
  echo "Compiling contracts..."
  (
    cd "$contracts_dir"
    forge install
    forge build --skip test --skip script
  )
fi

echo "Creating typescript files..."

# Reset the directories
(
  cd "$artifacts_dir"
  rm -rf ./*
)

function processOutDir() {
  local dir=$1
  for entry in "$dir"/*; do

    # Ignore build info and test contracts
    if [[ "$entry" == *"build-info" ]] || [[ "$entry" == *"test"* ]]; then
      continue
    fi

    # Recursively process directories
    if [[ -d "$entry" ]]; then
      processOutDir "$entry"

    # Process files
    elif [[ -f "$entry" ]]; then

      # Get the name of the contract
      local contract_name=$(basename "$entry" .json)

      # Omit contracts with "test"/"Test" in the name
      if [[ "$contract_name" == *"test"* ]] || [[ "$contract_name" == *"Test"* ]]; then
        continue
      fi

      # Ignore the contract if the file is too large. This prevents TSC from
      # throwing errors while trying to parse large files and prevents the
      # script from processing files we probably don't want to be importing into
      # our codebase.
      local file_size=$(wc -c <"$entry")
      if [ "$file_size" -gt "$max_file_size" ]; then
        echo "WARNING: File $entry is too large ($(echo $file_size | tr -d ' ') bytes) and will be omitted."
        continue
      fi

      # Get the fields we care about
      local abi=$(jq -r .abi <"$entry")
      local bytecode=$(jq -r .bytecode.object <"$entry")
      local methodIdentifiers=$(jq -r '.methodIdentifiers // "{}"' <"$entry")

      # Write the contract to a typescript file as a named export.
      local out_file="$artifacts_dir/$contract_name.ts"
      {
        echo "export const $contract_name = {"
        echo "  abi: $abi as const,"
        echo "  bytecode: '$bytecode' as \`0x\${string}\`,"
        echo "  methodIdentifiers: $methodIdentifiers as const"
        echo "};"
      } >"$out_file"
    fi
  done
}

processOutDir "$out_dir"
