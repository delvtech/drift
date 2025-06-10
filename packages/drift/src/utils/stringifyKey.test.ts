import { stringifyKey } from "src/utils/stringifyKey";
import { describe, expect, it } from "vitest";

describe("stringifyKey", () => {
  it.todo("should stringify keys correctly", () => {
    expect(stringifyKey({ a: 1, b: BigInt(2) })).toBe('{"a":1,"b":"2"}');
    expect(stringifyKey({ a: 1, b: undefined })).toBe('{"a":1,"b":undefined}');
    expect(stringifyKey({ a: BigInt(3), b: "test" }, 2)).toBe(
      '{\n  "a": "3",\n  "b": "test"\n}',
    );
  });
});
