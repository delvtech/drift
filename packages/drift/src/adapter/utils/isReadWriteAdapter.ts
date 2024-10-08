import type { Adapter, ReadWriteAdapter } from "src/adapter/types/Adapter";

export function isReadWriteAdapter(
  adapter: Adapter,
): adapter is ReadWriteAdapter {
  return "write" in adapter;
}
