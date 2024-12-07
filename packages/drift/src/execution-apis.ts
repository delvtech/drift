// This file was generated from the ethereum/execution-apis repo.
// See https://github.com/ethereum/execution-apis for more information.
//
// Changes to this file may cause incorrect behavior and will be lost if
// the code is regenerated.


export type BlockNumber = string;
/**
 *
 * `earliest`: The lowest numbered block the client has available; `finalized`: The most recent crypto-economically secure block, cannot be re-orged outside of manual intervention driven by community coordination; `safe`: The most recent block that is safe from re-orgs under honest majority and certain synchronicity assumptions; `latest`: The most recent block in the canonical chain observed by the client, this block may be re-orged out of the canonical chain even under healthy/normal conditions; `pending`: A sample next block built by the client on top of `latest` and containing the set of transactions usually taken from local mempool. Before the merge transition is finalized, any call querying for `finalized` or `safe` block MUST be responded to with `-39001: Unknown block` error
 *
 */
export type BlockTag = "earliest" | "finalized" | "safe" | "latest" | "pending";
export type StringDoaGddGA = string;
export type TerminalTotalDifficulty = string;
export type TerminalBlockHash = string;
export type TerminalBlockNumber = string;
export type HeadBlockHash = string;
export type SafeBlockHash = string;
export type FinalizedBlockHash = string;
export type Timestamp = string;
export type PreviousRandaoValue = string;
export type SuggestedFeeRecipient = string;
export type WithdrawalIndex = string;
export type ValidatorIndex = string;
export type WithdrawalAddress = string;
export type WithdrawalAmount = string;
export interface WithdrawalObjectV1 {
  index: WithdrawalIndex;
  validatorIndex: ValidatorIndex;
  address: WithdrawalAddress;
  amount: WithdrawalAmount;
  [k: string]: any;
}
export type Withdrawals = ValidatorWithdrawal[];
export type ParentBeaconBlockRoot = string;
export type ThreeTwoByteHexValue = string;
export type ParentBlockHash = string;
export type RecipientOfTransactionPriorityFees = string;
export type StateRoot = string;
export type ReceiptsRoot = string;
export type BloomFilter = string;
export type GasLimit = string;
export type GasUsed = string;
export type ExtraData = string;
export type BaseFeePerGas = string;
export type BlockHash = string;
export type HexEncodedBytes = string;
export type Transactions = HexEncodedBytes[];
export interface ExecutionPayloadObjectV1 {
  parentHash: ParentBlockHash;
  feeRecipient: RecipientOfTransactionPriorityFees;
  stateRoot: StateRoot;
  receiptsRoot: ReceiptsRoot;
  logsBloom: BloomFilter;
  prevRandao: PreviousRandaoValue;
  blockNumber: BlockNumber;
  gasLimit: GasLimit;
  gasUsed: GasUsed;
  timestamp: Timestamp;
  extraData: ExtraData;
  baseFeePerGas: BaseFeePerGas;
  blockHash: BlockHash;
  transactions: Transactions;
  [k: string]: any;
}
export interface ExecutionPayloadObjectV2 {
  parentHash: ParentBlockHash;
  feeRecipient: RecipientOfTransactionPriorityFees;
  stateRoot: StateRoot;
  receiptsRoot: ReceiptsRoot;
  logsBloom: BloomFilter;
  prevRandao: PreviousRandaoValue;
  blockNumber: BlockNumber;
  gasLimit: GasLimit;
  gasUsed: GasUsed;
  timestamp: Timestamp;
  extraData: ExtraData;
  baseFeePerGas: BaseFeePerGas;
  blockHash: BlockHash;
  transactions: Transactions;
  withdrawals: Withdrawals;
  [k: string]: any;
}
export type BlobGasUsed = string;
export type ExcessBlobGas = string;
export type Type = string;
export type Nonce = string;
export type ContractCreationNull = null;
export type Address = string;
export type ToAddress = ContractCreationNull | Address;
export type FromAddress = string;
export type GasLimit = string;
export type Value = string;
export type InputData = string;
/**
 *
 * The gas price willing to be paid by the sender in wei
 *
 */
export type GasPrice = string;
/**
 *
 * Maximum fee per gas the sender is willing to pay to miners in wei
 *
 */
export type MaxPriorityFeePerGas = string;
/**
 *
 * The maximum total fee per gas the sender is willing to pay (includes the network / base fee and miner / priority fee) in wei
 *
 */
export type MaxFeePerGas = string;
/**
 *
 * The maximum total fee per gas the sender is willing to pay for blob gas in wei
 *
 */
export type MaxFeePerBlobGas = string;
export type HexEncodedAddress = string;
export type UnorderedSetOf32ByteHexValuelSVlTjsm = ThreeTwoByteHexValue[];
export interface AccessListEntry {
  address?: HexEncodedAddress;
  storageKeys?: UnorderedSetOf32ByteHexValuelSVlTjsm;
}
/**
 *
 * EIP-2930 access list
 *
 */
export type AccessList = AccessListEntry[];
/**
 *
 * List of versioned blob hashes associated with the transaction's EIP-4844 data blobs.
 *
 */
export type BlobVersionedHashes = ThreeTwoByteHexValue[];
/**
 *
 * Raw blob data.
 *
 */
export type Blobs = HexEncodedBytes[];
/**
 *
 * Chain ID that this transaction is valid on.
 *
 */
export type ChainId = string;
/**
 *
 * An array of effective priority fee per gas data points from a single block. All zeroes are returned if the block is empty.
 *
 */
