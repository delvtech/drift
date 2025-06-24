import { useMemo } from "react";
import { getDrift } from "src/drift/web3/getDrift";
import type { DriftWeb3Options } from "src/drift/web3/types";

export function useDrift(options?: DriftWeb3Options) {
  return useMemo(() => getDrift(options), [options]);
}
