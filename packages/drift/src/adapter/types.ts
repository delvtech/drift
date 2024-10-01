import type { Abi } from "abitype";
import type {
  AdapterReadContract,
  AdapterReadWriteContract,
} from "src/adapter/contract/types/Contract";
import type { AdapterNetwork } from "src/adapter/network/AdapterNetwork";
import type { RequiredKeys } from "src/utils/types";

export interface Adapter {
  network: AdapterNetwork;
  readContract: <TAbi extends Abi>(
    abi: TAbi,
    address: string,
  ) => AdapterReadContract<TAbi>;
  readWriteContract?: <TAbi extends Abi>(
    abi: TAbi,
    address: string,
  ) => AdapterReadWriteContract<TAbi>;
}

export type ReadAdapter = Omit<Adapter, "readWriteContract">;
export type ReadWriteAdapter = RequiredKeys<Adapter, "readWriteContract">;
