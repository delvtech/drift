import type { Address } from "src/adapter/types/Abi";
import { MULTICALL_ADDRESSES } from "src/constants/multicall";

/**
 * A chain ID with a known Multicall3 deployment.
 *
 * @see [Multicall3 - Deployments](https://www.multicall3.com/deployments)
 */
export type MulticallChainId = keyof typeof MULTICALL_ADDRESSES;

type GetMulticallAddressReturn<
  TChainId extends MulticallChainId | (number & {}),
> = TChainId extends MulticallChainId
  ? (typeof MULTICALL_ADDRESSES)[TChainId]
  : number extends TChainId
    ? Address | undefined
    : undefined;

/**
 * Retrieves the address of a known Multicall3 deployment for a given chain ID.
 *
 * @param chainId - The chain ID for which to get the multicall address.
 * @returns The known Multicall3 address for the given chain ID if available,
 * undefined otherwise.
 *
 * @see [Multicall3 - Deployments](https://www.multicall3.com/deployments)
 */
export function getMulticallAddress<
  TChainId extends MulticallChainId | (number & {}),
>(chainId: TChainId): GetMulticallAddressReturn<TChainId> {
  const address = MULTICALL_ADDRESSES[chainId as MulticallChainId];
  if (!address) {
    console.warn(
      `No multicall address found for chain ID ${chainId}. Please provide a valid multicall address.`,
    );
  }
  return address as GetMulticallAddressReturn<TChainId>;
}
