import { OxAdapter } from "src/adapter/OxAdapter";
import type { Address as AddressType } from "src/adapter/types/Abi";
import type { Block } from "src/adapter/types/Block";
import type { EventLog } from "src/adapter/types/Event";
import type {
  DecodedFunctionData,
  FunctionArgs,
} from "src/adapter/types/Function";
import type {
  Transaction,
  TransactionReceipt,
} from "src/adapter/types/Transaction";
import { MockERC20 } from "src/artifacts/MockERC20";
import { TestToken } from "src/artifacts/TestToken";
import { ZERO_ADDRESS } from "src/constants";
import { HEX_REGEX } from "src/utils/isHexString";
import { describe, expect, it } from "vitest";

describe("OxAdapter", () => {
  const address = (
    process.env.VITE_TOKEN_ADDRESS || ZERO_ADDRESS
  ).toLowerCase() as AddressType;
  const rpcUrl = process.env.VITE_RPC_URL;

  it("fetches the chain id", async () => {
    const adapter = new OxAdapter({ rpcUrl });
    const chainId = await adapter.getChainId();
    expect(chainId).toBeTypeOf("number");
  });

  it("fetches the current block", async () => {
    const adapter = new OxAdapter({ rpcUrl });
    const block = await adapter.getBlock();
    expect(block).toMatchObject({
      timestamp: expect.any(BigInt),
      extraData: expect.any(String),
      gasLimit: expect.any(BigInt),
      gasUsed: expect.any(BigInt),
      hash: expect.any(String),
      logsBloom: expect.any(String),
      miner: expect.any(String),
      mixHash: expect.any(String),
      nonce: expect.any(BigInt),
      number: expect.any(BigInt),
      parentHash: expect.any(String),
      receiptsRoot: expect.any(String),
      sha3Uncles: expect.any(String),
      size: expect.any(BigInt),
      stateRoot: expect.any(String),
      transactions: expect.any(Array),
      transactionsRoot: expect.any(String),
    } as Block);
  });

  it("fetches account balances", async () => {
    const adapter = new OxAdapter({ rpcUrl });
    const balance = await adapter.getBalance({ address });
    expect(balance).toBeTypeOf("bigint");
  });

  it("fetches transactions", async () => {
    const adapter = new OxAdapter({ rpcUrl });
    let block: Block | undefined = await adapter.getBlock();
    while (block?.transactions.length === 0) {
      console.log(
        `No transactions in block ${block.number}. Fetching parent block.`,
      );
      block = await adapter.getBlock(block.parentHash);
    }
    const tx = await adapter.getTransaction({
      hash: block!.transactions[0]!,
    });
    expect(tx).toEqual(
      expect.objectContaining({
        gas: expect.any(BigInt),
        gasPrice: expect.any(BigInt),
        input: expect.any(String),
        nonce: expect.any(BigInt),
        type: expect.any(String),
        value: expect.any(BigInt),
        blockHash: expect.any(String),
        blockNumber: expect.any(BigInt),
        from: expect.any(String),
        hash: expect.any(String),
        transactionIndex: expect.any(BigInt),
      } as Transaction),
    );
  });

  it("returns receipts for waited transactions", async () => {
    const adapter = new OxAdapter({ rpcUrl });
    const blockNumber = await adapter.getBlockNumber();
    let block = await adapter.getBlock(blockNumber - 12n * 60n * 24n);
    while (block?.transactions.length === 0) {
      console.log(
        `No transactions in block ${block?.number}. Fetching parent block.`,
      );
      block = await adapter.getBlock(block.parentHash);
    }
    const tx = await adapter.waitForTransaction({
      hash: block!.transactions[0]!,
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
        transactionIndex: expect.any(BigInt),
      } as TransactionReceipt),
    );
  });

  describe("call", () => {
    it("reads from deployed contracts", async () => {
      const adapter = new OxAdapter({ rpcUrl });
      const data = adapter.encodeFunctionData({
        abi: TestToken.abi,
        fn: "symbol",
      });
      const result = await adapter.call({
        to: address,
        data,
      });
      expect(result).toEqual(expect.stringMatching(/^0x/));
    });

    it("reads from bytecodes", async () => {
      const adapter = new OxAdapter({ rpcUrl });
      const data = adapter.encodeFunctionData({
        abi: MockERC20.abi,
        fn: "name",
      });
      const result = await adapter.call({
        bytecode: MockERC20.bytecode,
        data,
      });
      expect(result).toEqual(expect.stringMatching(/^0x/));
    });
  });

  it("fetches events", async () => {
    const adapter = new OxAdapter({ rpcUrl });
    const currentBlock = await adapter.getBlockNumber();
    const events = await adapter.getEvents({
      abi: TestToken.abi,
      address,
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
      } as EventLog<typeof TestToken.abi, "Transfer">),
    );
  });

  describe("read", () => {
    it("reads from contracts", async () => {
      const adapter = new OxAdapter({ rpcUrl });
      const symbol = await adapter.read({
        abi: TestToken.abi,
        address,
        fn: "symbol",
      });
      expect(symbol).toBeTypeOf("string");
    });

    it("reads from contracts with args", async () => {
      const adapter = new OxAdapter({ rpcUrl });
      const balance = await adapter.read({
        abi: TestToken.abi,
        address,
        fn: "balanceOf",
        args: { owner: address },
      });
      expect(balance).toBeTypeOf("bigint");
    });
  });

  it("simulates writes to a contracts", async () => {
    const adapter = new OxAdapter({ rpcUrl });
    const balance = await adapter.simulateWrite({
      abi: TestToken.abi,
      address,
      fn: "transfer",
      args: {
        amount: 1n,
        to: address,
      },
    });
    expect(balance).toBeTypeOf("boolean");
  });

  it("deploys contracts", async () => {
    const adapter = new OxAdapter({ rpcUrl });

    const hash = await adapter.deploy({
      abi: TestToken.abi,
      bytecode: TestToken.bytecode,
      args: {
        decimals_: 18,
        initialSupply: 123n,
      },
    });
    const receipt = await adapter.waitForTransaction({ hash });

    expect(hash).toBeTypeOf("string");
    expect(receipt).toMatchObject({
      contractAddress: expect.stringMatching(HEX_REGEX),
    } satisfies Partial<TransactionReceipt>);
  });

  it("encodes deploy data", async () => {
    const adapter = new OxAdapter({ rpcUrl });
    const encoded = adapter.encodeDeployData({
      abi: TestToken.abi,
      bytecode: TestToken.bytecode,
      args: {
        decimals_: 18,
        initialSupply: 123n,
      },
    });
    expect(encoded).toBeTypeOf("string");
  });

  it("encodes function data", async () => {
    const adapter = new OxAdapter({ rpcUrl });
    const encoded = adapter.encodeFunctionData({
      abi: TestToken.abi,
      fn: "transfer",
      args: {
        amount: 123n,
        to: address,
      },
    });
    expect(encoded).toBeTypeOf("string");
  });

  // Ensures edge cases are handled correctly
  const tupleParamsAbi = [
    {
      name: "names",
      type: "function",
      inputs: [
        { name: "", type: "string" },
        { name: "", type: "string" },
      ],
      outputs: [
        { name: "", type: "string" },
        { name: "", type: "string" },
      ],
      stateMutability: "view",
    },
  ] as const;

  it("encodes function return data", async () => {
    const adapter = new OxAdapter({ rpcUrl });
    const encoded = adapter.encodeFunctionReturn({
      abi: tupleParamsAbi,
      fn: "names",
      value: {
        0: "delv",
        1: "drift",
      },
    });
    expect(encoded).toEqual(
      "0x00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000464656c760000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000056472696674000000000000000000000000000000000000000000000000000000",
    );
  });

  it("decodes function data", async () => {
    const adapter = new OxAdapter({ rpcUrl });
    const args: FunctionArgs<typeof tupleParamsAbi, "names"> = {
      0: "delv",
      1: "drift",
    };
    const decoded = adapter.decodeFunctionData({
      abi: tupleParamsAbi,
      fn: "names",
      data: adapter.encodeFunctionData({
        abi: tupleParamsAbi,
        fn: "names",
        args,
      }),
    });
    expect(decoded).toEqual({
      args,
      functionName: "names",
    } as DecodedFunctionData<typeof tupleParamsAbi, "names">);
  });

  it("decodes function return data", async () => {
    const adapter = new OxAdapter({ rpcUrl });
    const decoded = adapter.decodeFunctionReturn({
      abi: tupleParamsAbi,
      fn: "names",
      data: "0x00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000464656c760000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000056472696674000000000000000000000000000000000000000000000000000000",
    });
    expect(decoded).toMatchObject({
      0: "delv",
      1: "drift",
    });
  });
});
