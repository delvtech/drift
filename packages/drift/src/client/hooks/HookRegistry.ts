import type {
  AnyFunction,
  AnyObject,
  FunctionKey,
  MaybePromise,
} from "src/utils/types";

/**
 * A registry for managing and executing hook handlers.
 * Handlers are executed sequentially in registration order.
 *
 * @template T - The hooks configuration object
 */
export class HookRegistry<T extends AnyObject = AnyObject> {
  private _handlers: {
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
    this._handlers[hook] ??= [];
    this._handlers[hook].push(handler);
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
    const handlers = this._handlers[hook];
    if (!handlers) return false;

    let didRemove = false;
    this._handlers[hook] = handlers.filter((existing) => {
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
    const wrapped = (...args: any[]) => {
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
  async call<THook extends HookName<T>>(
    hook: THook,
    ...args: Parameters<HookHandler<T, THook>>
  ): Promise<void> {
    const handlers = this._handlers[hook];
    if (!handlers) return;
    for (const handler of handlers) {
      await handler(...args);
    }
  }
}

/**
 * Represents a possible hook name given a hooks configuration object.
 * @group Hooks
 */
export type HookName<THooks extends AnyObject = AnyObject> =
  | FunctionKey<THooks>
  | (string & {});

/**
 * A handler function for a specific hook.
 * @template THook - The name of the hook being handled
 * @template T - The hooks configuration object containing the hook
 * @group Hooks
 */
export type HookHandler<
  T extends AnyObject = AnyObject,
  THook extends HookName<T> = HookName<T>,
> = AnyObject extends T
  ? (...args: any[]) => MaybePromise<void>
  : T[THook] extends AnyFunction
    ? T[THook]
    : (...args: any[]) => MaybePromise<void>;

/**
 * The payload object passed to a hook handler.
 *
 * By convention, the payload will be the first argument of the hook, but this
 * may not always be the case for custom hooks at runtime
 *
 * @template THook - The name of the hook being handled
 * @template T - The hooks configuration object containing the hook
 * @group Hooks
 */
export type HookPayload<
  T extends AnyObject = AnyObject,
  THook extends HookName<T> = HookName<T>,
> = Parameters<HookHandler<T, THook>>[0];
