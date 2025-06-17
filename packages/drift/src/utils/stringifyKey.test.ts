import { stringifyKey } from "src/utils/stringifyKey";
import { describe, expect, it } from "vitest";

describe("stringifyKey", () => {
  it("should stringify keys correctly", () => {
    expect(stringifyKey({ a: 1, b: BigInt(2) })).toBe('{"a":1,"b":"2"}');
    expect(stringifyKey({ a: 1, b: undefined })).toBe('{"a":1}');
    expect(stringifyKey({ a: BigInt(3), b: "test" })).toBe(
      '{"a":"3","b":"test"}',
    );
  });
});
