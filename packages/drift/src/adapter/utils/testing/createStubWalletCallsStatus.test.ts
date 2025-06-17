import type { WalletCallsStatus } from "src/adapter/types/Adapter";
import type { WalletCallsReceipt } from "src/adapter/types/Transaction";
import { createStubWalletCallsStatus } from "src/adapter/utils/testing/createStubWalletCallsStatus";
import { describe, expect, it } from "vitest";

describe("createStubWalletCallsStatus", () => {
  it("creates a stub wallet calls status with overrides", () => {
    const status = createStubWalletCallsStatus({
      id: "0x123", // <--
    });
    expect(status).toStrictEqual({
      id: "0x123", // <--
      version: expect.any(String),
      chainId: expect.any(Number),
      status: expect.toBeOneOf([
        "pending",
        "confirmed",
        "failed",
        "reverted",
        "partially-reverted",
      ]) satisfies WalletCallsStatus["status"][],
      statusCode: expect.any(Number),
      atomic: expect.any(Boolean),
      receipts: expect.toBeOneOf([
        expect.arrayContaining([expect.any(Object)]),
        undefined,
      ]),
    } satisfies WalletCallsStatus);
  });

  it("includes receipts for confirmed and partially-reverted statuses", () => {
    const status1 = createStubWalletCallsStatus({
      status: "confirmed",
    });
    expect(status1).toMatchObject({
      status: "confirmed",
      receipts: expect.arrayContaining([
        expect.objectContaining({
          status: "success",
        }) satisfies Partial<WalletCallsReceipt>,
      ]),
    } satisfies Partial<WalletCallsStatus>);

    const status2 = createStubWalletCallsStatus({
      status: "partially-reverted",
    });
    expect(status2).toMatchObject({
      status: "partially-reverted",
      receipts: expect.arrayContaining([
        expect.objectContaining({
          status: expect.toBeOneOf(["success", "reverted"]),
        }) satisfies Partial<WalletCallsReceipt>,
      ]),
    } satisfies Partial<WalletCallsStatus>);
  });

  it("doesn't include receipts for pending or failure statuses", () => {
    const status1 = createStubWalletCallsStatus({
      status: "pending",
    });
    expect(status1).toMatchObject({
      status: "pending",
      receipts: undefined,
    } satisfies Partial<WalletCallsStatus>);

    const status2 = createStubWalletCallsStatus({
      statusCode: 500,
    });
    expect(status2).toMatchObject({
      status: "reverted",
      receipts: undefined,
    } satisfies Partial<WalletCallsStatus>);
  });

  const status3 = createStubWalletCallsStatus({
    status: "failed",
  });
  expect(status3).toMatchObject({
    status: "failed",
    statusCode: 400,
    receipts: undefined,
  } satisfies Partial<WalletCallsStatus>);
});
