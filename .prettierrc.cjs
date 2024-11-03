// A minimal config for extensions when in languages not supported by biome.
// https://biomejs.dev/internals/language-support/
/** @type {import("prettier").Config} */
module.exports = {
  tabWidth: 2,
  useTabs: false,
  trailingComma: "all",
  singleQuote: false,
  semi: true,
  printWidth: 80,
};
