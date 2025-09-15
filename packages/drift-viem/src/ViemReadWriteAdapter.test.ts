import { HEX_REGEX } from "@gud/drift";
import { testToken } from "@gud/drift/testing";
import { ViemReadWriteAdapter } from "src/ViemReadWriteAdapter";
import {
  type Address,
  createPublicClient,
  createWalletClient,
  getContract,
  http,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { anvil, mainnet } from "viem/chains";
import { describe, expect, it } from "vitest";

const rpcUrl = process.env.VITE_RPC_URL || anvil.rpcUrls.default.http[0];
const publicClient = createPublicClient({
  transport: http(rpcUrl),
});
const privateKey = process.env.VITE_PRIVATE_KEY as Address | undefined;
const walletClient = createWalletClient({
  transport: http(rpcUrl),
  chain: mainnet,
  account: privateKey ? privateKeyToAccount(privateKey) : undefined,
});
const adapter = new ViemReadWriteAdapter({ publicClient, walletClient });

describe("ViemReadWriteAdapter", () => {
  it("deploys contracts", async () => {
    const hash = await adapter.deploy({
      abi: testToken.abi,
      bytecode: testToken.bytecode,
      args: { decimals_: 18, initialSupply: 123n },
    });
    const receipt = await adapter.waitForTransaction({ hash });

    expect(hash).toMatch(HEX_REGEX);
    expect(receipt.contractAddress).toMatch(HEX_REGEX);
  });

  it("sends transactions", async () => {
    const hash = await adapter.sendTransaction({
      data: adapter.encodeDeployData({
        abi: testToken.abi,
        bytecode: testToken.bytecode,
        args: { decimals_: 18, initialSupply: 123n },
      }),
    });
    const receipt = await adapter.waitForTransaction({ hash });

    expect(hash).toMatch(HEX_REGEX);
    expect(receipt.contractAddress).toMatch(HEX_REGEX);

    const token = getContract({
      abi: testToken.abi,
      address: receipt.contractAddress!,
      client: publicClient,
    });
    const supply = await token.read.totalSupply();

    expect(supply).toEqual(123n);
  });
});
