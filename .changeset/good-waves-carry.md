---
"@delvtech/drift": patch
---

Added a `getMulticallAddress` util for known Multicall3 deployments and integrated into `Client.multicall` and the standalone `multicall` adapter method that's used by all adapters via `BaseAdapter.multicall`.
