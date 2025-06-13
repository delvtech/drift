import { HEX_REGEX } from "src/utils/hex";
import { randomHex } from "src/utils/testing/randomHex";
import { randomInt } from "src/utils/testing/randomInt";
import { describe, expect, it } from "vitest";

describe("randomHex", () => {
  it("generates valid hex strings", { repeats: 1_000 }, () => {
    const hex = randomHex();
    expect(hex).toMatch(HEX_REGEX);
  });

  it(
    "generates a valid hex string with a given byte length",
    { repeats: 1_000 },
    () => {
      const bytes = randomInt(1, 128);
      const hex = randomHex(bytes);
      expect(hex.length).toBe(bytes * 2 + 2);
      expect(hex).toMatch(HEX_REGEX);
    },
  );

  it(
    "maintains the correct byte length when provided a prefix",
    { repeats: 1_000 },
    () => {
      const prefix = "abcde";
      const bytes = randomInt(3, 128);
      const hex = randomHex(bytes, prefix);
      expect(hex.length).toBe(bytes * 2 + 2);
      expect(hex.startsWith(`0x${prefix}0`)).toBe(true);
      const generatedChars = hex.slice(2 + prefix.length);
      expect(generatedChars).toMatch(/^[0-9a-fA-F]+$/);
    },
  );

  it("handles zero byte length", () => {
    expect(randomHex(0)).toBe("0x");
  });

  it("slices the prefix if it exceeds the byte length", () => {
    const bytes = 2;
    const prefix = "abcdef";
    const hex = randomHex(bytes, prefix);
    expect(hex.length).toBe(bytes * 2 + 2);
    expect(hex.startsWith(`0x${prefix.slice(0, bytes * 2)}`)).toBe(true);
  });
});
