import type { BlockIdentifier } from "src/adapter/types/Block";
import { DriftError } from "src/error/DriftError";

export class BlockNotFoundError extends DriftError {
  constructor(block: BlockIdentifier | undefined, options?: ErrorOptions) {
    super(`Block not found: ${block}`, options);
  }
}
