import type { Networkish, Provider, Signer } from "ethers";
import { useEffect, useState } from "react";
import { getEthers } from "src/drift/ethers/getEthers";
import type { EthersOptions } from "src/drift/ethers/types";

export function useEthers(network?: Networkish, options?: EthersOptions) {
  const [instances, setInstances] = useState<{
    provider?: Provider;
    signer?: Signer;
  }>({});

  useEffect(() => {
    getEthers(network, options).then(setInstances);
  }, [network, options]);

  return instances;
}
