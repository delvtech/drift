import type { BlockIdentifier } from "@delvtech/drift";
import type { ContractInterface, providers } from "ethers/lib/ethers";
import type { Interface } from "ethers/lib/utils";

export type Provider = providers.Provider;
export type EthersAbi = Exclude<ContractInterface, Interface>;

declare module "@delvtech/drift" {
  interface BaseTypes {
    Address: string;
    Bytes: string;
    Hash: string;
    HexString: string;
  }

  interface BlockOverrides<T> {
    /**
     * Unavailable in ethers.js.
     */
    mixHash: undefined;
    /**
     * Unavailable in ethers.js v5.
     */
    receiptsRoot: undefined;
    /**
     * Unavailable in ethers.js.
     */
    sha3Uncles: undefined;
    /**
     * Unavailable in ethers.js.
     */
    size: undefined;
    /**
     * Unavailable in ethers.js v5.
     */
    stateRoot: undefined;
    /**
     * Unavailable in ethers.js.
     */
    transactionsRoot: undefined;
  }

  interface Transaction {
    /**
     * Possibly undefined in ethers.js.
     */
    type: string | undefined;
  }

  interface MinedTransaction {
    /**
     * Only available on transaction receipts in ethers.js v5.
     */
    transactionIndex: undefined;
  }

  interface TransactionReceipt {
    /**
     *
     * __Note:__ The ethers.js implementation of this field maps to the
     * `gasPrice` field of a {@linkcode TransactionResponse} object.
     *
     * @see [Ethers.js - TransactionResponse - gasPrice](https://docs.ethers.org/v6/api/providers/#TransactionResponse-gasPrice)
     */
    effectiveGasPrice: bigint;
    transactionIndex: bigint;
  }

  interface ContractCallOptions {
    /**
     * Unavailable in ethers.js.
     */
    blobs?: undefined;
    /**
     * Unavailable in ethers.js.
     */
    blobVersionedHashes?: undefined;
    /**
     * Unavailable in ethers.js.
     */
    maxFeePerBlobGas?: undefined;
  }
}
