import isMatch from "lodash.ismatch";
import { type SinonStub, stub as sinonStub } from "sinon";
import { DriftError } from "src/error/DriftError";
import { formatArgsForDisplay } from "src/utils/formatArgsForDisplay";
import type { FunctionKey, Replace } from "src/utils/types";

/**
 * A store for stubs that can be used to mock methods on an object, `T`.
 */
export class StubStore<T> {
  #methodStores = new Map<
    FunctionKey<T>,
    {
      defaultStub: SinonStub | undefined;
      keyedStubs: Replace<
        Map<string, SinonStub>,
        {
          // Override the `get` method to return a typed stub.
          get<TArgs extends any[], TReturnType = any>(
            key: string,
          ): SinonStub<TArgs, TReturnType>;
        }
      >;
    }
  >();

  reset(method?: FunctionKey<T>) {
    return method
      ? this.#methodStores.delete(method)
      : this.#methodStores.clear();
  }

  /**
   * Find out if a method has been stubbed.
   */
  has(params: HasStubParams<T>): boolean {
    const { method, key, matchPartial } = params;
    const methodStore = this.#methodStores.get(method);
    if (!methodStore) return false;
    if (!key) return true;
    if (methodStore.keyedStubs.has(key)) return true;
    if (!matchPartial) return false;
    const parsedKey = JSON.parse(key);
    for (const storedKey of methodStore.keyedStubs.keys()) {
      if (isMatch(parsedKey, JSON.parse(storedKey))) {
        return true;
      }
    }
    return !!methodStore.defaultStub;
  }

  /**
   * Get a typed stub for a method on the object, `T`.
   *
   * @example
   * ```ts
   * const stubs = new StubStore<Network>();
   * const aliceBalanceStub = stubs.get<[GetBalanceParams], Promise<bigint>>({
   *   method: "getBalance",
   *   key: "alice",
   * });
   *
   * const balance = await aliceBalanceStub();
   * // ✖ NotImplementedError
   *
   * aliceBalanceStub.resolves(100n);
   * const balance = await aliceBalanceStub();
   * // -> 100n
   * ```
   */
  get<TArgs extends any[], TReturnType = any>(
    params: GetStubParams<T, TArgs, TReturnType>,
  ): SinonStub<TArgs, TReturnType> {
    const { method, key, matchPartial, create } = params;
    const methodName = String(method);
    let methodStore = this.#methodStores.get(method);

    // Create a new method store if one doesn't exist
    if (!methodStore) {
      methodStore = {
        defaultStub: undefined,
        keyedStubs: new Map(),
      };
      this.#methodStores.set(method, methodStore);

      // Call the create function and return early if provided.
      if (create) {
        const newStub = create(createDefaultStub(methodName)) as SinonStub<
          TArgs,
          TReturnType
        >;
        if (key) {
          methodStore.keyedStubs.set(key, newStub);
        } else {
          methodStore.defaultStub = newStub;
        }
        return newStub;
      }
    }

    // Return the default stub if no key is provided.
    if (!key) {
      methodStore.defaultStub ||= create
        ? create(createDefaultStub(methodName))
        : createDefaultStub(methodName);
      return methodStore.defaultStub as SinonStub<TArgs, TReturnType>;
    }

    // Return the keyed stub if it exists.
    if (methodStore.keyedStubs.has(key)) {
      return methodStore.keyedStubs.get(key);
    }

    // Return the stub with the closest matching key or the default stub if
    // partial matching is enabled
    if (matchPartial) {
      let closestMatch = methodStore.defaultStub;
      if (methodStore.keyedStubs.size) {
        const parsedKey = JSON.parse(key);
        let closestMatchKey = "";
        for (const [storedKey, stub] of methodStore.keyedStubs.entries()) {
          if (
            isMatch(parsedKey, JSON.parse(storedKey)) &&
            storedKey.length > closestMatchKey.length
          ) {
            closestMatch = stub;
            closestMatchKey = storedKey;
          }
        }
      }
      if (closestMatch) {
        return closestMatch as SinonStub<TArgs, TReturnType>;
      }
    }

    // Return a new stub if no match is found.
    const newStub = create
      ? create(createDefaultStub(methodName))
      : createDefaultStub(methodName);
    methodStore.keyedStubs.set(key, newStub);
    return newStub as any;
  }
}

export interface GetStubParams<
  T,
  TArgs extends any[] = any[],
  TReturnType = any,
> {
  /**
   * The method to get a stub for.
   */
  method: FunctionKey<T>;

  /**
   * A key to distinguish the stub from others for the same method.
   *
   * @example
   * ```ts
   * const aliceBalanceStub = mock.stubs.get<[GetBalanceParams], Promise<bigint>>({
   *   method: "getBalance",
   *   key: "alice",
   * });
   *
   * const bobBalanceStub = mock.stubs.get<[GetBalanceParams], Promise<bigint>>({
   *   method: "getBalance",
   *   key: "bob",
   * });
   * ```
   */
  key?: string;

  /**
   * Whether to allow partial matching of the key. If `true`, the stub with the
   * closest matching key will be returned. This has no effect if `key` is not
   * provided.
   */
  matchPartial?: boolean;

  /**
   * A function to create the stub if it doesn't exist. A new stub which throws
   * a {@linkcode NotImplementedError} by default will be passed to this
   * function. The function should return the actual stub to be used.
   *
   * @example
   * ```ts
   * const aliceBalanceStub = mock.stubs.get<[GetBalanceParams], Promise<bigint>>({
   *   method: "getBalance",
   *   key: "alice",
   *   create: (stub) => stub.resolves(100n),
   * });
   * const balance = await aliceBalanceStub();
   * // -> 100n
   * ```
   */
  create?: (stub: SinonStub<TArgs, TReturnType>) => SinonStub;
}

export type HasStubParams<T> = Omit<GetStubParams<T>, "create">;

export class NotImplementedError extends DriftError {
  constructor({ method, args }: { method: string; args?: any[] }) {
    super(createMissingStubMessage(method, args), {
      name: "NotImplementedError",
    });
  }
}

// Internal //

function createDefaultStub<TArgs extends any[], TReturnType = any>(
  method: string,
) {
  return sinonStub().callsFake((...args) => {
    throw new NotImplementedError({ method, args });
  }) as SinonStub<TArgs, TReturnType>;
}

function createMissingStubMessage(method: string, args?: any[]) {
  let message = `Missing stub for mock method call.
  method: "${method}"`;

  if (args) {
    message += `
  args: ${formatArgsForDisplay(args)
    // Indent new lines.
    ?.replaceAll("\n", "\n  ")}`;
  }

  const capitalizedMethod = method.replace(/^./, (c) => c.toUpperCase());
  return `${message}

The value must be stubbed first. For example:
  mock.on${capitalizedMethod}(...args).resolves(value);
  mock.on${capitalizedMethod}(...args).callsFake(async (...args) => {
    // Do something with args
    return value;
  });
`;
}
