import type { Web3Options } from "src/drift/web3/types";
import { Web3 } from "web3";

export function getWeb3(options?: Web3Options) {
  return new Web3(options ?? import.meta.env.VITE_RPC_URL ?? window.ethereum);
}
