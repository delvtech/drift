import type { Abi, Hash } from "src/adapter/types/Abi";
import type { DeployParams, ReadWriteAdapter } from "src/adapter/types/Adapter";
import type { ConstructorArgs } from "src/adapter/types/Function";

export function deploy<TAbi extends Abi>(
  adapter: ReadWriteAdapter,
  {
    abi,
    bytecode,
    args = {} as ConstructorArgs<TAbi>,
    ...options
  }: DeployParams<TAbi>,
): Promise<Hash> {
  const data = adapter.encodeDeployData({ abi, bytecode, args });
  return adapter.sendTransaction({ data, ...options });
}
