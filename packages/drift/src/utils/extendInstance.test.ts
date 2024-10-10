import { extendInstance } from "src/utils/extendInstance";
import { assert, describe, expect, it } from "vitest";

describe("extendInstance", () => {
  it("Returns an object with properties from both the instance and the extension", () => {
    const obj = {
      a: 1,
      b: 2,
    };

    const extended = extendInstance(obj, {
      c: 3,
      d: 4,
    });

    expect(extended).toEqual({
      a: 1,
      b: 2,
      c: 3,
      d: 4,
    });
  });

  it("Maintains the prototype chain of the original instance", () => {
    const obj = { a: 1 };
    const extended = extendInstance(obj, { b: 3 });
    expect(Object.getPrototypeOf(extended)).toBe(Object.getPrototypeOf(obj));

    class Class {
      a = 1;
    }
    const instance = new Class();
    const extendedInstance = extendInstance(instance, { b: 3 });
    assert(extendedInstance instanceof Class);
  });

  it("Creates a shallow copy of the instance", () => {
    const obj = { a: 1, b: { c: 2 } };
    const extended = extendInstance(obj, { d: 3 });

    expect(extended).not.toBe(obj);

    obj.a = 2;
    expect(extended.a).toBe(1);
    
    obj.b.c = 3;
    expect(extended.b.c).toBe(3);
  });
});
