import { IERC20 } from "src/base/testing/IERC20";
import { ReadWriteContractStub } from "src/contract/stubs/ReadWriteContractStub";
import { expect, test } from "vitest";

const ERC20ABI = IERC20.abi;

test("It stubs the write function", async () => {
  const contract = new ReadWriteContractStub(ERC20ABI);

  const stubbedValue = "0x01234";
  contract.stubWrite("transfer", stubbedValue);

  const value = await contract.write("transfer", {
    _to: "0x123abc",
    _value: 100n,
  });
  expect(value).toBe(stubbedValue);

  const stub = contract.getWriteStub("transfer");
  expect(stub?.callCount).toBe(1);
});
