import stringify from "fast-json-stable-stringify";
import { type SinonStub, stub as sinonStub } from "sinon";
import type { SerializableKey } from "src/utils/createSerializableKey";

export class MockStore<T> {
  protected mocks = new Map<string, SinonStub>();

  get<TArgs extends any[], TReturnType = any>({
    method,
    key,
    create,
  }: {
    method: NonNullable<
      {
        [K in keyof T]: T[K] extends Function ? K : never;
      }[keyof T]
    >;
    key?: SerializableKey;
    create?: (mock: SinonStub<TArgs, TReturnType>) => SinonStub;
  }): SinonStub<TArgs, TReturnType> {
    let mockKey: string = String(method);
    if (key) {
      mockKey += `:${stringify(key)}`;
    }
    let mock = this.mocks.get(mockKey);
    if (mock) {
      return mock as any;
    }
    mock = sinonStub().throws(
      new NotImplementedError({
        method: String(method),
        mockKey,
      }),
    );
    if (create) {
      mock = create(mock as any);
    }
    this.mocks.set(mockKey, mock);
    return mock as any;
  }

  reset() {
    this.mocks.clear();
  }
}

export class NotImplementedError extends Error {
  constructor({ method, mockKey }: { method: string; mockKey: string }) {
    super(
      `No mock found with key "${mockKey}". Called ${method} on a Mock without a return value. The value must be stubbed first:
    mock.on${method.replace(/^./, (c) => c.toUpperCase())}(...args).resolves(value)`,
    );
    this.name = "NotImplementedError";
  }
}
