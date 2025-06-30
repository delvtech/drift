import { erc20 } from "@delvtech/drift";

export const tokenAbi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "name",
        type: "string",
        internalType: "string",
      },
      {
        name: "symbol",
        type: "string",
        internalType: "string",
      },
      {
        name: "decimals",
        type: "uint8",
        internalType: "uint8",
      },
    ],
    stateMutability: "nonpayable",
  },
  ...erc20.abi,
] as const;
