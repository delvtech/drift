#!/bin/bash
set -e

# Settings
contracts_dir="../../contracts"
compile_out_dir="$contracts_dir/out"
ts_out_dir="src/artifacts"
max_file_size=1000000 # 1MB

package_name=$(jq -r .name package.json)
script_name=$(basename "$0")

cat <<EOF
+
|  $package_name $script_name
|
|  Generating TypeScript files from compiled contract artifacts...
|
|  Contracts directory: $contracts_dir
|  Output directory:    $ts_out_dir
|  Max file size:       $max_file_size bytes
+
EOF

echo "Compiling contracts..."
(
  cd "$contracts_dir"
  forge install
  forge build --skip test --skip script --force
)

echo "Creating typescript files..."
temp_out_dir=$(mktemp -d)
trap 'rm -rf "$temp_out_dir"' EXIT

find "$compile_out_dir" \
  -type d -name "build-info" -prune \
  -o \
  -type f -name "*.json" \
  ! -name "*.dbg.json" \
  -print |
  while IFS= read -r file; do
    file_size=$(wc -c <"$file" | tr -d ' ')
    if [ "$file_size" -gt "$max_file_size" ]; then
      echo "Skipping $file: File size ($file_size bytes) exceeds max size ($max_file_size bytes)."
      continue
    fi

    contract_name=$(basename "$file" .json)
    abi=$(jq -c .abi <"$file")
    bytecode=$(jq -r .bytecode.object <"$file")
    methodIdentifiers=$(jq -c .methodIdentifiers <"$file")

    cat >"$temp_out_dir/$contract_name.ts" <<-EOF
			export const $contract_name = {
			  name: '$contract_name' as const,
			  abi: $abi as const,
			  bytecode: '$bytecode' as \`0x\${string}\`,
			  methodIdentifiers: $methodIdentifiers as const,
			};
		EOF
  done

echo "Cleaning up..."
rm -rf "$ts_out_dir"
mv "$temp_out_dir" "$ts_out_dir"

echo "✅ Typescript files generated in $(realpath -q "$ts_out_dir")"