export type RewardPercentile = RewardPercentile[];
export type FromBlock = string;
export type ToBlock = string;
export type AnyAddress = null;
export type Addresses = HexEncodedAddress[];
export type AddressEs = AnyAddress | Address | Addresses;
export type AnyTopicMatch = null;
export type SingleTopicMatch = string;
export type ThreeTwoHexEncodedBytes = string;
export type MultipleTopicMatch = ThreeTwoHexEncodedBytes[];
export type FilterTopicListEntry = SingleTopicMatch | MultipleTopicMatch;
export type SpecifiedFilterTopics = FilterTopicListEntry[];
export type Topics = AnyTopicMatch | SpecifiedFilterTopics;
export type Hash = string;
export type OmmersHash = string;
export type Coinbase = string;
export type TransactionsRoot = string;
export type Difficulty = string;
export type Number = string;
export type MixHash = string;
export type Nonce = string;
export type WithdrawalsRoot = string;
export type ParentBeaconBlockRoot = string;
export type TargetBlobsPerBlock = string;
export type BlockSize = string;
export type TransactionHashes = ThreeTwoByteHexValue[];
export type BlockHash = string;
export type BlockNumber = string;
export type TransactionHash = string;
export type TransactionIndex = string;
export type ContextualInformation = any;
export interface EIP4844Transaction {
  type: Type;
  nonce: Nonce;
  to: ToAddress;
  gas: GasLimit;
  value: Value;
  input: InputData;
  maxPriorityFeePerGas: MaxPriorityFeePerGas;
  maxFeePerGas: MaxFeePerGas;
  maxFeePerBlobGas: MaxFeePerBlobGas;
  accessList: AccessList;
  blobVersionedHashes: BlobVersionedHashes;
  chainId: ChainId;
  [k: string]: any;
}
/**
 *
 * The parity (0 for even, 1 for odd) of the y-value of the secp256k1 signature.
 *
 */
export type YParity = string;
export type R = string;
export type S = string;
export type EIP4844TransactionSignatureProperties = any;
export interface Signed4844Transaction { [key: string]: any; }
export interface EIP1559Transaction {
  type: Type;
  nonce: Nonce;
  to?: ToAddress;
  gas: GasLimit;
  value: Value;
  input: InputData;
  maxPriorityFeePerGas: MaxPriorityFeePerGas;
  maxFeePerGas: MaxFeePerGas;
  gasPrice: GasPrice;
  accessList: AccessList;
  chainId: ChainId;
  [k: string]: any;
}
export type V = string;
export type EIP1559TransactionSignatureProperties = any;
export interface Signed1559Transaction { [key: string]: any; }
export interface EIP2930Transaction {
  type: Type;
  nonce: Nonce;
  to?: ToAddress;
  gas: GasLimit;
  value: Value;
  input: InputData;
  gasPrice: GasPrice;
  accessList: AccessList;
  chainId: ChainId;
  [k: string]: any;
}
export type EIP2930TransactionSignatureProperties = any;
export interface Signed2930Transaction { [key: string]: any; }
export interface LegacyTransaction {
  type: Type;
  nonce: Nonce;
  to?: ToAddress;
  gas: GasLimit;
  value: Value;
  input: InputData;
  gasPrice: GasPrice;
  chainId?: ChainId;
  [k: string]: any;
}
export type LegacyTransactionSignatureProperties = any;
export interface SignedLegacyTransaction { [key: string]: any; }
export type OneOfSigned1559TransactionSigned2930TransactionSigned4844TransactionSignedLegacyTransactionINrNEATB = Signed4844Transaction | Signed1559Transaction | Signed2930Transaction | SignedLegacyTransaction;
export interface TransactionInformation { [key: string]: any; }
export type FullTransactions = TransactionInformation[];
export type AnyOfFullTransactionsTransactionHashesEmdpstix = TransactionHashes | FullTransactions;
export type IndexOfWithdrawal = string;
export type IndexOfValidatorThatGeneratedWithdrawal = string;
export type RecipientAddressForWithdrawalValue = string;
export type ValueContainedInWithdrawal = string;
export interface ValidatorWithdrawal {
  index: IndexOfWithdrawal;
  validatorIndex: IndexOfValidatorThatGeneratedWithdrawal;
  address: RecipientAddressForWithdrawalValue;
  amount: ValueContainedInWithdrawal;
}
export type Uncles = ThreeTwoByteHexValue[];
export interface Block {
  hash: Hash;
  parentHash: ParentBlockHash;
  sha3Uncles: OmmersHash;
  miner: Coinbase;
  stateRoot: StateRoot;
  transactionsRoot: TransactionsRoot;
  receiptsRoot: ReceiptsRoot;
  logsBloom: BloomFilter;
  difficulty?: Difficulty;
  number: Number;
  gasLimit: GasLimit;
  gasUsed: GasUsed;
  timestamp: Timestamp;
  extraData: ExtraData;
  mixHash: MixHash;
  nonce: Nonce;
  baseFeePerGas?: BaseFeePerGas;
  withdrawalsRoot?: WithdrawalsRoot;
  blobGasUsed?: BlobGasUsed;
  excessBlobGas?: ExcessBlobGas;
  parentBeaconBlockRoot?: ParentBeaconBlockRoot;
  targetBlobsPerBlock?: TargetBlobsPerBlock;
  size: BlockSize;
  transactions: AnyOfFullTransactionsTransactionHashesEmdpstix;
  withdrawals?: Withdrawals;
  uncles: Uncles;
}
export type RLP = string;
export interface BadBlock {
  block: Block;
  hash: Hash;
  rlp: RLP;
}
export type PayloadValidationStatus = "VALID" | "INVALID" | "SYNCING" | "ACCEPTED";
export type TheHashOfTheMostRecentValidBlock = string;
export type ValidationErrorMessage = string;
export interface PayloadStatus {
  status: PayloadValidationStatus;
  latestValidHash?: TheHashOfTheMostRecentValidBlock;
  validationError?: ValidationErrorMessage;
  [k: string]: any;
}
export type PayloadId = string;
export type Blob = string;
export type Proof = HexEncodedBytes[];
export interface BlobAndProofObjectV1 {
  blob: Blob;
  proof: Proof;
  [k: string]: any;
}
export type WithdrawalsAsArray = WithdrawalObjectV1[];
export type WithdrawalsAsNull = null;
export interface ExecutionPayloadBodyObjectV1 {
  transactions: Transactions;
  withdrawals?: Withdrawals;
  [k: string]: any;
}
export interface ExecutionPayload {
  parentHash: ParentBlockHash;
  feeRecipient: RecipientOfTransactionPriorityFees;
  stateRoot: StateRoot;
  receiptsRoot: ReceiptsRoot;
  logsBloom: BloomFilter;
  prevRandao: PreviousRandaoValue;
  blockNumber: BlockNumber;
  gasLimit: GasLimit;
  gasUsed: GasUsed;
  timestamp: Timestamp;
  extraData: ExtraData;
  baseFeePerGas: BaseFeePerGas;
  blockHash: BlockHash;
  transactions: Transactions;
  withdrawals: Withdrawals;
  blobGasUsed: BlobGasUsed;
  excessBlobGas: ExcessBlobGas;
  [k: string]: any;
}
export type ExpectedFeeValue = string;
export type FourEightHexEncodedBytes = string;
export type Commitments = FourEightHexEncodedBytes[];
export type Proofs = FourEightHexEncodedBytes[];
export type Blobs = HexEncodedBytes[];
export interface BlobsBundle {
  commitments: Commitments;
  proofs: Proofs;
  blobs: Blobs;
  [k: string]: any;
}
export type ShouldOverrideBuilderFlag = boolean;
export type ExecutionRequests = HexEncodedBytes[];
export type Error = string;
/**
 *
 * Lowest number block of returned range.
 *
 */
