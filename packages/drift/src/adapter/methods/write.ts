import type { Abi, Hash } from "src/adapter/types/Abi";
import type { ReadWriteAdapter, WriteParams } from "src/adapter/types/Adapter";
import type { FunctionArgs, FunctionName } from "src/adapter/types/Function";

export function write<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
>(
  adapter: ReadWriteAdapter,
  {
    abi,
    fn,
    args = {} as FunctionArgs<TAbi, TFunctionName>,
    address,
    ...options
  }: WriteParams<TAbi, TFunctionName>,
): Promise<Hash> {
  const data = adapter.encodeFunctionData({ abi, fn, args });
  return adapter.sendTransaction({ data, to: address, ...options });
}
