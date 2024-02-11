import { AbiItemType } from 'abitype';

export class AbiEntryNotFoundError extends Error {
  constructor({ type, name }: { type: AbiItemType; name?: string }) {
    super(`No ${type}${name ? ` with name ${name}` : ''} found in ABI.`);
  }
}
