import type {
  AnyObject,
  Eval,
  FunctionKey,
  MaybePromise,
} from "src/utils/types";

/**
 * A registry for managing and executing hook handlers. Handlers are executed
 * sequentially in registration order.
 * @typeParam THooks - An object that maps hook names to their corresponding
 * handler function types. The handler function type should accept a single
 * payload argument.
 *
 * @example
 * ```ts
 * const hooks = new HookRegistry<{
 *   beforeConnect: (payload: { peerId: string }) => void;
 *   afterConnect: (payload: { peerId: string; status: string }) => void;
 * }>();
 *
 * hooks.on("beforeConnect", ({ peerId }) => {
 *   console.log("Connecting to peer:", peerId);
 * });
 * hooks.on("afterConnect", ({ peerId, status }) => {
 *   if (status === "success") {
 *     console.log("Connected to peer:", peerId);
 *   } else {
 *     console.log("Failed to connect to peer:", peerId);
 *   }
 * });
 *
 * hooks.call("beforeConnect", { peerId: "123" }); // -> "Connecting to peer: 123"
 * hooks.call("afterConnect", { peerId: "123", status: "success" }); // -> "Connected to peer: 123"
 * ```
 */
export class HookRegistry<THooks extends AnyObject = AnyObject> {
  #handlers: {
    [K in HookName<THooks>]?: HookHandler<THooks, K>[];
  } = {};

  /**
   * Register a handler for a hook.
   * @param hook - The hook to handle.
   * @param handler - The function to execute when the hook is called.
   */
  on<THook extends HookName<THooks>>(
    hook: THook,
    handler: HookHandler<THooks, THook>,
  ): void {
    this.#handlers[hook] ||= [];
    this.#handlers[hook].push(handler);
  }

  /**
   * Remove a previously registered handler.
   * @param hook - The hook to remove the handler from.
   * @param handler - The handler function to remove.
   * @returns A boolean indicating whether the handler was found and removed.
   */
  off<THook extends HookName<THooks>>(
    hook: THook,
    handler: HookHandler<THooks, THook>,
  ): boolean {
    let didRemove = false;
    const handlers = this.#handlers[hook];
    if (!handlers) return didRemove;
    this.#handlers[hook] = handlers.filter((existing) => {
      if (existing === handler) {
        didRemove = true;
        return false;
      }
      return true;
    });

    return didRemove;
  }

  /**
   * Register a one-time handler that removes itself on execution.
   * @param hook - The hook to handle once.
   * @param handler - The function to execute once when the hook is called.
   */
  once<THook extends HookName<THooks>>(
    hook: THook,
    handler: HookHandler<THooks, THook>,
  ): void {
    const wrapped = (payload: HookPayload<THooks, THook>) => {
      this.off(hook, wrapped);
      handler(payload);
    };
    this.on(hook, wrapped);
  }

  /**
   * Call all handlers registered for a hook.
   * Handlers are called sequentially in registration order.
   * @param hook - The hook to call.
   * @param payload - The payload to pass to each handler.
   */
  call<THook extends HookName<THooks>>(
    hook: THook,
    payload: HookPayload<THooks, THook>,
  ): MaybePromise<void> {
    let result: MaybePromise<any> = undefined;
    const handlers = this.#handlers[hook];
    if (!handlers) return result;
    for (const handler of handlers) {
      if (result instanceof Promise) {
        result = result.then(() => handler(payload));
      } else {
        result = handler(payload);
      }
    }
    return result;
  }
}

/**
 * Get a union of all hook names from the hook mapping object `T`.
 */
export type HookName<THooks extends AnyObject = AnyObject> =
  THooks extends THooks ? FunctionKey<THooks> : never;

/**
 * The payload passed to handlers of a specific hook.
 * @typeParam THook - The name of the hook being handled
 * @typeParam T - The hook mapping object containing hook names and their
 */
export type HookPayload<
  THooks extends AnyObject = AnyObject,
  THook extends HookName<THooks> = HookName<THooks>,
> = Parameters<THooks[THook]>[0];

/**
 * A handler function for a specific hook.
 * @typeParam THook - The name of the hook being handled
 * @typeParam T - The hook mapping object containing hook names and their
 * corresponding handler functions.
 */
export type HookHandler<
  THooks extends AnyObject = AnyObject,
  THook extends HookName<THooks> = HookName<THooks>,
> = (payload: Eval<HookPayload<THooks, THook>>) => MaybePromise<void>;
