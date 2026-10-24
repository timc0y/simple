import test from "node:test";
import assert from "node:assert/strict";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import plugin from "../integrations/opencode-v2/index.mjs";
import { contextResponse, hookConfiguration } from "../skills/simple/scripts/antigravity.mjs";
import { install, skillLinks, SUPPORTED_HOSTS } from "../scripts/link-skill.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
function fixture(t, label = "alpha") {
  const cwd = mkdtempSync(join(tmpdir(), "simple host "));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  mkdirSync(join(cwd, ".git"));
  writeFileSync(join(cwd, "SIMPLE.md"), `# Simple\n\nrepository ${label}\n`);
  return cwd;
}
function isolated(cwd) { return { ...process.env, SIMPLE_OPERATOR_FILE: join(cwd, "absent.md") }; }
function host(directory, initial = []) {
  const handlers = new Map(), registrations = [], entries = [...initial], locations = new Map();
  let lookups = 0;
  const ctx = {
    location: { directory: "/wrong-plugin-location" },
    skill: { transform: async (fn) => {
      fn({ list: () => entries, add: (entry) => entries.push(entry) });
      const registration = { disposed: false, async dispose() { this.disposed = true; } };
      registrations.push(registration); return registration;
    } },
    session: {
      get: async ({ sessionID }) => { lookups++; if (!locations.has(sessionID)) throw new Error("missing session"); return { location: { directory: locations.get(sessionID) } }; },
      hook: async (kind, fn) => {
        handlers.set(kind, fn);
        const registration = { disposed: false, async dispose() { this.disposed = true; handlers.delete(kind); } };
        registrations.push(registration); return registration;
      }
    }
  };
  locations.set("ses_a", directory);
  return { ctx, entries, handlers, registrations, locations, lookups: () => lookups };
}
function event(sessionID = "ses_a") {
  return { sessionID, system: [], messages: Object.freeze([]), options: Object.freeze({}), tools: Object.freeze({}), result: { summary: "host-owned" } };
}

test("only the four requested hosts have maintained installation routes", () => {
  assert.deepEqual(SUPPORTED_HOSTS, ["opencode", "claude", "codex", "antigravity"]);
  assert.equal(skillLinks("/example").length, 6);
  assert.ok(skillLinks("/example").some((path) => path.endsWith(join(".gemini", "antigravity-cli", "skills", "simple"))));
  assert.equal(existsSync(join(root, "gemini-extension.json")), false);
  const manifest = JSON.parse(readFileSync(join(root, "plugin.json"), "utf8"));
  assert.equal(manifest.name, "simple");
  assert.deepEqual(Object.keys(manifest).sort(), ["description", "name"]);
});

test("installer preflights later collisions without changing earlier destinations", (t) => {
  const home = fixture(t);
  const paths = skillLinks(home);
  mkdirSync(paths.at(-1), { recursive: true });
  writeFileSync(join(paths.at(-1), "keep"), "original");
  assert.throws(() => install(home), /refusing to replace/);
  assert.equal(existsSync(paths[0]), false);
  assert.equal(readFileSync(join(paths.at(-1), "keep"), "utf8"), "original");
});

test("Claude and Codex start matcher covers forks but no unknown event suffixes", () => {
  const hooks = JSON.parse(readFileSync(join(root, "hooks/hooks.json"), "utf8")).hooks;
  const matcher = new RegExp(hooks.SessionStart[0].matcher);
  for (const source of ["startup", "resume", "clear", "compact", "fork"]) assert.equal(matcher.test(source), true);
  for (const source of ["refork", "resume-malicious", "future", ""]) assert.equal(matcher.test(source), false);
  assert.equal(hooks.Stop, undefined);
});

test("session and compaction hooks reload changed facts without reading transcripts", (t) => {
  const cwd = fixture(t);
  const hook = join(root, "scripts/hook.mjs");
  const transcript = join(cwd, "not-a-file"); mkdirSync(transcript);
  for (const source of ["startup", "resume", "fork", "compact", "clear"]) {
    writeFileSync(join(cwd, "SIMPLE.md"), `current fact ${source}`);
    const run = spawnSync(process.execPath, [hook], { encoding: "utf8", env: isolated(cwd),
      input: JSON.stringify({ hook_event_name: "SessionStart", source, cwd, transcript_path: transcript }) });
    assert.equal(run.status, 0, run.stderr);
    const body = JSON.parse(run.stdout);
    assert.ok(body.hookSpecificOutput.additionalContext.includes(`current fact ${source}`));
    assert.equal(body.continue, undefined);
    assert.equal(body.decision, undefined);
  }
});

test("skill-only installation runs context diagnostics without checkout dependencies", (t) => {
  const cwd = fixture(t);
  const copy = join(cwd, "installed skill");
  cpSync(join(root, "skills/simple"), copy, { recursive: true });
  const target = join(cwd, "project"); mkdirSync(target);
  const cli = join(copy, "scripts/simple.mjs");
  assert.equal(spawnSync(process.execPath, [cli, "init", target], { env: isolated(cwd) }).status, 0);
  const run = spawnSync(process.execPath, [cli, "check", target, "--context"], { encoding: "utf8", env: isolated(cwd) });
  const body = JSON.parse(run.stdout);
  assert.equal(run.status, 1, "the deliberately incomplete profile must not look ready");
  assert.ok(body.identity.assembler.path.startsWith(copy));
  assert.match(body.identity.skillFile.sha256, /^[0-9a-f]{64}$/);
  assert.equal(body.identity.hostDelivered, null);
  assert.equal(body.identity.modelApplied, null);
  assert.equal(body.ready, false);
});

