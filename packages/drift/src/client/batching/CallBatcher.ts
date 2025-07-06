import type {
  Adapter,
  CallOptions,
  CallParams,
  MulticallCallParams,
  ReadParams,
} from "src/adapter/types/Adapter";
import { BatchHandler } from "src/client/batching/BatchHandler";
import { stringifyKey } from "src/utils/stringifyKey";
import type { OneOf } from "src/utils/types";

export interface CallBatcherOptions {
  adapter: Adapter;
  maxBatchSize?: number;
}

export class CallBatcher extends BatchHandler<
  OneOf<CallParams | ReadParams>,
  unknown
> {
  constructor({ adapter, maxBatchSize }: CallBatcherOptions) {
    super({
      maxBatchSize,
      async batchFn(queue) {
        // Forward single calls directly to the adapter.
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
            // Forward single calls directly to the adapter.
            if (calls.length === 1) {
              const params = { ...calls[0]!, ...options };
              const { resolve, reject } = callbacks[0]!;
              if (params.abi) {
                return adapter.read(params).then(resolve).catch(reject);
              }
              return adapter.call(params).then(resolve).catch(reject);
            }

            // Batch multiple calls using multicall.
            return adapter.multicall({ calls, ...options }).then((results) => {
              for (const [i, result] of results.entries()) {
                const { resolve, reject } = callbacks[i] || {};
                if (result.success) {
                  resolve?.(result.value);
                } else {
                  reject?.(result.error);
                }
              }
            });
          }),
        );
      },
    });
  }
}
