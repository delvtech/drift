import type { Adapter } from "src/adapter/types/Adapter";
import { DriftError, type DriftErrorOptions } from "src/error/DriftError";
import type { FunctionKey } from "src/utils/types";

export interface NotImplementedErrorParams<TAdapter extends Adapter = Adapter>
  extends DriftErrorOptions {
  /**
   * The method that has not been implemented.
   */
  method: FunctionKey<TAdapter> | (string & {});
  message?: string;
}

/**
 * An error that indicates a method has not been implemented.
 */
export class NotImplementedError<
  TAdapter extends Adapter = Adapter,
> extends DriftError {
  constructor({
    method,
    message,
    ...options
  }: NotImplementedErrorParams<TAdapter>) {
    super(
      `Method not implemented: \`${String(method)}\`.${message ? `\n\n  ${message}\n` : ""}`,
      options,
    );
  }
}
