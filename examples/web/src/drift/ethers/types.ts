import type { Store } from "@delvtech/drift";
import type { BrowserProviderOptions, JsonRpcApiProviderOptions } from "ethers";

export interface EthersOptions
  extends BrowserProviderOptions,
    JsonRpcApiProviderOptions {}

export interface DriftEthersOptions extends EthersOptions {
  store?: Store;
}
