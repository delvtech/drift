import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/exports/index.ts", "src/exports/testing.ts"],
  format: ["esm", "cjs"],
  sourcemap: true,
  dts: true,
  clean: true,
  minify: true,
  shims: true,
  cjsInterop: true,
});
