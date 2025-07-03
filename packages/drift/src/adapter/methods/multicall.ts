import type { Abi, AbiEntry } from "src/adapter/types/Abi";
import type {
  Adapter,
  MulticallParams,
  MulticallReturn,
} from "src/adapter/types/Adapter";
import { prepareCall } from "src/adapter/utils/prepareCall";
import { IMulticall3 } from "src/artifacts/IMulticall3";
import { DriftError } from "src/error/DriftError";

export const DEFAULT_MULTICALL_ADDRESS =
  "0xcA11bde05977b3631167028862bE2a173976CA11";

export async function multicall<
  TCalls extends readonly unknown[],
  TAllowFailure extends boolean = true,
>(
  adapter: Adapter,
  {
    calls,
    multicallAddress = DEFAULT_MULTICALL_ADDRESS,
    allowFailure = true as TAllowFailure,
    ...options
  }: MulticallParams<TCalls, TAllowFailure>,
): Promise<NoInfer<MulticallReturn<TCalls, TAllowFailure>>> {
  const abiEntryMap = new Map<number, AbiEntry<Abi, "function">>();

  const results = await adapter.simulateWrite({
    abi: IMulticall3.abi,
    address: multicallAddress,
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
    ...options,
  });

  return results.map(({ returnData, success }, i) => {
    if (!success) {
      // If success is false, allowFailure must be true, otherwise the request
      // would have thrown an error.
      return {
        success,
        error: new DriftError(
          // Slice off the `0x` prefix and the first 4 bytes (function
          // selector) to get the error message.
          Buffer.from(returnData.slice(10), "hex").toString(),
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
