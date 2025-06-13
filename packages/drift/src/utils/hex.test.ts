import { toHexString } from "src/utils/hex";
import { describe, expect, it } from "vitest";

const helloHex = "68656c6c6f";

describe("toHexString", () => {
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

  it("returns valid prefixed hex strings as is", () => {
    expect(toHexString("0xff")).toBe("0xff");
  });

  it("converts without a prefix when specified", () => {
    expect(toHexString(255, { prefix: false })).toBe("ff");
    expect(toHexString("hello", { prefix: false })).toBe(helloHex);
  });
});
