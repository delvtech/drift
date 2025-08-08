import {
  // deserialize as _deserialize,
  // parseKey as _parseKey,
  serialize as _serialize,
  stringifyKey as _stringifyKey,
} from "./packages/drift/dist/index.js";

const address = "0x1234567890abcdef1234567890abcdef12345678";
const params = {
  address,
  event: "Transfer",
  filter: {
    to: address,
  },
  fromBlock: 12345678n,
  toBlock: 23456789n,
};

// const stringifiedKey = _stringifyKey(params);
// const serializedKey = _serialize(params);

export function stringifyKey() {
  return _stringifyKey(params);
}

// export function parseKey() {
//   return _parseKey(stringifiedKey);
// }

export function serialize() {
  return _serialize(params);
}

// export function deserialize() {
//   return _deserialize(serializedKey);
// }
