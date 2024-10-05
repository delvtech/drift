import stringify from "fast-json-stable-stringify";
import { type SinonStub, stub as sinonStub } from "sinon";
import { DriftError } from "src/error";
import type { SerializableKey } from "src/utils/createSerializableKey";
import type { FunctionKey } from "src/utils/types";

export class MockStore<T> {
  protected mocks = new Map<string, SinonStub>();

  get<TArgs extends any[], TReturnType = any>({
    method,
    key,
    create,
  }: {
    method: FunctionKey<T>;
    key?: SerializableKey;
    create?: (mock: SinonStub<TArgs, TReturnType>) => SinonStub;
  }): SinonStub<TArgs, TReturnType> {
    let mockKey: string = String(method);
    if (key) {
      mockKey += `:${stringify(key)}`;
    }
    if (this.mocks.has(mockKey)) {
      return this.mocks.get(mockKey) as any;
    }
    let mock = sinonStub().throws(
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

export class NotImplementedError extends DriftError {
  constructor({ method, mockKey }: { method: string; mockKey: string }) {
    super(
      `No mock found with key "${mockKey}". Called ${method} on a Mock without a return value. The value must be stubbed first:
    mock.on${method.replace(/^./, (c) => c.toUpperCase())}(...args).resolves(value)`,
    );
    this.name = "NotImplementedError";
  }
}
