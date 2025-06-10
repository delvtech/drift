import { DriftError } from "src/error/DriftError";
import { describe, expect, it } from "vitest";

describe("DriftError", () => {
  it("uses the provided prefix and name", () => {
    class FooError extends DriftError {
      constructor(error: any) {
        super(error, { prefix: "🚨 ", name: "Foo Error" });
      }
    }
    const error = new FooError("Something went wrong");

    // The name is set to the provided name.
    expect(error.name).toBe("Foo Error");

    // The prefix is included in the stack trace.
    expect(error.stack).toMatch("🚨 Foo Error: Something went wrong\n");

    // The prefix is not included in the message.
    expect(error.message).toBe("Something went wrong");
  });

  it("displays wrapped error names if not `Error`", () => {
    class CustomError extends Error {}
    const wrappedCustomError = new DriftError(new CustomError());
    const wrappedError = new DriftError(new Error());

    // The custom error name is included in the stack trace.
    expect(wrappedCustomError.stack).toMatch("[CustomError]");

    // The default name, "Error", is ignored.
    expect(wrappedError.stack).not.toMatch("[Error]");
  });
});
