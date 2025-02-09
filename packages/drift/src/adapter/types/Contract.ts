import type {
  Abi,
  Address,
  Bytes,
  Hash,
  HexString,
} from "src/adapter/types/Abi";
import type { BlockTag } from "src/adapter/types/Block";
import type { EventFilter, EventName } from "src/adapter/types/Event";

// https://ethereum.github.io/execution-apis/api-documentation/

export interface ContractParams<TAbi extends Abi = Abi> {
  abi: TAbi;
  address: Address;
}

// https://github.com/ethereum/execution-apis/blob/main/src/eth/execute.yaml#L1
export interface ContractReadOptions {
  block?: BlockTag | bigint;
}

export interface ContractGetEventsOptions<
  TAbi extends Abi = Abi,
  TEventName extends EventName<TAbi> = EventName<TAbi>,
> {
  filter?: EventFilter<TAbi, TEventName>;
  fromBlock?: bigint | BlockTag;
  toBlock?: bigint | BlockTag;
}

// https://github.com/ethereum/execution-apis/blob/main/src/schemas/transaction.yaml#L274
export interface ContractWriteOptions {
  type?: string;
  nonce?: bigint;
  from?: Address;
  /**
   * Gas limit
   */
  gas?: bigint;
  value?: bigint;
  /**
   * The gas price willing to be paid by the sender in wei
   */
  gasPrice?: bigint;
  /**
   * Maximum fee per gas the sender is willing to pay to miners in wei
   */
  maxPriorityFeePerGas?: bigint;
  /**
   * The maximum total fee per gas the sender is willing to pay (includes the
   * network / base fee and miner / priority fee) in wei
   */
  maxFeePerGas?: bigint;
  /**
   * EIP-2930 access list
   */
  accessList?: {
    address: Address;
    storageKeys: readonly HexString[];
  }[];
  /**
   * Chain ID that this transaction is valid on.
   */
  chainId?: bigint;
}

// https://github.com/ethereum/execution-apis/blob/7c9772f95c2472ccfc6f6128dc2e1b568284a2da/src/schemas/transaction.yaml#L1
export interface Eip4844CallOptions {
  /**
   * The maximum total fee per gas the sender is willing to pay for blob gas in
   * wei
   */
  maxFeePerBlobGas?: bigint;
  /**
   * List of versioned blob hashes associated with the transaction's EIP-4844 data blobs.
   */
  blobVersionedHashes?: readonly Hash[];
  blobs?: readonly Bytes[];
}

// https://github.com/ethereum/execution-apis/blob/7c9772f95c2472ccfc6f6128dc2e1b568284a2da/src/eth/execute.yaml#L1
export interface ContractCallOptions
  extends ContractReadOptions,
    ContractWriteOptions,
    Eip4844CallOptions {}
