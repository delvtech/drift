import type { WalletCallsStatus } from "src/adapter/types/Adapter";
import { getWalletCallsStatusLabel } from "src/adapter/utils/getWalletCallsStatusFromCode";
import { randomHex } from "src/utils/testing/randomHex";
import { randomInt } from "src/utils/testing/randomInt";
import { randomSelection } from "src/utils/testing/randomSelection";
import type { Eval, Replace, Writable } from "src/utils/types";

const statusCodeMap: Record<string, number> = {
  pending: 100,
  confirmed: 200,
  failed: 400,
  reverted: 500,
  "partially-reverted": 600,
};

/**
 * Creates a stub wallet calls status for testing.
 * @param override - Override default values
 */
export function createStubWalletCallsStatus<
  const T extends Partial<WalletCallsStatus> = WalletCallsStatus,
>(overrides: T = {} as T): Eval<Replace<WalletCallsStatus, Writable<T, true>>> {
  const statusCode =
    overrides.statusCode ?? statusCodeMap[overrides.status ?? "confirmed"]!;
  const status = overrides.status ?? getWalletCallsStatusLabel(statusCode);
  const blockHash = overrides.receipts?.[0]?.blockHash ?? randomHex(32);
  const transactionHash =
    overrides.receipts?.[0]?.transactionHash ?? randomHex(32);
  return {
    version: "1.0",
    chainId: 1,
    id: randomHex(randomInt(32, 128)),
    status,
    statusCode,
    atomic: true,
    receipts:
      overrides.receipts ||
      (status === "confirmed" || status === "partially-reverted"
        ? Array.from({ length: randomInt(1, 5) }, () => ({
            status:
              status === "confirmed"
                ? "success"
                : randomSelection(["success", "reverted"]),
            blockHash,
            blockNumber: 1n,
            gasUsed: 0n,
            transactionHash,
          }))
        : undefined),
    ...overrides,
  };
}
