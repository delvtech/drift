import stringify from "fast-json-stable-stringify";
import { type SinonStub, stub as sinonStub } from "sinon";
import { DriftError } from "src/error";
import type { SerializableKey } from "src/utils/createSerializableKey";
import type { FunctionKey } from "src/utils/types";

export class StubStore<T> {
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
    let stubKey: string = String(method);
    if (key) {
      stubKey += `:${stringify(key)}`;
    }
    if (this.stubs.has(stubKey)) {
      return this.stubs.get(stubKey) as any;
    }
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
