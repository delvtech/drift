import { createDrift, type DriftOptions } from "@delvtech/drift";
import { driftStore } from "src/config/drift";

export function getDrift(options?: DriftOptions) {
  return createDrift({ store: driftStore, ...options });
}
