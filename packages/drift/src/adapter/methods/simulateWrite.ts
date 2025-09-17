import type { Abi } from "src/adapter/types/Abi";
import type { Adapter, SimulateWriteParams } from "src/adapter/types/Adapter";
import type {
  FunctionArgs,
  FunctionReturn,
  WriteFunctionName,
} from "src/adapter/types/Function";
import { prepareFunctionData } from "src/adapter/utils/encodeFunctionData";

/**
 * Call a state-mutating function on a contract without sending a transaction.
 * @returns The decoded return value of the function.
 */
export async function simulateWrite<
  TAbi extends Abi,
  TFunctionName extends WriteFunctionName<TAbi>,
>(
  adapter: Adapter,
  {
    abi,
    fn,
    args = {} as FunctionArgs<TAbi, TFunctionName>,
    from,
    address,
    ...options
  }: SimulateWriteParams<TAbi, TFunctionName>,
): Promise<FunctionReturn<TAbi, TFunctionName>> {
  const { abiEntry, data } = prepareFunctionData({ abi, fn, args });
  const result = await adapter.call({
    data,
    from: from ?? (await adapter.getSignerAddress?.().catch(() => undefined)),
    to: address,
    ...options,
  });
  return adapter.decodeFunctionReturn({
    abi: [abiEntry] as Abi,
    data: result,
    fn,
  });
}
