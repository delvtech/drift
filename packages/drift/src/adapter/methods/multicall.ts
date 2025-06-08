import type { Abi, AbiEntry } from "src/adapter/types/Abi";
import type {
  Adapter,
  MulticallParams,
  MulticallReturn,
} from "src/adapter/types/Adapter";
import { prepareFunctionData } from "src/adapter/utils/encodeFunctionData";
import { IMulticall3 } from "src/artifacts/IMulticall3";
import { DriftError } from "src/error/DriftError";

export const DEFAULT_MULTICALL_ADDRESS =
  "0xcA11bde05977b3631167028862bE2a173976CA11";

export async function multicall<
  TCalls extends { abi: Abi }[],
  TAllowFailure extends boolean = true,
>(
  adapter: Adapter,
  {
    calls,
    multicallAddress = DEFAULT_MULTICALL_ADDRESS,
    allowFailure = true as TAllowFailure,
    ...options
  }: MulticallParams<TCalls, TAllowFailure>,
): Promise<MulticallReturn<TCalls, TAllowFailure>> {
  const abiFns: AbiEntry<Abi, "function">[] = [];

  const results = await adapter.simulateWrite({
    abi: IMulticall3.abi,
    address: multicallAddress,
    fn: "aggregate3",
    args: {
      calls: calls.map((read) => {
        const { abiFn, data } = prepareFunctionData({
          abi: read.abi,
          fn: read.fn,
          args: read.args,
        });
        abiFns.push(abiFn);
        return {
          target: read.address,
          callData: data,
          allowFailure,
        };
      }),
    },
    ...options,
  });

  return results.map(({ returnData, success }, i) => {
    const { fn } = calls[i]!;
    const abiFn = abiFns[i]!;

    if (!allowFailure) {
      return adapter.decodeFunctionReturn({
        abi: [abiFn],
        data: returnData,
        fn,
      });
    }

    if (!success) {
      return {
        success,
        error: new DriftError(
          // Slice off the `0x` prefix and the first 4 bytes (function
          // selector) to get the error message.
          Buffer.from(returnData.slice(10), "hex").toString(),
        ),
      };
    }

    return {
      success,
      value: adapter.decodeFunctionReturn({
        abi: [abiFn],
        data: returnData,
        fn,
      }),
    };
  }) as MulticallReturn<TCalls, TAllowFailure>;
}
