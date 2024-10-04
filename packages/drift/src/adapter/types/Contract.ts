import type { Abi } from "abitype";
import type { BlockTag } from "src/adapter/types/Block";
import type { EventFilter, EventName } from "src/adapter/types/Event";

// https://ethereum.github.io/execution-apis/api-documentation/

// https://github.com/ethereum/execution-apis/blob/main/src/eth/execute.yaml#L1
export interface ContractReadOptions {
  /**
   * @default 'latest'
   */
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
  to?: string;
  from?: string;
  /**
   * Gas limit
   */
  gas?: bigint;
  value?: bigint;
  input?: string;
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
    address: string;
    storageKeys: string[];
  }[];
  /**
   * Chain ID that this transaction is valid on.
   */
  chainId?: bigint;
}