export type OldestBlock = string;
export type HexEncodedUnsignedInteger = string;
/**
 *
 * An array of block base fees per gas. This includes the next block after the newest of the returned range, because this value can be derived from the newest block. Zeroes are returned for pre-EIP-1559 blocks.
 *
 */
export type BaseFeePerGasArray = HexEncodedUnsignedInteger[];
/**
 *
 * An array of block base fees per blob gas. This includes the next block after the newest of the returned range, because this value can be derived from the newest block. Zeroes are returned for pre-EIP-4844 blocks.
 *
 */
export type BaseFeePerBlobGasArray = HexEncodedUnsignedInteger[];
export type NormalizedRatio = number;
/**
 *
 * An array of block gas used ratios. These are calculated as the ratio of gasUsed and gasLimit.
 *
 */
export type GasUsedRatio = NormalizedRatio[];
/**
 *
 * An array of block blob gas used ratios. These are calculated as the ratio of blobGasUsed and the max blob gas per block.
 *
 */
export type BlobGasUsedRatio = NormalizedRatio[];
/**
 *
 * A two-dimensional array of effective priority fees per gas at the requested block percentiles.
 *
 */
export type RewardArray = RewardPercentile[];
export type NotFoundNull = null;
export interface BlockObject {
  hash: Hash;
  parentHash: ParentBlockHash;
  sha3Uncles: OmmersHash;
  miner: Coinbase;
  stateRoot: StateRoot;
  transactionsRoot: TransactionsRoot;
  receiptsRoot: ReceiptsRoot;
  logsBloom: BloomFilter;
  difficulty?: Difficulty;
  number: Number;
  gasLimit: GasLimit;
  gasUsed: GasUsed;
  timestamp: Timestamp;
  extraData: ExtraData;
  mixHash: MixHash;
  nonce: Nonce;
  baseFeePerGas?: BaseFeePerGas;
  withdrawalsRoot?: WithdrawalsRoot;
  blobGasUsed?: BlobGasUsed;
  excessBlobGas?: ExcessBlobGas;
  parentBeaconBlockRoot?: ParentBeaconBlockRoot;
  targetBlobsPerBlock?: TargetBlobsPerBlock;
  size: BlockSize;
  transactions: AnyOfFullTransactionsTransactionHashesEmdpstix;
  withdrawals?: Withdrawals;
  uncles: Uncles;
}
export type From = string;
export type RecipientAddress = string;
/**
 *
 * Address of the receiver or null in a contract creation transaction.
 *
 */
export type To = ContractCreationNull | RecipientAddress;
/**
 *
 * The sum of gas used by this transaction and all preceding transactions in the same block.
 *
 */
export type CumulativeGasUsed = string;
/**
 *
 * The amount of gas used for this specific transaction alone.
 *
 */
export type GasUsed = string;
/**
 *
 * The amount of blob gas used for this specific transaction. Only specified for blob transactions as defined by EIP-4844.
 *
 */
export type BlobGasUsed = string;
export type Null = null;
/**
 *
 * The contract address created, if the transaction was a contract creation, otherwise null.
 *
 */
