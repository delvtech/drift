import type { Abi, AbiItemType } from "abitype";
import type { AbiEntry, AbiEntryName } from "src/adapter/types/Abi";
import { DriftError } from "src/error";

/**
 * Get an entry from an ABI by type and name.
 * @throws If the entry is not found in the ABI.
 */
export function getAbiEntry<
  TAbi extends Abi,
  TItemType extends AbiItemType,
  TName extends AbiEntryName<TAbi, TItemType>,
>({
  abi,
  type,
  name,
}: {
  abi: TAbi;
  type: TItemType;
  name?: TName;
}): AbiEntry<TAbi, TItemType, TName> {
  const abiItem = abi.find(
    (item) =>
      item.type === type &&
      (type === "constructor" || (item as any).name === name),
  ) as AbiEntry<TAbi, TItemType, TName> | undefined;

  if (!abiItem) {
    throw new AbiEntryNotFoundError({ type, name });
  }

  return abiItem;
}

export class AbiEntryNotFoundError extends DriftError {
  constructor({ type, name }: { type: AbiItemType; name?: string }) {
    super(`No ${type}${name ? ` with name ${name}` : ""} found in ABI.`);
    this.name = "AbiEntryNotFoundError";
  }
}
