import type { OxReadAdapterParams } from "src/adapter/OxAdapter";
import type { Adapter } from "src/adapter/types/Adapter";

export type AdapterParam<T extends Adapter = Adapter> =
  | {
      adapter: T;
    }
  | OxReadAdapterParams;
