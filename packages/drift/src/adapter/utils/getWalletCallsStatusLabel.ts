import type { WalletCallsStatus } from "src/adapter/types/Adapter";
import { DriftError } from "src/error/DriftError";

/**
 * Returns the status label for a given wallet calls status code.
 *
 * @example
 * ```ts
 * getWalletCallsStatusLabel(100); // "pending"
 * getWalletCallsStatusLabel(200); // "confirmed"
 * getWalletCallsStatusLabel(400); // "failed"
 * getWalletCallsStatusLabel(500); // "reverted"
 * getWalletCallsStatusLabel(600); // "partially-reverted"
 * ```
 */
export function getWalletCallsStatusLabel(
  statusCode: number,
): WalletCallsStatus["status"] {
  if (statusCode >= 100 && statusCode < 200) return "pending";
  if (statusCode >= 200 && statusCode < 300) return "confirmed";
  if (statusCode >= 400 && statusCode < 500) return "failed";
  if (statusCode >= 500 && statusCode < 600) return "reverted";
  if (statusCode >= 600 && statusCode < 700) return "partially-reverted";
  throw new DriftError(`Unknown status code: ${statusCode}`);
}
