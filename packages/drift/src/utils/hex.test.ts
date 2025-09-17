import {
  hexToBytes,
  hexToString,
  InvalidHexStringError,
  isHexString,
  toHexString,
} from "src/utils/hex";
import { describe, expect, it } from "vitest";

const HELLO_HEX = "68656c6c6f";

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
    expect(toHexString("hello")).toBe(`0x${HELLO_HEX}`);
  });

  it("returns valid hex strings as is", () => {
    expect(toHexString("0xff")).toBe("0xff");
    expect(toHexString("ff", { prefix: false })).toBe("ff");
  });

  it("converts without a prefix when specified", () => {
    expect(toHexString(255, { prefix: false })).toBe("ff");
    expect(toHexString("hello", { prefix: false })).toBe(HELLO_HEX);
  });
});

describe("hexToString", () => {
  it("converts valid hex to string", () => {
    expect(hexToString(`0x${HELLO_HEX}`)).toBe("hello");
  });

  it("returns empty string for 0x", () => {
    expect(hexToString("0x")).toBe("");
  });

  it("throws for invalid hex", () => {
    expect(() => hexToString("0xyz")).toThrow(InvalidHexStringError);
    expect(() => hexToString("123" as `0x${string}`)).toThrow(
      InvalidHexStringError,
    );
    expect(() => hexToString("0x123", { prefix: false })).toThrow(
      InvalidHexStringError,
    );
  });

  it("handles odd-length hex strings", () => {
    expect(hexToString(`0x${HELLO_HEX}2`)).toBe("hello\u0002");
  });

  it("handles hex with no prefix when specified", () => {
    expect(hexToString(HELLO_HEX, { prefix: false })).toBe("hello");
  });
});

describe("hexToBytes", () => {
  const HELLO_BYTES = new TextEncoder().encode("hello");

  it("converts valid hex to string", () => {
    expect(hexToBytes(`0x${HELLO_HEX}`)).toStrictEqual(HELLO_BYTES);
  });

  it("returns empty string for 0x", () => {
    expect(hexToBytes("0x")).toStrictEqual(new Uint8Array([]));
  });

  it("throws for invalid hex", () => {
    expect(() => hexToBytes("0xyz")).toThrow(InvalidHexStringError);
    expect(() => hexToBytes("123" as `0x${string}`)).toThrow(
      InvalidHexStringError,
    );
    expect(() => hexToBytes("0x123", { prefix: false })).toThrow(
      InvalidHexStringError,
    );
  });

  it("handles odd-length hex strings", () => {
    expect(hexToBytes(`0x${HELLO_HEX}2`)).toStrictEqual(
      new Uint8Array([...HELLO_BYTES, 2]),
    );
  });

  it("handles hex with no prefix when specified", () => {
    expect(hexToBytes(HELLO_HEX, { prefix: false })).toStrictEqual(HELLO_BYTES);
  });
});