test("Antigravity emits transient context, not permission or completion decisions", (t) => {
  const cwd = fixture(t);
  const response = contextResponse({ workspacePaths: [cwd], transcriptPath: join(cwd, "never-read") }, { env: isolated(cwd) });
  assert.match(response.injectSteps[0].ephemeralMessage, /repository alpha/);
  assert.deepEqual(Object.keys(response), ["injectSteps"]);
  assert.deepEqual(Object.keys(response.injectSteps[0]), ["ephemeralMessage"]);
  const config = hookConfiguration();
  assert.deepEqual(Object.keys(config.simple), ["PreInvocation"]);
  assert.equal(config.simple.PreInvocation[0].type, "command");
});

test("Antigravity never guesses one of multiple workspaces or falls back to process cwd", (t) => {
  const a = fixture(t, "private-a"), b = fixture(t, "private-b");
  for (const workspacePaths of [[], [a, b], ["relative"], [null]]) {
    const response = contextResponse({ workspacePaths }, { env: isolated(a) });
    const text = JSON.stringify(response);
    assert.doesNotMatch(text, /private-a|private-b/);
    assert.match(text, /No repository context was injected/);
  }
  assert.match(JSON.stringify(contextResponse({ workspacePaths: [a, a] }, { env: isolated(a) })), /private-a/);
});

test("Antigravity configuration command actually runs in a path containing spaces", (t) => {
  const cwd = fixture(t);
  const copy = join(cwd, "skill copy"); cpSync(join(root, "skills/simple"), copy, { recursive: true });
  const script = join(copy, "scripts/antigravity.mjs");
  const configRun = spawnSync(process.execPath, [script, "config"], { encoding: "utf8", env: isolated(cwd) });
  assert.equal(configRun.status, 0, configRun.stderr);
  const command = JSON.parse(configRun.stdout).simple.PreInvocation[0].command;
  const run = spawnSync(command, { shell: true, encoding: "utf8", env: isolated(cwd),
    input: JSON.stringify({ workspacePaths: [cwd], invocationNum: 0 }) });
  assert.equal(run.status, 0, run.stderr);
  assert.match(JSON.parse(run.stdout).injectSteps[0].ephemeralMessage, /repository alpha/);
  writeFileSync(join(cwd, "SIMPLE.md"), "changed current fact");
  const next = spawnSync(command, { shell: true, encoding: "utf8", env: isolated(cwd), input: JSON.stringify({ workspacePaths: [cwd], invocationNum: 1 }) });
  assert.match(next.stdout, /changed current fact/);
});

test("Antigravity malformed JSON fails open without echoing input", (t) => {
  const cwd = fixture(t);
  const run = spawnSync(process.execPath, [join(root, "skills/simple/scripts/antigravity.mjs"), "context"], {
    encoding: "utf8", env: isolated(cwd), input: 'sensitive-invalid-json'
  });
  assert.equal(run.status, 0);
  assert.deepEqual(JSON.parse(run.stdout), {});
  assert.doesNotMatch(run.stderr, /sensitive-invalid-json/);
});

test("OpenCode V2 resolves each session location and refreshes moved sessions", async (t) => {
  const a = fixture(t, "a"), b = fixture(t, "b");
  const h = host(a); h.locations.set("ses_b", b);
  await plugin.setup(h.ctx);
  assert.deepEqual([...h.handlers.keys()], ["context", "compaction", "generate"]);
  for (const kind of h.handlers.keys()) {
    for (const [id, expected, absent] of [["ses_a", "repository a", "repository b"], ["ses_b", "repository b", "repository a"]]) {
      const output = event(id);
      await h.handlers.get(kind)(output);
      assert.ok(output.system[0].text.includes(expected));
      assert.ok(!output.system[0].text.includes(absent));
      assert.deepEqual(output.result, { summary: "host-owned" });
      assert.equal(output.messages.length, 0);
      assert.equal(Object.keys(output.options).length, 0);
    }
  }
  h.locations.set("ses_a", b);
  const moved = event(); await h.handlers.get("context")(moved);
  assert.match(moved.system[0].text, /repository b/);
  assert.equal(h.lookups(), 7);
});

test("OpenCode V2 unresolved sessions produce an explicit diagnostic, never wrong context", async (t) => {
  const cwd = fixture(t); const h = host(cwd); await plugin.setup(h.ctx);
  for (const id of ["missing", ""]) {
    const output = event(id); await h.handlers.get("context")(output);
    assert.match(output.system[0].text, /No repository profile was injected/);
    assert.doesNotMatch(output.system[0].text, /repository alpha/);
  }
});

test("OpenCode V2 uses the canonical skill, preserves same-source discovery and rejects collisions", async (t) => {
  const cwd = fixture(t); const first = host(cwd); await plugin.setup(first.ctx);
  const definition = first.entries[0];
  assert.equal(definition.name, "simple");
  assert.match(definition.content, /smallest truthful|least complicated/);
  assert.match(definition.description, /repository evidence/);
  const same = host(cwd, [definition]); await plugin.setup(same.ctx); assert.equal(same.entries.length, 1);
  const conflicting = host(cwd, [definition, { ...definition, path: join(cwd, "other/SKILL.md") }]);
  await assert.rejects(() => plugin.setup(conflicting.ctx), /Another Simple skill/);
  assert.equal(conflicting.handlers.size, 0);
});

test("OpenCode V2 cleans registrations after partial setup failure", async (t) => {
  const h = host(fixture(t));
  const original = h.ctx.session.hook;
  h.ctx.session.hook = async (kind, fn) => { if (kind === "compaction") throw new Error("failed registration"); return original(kind, fn); };
  await assert.rejects(() => plugin.setup(h.ctx), /failed registration/);
  assert.equal(h.handlers.size, 0);
  assert.ok(h.registrations.every((registration) => registration.disposed));
});
