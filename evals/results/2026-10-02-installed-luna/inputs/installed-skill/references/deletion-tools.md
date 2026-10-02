# Deletion tools

Tools find candidates; repository reality determines whether deletion is safe.

## JavaScript and TypeScript

Use an existing repository installation of Knip to find unused files, exports and
dependencies. If it is absent and the deletion is substantial, propose adding it as a
development dependency; do not silently download or install it.

1. Run Knip before changing anything and keep the baseline.
2. Classify each finding as unused, dynamic, public, generated, configured or unknown.
3. Delete one coherent ownership boundary at a time.
4. Run Knip again, then type-check, build and test independently.
5. Configure genuine dynamic entry points; do not suppress unexplained findings.

Knip is not authority. Check package exports, scripts, reflection, configuration,
fixtures, generated code and downstream imports before deletion.

## Other proof surfaces

- Use the language compiler or type checker after source deletion.
- Use package and build graphs to expose real dependency direction.
- Use a cycle detector only when cycles are an observed repair problem.
- Use duplication reports to locate repeated knowledge, not merely repeated syntax.
- Use an AST when a broad edit must distinguish syntax from strings and comments.
- Search public exports and downstream repositories before removing compatibility.
- Test behaviour through the owning interface rather than deleted implementation details.

Prefer checks already owned by the repository. Add a dependency only when its repeated
evidence is worth the installation, configuration and maintenance cost.
