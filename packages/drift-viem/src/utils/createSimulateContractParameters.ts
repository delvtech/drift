import {
  type AdapterWriteParams,
  type FunctionName,
  objectToArray,
} from "@delvtech/drift";
import type { Abi, SimulateContractParameters } from "viem";

/**
 * Get parameters for `simulateContract` from `ContractWriteOptions`
 */
export function createSimulateContractParameters<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
>({
  abi,
  address,
  fn,
  args,
  accessList,
  from,
  gas,
  gasPrice,
  maxFeePerGas,
  maxPriorityFeePerGas,
  nonce,
  value,
}: AdapterWriteParams<TAbi, TFunctionName>): SimulateContractParameters {
  const argsArray = objectToArray({
    abi: abi as Abi,
    type: "function",
    name: fn,
    kind: "inputs",
    value: args,
  });

  const gasPriceOptions =
    gasPrice !== undefined
      ? { gasPrice }
      : { maxFeePerGas, maxPriorityFeePerGas };

  return {
    abi,
    address,
    functionName: fn,
    args: argsArray,
    accessList,
    account: from,
    gas,
    nonce: nonce !== undefined ? Number(nonce) : undefined,
    value,
    ...gasPriceOptions,
  } as SimulateContractParameters;
}
