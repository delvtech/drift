export const IERC721TokenReceiver = {
  name: 'IERC721TokenReceiver' as const,
  abi: [{"type":"function","name":"onERC721Received","inputs":[{"name":"_operator","type":"address","internalType":"address"},{"name":"_from","type":"address","internalType":"address"},{"name":"_tokenId","type":"uint256","internalType":"uint256"},{"name":"_data","type":"bytes","internalType":"bytes"}],"outputs":[{"name":"","type":"bytes4","internalType":"bytes4"}],"stateMutability":"nonpayable"}] as const,
  methodIdentifiers: {"onERC721Received(address,address,uint256,bytes)":"150b7a02"} as const,
};
