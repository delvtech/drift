import isMatch from "lodash.ismatch";
import stringify from "safe-stable-stringify";
import { type SinonStub, stub as sinonStub } from "sinon";
import { DriftError } from "src/error/DriftError";
import type { FunctionKey } from "src/utils/types";

export interface GetStubParams<T, TArgs extends any[], TReturnType> {
  /**
   * The method to get a stub for.
   */
  method: FunctionKey<T>;

  /**
   * A key to distinguish the stub from others for the same method.
   *
   * @example
   * ```ts
   * const aliceBalanceStub = mock.stubs.get<[NetworkGetBalanceParams], Promise<bigint>>({
   *   method: "getBalance",
   *   key: { address: "alice" },
   * });
   *
   * const bobBalanceStub = mock.stubs.get<[NetworkGetBalanceParams], Promise<bigint>>({
   *   method: "getBalance",
   *   key: { address: "bob" },
   * });
   * ```
   */
  key?: string;

  /**
   * Whether to allow partial matching of the key. If `true`, the first stub
   * with a key that is a partial match of the given key will be returned. This
   * has no effect if `key` is not provided.
   */
  matchPartial?: boolean;

  /**
   * A function to create the stub if it doesn't exist.
   */
  create?: (stub: SinonStub<TArgs, TReturnType>) => SinonStub;
}

/**
 * A store for stubs that can be used to mock methods on an object, `T`.
 */
export class StubStore<T> {
  protected methodStores = new Map<
    FunctionKey<T>,
    {
      defaultStub: SinonStub;
      keyedStubs: Map<string, SinonStub>;
    }
  >();

  reset(method?: FunctionKey<T>) {
    return method
      ? this.methodStores.delete(method)
      : this.methodStores.clear();
  }

  /**
   * Get a typed stub for a method on the object, `T`.
   */
  get<TArgs extends any[], TReturnType = any>({
    method,
    key,
    matchPartial,
    create,
  }: GetStubParams<T, TArgs, TReturnType>): SinonStub<TArgs, TReturnType> {
    let methodStore = this.methodStores.get(method);

    // Create a new method store if one doesn't exist
    if (!methodStore) {
      methodStore = {
        defaultStub: sinonStub().callsFake((...args) => {
          throw new NotImplementedError({
            method: String(method),
            args,
          });
        }),
        keyedStubs: new Map(),
      };
      this.methodStores.set(method, methodStore);

      // Apply the create function to the new default stub and return early if
      // no key is provided or if partial matching is enabled.
      if (create && (!key || matchPartial)) {
        methodStore.defaultStub = create(methodStore.defaultStub as any);
        return methodStore.defaultStub as any;
      }
    }

    if (!key) {
      return methodStore.defaultStub as any;
    }

    if (methodStore.keyedStubs.has(key)) {
      return methodStore.keyedStubs.get(key) as any;
    }

    if (matchPartial) {
      // Try to compare the keys to find a partial match
      const parsedKey = JSON.parse(key);
      for (const [storedKey, storedStub] of methodStore.keyedStubs) {
        const storedKeyData = JSON.parse(storedKey);
        if (isMatch(parsedKey, storedKeyData)) {
          return storedStub as any;
        }
      }

      return methodStore.defaultStub as any;
    }

    let newStub = sinonStub().callsFake((...args) => {
      throw new NotImplementedError({
        method: String(method),
        key,
        args,
      });
    });

    if (create) {
      newStub = create(newStub as any);
    }

    methodStore.keyedStubs.set(key, newStub);
    return newStub as any;
  }

  /**
   * Find out if a method has been stubbed.
   */
  has(method: FunctionKey<T>) {
    return this.methodStores.has(method);
  }
}

export class NotImplementedError extends DriftError {
  constructor({
    method,
    key,
    args,
  }: { method: string; key?: string; args?: any[] }) {
    super(
      `Missing stub${key ? ` with key '${key}'` : ""} for '${method}' method.

  The value must be stubbed first: 'mock.on${method.replace(/^./, (c) => c.toUpperCase())}(...args).resolves(value)'
  ${
    args
      ? `
  args: [
    ${args
      .map((arg) => {
        if (typeof arg === "object" && "abi" in arg) {
          const { abi, ...rest } = arg;
          return stringify(
            {
              ...rest,
              abi: stringify(abi)?.replace(/(?<=.{100}).+/, "..."),
            },
            null,
            2,
          )?.replaceAll("\n", "\n    ");
        }
        return stringify(arg, null, 2)?.replaceAll("\n", "\n    ");
      })
      .join(",\n    ")
      .replace(/"abi": "(.+)"/, '"abi": $1')}
  ]
`
      : ""
  }`,
      {
        name: "NotImplementedError",
      },
    );
  }
}
