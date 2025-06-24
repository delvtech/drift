import type { Store } from "@delvtech/drift";
import type { EthExecutionAPI, SupportedProviders } from "web3";
import type { Web3ContextInitOptions } from "web3-core";

export type Web3Options =
  | SupportedProviders<EthExecutionAPI>
  | Web3ContextInitOptions<EthExecutionAPI>;

export type DriftWeb3Options = Web3Options & {
  store?: Store;
};