export type ContractAddress = HexEncodedAddress | Null;
export type Removed = boolean;
export type LogIndex = string;
export type Address = string;
export type Data = string;
export type Topics = ThreeTwoHexEncodedBytes[];
export interface Log {
  removed?: Removed;
  logIndex?: LogIndex;
  transactionIndex?: TransactionIndex;
  transactionHash: TransactionHash;
  blockHash?: BlockHash;
  blockNumber?: BlockNumber;
  address?: Address;
  data?: Data;
  topics?: Topics;
}
export type Logs = Log[];
export type LogsBloom = string;
/**
 *
 * The post-transaction state root. Only specified for transactions included before the Byzantium upgrade.
 *
 */
export type StateRoot = string;
/**
 *
 * Either 1 (success) or 0 (failure). Only specified for transactions included after the Byzantium upgrade.
 *
 */
export type Status = string;
/**
 *
 * The actual value per gas deducted from the sender's account. Before EIP-1559, this is equal to the transaction's gas price. After, it is equal to baseFeePerGas + min(maxFeePerGas - baseFeePerGas, maxPriorityFeePerGas).
 *
 */
export type EffectiveGasPrice = string;
/**
 *
 * The actual value per gas deducted from the sender's account for blob gas. Only specified for blob transactions as defined by EIP-4844.
 *
 */
export type BlobGasPrice = string;
export interface ReceiptInformation {
  type?: Type;
  transactionHash: TransactionHash;
  transactionIndex: TransactionIndex;
  blockHash: BlockHash;
  blockNumber: BlockNumber;
  from: From;
  to?: To;
  cumulativeGasUsed: CumulativeGasUsed;
  gasUsed: GasUsed;
  blobGasUsed?: BlobGasUsed;
  contractAddress?: ContractAddress;
  logs: Logs;
  logsBloom: LogsBloom;
  root?: StateRoot;
  status?: Status;
  effectiveGasPrice: EffectiveGasPrice;
  blobGasPrice?: BlobGasPrice;
}
export type ReceiptsInformation = ReceiptInformation[];
export type TransactionCount = string;
export type NewBlockOrTransactionHashes = ThreeTwoByteHexValue[];
export type NewLogs = Log[];
export type AccountProof = HexEncodedBytes[];
export type Balance = string;
export type CodeHash = string;
export type StorageHash = string;
export type Key = string;
export interface StorageProof {
  key: Key;
  value: Value;
  proof: Proof;
}
export type StorageProofs = StorageProof[];
export type UncleCount = string;
export type StartingBlock = string;
export type CurrentBlock = string;
export type HighestBlock = string;
export interface SyncingProgress {
  startingBlock?: StartingBlock;
  currentBlock?: CurrentBlock;
  highestBlock?: HighestBlock;
}
/**
 *
 * Should always return false if not syncing.
 *
 */
