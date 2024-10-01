import type { Abi } from "abitype";
import type {
  AdapterReadContract,
  AdapterReadWriteContract,
} from "src/adapter/contract/types/Contract";
import type { AdapterNetwork } from "src/adapter/network/AdapterNetwork";

export interface ReadAdapter {
  network: AdapterNetwork;
  readContract: <TAbi extends Abi>(
    abi: TAbi,
    address: string,
  ) => AdapterReadContract<TAbi>;
}

export interface ReadWriteAdapter extends ReadAdapter {
  // Write-only properties
  getSignerAddress: () => Promise<string>;
  readWriteContract: <TAbi extends Abi>(
    abi: TAbi,
    address: string,
  ) => AdapterReadWriteContract<TAbi>;
}

export type Adapter = ReadAdapter | ReadWriteAdapter;
