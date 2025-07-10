import type {
  Adapter,
  CallOptions,
  CallParams,
  MulticallCallParams,
  ReadParams,
} from "src/adapter/types/Adapter";
import { getMulticallAddress } from "src/adapter/utils/getMulticallAddress";
import {
  MicrotaskQueue,
  type PendingRequest,
} from "src/client/batching/MicrotaskQueue";
import type { ClientCache } from "src/client/cache/ClientCache";
import { cachedMulticall } from "src/client/utils/cachedMulticall";
import { getOrSet } from "src/store/utils/getOrSet";
import { stringifyKey } from "src/utils/stringifyKey";
import type { OneOf } from "src/utils/types";

/**
 * Configuration options for creating a {@linkcode MulticallQueue}.
 * @internal
 */
export interface MulticallQueueOptions {
  adapter: Adapter;
  cache: ClientCache;
  /**
   * The Client's cached getChainId method, used to determine the multicall
   * address without repeatedly fetching it from the Adapter.
   */
  getChainId: () => Promise<number>;
  maxBatchSize?: number;
}

/**
 * A bucket of calls that share the same options and can be processed together.
 * @internal
 */
interface CallBucket {
  calls: MulticallCallParams[];
  callbacks: {
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
  }[];
  options: CallOptions;
}

/**
 * A queue that aggregates calls and reads using multicall when possible.
 * @internal
 */
export class MulticallQueue extends MicrotaskQueue<
  OneOf<CallParams | ReadParams>,
  unknown
> {
  #adapter: Adapter;
  #cache: ClientCache;
  #getChainId: () => Promise<number>;

  constructor({
    adapter,
    cache,
    getChainId,
    maxBatchSize,
  }: MulticallQueueOptions) {
    super({
      maxBatchSize,
      batchFn: (requests) => this.#batchFn(requests),
    });
    this.#adapter = adapter;
    this.#cache = cache;
    this.#getChainId = getChainId;
  }

  async #batchFn(
    queue: PendingRequest<OneOf<CallParams | ReadParams>, unknown>[],
  ) {
    // Forward single calls to avoid unnecessary overhead from bucketing and
    // aggregating with multicall.
    if (queue.length === 1) {
      const { reject, request, resolve } = queue[0]!;
      return this.#forwardCall(request).then(resolve).catch(reject);
    }

    // Bucket calls by their stringified options.
    const CallBuckets = new Map<string, CallBucket>();
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
      CallBuckets.values().map((bucket) => this.#processBucket(bucket)),
    );
  }

  async #processBucket(bucket: CallBucket) {
    // Forward single call buckets directly to the adapter.
    if (bucket.calls.length === 1) return this.#forwardCalls(bucket);

    const { calls, callbacks, options } = bucket;
    const chainId = await this.#getChainId();
    const multicallAddress = getMulticallAddress(chainId);

    return cachedMulticall({
      adapter: this.#adapter,
      cache: this.#cache,
      params: {
        calls,
        multicallAddress,
        allowFailure: true,
        ...options,
      },
    })
      .then((results) => {
        for (const [i, result] of results.entries()) {
          const { resolve, reject } = bucket.callbacks[i] || {};
          if (result.success) {
            resolve?.(result.value);
          } else {
            reject?.(result.error);
          }
        }
      })
      .catch((error) => {
        // If there's no known multicall address, and the call failed, try again
        // with each call individually in case the error is due to a missing
        // multicall address.
        if (!multicallAddress) return this.#forwardCalls(bucket);

        // Otherwise, reject all calls in the bucket with the error.
        for (const { reject } of callbacks) reject(error);
      });
  }

  /**
   * Forward each call in a bucket to its respective adapter method.
   */
  #forwardCalls({ calls, callbacks, options }: CallBucket) {
    return Promise.all(
      calls.map((call, i) => {
        const callParams = {
          ...call,
          ...options,
        } as OneOf<CallParams | ReadParams>;
        const { resolve, reject } = callbacks[i] || {};
        return this.#forwardCall(callParams).then(resolve).catch(reject);
      }),
    );
  }

  /**
   * Forward a single call to its respective adapter method.
   */
  #forwardCall(params: OneOf<CallParams | ReadParams>) {
    return params.abi
      ? getOrSet({
          store: this.#cache.store,
          key: this.#cache.readKey(params),
          fn: () => this.#adapter.read(params),
        })
      : getOrSet({
          store: this.#cache.store,
          key: this.#cache.callKey(params),
          fn: () => this.#adapter.call(params),
        });
  }
}
