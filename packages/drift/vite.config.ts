import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths() as any],
  test: {
    coverage: {
      include: ["src/**/*"],
      exclude: ["src/ethereum", "src/artifacts", "src/exports"],
    },
  },
});
