// A minimal config for extensions when in languages not supported by biome.
// https://biomejs.dev/internals/language-support/
/** @type {import("prettier").Config} */
const config = {
  tabWidth: 2,
  useTabs: false,
  trailingComma: "all",
  singleQuote: false,
  semi: true,
  printWidth: 80,
};

export default config;
