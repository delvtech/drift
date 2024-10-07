import type {
  Block,
  ContractEvent,
  DecodedFunctionData,
  FunctionArgs,
  Transaction,
  TransactionReceipt,
} from "@delvtech/drift";
import { erc20 } from "integration-tests/artifacts/erc20";
import { ViemReadAdapter } from "src/ReadAdapter";
import { http, type Address, createPublicClient } from "viem";
import { describe, expect, it } from "vitest";

const { VITE_RPC_URL = "", VITE_TOKEN_ADDRESS = "" } = process.env;
const publicClient = createPublicClient({
  transport: http(VITE_RPC_URL),
});

describe("ViemReadAdapter", () => {
  it("fetches the chain id", async () => {
    const adapter = new ViemReadAdapter({ publicClient });
    const chainId = await adapter.getChainId();
    expect(chainId).toBeTypeOf("number");
  });

  it("fetches the current block", async () => {
    const adapter = new ViemReadAdapter({ publicClient });
    const block = await adapter.getBlock();
    expect(block).toEqual({
      blockNumber: expect.any(BigInt),
      timestamp: expect.any(BigInt),
    } as Block);
  });

  it("fetches account balances", async () => {
    const adapter = new ViemReadAdapter({ publicClient });
    const balance = await adapter.getBalance({
      address: VITE_TOKEN_ADDRESS,
    });
    expect(balance).toBeTypeOf("bigint");
  });

  it("fetches transactions", async () => {
    const adapter = new ViemReadAdapter({ publicClient });
    let block = await publicClient.getBlock();
    while (block.transactions.length === 0) {
      console.log(
        `No transactions in block ${block.number}. Fetching parent block.`,
      );
      block = await publicClient.getBlock({ blockHash: block.parentHash });
    }
    const tx = await adapter.getTransaction({
      hash: block.transactions[0]!,
    });
    expect(tx).toEqual(
      expect.objectContaining({
        gas: expect.any(BigInt),
        gasPrice: expect.any(BigInt),
        input: expect.any(String),
        nonce: expect.any(Number),
        type: expect.any(String),
        value: expect.any(BigInt),
        blockHash: expect.any(String),
        blockNumber: expect.any(BigInt),
        from: expect.any(String),
        hash: expect.any(String),
        to: expect.any(String),
        transactionIndex: expect.any(Number),
      } as Transaction),
    );
  });

  it("returns receipts for waited transactions", async () => {
    const adapter = new ViemReadAdapter({ publicClient });
    let block = await publicClient.getBlock();
    while (block.transactions.length === 0) {
      console.log(
        `No transactions in block ${block.number}. Fetching parent block.`,
      );
      block = await publicClient.getBlock({ blockHash: block.parentHash });
    }
    const tx = await adapter.waitForTransaction({
      hash: block.transactions[0]!,
    });
    expect(tx).toEqual(
      expect.objectContaining({
        blockHash: expect.any(String),
        blockNumber: expect.any(BigInt),
        from: expect.any(String),
        cumulativeGasUsed: expect.any(BigInt),
        effectiveGasPrice: expect.any(BigInt),
        gasUsed: expect.any(BigInt),
        logsBloom: expect.any(String),
        status: expect.stringMatching(/^(success|reverted)$/),
        to: expect.any(String),
        transactionHash: expect.any(String),
        transactionIndex: expect.any(Number),
      } as TransactionReceipt),
    );
  });

  it("fetches events", async () => {
    const adapter = new ViemReadAdapter({ publicClient });
    const currentBlock = await publicClient.getBlockNumber();
    const events = await adapter.getEvents({
      abi: erc20.abi,
      address: VITE_TOKEN_ADDRESS,
      event: "Transfer",
      fromBlock: currentBlock - 100n,
    });
    expect(events).toBeInstanceOf(Array);
    expect(events[0]).toEqual(
      expect.objectContaining({
        args: expect.any(Object),
        blockNumber: expect.any(BigInt),
        data: expect.any(String),
        transactionHash: expect.any(String),
      } as ContractEvent<typeof erc20.abi, "Transfer">),
    );
  });

  describe("read", () => {
    it("reads from contracts", async () => {
      const adapter = new ViemReadAdapter({ publicClient });
      const symbol = await adapter.read({
        abi: erc20.abi,
        address: VITE_TOKEN_ADDRESS,
        fn: "symbol",
      });
      expect(symbol).toBeTypeOf("string");
    });

    it("reads from contracts with args", async () => {
      const adapter = new ViemReadAdapter({ publicClient });
      const balance = await adapter.read({
        abi: erc20.abi,
        address: VITE_TOKEN_ADDRESS,
        fn: "balanceOf",
        args: {
          account: VITE_TOKEN_ADDRESS as Address,
        },
      });
      expect(balance).toBeTypeOf("bigint");
    });
  });

  it("simulates writes to a contracts", async () => {
    const adapter = new ViemReadAdapter({ publicClient });
    const balance = await adapter.simulateWrite({
      abi: erc20.abi,
      address: VITE_TOKEN_ADDRESS,
      fn: "transfer",
      args: {
        amount: 1n,
        to: VITE_TOKEN_ADDRESS as Address,
      },
    });
    expect(balance).toBeTypeOf("boolean");
  });

  it("encodes function data", async () => {
    const adapter = new ViemReadAdapter({ publicClient });
    const encoded = adapter.encodeFunctionData({
      abi: erc20.abi,
      fn: "transfer",
      args: {
        amount: 123n,
        to: VITE_TOKEN_ADDRESS as Address,
      },
    });
    expect(encoded).toBeTypeOf("string");
  });

  it("decodes function data", async () => {
    const adapter = new ViemReadAdapter({ publicClient });
    const args: FunctionArgs<typeof erc20.abi, "transfer"> = {
      amount: 123n,
      to: VITE_TOKEN_ADDRESS as Address,
    };
    const decoded = adapter.decodeFunctionData({
      abi: erc20.abi,
      fn: "transfer",
      data: adapter.encodeFunctionData({
        abi: erc20.abi,
        fn: "transfer",
        args,
      }),
    });
    expect(decoded).toEqual({
      args,
      functionName: "transfer",
    } as DecodedFunctionData<typeof erc20.abi, "transfer">);
  });
});
