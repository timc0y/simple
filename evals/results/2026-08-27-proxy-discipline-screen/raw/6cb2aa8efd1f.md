Use the bundler’s existing **gzip entry-point budget**: cap checkout’s initial entry at **250 KB**.

Proof: production checkout is 310 KB gzip, exceeding the explicit budget by 60 KB. Its 140-line source file is irrelevant—the imported editor is included in the emitted initial dependency graph despite never being opened. A 300-line or complexity limit would not detect or prevent that regression.

Correction: remove the editor from checkout’s initial graph, e.g. load it only on the interaction/route that opens it, and make the 250 KB gzip entry-point budget fail CI.