export type NotSyncing = boolean;
export type BlockNumberOrTag = BlockNumber | BlockTag;
export type UnorderedSetOfStringDoaGddGADvj0XlFa = StringDoaGddGA[];
export interface TransitionConfigurationObject {
  terminalTotalDifficulty: TerminalTotalDifficulty;
  terminalBlockHash: TerminalBlockHash;
  terminalBlockNumber: TerminalBlockNumber;
  [k: string]: any;
}
export interface ForkchoiceStateObjectV1 {
  headBlockHash: HeadBlockHash;
  safeBlockHash: SafeBlockHash;
  finalizedBlockHash: FinalizedBlockHash;
  [k: string]: any;
}
export interface PayloadAttributesObjectV1 {
  timestamp: Timestamp;
  prevRandao: PreviousRandaoValue;
  suggestedFeeRecipient: SuggestedFeeRecipient;
  [k: string]: any;
}
export interface PayloadAttributesObjectV2 {
  timestamp: Timestamp;
  prevRandao: PreviousRandaoValue;
  suggestedFeeRecipient: SuggestedFeeRecipient;
  withdrawals: Withdrawals;
  [k: string]: any;
}
export interface PayloadAttributesObjectV3 {
  timestamp: Timestamp;
  prevRandao: PreviousRandaoValue;
  suggestedFeeRecipient: SuggestedFeeRecipient;
  withdrawals: Withdrawals;
  parentBeaconBlockRoot: ParentBeaconBlockRoot;
  [k: string]: any;
}
export type HexEncoded64BitUnsignedInteger = string;
export type EightHexEncodedBytes = string;
export type OneOfExecutionPayloadObjectV1ExecutionPayloadObjectV2TSZdGFYz = ExecutionPayloadObjectV1 | ExecutionPayloadObjectV2;
export interface ExecutionPayloadObjectV3 {
  parentHash: ParentBlockHash;
  feeRecipient: RecipientOfTransactionPriorityFees;
  stateRoot: StateRoot;
  receiptsRoot: ReceiptsRoot;
  logsBloom: BloomFilter;
  prevRandao: PreviousRandaoValue;
  blockNumber: BlockNumber;
  gasLimit: GasLimit;
  gasUsed: GasUsed;
  timestamp: Timestamp;
  extraData: ExtraData;
  baseFeePerGas: BaseFeePerGas;
  blockHash: BlockHash;
  transactions: Transactions;
  withdrawals: Withdrawals;
  blobGasUsed: BlobGasUsed;
  excessBlobGas: ExcessBlobGas;
  [k: string]: any;
}
export type UnorderedSetOfHexEncodedBytesS57QoHic = HexEncodedBytes[];
export interface TransactionObjectGenericToAllTypes {
  type?: Type;
  nonce?: Nonce;
  to?: ToAddress;
  from?: FromAddress;
  gas?: GasLimit;
  value?: Value;
  input?: InputData;
  gasPrice?: GasPrice;
  maxPriorityFeePerGas?: MaxPriorityFeePerGas;
  maxFeePerGas?: MaxFeePerGas;
  maxFeePerBlobGas?: MaxFeePerBlobGas;
  accessList?: AccessList;
  blobVersionedHashes?: BlobVersionedHashes;
  blobs?: Blobs;
  chainId?: ChainId;
}
export type BlockNumberTagOrBlockHash = BlockNumber | BlockTag | BlockHash;
export type RewardPercentiles = RewardPercentile[];
export type Hydrated = boolean;
export interface Filter {
  fromBlock?: FromBlock;
  toBlock?: ToBlock;
  address?: AddressEs;
  topics?: Topics;
}
export type StorageKeys = ThreeTwoHexEncodedBytes[];
export type HexEncoded256BitUnsignedInteger = string;
export type BadBlockArray = BadBlock[];
export type ReceiptArray = HexEncodedBytes[];
export interface ForkchoiceUpdatedResponse {
  payloadStatus: PayloadStatus;
  payloadId?: PayloadId;
  [k: string]: any;
}
export type UnorderedSetOfBlobAndProofObjectV1BIO4SK1J = BlobAndProofObjectV1[];
export type UnorderedSetOfExecutionPayloadBodyObjectV1VSEwmcHM = ExecutionPayloadBodyObjectV1[];
export interface ObjectOfExecutionPayloadExpectedFeeValuePikLVG8Z {
  executionPayload: ExecutionPayload;
  blockValue: ExpectedFeeValue;
  [k: string]: any;
}
export interface ObjectOfShouldOverrideBuilderFlagExecutionPayloadExpectedFeeValueBlobsBundle75U5EmIg {
  executionPayload: ExecutionPayload;
  blockValue: ExpectedFeeValue;
  blobsBundle: BlobsBundle;
  shouldOverrideBuilder: ShouldOverrideBuilderFlag;
  [k: string]: any;
}
export interface ObjectOfShouldOverrideBuilderFlagExecutionRequestsExecutionPayloadExpectedFeeValueBlobsBundleCodhIlIf {
  executionPayload: ExecutionPayload;
  blockValue: ExpectedFeeValue;
  blobsBundle: BlobsBundle;
  shouldOverrideBuilder: ShouldOverrideBuilderFlag;
  executionRequests: ExecutionRequests;
  [k: string]: any;
}
export interface PayloadStatusObjectV1 {
  status: PayloadValidationStatus;
  latestValidHash?: TheHashOfTheMostRecentValidBlock;
  validationError?: ValidationErrorMessage;
  [k: string]: any;
}
export interface PayloadStatusObjectDeprecatingINVALIDBLOCKHASHStatus {
  status: PayloadValidationStatus;
  latestValidHash?: TheHashOfTheMostRecentValidBlock;
  validationError?: ValidationErrorMessage;
  [k: string]: any;
}
export type Accounts = HexEncodedAddress[];
export type BlobGasBaseFee = string;
export interface AccessListResult {
  accessList?: AccessList;
  error?: Error;
  gasUsed?: GasUsed;
}
/**
 *
 * Fee history results.
 *
 */
export interface FeeHistoryResults {
  oldestBlock: OldestBlock;
  baseFeePerGas: BaseFeePerGasArray;
  baseFeePerBlobGas?: BaseFeePerBlobGasArray;
  gasUsedRatio: GasUsedRatio;
  blobGasUsedRatio?: BlobGasUsedRatio;
  reward?: RewardArray;
}
export type GasPrice = string;
export type OneOfBlockObjectNotFoundNullYYhHv0RH = NotFoundNull | BlockObject;
export type OneOfNotFoundNullReceiptsInformationDGPSZB4T = NotFoundNull | ReceiptsInformation;
export type OneOfNotFoundNullTransactionCountWkBkrTRZ = NotFoundNull | TransactionCount;
export type FilterResults = NewBlockOrTransactionHashes | NewLogs;
export interface AccountProof {
  address: Address;
  accountProof: AccountProof;
  balance: Balance;
  codeHash: CodeHash;
  nonce: Nonce;
  storageHash: StorageHash;
  storageProof: StorageProofs;
}
export type OneOfNotFoundNullTransactionInformationZso9WPPm = NotFoundNull | TransactionInformation;
export type OneOfNotFoundNullReceiptInformationHbeARN0V = NotFoundNull | ReceiptInformation;
export type OneOfNotFoundNullUncleCountN18X5O4D = NotFoundNull | UncleCount;
export type MaxPriorityFeePerGas = string;
export type SixFiveHexEncodedBytes = string;
export type SyncingStatus = SyncingProgress | NotSyncing;
export type BooleanVyG3AETh = boolean;
/**
 *
 * Generated! Represents an alias to any of the provided schemas
 *
 */
