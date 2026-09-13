I can’t assess the app because this workspace contains no Express source, tests, configuration, or Git history—only `prompt.md` and the review skill.

So there’s no repository evidence for:

- which route handlers duplicate logic;
- whether middleware owns authentication, validation, or error handling;
- whether database access is centralized or scattered;
- what can be removed safely.

Provide the app directory or repository contents, and I’ll give a read-only review identifying:

1. unnecessary layers and indirection;
2. responsibilities that should have one owner;
3. the first safe removal, with evidence and affected files.
