import { parseKey, stringifyKey } from "src/utils/keys";
import { describe, expect, it } from "vitest";

describe("stringifyKey", () => {
  it("should stringify keys correctly", () => {
    expect(stringifyKey({ a: 1, b: 2n })).toBe('{"a":1,"b":"2n"}');
    expect(stringifyKey({ a: 1, b: undefined })).toBe('{"a":1}');
    expect(stringifyKey({ a: -3n, b: "test" })).toBe('{"a":"-3n","b":"test"}');
  });
});

describe("parseKey", () => {
  it("should parse keys correctly", () => {
    expect(parseKey('{"a":1,"b":"2n"}')).toEqual({ a: 1, b: 2n });
    expect(parseKey('{"a":1}')).toEqual({ a: 1 });
    expect(parseKey('{"a":"-3n","b":"test"}')).toEqual({ a: -3n, b: "test" });
  });
});
