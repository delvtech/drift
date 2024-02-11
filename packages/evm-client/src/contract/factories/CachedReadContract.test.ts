import { IERC20 } from "src/base/testing/IERC20";
import { ALICE, BOB } from "src/base/testing/accounts";
import { ReadContractStub } from "src/contract/stubs/ReadContractStub";
import { Event } from "src/contract/types/Event";
import { expect, test } from "vitest";
import { createCachedReadContract } from "./createCachedReadContract";

const ERC20ABI = IERC20.abi;

test("It caches the read function", async () => {
  const contract = new ReadContractStub(ERC20ABI);
  const cachedContract = createCachedReadContract({ contract });

  const stubbedValue = "0x123abc";
  contract.stubRead({
    functionName: "name",
    value: stubbedValue,
  });

  const value = await cachedContract.read("name");
  expect(value).toBe(stubbedValue);

  const value2 = await cachedContract.read("name");
  expect(value2).toBe(stubbedValue);

  const stub = contract.getReadStub("name");
  expect(stub?.callCount).toBe(1);
});

test("It caches the getEvents function", async () => {
  const contract = new ReadContractStub(ERC20ABI);
  const cachedContract = createCachedReadContract({ contract });

  const stubbedEvents: Event<typeof ERC20ABI, "Transfer">[] = [
    {
      eventName: "Transfer",
      args: {
        from: ALICE,
        to: BOB,
        value: 100n,
      },
      blockNumber: 1n,
      data: "0x123abc",
      transactionHash: "0x123abc",
    },
  ];
  contract.stubEvents("Transfer", stubbedEvents);

  const events = await cachedContract.getEvents("Transfer");
  expect(events).toBe(stubbedEvents);

  const events2 = await cachedContract.getEvents("Transfer");
  expect(events2).toBe(stubbedEvents);

  const stub = contract.getEventsStub("Transfer");
  expect(stub?.callCount).toBe(1);
});

test("The deleteRead function deletes the cached read value", async () => {
  const contract = new ReadContractStub(ERC20ABI);
  const cachedContract = createCachedReadContract({ contract });

  const stubbedValue = 100n;
  contract.stubRead({ functionName: "balanceOf", value: stubbedValue });

  const value = await cachedContract.read("balanceOf", "0x123abc");
  expect(value).toBe(stubbedValue);

  cachedContract.deleteRead("balanceOf", "0x123abc");

  const value2 = await cachedContract.read("balanceOf", "0x123abc");
  expect(value2).toBe(stubbedValue);

  const stub = contract.getReadStub("balanceOf");
  expect(stub?.callCount).toBe(2);
});

test("It clears the cache", async () => {
  const contract = new ReadContractStub(ERC20ABI);
  const cachedContract = createCachedReadContract({ contract });

  contract.stubRead({ functionName: "balanceOf", value: 100n });
  const stubbedValue = "0x123abc";
  contract.stubRead({
    functionName: "name",
    value: stubbedValue,
  });
  2;
  await cachedContract.read("balanceOf", "0x123abc");
  await cachedContract.read("name");

  cachedContract.clearCache();

  await cachedContract.read("balanceOf", "0x123abc");
  await cachedContract.read("name");

  const stubA = contract.getReadStub("balanceOf");
  const stubB = contract.getReadStub("name");
  expect(stubA?.callCount).toBe(2);
  expect(stubB?.callCount).toBe(2);
});
