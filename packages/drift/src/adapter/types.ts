import type { Abi } from "abitype";
import type {
  ReadContract,
  ReadWriteContract,
} from "src/contract/types/Contract";
import type { Network } from "src/network/types/Network";
import type { RequiredKeys } from "src/utils/types";

export interface Adapter {
  network: Network;
  readContract: <TAbi extends Abi>(
    abi: TAbi,
    address: string,
  ) => ReadContract<TAbi>;
  readWriteContract?: <TAbi extends Abi>(
    abi: TAbi,
    address: string,
  ) => ReadWriteContract<TAbi>;
}

export type ReadAdapter = Omit<Adapter, "readWriteContract">;
export type ReadWriteAdapter = RequiredKeys<Adapter, "readWriteContract">;
