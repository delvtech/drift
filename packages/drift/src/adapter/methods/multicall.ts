import type { Abi, AbiEntry } from "src/adapter/types/Abi";
import type {
  Adapter,
  MulticallParams,
  MulticallReturn,
} from "src/adapter/types/Adapter";
import { getMulticallAddress } from "src/adapter/utils/getMulticallAddress";
import { prepareCall } from "src/adapter/utils/prepareCall";
import { IMulticall3 } from "src/artifacts/IMulticall3";
import { DriftError } from "src/error/DriftError";
import { hexToString } from "src/utils/hex";

export async function multicall<
  TCalls extends readonly unknown[],
  TAllowFailure extends boolean = true,
>(
  adapter: Adapter,
  {
    calls,
    multicallAddress,
    allowFailure = true as TAllowFailure,
    ...options
  }: MulticallParams<TCalls, TAllowFailure>,
): Promise<NoInfer<MulticallReturn<TCalls, TAllowFailure>>> {
  const abiEntryMap = new Map<number, AbiEntry<Abi, "function">>();

  if (!multicallAddress) {
    const chainId = await adapter.getChainId();
    multicallAddress = getMulticallAddress(chainId);
    if (!multicallAddress) {
      throw new DriftError(
        `No multicall address found for chain ID ${chainId}. Please provide a valid multicall address.`,
      );
    }
  }

  const results = await adapter
    .call({
      to: multicallAddress,
      data: adapter.encodeFunctionData({
        abi: IMulticall3.abi,
        fn: "aggregate3",
        args: {
          calls: calls.map((call, i) => {
            const { to, data, abiEntry } = prepareCall(call);
            if (abiEntry) abiEntryMap.set(i, abiEntry);
            return {
              target: to,
              callData: data || "0x",
              allowFailure,
            };
          }),
        },
      }),
      ...options,
    })
    .then((data) =>
      adapter.decodeFunctionReturn({
        abi: IMulticall3.abi,
        data,
        fn: "aggregate3",
      }),
    );

  return results.map(({ returnData, success }, i) => {
    if (!success) {
      // If success is false, allowFailure must be true, otherwise the request
      // would have thrown an error.
      return {
        success,
        error: new DriftError(
          // Slice off the `0x` prefix and the first 4 bytes (function
          // selector) to get the error message.
          hexToString(returnData.slice(10), { prefix: false }),
        ),
      };
    }

    let value: unknown = returnData;

    const abiEntry = abiEntryMap.get(i);
    if (abiEntry)
      value = adapter.decodeFunctionReturn({
        abi: [abiEntry],
        data: returnData,
        fn: abiEntry.name,
      });

    return allowFailure === false ? value : { success, value };
  }) as MulticallReturn<TCalls, TAllowFailure>;
}
