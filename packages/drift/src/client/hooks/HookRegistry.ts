import type { AnyObject, FunctionKey, MaybePromise } from "src/utils/types";

/**
 * A registry for managing and executing hook handlers.
 * Handlers are executed sequentially in registration order.
 *
 * @typeParam T - The hook mapping object containing hook names and their
 * corresponding handler functions.
 */
export class HookRegistry<T extends AnyObject = AnyObject> {
  #handlers: {
    [K in HookName<T>]?: HookHandler<T, K>[];
  } = {};

  /**
   * Register a handler for a hook.
   * @param hook - The hook to handle
   * @param handler - Function to execute when the hook is called
   */
  on<THook extends HookName<T>>(
    hook: THook,
    handler: HookHandler<T, THook>,
  ): void {
    this.#handlers[hook] ||= [];
    this.#handlers[hook].push(handler);
  }

  /**
   * Remove a previously registered handler.
   * @param hook - The hook to remove the handler from
   * @param handler - The handler function to remove
   * @returns true if the handler was found and removed
   */
  off<THook extends HookName<T>>(
    hook: THook,
    handler: HookHandler<T, THook>,
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
   * Register a one-time handler that removes itself after execution.
   * @param hook - The hook to handle once
   * @param handler - Function to execute once when the hook is called
   */
  once<THook extends HookName<T>>(
    hook: THook,
    handler: HookHandler<T, THook>,
  ): void {
    const wrapped = (...args: Parameters<typeof handler>) => {
      this.off(hook, wrapped);
      handler(...args);
    };
    this.on(hook, wrapped);
  }

  /**
   * Call all handlers registered for a hook.
   * Handlers are called sequentially in registration order.
   * @param hook - The hook to call
   * @param args - Arguments to pass to each handler
   */
  call<THook extends HookName<T>>(
    hook: THook,
    ...args: Parameters<HookHandler<T, THook>>
  ): MaybePromise<void> {
    let result: MaybePromise<any> = undefined;
    const handlers = this.#handlers[hook];
    if (!handlers) return result;
    for (const handler of handlers) {
      if (result instanceof Promise) {
        result = result.then(() => handler(...args));
      } else {
        result = handler(...args);
      }
    }
    return result;
  }
}

/**
 * Get a union of all hook names from the hook mapping object `T`.
 */
export type HookName<T extends AnyObject = AnyObject> = T extends T
  ? FunctionKey<T>
  : never;

/**
 * A handler function for a specific hook.
 * @template THook - The name of the hook being handled
 * @template T - The hook mapping object containing hook names and their
 * corresponding handler functions.
 */
export type HookHandler<
  T extends AnyObject = AnyObject,
  THook extends HookName<T> = HookName<T>,
> = (payload: Parameters<T[THook]>[0]) => MaybePromise<void>;
