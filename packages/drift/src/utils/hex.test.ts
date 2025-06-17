import { isHexString, toHexString } from "src/utils/hex";
import { describe, expect, it } from "vitest";

describe("isHexString", () => {
  it("returns true for valid prefixed hex strings", () => {
    expect(isHexString("0x")).toBe(true);
    expect(isHexString("0x123abc")).toBe(true);
    expect(isHexString("123abc", { prefix: false })).toBe(true);
  });
  it("returns false for invalid hex strings", () => {
    expect(isHexString("0xxyz")).toBe(false);
    expect(isHexString("123abc")).toBe(false);
    expect(isHexString("0x123abc", { prefix: false })).toBe(false);
    expect(isHexString("0x123 456")).toBe(false);
    expect(isHexString("0x123_456")).toBe(false);
  });
});

describe("toHexString", () => {
  const helloHex = "68656c6c6f";

  it("converts numbers", () => {
    expect(toHexString(255)).toBe("0xff");
  });

  it("converts bigints", () => {
    expect(toHexString(255n)).toBe("0xff");
  });

  it("converts Uint8Arrays", () => {
    const arr = new Uint8Array([255, 16, 32]);
    expect(toHexString(arr)).toBe("0xff1020");
  });

  it("converts strings", () => {
    expect(toHexString("hello")).toBe(`0x${helloHex}`);
  });

  it("returns valid hex strings as is", () => {
    expect(toHexString("0xff")).toBe("0xff");
    expect(toHexString("ff", { prefix: false })).toBe("ff");
  });

  it("converts without a prefix when specified", () => {
    expect(toHexString(255, { prefix: false })).toBe("ff");
    expect(toHexString("hello", { prefix: false })).toBe(helloHex);
  });
});
