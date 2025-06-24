import { useMemo } from "react";
import { getWeb3 } from "src/drift/web3/getWeb3";
import type { Web3Options } from "src/drift/web3/types";

export function useWeb3(options?: Web3Options) {
  return useMemo(() => getWeb3(options), [options]);
}
