import type { Abi } from "src/adapter/types/Abi";
import type { Adapter, ReadParams } from "src/adapter/types/Adapter";
import type {
  FunctionArgs,
  FunctionReturn,
  ReadFunctionName,
} from "src/adapter/types/Function";
import { prepareFunctionData } from "src/adapter/utils/encodeFunctionData";

/**
 * Calls a `pure` or `view` function on a contract.
 * @returns The decoded return value of the function.
 */
export async function read<
  TAbi extends Abi,
  TFunctionName extends ReadFunctionName<TAbi>,
>(
  adapter: Adapter,
  {
    abi,
    address,
    fn,
    args = {} as FunctionArgs<TAbi, TFunctionName>,
    block,
  }: ReadParams<TAbi, TFunctionName>,
): Promise<FunctionReturn<TAbi, TFunctionName>> {
  const { abiEntry, data } = prepareFunctionData({ abi, fn, args });
  const returnData = await adapter.call({ to: address, data, block });
  return adapter.decodeFunctionReturn({
    abi: [abiEntry] as Abi,
    data: returnData,
    fn,
  });
}
