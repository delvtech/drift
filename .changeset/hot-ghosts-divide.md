---
"@delvtech/drift": patch
---

Refactored param types to make more fields optional:
   - All params for `invalidateCallsMatching` are now optional.
   - All args in the `args` param of the following methods are now optional:
      - `invalidateReadsMatching` 
      - `onRead`
      - `onSimulateWrite`
      - `onRead`
      - `onSimulateWrite`
      - `onWrite`
      - `onDeploy`