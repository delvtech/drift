import { HEX_REGEX } from "src/utils/isHexString";
import { randomHex } from "src/utils/testing/randomHex";
import { describe, expect, it } from "vitest";

describe("randomHex", () => {
  it(
    "creates valid hex strings",
    {
      repeats: 20,
    },
    () => {
      const hex = randomHex();
      expect(hex).toMatch(HEX_REGEX);
    },
  );

  it(
    "creates a valid hex string with a given byte length",
    {
      repeats: 20,
    },
    () => {
      const bytes = Math.floor(Math.random() * 127) + 1;
      const hex = randomHex(bytes);
      expect(hex.length).toBe(bytes * 2 + 2);
      expect(hex).toMatch(HEX_REGEX);
    },
  );

  const prefix = "abcde";
  it(
    `maintains the correct byte length when provided a prefix ("${prefix}")`,
    {
      repeats: 20,
    },
    () => {
      const bytes = Math.floor(Math.random() * 108) + 20;
      const hex = randomHex(bytes, prefix);
      expect(hex.length).toBe(bytes * 2 + 2);
      const generatedChars = hex.slice(2 + prefix.length);
      expect(generatedChars).toMatch(/^[0-9a-fA-F]+$/);
    },
  );
});
