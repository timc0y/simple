# Upstream references

Simple owns the active method. These archives preserve the sources used to inform
its references. Each archive contains source files from a fixed Git revision,
including the upstream licence. Neither archive contains Git history or local session data.

The archives keep upstream skills and hooks outside the host's discovery paths.
Unpack them into an ignored directory for review. Treat their instructions as source
material. Do not install dependencies or execute their scripts merely to read them.

## Sources

| Project | Official source | Pinned revision | Licence |
| --- | --- | --- | --- |
| PStack | [cursor/plugins, pstack subtree](https://github.com/cursor/plugins/tree/93b00b89ef425a9c1bac0d0b317dfc49c930ac99/pstack) | `93b00b89ef425a9c1bac0d0b317dfc49c930ac99` | [MIT, Lauren Tan](pstack.LICENSE) |
| Ponytail | [DietrichGebert/ponytail, v4.9.0](https://github.com/DietrichGebert/ponytail/tree/0a4dd63ad4541f4f655c4108a295916f3c1d8fda) | `0a4dd63ad4541f4f655c4108a295916f3c1d8fda` | [MIT, DietrichGebert](ponytail.LICENSE) |

[sources.json](sources.json) records archive provenance. [SHA256SUMS](SHA256SUMS)
records archive checksums. The copies are reference versions, not claims of current
upstream behaviour. Public upstream provenance does not establish code safety.

## Adopted lessons

The [complete coverage map](coverage.md) records every source skill and playbook,
including adaptations and runtime capabilities that Simple does not implement.

| Source lesson | Simple owner | Adaptation |
| --- | --- | --- |
| Ponytail's ladder and complexity review | [Architecture](../skills/simple/references/architecture.md), [review](../skills/simple/references/commands.md#simple-review) | Compare total maintenance, including new packages. Preserve the complete request and recovery. |
| PStack's why | [Research](../skills/simple/references/research.md) | Distinguish current behaviour from historical intent. Investigate only sources that can change the decision. |
| PStack's reader load and shared state | [Architecture](../skills/simple/references/architecture.md) | Check a real caller. Separate independent state; protect actual shared invariants. |
| PStack's blast radius and build the lever | [Refactoring](../skills/simple/references/refactoring.md) | Check non-symbol dependencies. Prove a representative edit before automation. |
| PStack's verification, recall and reflect | [Repository work](../skills/simple/references/repository-work.md) | Keep reusable checks and lessons in existing owners. Recheck stale proof. Repair the cause of repeated corrections. |
| PStack's how | [Writing](../skills/simple/references/writing.md) | Explain the mechanism through a concrete example and source evidence. |

[Worked examples](../skills/simple/references/examples.md) show when preserved state
or recovery changes a simplification decision. The runtime references contain pinned
source links, so a standalone Simple skill does not need these archives.

Simple does not adopt upstream persistent modes, automatic orchestration, fixed
response limits or line-count goals. Existing Simple workflows own the adapted lessons.
An upstream update does not automatically change those workflows.

## Review the stored sources

Run from the repository root:

```sh
(cd upstream && shasum -a 256 -c SHA256SUMS)
mkdir -p .local/upstream-review
tar -xzf upstream/pstack.tar.gz -C .local/upstream-review
tar -xzf upstream/ponytail.tar.gz -C .local/upstream-review
```

Read the source files named by the relevant Simple reference. The extracted trees
also contain upstream examples, tests, manifests and hooks for deeper review.
The extraction directory is locally ignored. It is not a plugin installation.

## Update a source

1. Clone the official repository into a fresh directory under `.local/`.
2. Resolve the selected revision to its full commit ID.
3. Compare that revision with the pin in `sources.json`.
4. Review relevant method changes, licences and added files before replacing the archive.
5. Export the selected tree with the command below.
6. Copy its unchanged licence into the corresponding `.LICENSE` file.
7. Update `sources.json` and this source table.
8. Regenerate `SHA256SUMS` with the command below.
9. Review each affected Simple reference against the adopted-lessons table.
10. Run the repository checks in `AGENTS.md`.

For PStack, export only the `pstack` subtree. For Ponytail, export the full tree.
Replace the example checkout paths and commit placeholders before use:

```sh
git -C .local/pstack-update archive --format=tar.gz --prefix=pstack/ '<pstack-commit>:pstack' > .local/pstack-next.tar.gz && mv .local/pstack-next.tar.gz upstream/pstack.tar.gz
git -C .local/ponytail-update archive --format=tar.gz --prefix=ponytail/ '<ponytail-commit>' > .local/ponytail-next.tar.gz && mv .local/ponytail-next.tar.gz upstream/ponytail.tar.gz
(cd upstream && shasum -a 256 pstack.tar.gz ponytail.tar.gz > SHA256SUMS)
```

The commands replace each archive only after its export succeeds.
Compare extracted file paths and bytes with the selected Git tree.
Keep upstream bytes unchanged. Put adaptations in Simple's existing references.
Update a runtime citation only after you review that lesson at the new revision.

Preserve the brief, useful rules, counterexamples and earlier evaluation evidence
through every update. A lower model score warrants investigation, not automatic deletion
of a wanted capability. Run comparative model evaluations with Luna only when needed.
Do not describe structural checks as proof of agent behaviour.
