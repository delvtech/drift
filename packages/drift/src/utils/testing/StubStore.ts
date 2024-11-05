import isMatch from "lodash.ismatch";
import stringify from "safe-stable-stringify";
import { type SinonStub, stub as sinonStub } from "sinon";
import { DriftError } from "src/error";
import type { SerializableKey } from "src/utils/createSerializableKey";
import type { FunctionKey } from "src/utils/types";

export class StubStore<T> {
  // TODO: Split by method name to avoid iterating over all stubs while
  // searching for a partial match.
  protected stubs = new Map<string, SinonStub>();

  get<TArgs extends any[], TReturnType = any>({
    method,
    key,
    create,
  }: {
    method: FunctionKey<T>;
    key?: SerializableKey;
    create?: (stub: SinonStub<TArgs, TReturnType>) => SinonStub;
  }): SinonStub<TArgs, TReturnType> {
    const methodString = String(method);
    let stubKey = methodString;
    if (key) {
      stubKey += `:${stringify(key)}`;
    }

    // If a stub matching the key exists, return it
    if (this.stubs.has(stubKey)) {
      return this.stubs.get(stubKey) as any;
    }

    // Otherwise, search for a partial match
    const isObjectKey = typeof key === "object";
    let fallbackStub: SinonStub<TArgs, TReturnType> | undefined;
    for (const [storedKey, storedStub] of this.stubs) {
      // If the keys are partial matches, return the stub
      const [, storedKeyData] = storedKey.split(/^\w+:/);
      if (storedKeyData && isObjectKey) {
        const storedKeyParsed = JSON.parse(storedKeyData);
        if (isMatch(key, storedKeyParsed)) {
          return storedStub as any;
        }
      }

      // If the key is only the method name, save it as a fallback
      if (storedKey === methodString) {
        fallbackStub = storedStub as any;
      }
    }

    // If a fallback stub exists, return it
    if (fallbackStub) {
      return fallbackStub;
    }

    // Otherwise, create a new stub that throws a NotImplementedError by default
    let stub = sinonStub().throws(
      new NotImplementedError({
        method: String(method),
        stubKey,
      }),
    );
    if (create) {
      stub = create(stub as any);
    }
    this.stubs.set(stubKey, stub);
    return stub as any;
  }

  reset() {
    this.stubs.clear();
  }
}

export class NotImplementedError extends DriftError {
  constructor({ method, stubKey }: { method: string; stubKey: string }) {
    super(
      `No stub found with key "${stubKey}". Called \`.${method}\` on a Mock without a return value. The value must be stubbed first:
    mock.on${method.replace(/^./, (c) => c.toUpperCase())}(...args).resolves(value)`,
    );
    this.name = "NotImplementedError";
  }
}
