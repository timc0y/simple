Keep the fallback result as the existing structured record:

```ts
type Result = {
  id: string
  kind: string
  source: string
  version: string
}
```

Do not replace it with `source:id`; that loses `kind` and `version`, breaking reconciliation and potentially merging distinct retained records.

Derive a separate, canonical cache key:

```ts
cacheKey = encode([result.source, result.id, result.kind, result.version])
```

Use an unambiguous encoding—such as length-prefixed fields or canonical JSON—rather than naïve delimiter concatenation. Including `source` keeps provider results distinguishable and observable; including `kind` and `version` preserves cache separation.

Migration should happen at the router boundary and its consumers:

- Continue returning the structured record.
- Replace direct cache-key construction with `cacheKey(result)`.
- Version or namespace the new keys, for example `result-v2:<encoded tuple>`.
- Read the new key first, optionally fall back to the old `source:id` key only for compatibility, and write only the new format.
- Retire the fallback after existing cache entries and reconciliation data have expired or been migrated.

The `source:id` proposal is not backward-compatible as a result representation. It also cannot safely serve as the sole cache key because records sharing `source` and `id` can differ in `kind` or `version`.

Proof should run both provider paths with:

- identical `id`, different `kind`;
- identical `id` and `kind`, different `version`;
- identical `id`, `kind`, and `version`, different `source`.

Verify that the first two cases produce separate cache entries and reconciliation identities, while every result still exposes its provider through `source`.
