import stringify from "safe-stable-stringify";
import type { Abi } from "src/adapter/types/Abi";
import { convert } from "src/utils/convert";
import type { Extended } from "src/utils/types";

/**
 * Format arguments for display in a human-readable way. Useful for debugging.
 * @internal
 */
export function formatArgsForDisplay(args: any, truncateAbi = true) {
  if (truncateAbi) {
    args = convert(
      args,
      (v): v is Extended<{ abi: Abi }> => {
        return v && typeof v === "object" && "abi" in v;
      },
      ({ abi, ...rest }) => {
        return {
          abi: stringify(abi)?.replace(/(?<=.{100}).+/, "…]"),
          ...rest,
        };
      },
    );
  }

  const argsString = stringify(args, bigintReplacer, 2)
    // Unescape quotes.
    ?.replaceAll('\\"', '"')
    // Remove quotes around object keys and stringified bigints.
    // https://regex101.com/r/hW0rCo/1
    ?.replace(/"([^"]+)"(:)|"(\d+n)"/g, "$1$2$3")
    // Remove quotes around stringified arrays.
    // https://regex101.com/r/2Itck2/1
    ?.replace(/"(\[.*?\])"/g, "$1");

  if (argsString?.length && argsString.length < 40) {
    return argsString.replaceAll(/\n\s*/g, " ");
  }

  return argsString;
}

function bigintReplacer(_key: string, value: unknown) {
  return typeof value === "bigint" ? `${value}n` : value;
}
