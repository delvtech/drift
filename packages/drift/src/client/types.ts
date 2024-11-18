import type { OxAdapterParams } from "src/adapter/OxAdapter";
import type { Adapter } from "src/adapter/types/Adapter";
import type { OneOf } from "src/utils/types";

export type AdapterParam<T extends Adapter = Adapter> = OneOf<
  | {
      adapter: T;
    }
  | OxAdapterParams
>;
