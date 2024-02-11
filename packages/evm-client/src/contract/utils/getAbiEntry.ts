import { Abi, AbiItemType } from 'abitype';
import { AbiEntry, AbiEntryName } from 'src/contract/types/AbiEntry';
import { AbiEntryNotFoundError } from 'src/errors/AbiEntryNotFound';

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
      (type === 'constructor' || (item as any).name === name),
  ) as AbiEntry<TAbi, TItemType, TName> | undefined;

  if (!abiItem) {
    throw new AbiEntryNotFoundError({ type, name });
  }

  return abiItem;
}
