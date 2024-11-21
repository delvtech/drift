import type {
  Address,
  Block,
  ContractEvent,
  DecodedFunctionData,
  FunctionArgs,
  Hash,
  TransactionReceipt,
} from "@delvtech/drift";
import { erc20 } from "@delvtech/drift/testing";
import { JsonRpcProvider } from "ethers";
import { EthersReadAdapter } from "src/EthersReadAdapter";
import { describe, expect, it } from "vitest";

const { VITE_RPC_URL = "", VITE_TOKEN_ADDRESS = "0x0" } = process.env;
const provider = new JsonRpcProvider(VITE_RPC_URL);

const address = VITE_TOKEN_ADDRESS as Address;

describe("EthersReadAdapter", () => {
  it("can be initialized with either a provider instance or RPC url", async () => {
    const fromInstance = new EthersReadAdapter({ provider });
    expect(fromInstance.getChainId()).resolves;
    const fromUrl = new EthersReadAdapter({ provider: VITE_RPC_URL });
    expect(fromUrl.getChainId()).resolves;
  });

  it("fetches the chain id", async () => {
    const adapter = new EthersReadAdapter({ provider });
    const chainId = await adapter.getChainId();
    expect(chainId).toBeTypeOf("number");
  });

  it("fetches the current block", async () => {
    const adapter = new EthersReadAdapter({ provider });
    const block = await adapter.getBlock();
    expect(block).toMatchObject({
      number: expect.any(BigInt),
      timestamp: expect.any(BigInt),
    } as Partial<Block>);
  });

  it("fetches account balances", async () => {
    const adapter = new EthersReadAdapter({ provider });
    const balance = await adapter.getBalance({ address });
    expect(balance).toBeTypeOf("bigint");
  });

  it("fetches transactions", async () => {
    const adapter = new EthersReadAdapter({ provider });
    let block = await provider.getBlock("latest");
    expect(block).toBeDefined();
    while (block?.transactions.length === 0) {
      console.log(
        `No transactions in block ${block.number}. Fetching parent block.`,
      );
      block = await provider.getBlock(block.parentHash);
    }
    const tx = await adapter.getTransaction({
      hash: block!.transactions[0] as Hash,
    });
    expect(tx).toMatchObject({
      gas: expect.any(BigInt),
      gasPrice: expect.any(BigInt),
      input: expect.any(String),
      nonce: expect.any(BigInt),
      type: expect.any(String),
      value: expect.any(BigInt),
      blockHash: expect.any(String),
      blockNumber: expect.any(BigInt),
      from: expect.any(String),
      transactionHash: expect.any(String),
      to: expect.any(String),
      transactionIndex: expect.any(BigInt),
    });
  });

  it("returns receipts for waited transactions", async () => {
    const adapter = new EthersReadAdapter({ provider });
    let block = await provider.getBlock("latest");
    expect(block).toBeDefined();
    while (block?.transactions.length === 0) {
      console.log(
        `No transactions in block ${block.number}. Fetching parent block.`,
      );
      block = await provider.getBlock(block.parentHash);
    }
    const tx = await adapter.waitForTransaction({
      hash: block!.transactions[0] as Hash,
    });
    expect(tx).toMatchObject({
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
      transactionIndex: expect.any(BigInt),
    } as TransactionReceipt);
  });

  it("fetches events", async () => {
    const adapter = new EthersReadAdapter({ provider });
    const currentBlock = await provider.getBlockNumber();
    const events = await adapter.getEvents({
      abi: erc20.abi,
      address,
      event: "Transfer",
      fromBlock: BigInt(currentBlock - 100),
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
      const adapter = new EthersReadAdapter({ provider });
      const symbol = await adapter.read({
        abi: erc20.abi,
        address,
        fn: "symbol",
      });
      expect(symbol).toBeTypeOf("string");
    });

    it("reads from contracts with args", async () => {
      const adapter = new EthersReadAdapter({ provider });
      const balance = await adapter.read({
        abi: erc20.abi,
        address,
        fn: "balanceOf",
        args: { account: address },
      });
      expect(balance).toBeTypeOf("bigint");
    });
  });

  it("simulates writes to a contracts", async () => {
    const adapter = new EthersReadAdapter({ provider });
    const success = await adapter.simulateWrite({
      abi: erc20.abi,
      address,
      fn: "transfer",
      args: {
        amount: 1n,
        to: address,
      },
    });
    expect(success).toBeTypeOf("boolean");
  });

  it("encodes function data", async () => {
    const adapter = new EthersReadAdapter({ provider });
    const encoded = adapter.encodeFunctionData({
      abi: erc20.abi,
      fn: "transfer",
      args: {
        amount: 123n,
        to: address,
      },
    });
    expect(encoded).toBeTypeOf("string");
  });

  it("decodes function data", async () => {
    const adapter = new EthersReadAdapter({ provider });
    const args: FunctionArgs<typeof erc20.abi, "transfer"> = {
      amount: 123n,
      to: address,
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
    expect(decoded).toMatchObject({
      args,
      functionName: "transfer",
    } as DecodedFunctionData<typeof erc20.abi, "transfer">);
  });
});
