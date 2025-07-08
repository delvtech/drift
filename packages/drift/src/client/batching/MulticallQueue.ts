import type {
  Adapter,
  CallOptions,
  CallParams,
  MulticallCallParams,
  ReadParams,
} from "src/adapter/types/Adapter";
import { getMulticallAddress } from "src/adapter/utils/getMulticallAddress";
import { MicrotaskQueue } from "src/client/batching/MicrotaskQueue";
import { stringifyKey } from "src/utils/stringifyKey";
import type { OneOf } from "src/utils/types";

/**
 * Configuration options for creating a {@linkcode MulticallQueue}.
 * @internal
 */
export interface MulticallQueueOptions {
  adapter: Adapter;
  getChainId: () => Promise<number>;
  maxBatchSize?: number;
}

/**
 * A queue that aggregates calls and reads using a multicall when possible.
 * @internal
 */
export class MulticallQueue extends MicrotaskQueue<
  OneOf<CallParams | ReadParams>,
  unknown
> {
  constructor({ adapter, getChainId, maxBatchSize }: MulticallQueueOptions) {
    super({
      maxBatchSize: maxBatchSize,
      processFn: async (queue) => {
        // Forward single calls directly to the adapter. This avoids unnecessary
        // overhead from bucketing when there's only one call in the queue.
        if (queue.length === 1) {
          const { reject, request, resolve } = queue[0]!;
          if (request.abi) {
            return adapter.read(request).then(resolve).catch(reject);
          }
          return adapter.call(request).then(resolve).catch(reject);
        }

        // Bucket calls by their options.
        const CallBuckets = new Map<
          string, // stringified options
          {
            calls: MulticallCallParams[];
            callbacks: {
              resolve: (value: unknown) => void;
              reject: (reason?: any) => void;
            }[];
            options: CallOptions;
          }
        >();

        for (const { request, resolve, reject } of queue) {
          const { abi, address, fn, args, to, data, ...options } = request;
          const call = {
            abi,
            address,
            fn,
            args,
            to,
            data,
          } as MulticallCallParams;
          const key = stringifyKey(options);
          const bucket = CallBuckets.get(key);

          if (bucket) {
            bucket.calls.push(call);
            bucket.callbacks.push({ resolve, reject });
          } else {
            CallBuckets.set(key, {
              calls: [call],
              callbacks: [{ resolve, reject }],
              options,
            });
          }
        }

        // Process buckets.
        return Promise.all(
          CallBuckets.values().map(async ({ calls, callbacks, options }) => {
            const chainId = await getChainId();
            const multicallAddress = getMulticallAddress(chainId);

            // Forward single calls directly to the adapter.
            if (calls.length === 1) {
              return forwardCalls({ adapter, calls, callbacks, options });
            }

            // Batch multiple calls using multicall.
            return adapter
              .multicall({ calls, multicallAddress, ...options })
              .then((results) => {
                for (const [i, result] of results.entries()) {
                  const { resolve, reject } = callbacks[i] || {};
                  if (result.success) {
                    resolve?.(result.value);
                  } else {
                    reject?.(result.error);
                  }
                }
              })
              .catch((error) => {
                // If there's no known multicall address, and the call failed,
                // try again with each call individually in case the error is
                // due to a missing multicall address.
                if (!multicallAddress) {
                  return forwardCalls({ adapter, calls, callbacks, options });
                }

                // Otherwise, reject all calls in the bucket with the error.
                for (const { reject } of callbacks) reject(error);
              });
          }),
        );
      },
    });
  }
}

function forwardCalls({
  adapter,
  calls,
  callbacks,
  options,
}: {
  adapter: Adapter;
  calls: MulticallCallParams[];
  callbacks: {
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
  }[];
  options: CallOptions;
}) {
  return Promise.all(
    calls.map((call, i) => {
      const params = { ...call, ...options };
      const { resolve, reject } = callbacks[i] || {};
      if (params.abi) {
        return adapter.read(params).then(resolve).catch(reject);
      }
      return adapter.call(params).then(resolve).catch(reject);
    }),
  );
}
