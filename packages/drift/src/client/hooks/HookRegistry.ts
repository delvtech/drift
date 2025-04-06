import type { Eval, FunctionKey, MaybePromise } from "src/utils/types";

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
export class HookRegistry<THooks extends HookMap = HookMap> {
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
    if (handlers) {
      this.#handlers[hook] = handlers.filter((existing) => {
        if (existing === handler) {
          didRemove = true;
          return false;
        }
        return true;
      });
    }
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
   * Call all handlers registered for a hook. Handlers are called sequentially
   * in registration order.
   * @param hook - The hook to call.
   * @param payload - The payload to pass to each handler.
   */
  call<THook extends HookName<THooks>>(
    hook: THook,
    payload: HookPayload<THooks, THook>,
  ): MaybePromise<void> {
    let result: MaybePromise<any> = undefined;
    const handlers = this.#handlers[hook];
    if (handlers) {
      for (const handler of handlers) {
        if (result instanceof Promise) {
          result = result.then(() => handler(payload));
        } else {
          result = handler(payload);
        }
      }
    }
    return result;
  }
}

/**
 * An object mapping hook names to handler function types.
 */
export type HookMap<
  THookName extends PropertyKey = PropertyKey,
  THookHandler extends (payload: any) => any = (payload: any) => any,
> = Record<THookName, THookHandler>;

/**
 * Get a union of all hook names from a hook map.
 */
export type HookName<THooks extends HookMap = HookMap> = THooks extends THooks
  ? FunctionKey<THooks>
  : never;

/**
 * The payload passed to handlers of a specific hook.
 * @typeParam THooks - A mapping of hook names to their handler function types.
 * @typeParam THook - The name of the hook to get the payload for.
 */
export type HookPayload<
  THooks extends HookMap = HookMap,
  THook extends HookName<THooks> = HookName<THooks>,
> = Parameters<THooks[THook]>[0];

/**
 * A handler function for a specific hook.
 * @typeParam THooks - A mapping of hook names to their handler function types.
 * @typeParam THook - The name of the hook being handled.
 */
export type HookHandler<
  THooks extends HookMap = HookMap,
  THook extends HookName<THooks> = HookName<THooks>,
> = (payload: Eval<HookPayload<THooks, THook>>) => MaybePromise<void>;
