#!/usr/bin/env ts-node
import assert from "node:assert";
import { execSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, join, relative } from "node:path";
import manifest from "../package.json";

// Settings //

const branch = "main";
const repoUrl = "git@github.com:ethereum/execution-apis.git";
const schemaDoc = "refs-openrpc.json";
const outDir = "src/ethereum";
const tsOutFilename = "ethereum.ts";
const schemaOutFilename = "openrpc.json";

// Derived Constants //

const tsOutBasename = basename(tsOutFilename, ".ts");
const sanitizedTsOutFilename = `${tsOutBasename}.ts`;

// Output paths
const tsOutPath = join(outDir, sanitizedTsOutFilename);
const schemaOutPath = join(outDir, schemaOutFilename);

// Temp paths
const tempCloneDir = `${basename(repoUrl, ".git")}.temp`;
const tempTsOutPath = join(tempCloneDir, sanitizedTsOutFilename);
const tempSchemaOutPath = join(tempCloneDir, schemaDoc);

// Relative paths (for logging and final doc comment)
const cwd = process.cwd();
const relativeScriptPath = relative(cwd, import.meta.filename);
const relativeTsOutPath = relative(cwd, tsOutPath);
const relativeSchemaOutPath = relative(cwd, schemaOutPath);

console.log(`+
|  ${manifest.name} - ${relativeScriptPath}
|
|  Generating types from Ethereum OpenRPC schema...
|
|  Branch:        ${branch}
|  Repository:    ${repoUrl}
|  Output paths:
|    - Types:     ${relativeTsOutPath}
|    - Schema:    ${relativeSchemaOutPath}
+`);

// 1. Clone or update the repo
if (!existsSync(tempCloneDir)) {
  run(`git clone --depth 1 ${repoUrl} --branch ${branch} ${tempCloneDir}`);
} else {
  run(`git -C ${tempCloneDir} pull origin ${branch}`);
}

// 2. Generate OpenRPC schema
console.log("Generating OpenRPC schema...");
run("npm install --omit peer --package-lock false --force", tempCloneDir);
run("npm run build", tempCloneDir);
assert(
  existsSync(tempSchemaOutPath),
  `Error: Schema document "${schemaDoc}" not found at "${tempSchemaOutPath}" after build.`,
);

// 3. Generate TypeScript types from the schema
console.log("Generating TypeScript types...");
run(
  `npx open-rpc-typings -d ${tempSchemaOutPath} --output-ts ${tempCloneDir} --name-ts ${tsOutBasename}`,
);
assert(
  existsSync(tempTsOutPath),
  `Error: TypeScript output file "${tsOutBasename}" not found at "${tempTsOutPath}" after type generation.`,
);

// 4. Fix/Process generated types //

console.log("Processing generated types...");
const types = readFileSync(tempTsOutPath, "utf8")
  // Remove spaces from identifiers: https://regex101.com/r/jfXx65/4
  .replace(
    /\b(?!(?:export|type|interface)\s+)\b\w[\w_$]+(?:\s[\w_$]+)+(?=\s*(?:=|\??:))/g,
    (id) => toPascalCase(id),
  )
  // Get types as an array: https://regex101.com/r/EYtni7/5
  .match(
    /^(?:\/\*\*[^]+?\*\/\n)?(?:export|type|interface)(?:.+?\}|.+?;|[^]+?[}\s]*\})$/gm,
  );

assert(
  types?.length,
  `Error: Unable to extract type declarations from the generated file "${tempTsOutPath}". The file might be empty or in an unexpected format.`,
);

// Collect types in a map keyed by their names to remove duplicates
const typeMap = types.reduce((map, typeDeclaration) => {
  // Extract the type name: https://regex101.com/r/Uvty5a/1
  const match = typeDeclaration.match(
    /(?<=^(?:export\s+)?(?:type|interface)\s+)(\w+)/m,
  );
  if (!match) {
    throw new Error(
      `Unable to extract type name from declaration: "${typeDeclaration}"`,
    );
  }
  const typeName = match[0];

  // Keep the longest declaration, which is likely commented.
  const existingTypeLength = map.get(typeName)?.length ?? 0;
  if (typeDeclaration.length > existingTypeLength) {
    map.set(typeName, typeDeclaration);
  }

  return map;
}, new Map<string, string>());

const namespace = toPascalCase(tsOutBasename);
const indentedTypes = [...typeMap.values()]
  .map((typeDeclaration) => typeDeclaration.replaceAll("\n", "\n  "))
  .join("\n  ");

const processedTs = `/* eslint-disable */
// @ts-nocheck

// This file was generated using the OpenRPC schema from the ethereum/execution-apis repo.
// See https://github.com/ethereum/execution-apis for more information.
//
// Changes to this file will be lost when the code is regenerated.
// Generated by: ${relativeScriptPath}

export namespace ${namespace} {
  ${indentedTypes}
}
`;

writeFileSync(tempTsOutPath, processedTs, "utf8");

// 5. Move generated files to the final output directory and clean up
console.log("Moving generated files to output directory and cleaning up...");
mkdirSync(outDir, { recursive: true });
renameSync(tempTsOutPath, tsOutPath);
renameSync(tempSchemaOutPath, schemaOutPath);
rmSync(tempCloneDir, { recursive: true, force: true });

// Done
console.log(`✅ Types: ${relativeTsOutPath}`);
console.log(`✅ Schema: ${relativeSchemaOutPath}`);

// Helper Functions //

function run(cmd: string, cwd?: string) {
  console.log(`▶️ Running: ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd });
}

function toPascalCase(str: string) {
  return str.replace(/(?:^|-|_|\s+)(.)/g, (_, c) => c.toUpperCase());
}
