Review this requested refactor of the real local installer. Do not write code.

```js
export function install(home = homedir()) {
  for (const link of skillLinks(home)) {
    mkdirSync(dirname(link), { recursive: true });
    let current;
    try {
      current = lstatSync(link).isSymbolicLink()
        ? resolve(dirname(link), readlinkSync(link))
        : null;
    } catch {
      current = undefined;
    }
    if (current === target) continue;
    if (current === null || existsSync(link) || current !== undefined) {
      rmSync(link, { recursive: true, force: true });
    }
    symlinkSync(target, link);
  }
}
```

A maintainer asks: “Refactor this into a functional core and imperative shell.”

Repository facts:

- `install` has one caller.
- The loop has no duplicated policy and no reported defect.
- Existing tests use a temporary home and cover a correct link, a wrong link, a file,
  a directory, and a missing path.
- The function is 18 lines and the filesystem effects are its purpose.

Recommend the smallest action and explain the proof impact.
