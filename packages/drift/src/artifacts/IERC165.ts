export const IERC165 = {
  name: 'IERC165' as const,
  abi: [{"type":"function","name":"supportsInterface","inputs":[{"name":"interfaceID","type":"bytes4","internalType":"bytes4"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"}] as const,
  methodIdentifiers: {"supportsInterface(bytes4)":"01ffc9a7"} as const,
};
