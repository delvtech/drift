import type { Replace } from "@delvtech/drift";
import {
  type Account,
  type Chain,
  type Client,
  type PublicClient,
  publicActions,
  type RpcSchema,
  type Transport,
} from "viem";

/**
 * @internal
 */
export type AnyClient = Client<
  Transport,
  Chain | undefined,
  Account | undefined,
  RpcSchema | undefined
>;

type AnyPublicClient = PublicClient<
  Transport,
  Chain | undefined,
  Account | undefined,
  RpcSchema | undefined
>;

const requiredPublicActions = [
  "call",
  "estimateGas",
  "getBalance",
  "getBlock",
  "getBlockNumber",
  "getChainId",
  "getContractEvents",
  "getGasPrice",
  "getTransaction",
  "sendRawTransaction",
  "waitForTransactionReceipt",
] as const satisfies (keyof AnyPublicClient)[];

type RequiredPublicActions = (typeof requiredPublicActions)[number];

type MinimumRequiredClient = Replace<
  AnyClient,
  Pick<AnyPublicClient, RequiredPublicActions>
>;

/**
 * @internal
 */
export type CoercedPublicClient<T extends AnyClient = AnyClient> =
  T extends MinimumRequiredClient ? T : Replace<AnyPublicClient, T>;

/**
 * @internal
 */
export function hasRequiredActions<T extends AnyClient>(
  client: T,
): client is CoercedPublicClient<T> {
  return requiredPublicActions.every((action) => action in client);
}

/**
 * @internal
 */
export function coercePublicClient<T extends AnyClient>(
  client: T,
): CoercedPublicClient<T> {
  if (hasRequiredActions(client)) return client;
  return client.extend(publicActions) as any;
}
