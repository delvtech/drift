import type { DriftOptions } from "@delvtech/drift";
import { useMemo } from "react";
import { getDrift } from "src/drift/default/getDrift";

export function useDrift(options?: DriftOptions) {
  return useMemo(() => getDrift(options), [options]);
}
