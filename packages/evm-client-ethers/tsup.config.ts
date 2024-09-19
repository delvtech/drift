import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/stubs.ts"],
  format: ["esm"],
  sourcemap: true,
  dts: true,
  clean: true,
  minify: true,
  shims: true,
  cjsInterop: true,
});
