import { HEX_REGEX } from "@delvtech/drift";
import { testToken } from "@delvtech/drift/testing";
import { ViemReadWriteAdapter } from "src/ViemReadWriteAdapter";
import {
  http,
  createPublicClient,
  createWalletClient,
  getContract,
} from "viem";
import { mainnet } from "viem/chains";
import { describe, expect, it } from "vitest";

const { VITE_RPC_URL = "http://127.0.0.1:8545" } = process.env;
const publicClient = createPublicClient({
  transport: http(VITE_RPC_URL),
});
const walletClient = createWalletClient({
  transport: http(VITE_RPC_URL),
  chain: mainnet,
});

describe("ViemReadWriteAdapter", () => {
  it("deploys contracts", async () => {
    const adapter = new ViemReadWriteAdapter({ publicClient, walletClient });

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
    const adapter = new ViemReadWriteAdapter({ publicClient, walletClient });

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
