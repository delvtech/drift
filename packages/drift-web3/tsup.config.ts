import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/Web3Adapter.ts"],
  format: ["esm", "cjs"],
  sourcemap: true,
  dts: true,
  clean: true,
  minify: true,
  shims: true,
  cjsInterop: true,
});
