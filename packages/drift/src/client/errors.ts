import type { BlockIdentifier } from "src/adapter/types/Block";
import { DriftError, type DriftErrorOptions } from "src/error/DriftError";

export class BlockNotFoundError extends DriftError {
  constructor(block: BlockIdentifier | undefined, options?: DriftErrorOptions) {
    super(`Block not found: ${block}`, options);
  }
}
