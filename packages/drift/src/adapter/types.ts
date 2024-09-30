import type { Abi } from "abitype";
import type { Prettify } from "src/base/types";
import type {
  ReadContract,
  ReadWriteContract,
} from "src/contract/types/Contract";
import type { Network } from "src/network/types/Network";

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

export type ReadWriteAdapter = Prettify<
  Omit<Adapter, "createReadWriteContract"> &
    Pick<Required<Adapter>, "readWriteContract">
>;
