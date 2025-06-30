---
"@delvtech/drift": patch
---

Removed block overriding in `Contract.read` when provided a block earlier than the contract's `epochBlock`. If the contract was constructed with an `epochBlock`, it used to overwrite the `block` option passed to `read` to ensure it didn't read from a block where there was no data, but this can misleading by implying that there was data where there wasn't. So, `epochBlock` now only affects the behavior of event queries.
