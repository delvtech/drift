/**
 * A queue of pending requests with their associated resolve and reject
 * callbacks.
 * @internal
 */
export type PendingRequest<TRequest = unknown, TResponse = unknown> = {
  request: TRequest;
  resolve: (value: TResponse) => void;
  reject: (reason?: any) => void;
};

/**
 * A function that processes a batch of requests in a microtask queue.
 * @internal
 */
export type BatchFunction<TRequest = unknown, TResponse = unknown> = (
  requests: PendingRequest<TRequest, TResponse>[],
) => Promise<any>;

/**
 * Configuration options for creating a {@linkcode MicrotaskQueue}.
 * @internal
 */
export interface MicrotaskQueueOptions<
  TRequest = unknown,
  TResponse = unknown,
> {
  /**
   * The function to call for each batch of requests. It receives a queue of
   * pending requests and should return a promise that resolves when all
   * requests in the queue have been processed.
   */
  batchFn: BatchFunction<TRequest, TResponse>;

  /**
   * The maximum number of requests to batch together.
   * If not provided, all requests will be batched together.
   */
  maxBatchSize?: number;
}

/**
 * A queue that processes requests in microtasks to aggregate them into
 * batches and reduce the number of calls made to an external service.
 * @internal
 */
export class MicrotaskQueue<TRequest = unknown, TResponse = unknown> {
  /**
   * The queue of pending requests, each with its associated resolve and
   * reject callbacks.
   */
  pending: PendingRequest<TRequest, TResponse>[] = [];
  maxBatchSize?: number;

  #batchFn: BatchFunction<TRequest, TResponse>;

  constructor({
    batchFn,
    maxBatchSize,
  }: MicrotaskQueueOptions<TRequest, TResponse>) {
    this.maxBatchSize = maxBatchSize;
    this.#batchFn = batchFn;
  }

  submit(request: TRequest): Promise<TResponse> {
    return new Promise((resolve, reject) => {
      // Add the new request to the queue with the resolve function of the
      // returned promise.
      this.pending.push({ request, resolve, reject });

      // if this is the first call, enqueue a microtask which allows the current
      // call stack to complete before firing. All subsequent calls in the same
      // event loop will add to the queue to be processed in the microtask.
      if (this.pending.length === 1) {
        queueMicrotask(() => {
          const queue = this.pending;
          this.pending = [];

          const batchSize = this.maxBatchSize || queue.length;
          const batches = [];
          for (let i = 0; i < queue.length; i += batchSize) {
            batches.push(queue.slice(i, i + batchSize));
          }

          for (const batch of batches)
            try {
              this.#batchFn(batch).catch((error) => {
                for (const { reject } of batch) reject(error);
              });
            } catch (error) {
              for (const { reject } of batch) reject(error);
            }
        });
      }
    });
  }
}
