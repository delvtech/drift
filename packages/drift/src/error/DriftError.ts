export interface DriftErrorOptions extends ErrorOptions {
  /**
   * A custom prefix to use in place of {@linkcode DriftError.prefix}.
   */
  prefix?: string;

  /**
   * A custom name to use in place of {@linkcode DriftError.name}.
   */
  name?: string;
}

/**
 * An error thrown by Drift.
 *
 * This error is designed to ensure clean stack trace formatting even when
 * minified and can be extended to create other error types with the same
 * behavior.
 *
 * @example
 * ```ts
 * class MySdkError extends DriftError {
 *   constructor(message: string, options?: ErrorOptions) {
 *     super(message, {
 *       ...options,
 *       prefix: "🚨 ",
 *       name: "SDK Error",
 *     });
 *   }
 * }
 *
 * throw new MySdkError("Something went wrong");
 * // 🚨 SDK Error: Something went wrong
 * //     at ...
 * ```
 */
export class DriftError extends Error {
  static prefix = "✖ " as const;
  static name = "Drift Error" as const;

  constructor(error: any, options?: DriftErrorOptions) {
    // Try to coerce the error to a string for the message.
    let message: string;
    try {
      message = error?.message ?? String(error);
    } catch {
      throw error;
    }

    super(message);
    this.name = options?.name ?? DriftError.name;

    // Minification can mangle the stack traces of custom errors by obfuscating
    // the class name and including large chunks of minified code in the output.
    // To remedy this, the original stack trace is copied from either the given
    // error or a new error instance; and the stack getter is overridden to
    // ensure it's nicely formatted.

    const isError = error instanceof Error;
    const cause = options?.cause ?? error?.cause;

    let stackTarget: Error = error;
    if (!isError) {
      stackTarget = new Error();
      Error.captureStackTrace?.(stackTarget, new.target);
    }

    let customName: string | undefined;
    if (error?.name && error.name !== "Error") {
      customName = error.name;
    } else if (isError && error.constructor.name !== "Error") {
      customName = error.constructor.name;
    }

    // Doing this in constructor prevents the need to add custom properties to
    // the prototype, which would be displayed in the stack trace. The getter
    // ensures the name and message are up-to-date when accessed (e.g., after
    // subclassing and changing the name).
    Object.defineProperty(this, "stack", {
      get(): string {
        let stack = `${options?.prefix ?? DriftError.prefix}${this.name}`;

        if (customName) {
          stack += ` [${customName}]`;
        }

        if (this.message) {
          stack += `: ${this.message}`;
        }

        if (stackTarget.stack) {
          stack += `\n${stackTarget.stack.replace(/^.*\n/, "")}`;
        }

        if (cause) {
          stack += `\n  Caused by: ${cause.stack || cause}`;
        }

        return stack.trim();
      },
    });
  }
}
