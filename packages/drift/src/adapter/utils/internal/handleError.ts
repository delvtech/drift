import { DriftError } from "src/error/DriftError";
import type { AnyObject } from "src/utils/types";

/** @internal */
export function handleError(error: any): never {
  if (typeof error !== "object") {
    throw new DriftError(error);
  }

  const _error = { message: "" };
  let details: AnyObject | undefined;

  try {
    details = JSON.parse(error.details);
  } catch {}

  if (error.shortMessage) {
    _error.message += error.shortMessage;
  }
  if (details?.message) {
    _error.message += `\n${details.message}`;
  }
  _error.message += `\n${error.message.replace(error.shortMessage, "").trimStart()}`;
  _error.message = _error.message.trimStart();

  throw new DriftError(_error);
}
