export type BatchQueue<TRequest, TResponse> = {
  request: TRequest;
  resolve: (value: TResponse) => void;
  reject: (reason?: any) => void;
}[];

export type BatchFunction<TRequest, TResponse> = (
  queue: BatchQueue<TRequest, TResponse>,
) => Promise<any>;

export interface BatchHandlerOptions<TRequest = string, TResponse = unknown> {
  /**
   * The function to call for each batch of requests. It receives a queue of
   * requests and should return a promise that resolves when all requests in the
   * queue have been processed.
   */
  batchFn: BatchFunction<TRequest, TResponse>;

  /**
   * The maximum number of requests to batch together.
   * If not provided, all requests will be batched together.
   */
  maxBatchSize?: number;
}

export class BatchHandler<TRequest = unknown, TResponse = unknown> {
  queue: {
    request: TRequest;
    resolve: (value: TResponse) => void;
    reject: (reason?: any) => void;
  }[];
  maxBatchSize?: number;

  #batchFn: BatchFunction<TRequest, TResponse>;

  constructor({
    batchFn,
    maxBatchSize,
  }: BatchHandlerOptions<TRequest, TResponse>) {
    this.maxBatchSize = maxBatchSize;
    this.#batchFn = batchFn;
    this.queue = [];
  }

  handle(request: TRequest): Promise<TResponse> {
    return new Promise((resolve, reject) => {
      // Add the new request to the queue with the resolve function of the
      // returned promise.
      this.queue.push({ request, resolve, reject });

      // if this is the first call, enqueue a microtask which allows the current
      // call stack to complete before firing. All subsequent calls in the same
      // event loop will add to the queue to be processed in the microtask.
      if (this.queue.length === 1) {
        queueMicrotask(() => {
          const queued = this.queue.slice();
          this.queue = [];
          if (this.maxBatchSize) {
            // Split the queue into batches of maxBatchSize.
            const batches = [];
            for (let i = 0; i < queued.length; i += this.maxBatchSize) {
              batches.push(queued.slice(i, i + this.maxBatchSize));
            }
            // Process each batch.
            Promise.all(
              batches.flatMap((batch) =>
                this.#batchFn(batch).catch((error) => {
                  // Reject all promises in the batch with the error.
                  for (const { reject } of batch) reject(error);
                }),
              ),
            );
          } else {
            // Process the entire queue as a single batch.
            this.#batchFn(queued).catch((error) => {
              for (const { reject } of queued) reject(error);
            });
          }
        });
      }
    });
  }
}
