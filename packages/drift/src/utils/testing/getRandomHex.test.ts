import { getRandomHex } from "src/utils/testing/getRandomHex";
import { describe, expect, it } from "vitest";

describe("getRandomHex", () => {
  it(
    "creates valid hex strings",
    {
      repeats: 20,
    },
    () => {
      const hex = getRandomHex();
      expect(hex).toMatch(/^0x[0-9a-f]+$/);
    },
  );

  it(
    "creates a valid hex string with a given byte length",
    {
      repeats: 20,
    },
    () => {
      const bytes = Math.floor(Math.random() * 127) + 1;
      const hex = getRandomHex(bytes);
      expect(hex.length).toBe(bytes * 2 + 2);
      expect(hex).toMatch(/^0x[0-9a-f]+$/);
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
      const hex = getRandomHex(bytes, prefix);
      expect(hex.length).toBe(bytes * 2 + 2);
      const generatedChars = hex.slice(2 + prefix.length);
      expect(generatedChars).toMatch(/^[0-9a-f]+$/);
    },
  );
});
