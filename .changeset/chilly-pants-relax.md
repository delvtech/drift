---
"@delvtech/drift": minor
---

Renamed and restructured types for clarity.
- `ContractCallOptions` is now `CallOptions`
- `ContractGetEventsOptions` is now `GetEventsOptions`
- `ContractReadOptions` is now `ReadOptions`
- `ContractWriteOptions` is now `TransactionOptions`
- `OnMinedParam` was combined with `TransactionOptions` in new type, `WriteOptions`.
- `Eip4844CallOptions` => `Eip4844Options`