export type AnyOfBlockNumberOrTagBlockNumberOrTagBlockNumberOrTag32ByteHexValueUnorderedSetOfStringDoaGddGADvj0XlFaTransitionConfigurationObjectForkchoiceStateObjectV1PayloadAttributesObjectV1ForkchoiceStateObjectV1PayloadAttributesObjectV2ForkchoiceStateObjectV1PayloadAttributesObjectV3UnorderedSetOf32ByteHexValuelSVlTjsmUnorderedSetOf32ByteHexValuelSVlTjsmHexEncoded64BitUnsignedIntegerHexEncoded64BitUnsignedInteger8HexEncodedBytes8HexEncodedBytes8HexEncodedBytes8HexEncodedBytesExecutionPayloadObjectV1OneOfExecutionPayloadObjectV1ExecutionPayloadObjectV2TSZdGFYzExecutionPayloadObjectV3UnorderedSetOf32ByteHexValuelSVlTjsm32ByteHexValueExecutionPayloadObjectV3UnorderedSetOf32ByteHexValuelSVlTjsm32ByteHexValueUnorderedSetOfHexEncodedBytesS57QoHicTransactionObjectGenericToAllTypesBlockNumberTagOrBlockHashTransactionObjectGenericToAllTypesBlockNumberOrTagTransactionObjectGenericToAllTypesBlockNumberOrTagHexEncodedUnsignedIntegerBlockNumberOrTagRewardPercentilesHexEncodedAddressBlockNumberTagOrBlockHash32ByteHexValueHydratedBlockNumberOrTagHydratedBlockNumberTagOrBlockHash32ByteHexValueBlockNumberOrTagHexEncodedAddressBlockNumberTagOrBlockHashHexEncodedUnsignedIntegerHexEncodedUnsignedIntegerFilterHexEncodedAddressStorageKeysBlockNumberTagOrBlockHashHexEncodedAddressHexEncoded256BitUnsignedIntegerBlockNumberTagOrBlockHash32ByteHexValueHexEncodedUnsignedIntegerBlockNumberOrTagHexEncodedUnsignedInteger32ByteHexValueHexEncodedAddressBlockNumberTagOrBlockHash32ByteHexValue32ByteHexValueBlockNumberOrTagFilterHexEncodedBytesTransactionObjectGenericToAllTypesHexEncodedAddressHexEncodedBytesTransactionObjectGenericToAllTypesHexEncodedUnsignedIntegerBadBlockArrayHexEncodedBytesHexEncodedBytesReceiptArrayHexEncodedBytesUnorderedSetOfStringDoaGddGADvj0XlFaTransitionConfigurationObjectForkchoiceUpdatedResponseForkchoiceUpdatedResponseForkchoiceUpdatedResponseUnorderedSetOfBlobAndProofObjectV1BIO4SK1JUnorderedSetOfExecutionPayloadBodyObjectV1VSEwmcHMUnorderedSetOfExecutionPayloadBodyObjectV1VSEwmcHMExecutionPayloadObjectV1ObjectOfExecutionPayloadExpectedFeeValuePikLVG8ZObjectOfShouldOverrideBuilderFlagExecutionPayloadExpectedFeeValueBlobsBundle75U5EmIgObjectOfShouldOverrideBuilderFlagExecutionRequestsExecutionPayloadExpectedFeeValueBlobsBundleCodhIlIfPayloadStatusObjectV1PayloadStatusObjectDeprecatingINVALIDBLOCKHASHStatusPayloadStatusObjectDeprecatingINVALIDBLOCKHASHStatusPayloadStatusObjectDeprecatingINVALIDBLOCKHASHStatusAccountsBlobGasBaseFeeHexEncodedUnsignedIntegerHexEncodedBytesHexEncodedUnsignedIntegerHexEncodedAddressAccessListResultHexEncodedUnsignedIntegerFeeHistoryResultsGasPriceHexEncodedUnsignedIntegerOneOfBlockObjectNotFoundNullYYhHv0RHOneOfBlockObjectNotFoundNullYYhHv0RHOneOfNotFoundNullReceiptsInformationDGPSZB4TOneOfNotFoundNullTransactionCountWkBkrTRZOneOfNotFoundNullTransactionCountWkBkrTRZHexEncodedBytesFilterResultsFilterResultsFilterResultsAccountProofHexEncodedBytesOneOfNotFoundNullTransactionInformationZso9WPPmOneOfNotFoundNullTransactionInformationZso9WPPmOneOfNotFoundNullTransactionInformationZso9WPPmHexEncodedUnsignedIntegerOneOfNotFoundNullReceiptInformationHbeARN0VOneOfNotFoundNullUncleCountN18X5O4DOneOfNotFoundNullUncleCountN18X5O4DMaxPriorityFeePerGasHexEncodedUnsignedIntegerHexEncodedUnsignedIntegerHexEncodedUnsignedInteger32ByteHexValue32ByteHexValue65HexEncodedBytesHexEncodedBytesSyncingStatusBooleanVyG3AETh = BlockNumberOrTag | ThreeTwoByteHexValue | UnorderedSetOfStringDoaGddGADvj0XlFa | TransitionConfigurationObject | ForkchoiceStateObjectV1 | PayloadAttributesObjectV1 | PayloadAttributesObjectV2 | PayloadAttributesObjectV3 | UnorderedSetOf32ByteHexValuelSVlTjsm | HexEncoded64BitUnsignedInteger | EightHexEncodedBytes | ExecutionPayloadObjectV1 | OneOfExecutionPayloadObjectV1ExecutionPayloadObjectV2TSZdGFYz | ExecutionPayloadObjectV3 | UnorderedSetOfHexEncodedBytesS57QoHic | TransactionObjectGenericToAllTypes | BlockNumberTagOrBlockHash | HexEncodedUnsignedInteger | RewardPercentiles | HexEncodedAddress | Hydrated | Filter | StorageKeys | HexEncoded256BitUnsignedInteger | HexEncodedBytes | BadBlockArray | ReceiptArray | ForkchoiceUpdatedResponse | UnorderedSetOfBlobAndProofObjectV1BIO4SK1J | UnorderedSetOfExecutionPayloadBodyObjectV1VSEwmcHM | ObjectOfExecutionPayloadExpectedFeeValuePikLVG8Z | ObjectOfShouldOverrideBuilderFlagExecutionPayloadExpectedFeeValueBlobsBundle75U5EmIg | ObjectOfShouldOverrideBuilderFlagExecutionRequestsExecutionPayloadExpectedFeeValueBlobsBundleCodhIlIf | PayloadStatusObjectV1 | PayloadStatusObjectDeprecatingINVALIDBLOCKHASHStatus | Accounts | BlobGasBaseFee | AccessListResult | FeeHistoryResults | GasPrice | OneOfBlockObjectNotFoundNullYYhHv0RH | OneOfNotFoundNullReceiptsInformationDGPSZB4T | OneOfNotFoundNullTransactionCountWkBkrTRZ | FilterResults | AccountProof | OneOfNotFoundNullTransactionInformationZso9WPPm | OneOfNotFoundNullReceiptInformationHbeARN0V | OneOfNotFoundNullUncleCountN18X5O4D | MaxPriorityFeePerGas | SixFiveHexEncodedBytes | SyncingStatus | BooleanVyG3AETh;
export type DebugGetBadBlocks = () => Promise<BadBlockArray>;
export type DebugGetRawBlock = (Block: BlockNumberOrTag) => Promise<HexEncodedBytes>;
export type DebugGetRawHeader = (Block: BlockNumberOrTag) => Promise<HexEncodedBytes>;
export type DebugGetRawReceipts = (Block: BlockNumberOrTag) => Promise<ReceiptArray>;
export type DebugGetRawTransaction = (Transaction hash: ThreeTwoByteHexValue) => Promise<HexEncodedBytes>;
export type EngineExchangeCapabilities = (Consensus client methods: UnorderedSetOfStringDoaGddGADvj0XlFa) => Promise<UnorderedSetOfStringDoaGddGADvj0XlFa>;
export type EngineExchangeTransitionConfigurationV1 = (Consensus client configuration: TransitionConfigurationObject) => Promise<TransitionConfigurationObject>;
export type EngineForkchoiceUpdatedV1 = (Forkchoice state: ForkchoiceStateObjectV1, Payload attributes?: PayloadAttributesObjectV1) => Promise<ForkchoiceUpdatedResponse>;
export type EngineForkchoiceUpdatedV2 = (Forkchoice state: ForkchoiceStateObjectV1, Payload attributes?: PayloadAttributesObjectV2) => Promise<ForkchoiceUpdatedResponse>;
export type EngineForkchoiceUpdatedV3 = (Forkchoice state: ForkchoiceStateObjectV1, Payload attributes?: PayloadAttributesObjectV3) => Promise<ForkchoiceUpdatedResponse>;
export type EngineGetBlobsV1 = (Blob versioned hashes: UnorderedSetOf32ByteHexValuelSVlTjsm) => Promise<UnorderedSetOfBlobAndProofObjectV1BIO4SK1J>;
export type EngineGetPayloadBodiesByHashV1 = (Array of block hashes: UnorderedSetOf32ByteHexValuelSVlTjsm) => Promise<UnorderedSetOfExecutionPayloadBodyObjectV1Ibczw2Ge>;
export type EngineGetPayloadBodiesByRangeV1 = (Starting block number: HexEncoded64BitUnsignedInteger, Number of blocks to return: HexEncoded64BitUnsignedInteger) => Promise<UnorderedSetOfExecutionPayloadBodyObjectV1Ibczw2Ge>;
export type EngineGetPayloadV1 = (Payload id: EightHexEncodedBytes) => Promise<ExecutionPayloadObjectV1>;
export type EngineGetPayloadV2 = (Payload id: EightHexEncodedBytes) => Promise<ObjectOfExecutionPayloadExpectedFeeValuePikLVG8Z>;
export type EngineGetPayloadV3 = (Payload id: EightHexEncodedBytes) => Promise<ObjectOfShouldOverrideBuilderFlagExecutionPayloadExpectedFeeValueBlobsBundle75U5EmIg>;
export type EngineGetPayloadV4 = (Payload id: EightHexEncodedBytes) => Promise<ObjectOfShouldOverrideBuilderFlagExecutionRequestsExecutionPayloadExpectedFeeValueBlobsBundleCodhIlIf>;
export type EngineNewPayloadV1 = (Execution payload: ExecutionPayloadObjectV1) => Promise<PayloadStatusObjectV1>;
export type EngineNewPayloadV2 = (Execution payload: OneOfExecutionPayloadObjectV1ExecutionPayloadObjectV2TSZdGFYz) => Promise<PayloadStatusObjectDeprecatingINVALIDBLOCKHASHStatus>;
export type EngineNewPayloadV3 = (Execution payload: ExecutionPayloadObjectV3, Expected blob versioned hashes: UnorderedSetOf32ByteHexValuelSVlTjsm, Root of the parent beacon block: ThreeTwoByteHexValue) => Promise<PayloadStatusObjectDeprecatingINVALIDBLOCKHASHStatus>;
export type EngineNewPayloadV4 = (Execution payload: ExecutionPayloadObjectV3, Expected blob versioned hashes: UnorderedSetOf32ByteHexValuelSVlTjsm, Root of the parent beacon block: ThreeTwoByteHexValue, Execution requests: UnorderedSetOfHexEncodedBytesS57QoHic) => Promise<PayloadStatusObjectDeprecatingINVALIDBLOCKHASHStatus>;
export type EthAccounts = () => Promise<Accounts>;
export type EthBlobBaseFee = () => Promise<BlobGasBaseFee>;
export type EthBlockNumber = () => Promise<HexEncodedUnsignedInteger>;
export type EthCall = (Transaction: TransactionObjectGenericToAllTypes, Block?: BlockNumberTagOrBlockHash) => Promise<HexEncodedBytes>;
export type EthChainId = () => Promise<HexEncodedUnsignedInteger>;
export type EthCoinbase = () => Promise<HexEncodedAddress>;
export type EthCreateAccessList = (Transaction: TransactionObjectGenericToAllTypes, Block?: BlockNumberOrTag) => Promise<AccessListResult>;
export type EthEstimateGas = (Transaction: TransactionObjectGenericToAllTypes, Block?: BlockNumberOrTag) => Promise<HexEncodedUnsignedInteger>;
export type EthFeeHistory = (blockCount: HexEncodedUnsignedInteger, newestBlock: BlockNumberOrTag, rewardPercentiles: RewardPercentiles) => Promise<FeeHistoryResults>;
export type EthGasPrice = () => Promise<GasPrice>;
export type EthGetBalance = (Address: HexEncodedAddress, Block: BlockNumberTagOrBlockHash) => Promise<HexEncodedUnsignedInteger>;
export type EthGetBlockByHash = (Block hash: ThreeTwoByteHexValue, Hydrated transactions: Hydrated) => Promise<OneOfBlockObjectNotFoundNullYYhHv0RH>;
export type EthGetBlockByNumber = (Block: BlockNumberOrTag, Hydrated transactions: Hydrated) => Promise<OneOfBlockObjectNotFoundNullYYhHv0RH>;
export type EthGetBlockReceipts = (Block: BlockNumberTagOrBlockHash) => Promise<OneOfNotFoundNullReceiptsInformationDGPSZB4T>;
export type EthGetBlockTransactionCountByHash = (Block hash: ThreeTwoByteHexValue) => Promise<OneOfNotFoundNullTransactionCountWkBkrTRZ>;
export type EthGetBlockTransactionCountByNumber = (Block: BlockNumberOrTag) => Promise<OneOfNotFoundNullTransactionCountWkBkrTRZ>;
export type EthGetCode = (Address: HexEncodedAddress, Block: BlockNumberTagOrBlockHash) => Promise<HexEncodedBytes>;
export type EthGetFilterChanges = (Filter identifier: HexEncodedUnsignedInteger) => Promise<FilterResults>;
export type EthGetFilterLogs = (Filter identifier: HexEncodedUnsignedInteger) => Promise<FilterResults>;
export type EthGetLogs = (Filter: Filter) => Promise<FilterResults>;
export type EthGetProof = (Address: HexEncodedAddress, StorageKeys: StorageKeys, Block: BlockNumberTagOrBlockHash) => Promise<AccountProof>;
export type EthGetStorageAt = (Address: HexEncodedAddress, Storage slot: HexEncoded256BitUnsignedInteger, Block: BlockNumberTagOrBlockHash) => Promise<HexEncodedBytes>;
export type EthGetTransactionByBlockHashAndIndex = (Block hash: ThreeTwoByteHexValue, Transaction index: HexEncodedUnsignedInteger) => Promise<OneOfNotFoundNullTransactionInformationZso9WPPm>;
export type EthGetTransactionByBlockNumberAndIndex = (Block: BlockNumberOrTag, Transaction index: HexEncodedUnsignedInteger) => Promise<OneOfNotFoundNullTransactionInformationZso9WPPm>;
export type EthGetTransactionByHash = (Transaction hash: ThreeTwoByteHexValue) => Promise<OneOfNotFoundNullTransactionInformationZso9WPPm>;
export type EthGetTransactionCount = (Address: HexEncodedAddress, Block: BlockNumberTagOrBlockHash) => Promise<HexEncodedUnsignedInteger>;
export type EthGetTransactionReceipt = (Transaction hash: ThreeTwoByteHexValue) => Promise<OneOfNotFoundNullReceiptInformationHbeARN0V>;
export type EthGetUncleCountByBlockHash = (Block hash: ThreeTwoByteHexValue) => Promise<OneOfNotFoundNullUncleCountN18X5O4D>;
export type EthGetUncleCountByBlockNumber = (Block: BlockNumberOrTag) => Promise<OneOfNotFoundNullUncleCountN18X5O4D>;
export type EthMaxPriorityFeePerGas = () => Promise<MaxPriorityFeePerGas>;
export type EthNewBlockFilter = () => Promise<HexEncodedUnsignedInteger>;
export type EthNewFilter = (Filter: Filter) => Promise<HexEncodedUnsignedInteger>;
export type EthNewPendingTransactionFilter = () => Promise<HexEncodedUnsignedInteger>;
export type EthSendRawTransaction = (Transaction: HexEncodedBytes) => Promise<ThreeTwoByteHexValue>;
export type EthSendTransaction = (Transaction: TransactionObjectGenericToAllTypes) => Promise<ThreeTwoByteHexValue>;
export type EthSign = (Address: HexEncodedAddress, Message: HexEncodedBytes) => Promise<SixFiveHexEncodedBytes>;
export type EthSignTransaction = (Transaction: TransactionObjectGenericToAllTypes) => Promise<HexEncodedBytes>;
export type EthSyncing = () => Promise<SyncingStatus>;
export type EthUninstallFilter = (Filter identifier: HexEncodedUnsignedInteger) => Promise<BooleanVyG3AETh>;