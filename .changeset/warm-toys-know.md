---
"@delvtech/drift": patch
---

Made the `receipt` argument of the `onMined` param required. The value will either be a receipt or undefined explicitly, but this prevents the function from being called with no arguments.
