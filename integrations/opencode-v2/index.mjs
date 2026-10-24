// OpenCode V2: keep this directory out of V1's automatic plugin discovery.
import { readFileSync, realpathSync } from "node:fs";
import { isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";
import { assembleContext } from "../../skills/simple/scripts/context.mjs";

const skillPath = fileURLToPath(new URL("../../skills/simple/SKILL.md", import.meta.url));
const recovery = "Recover the active outcome, corrections, permissions and durable obligations. " +
  "Refresh mutable status from its owner; a summary is not proof of current state.\n\n";

// This reads the frontmatter format owned by Simple, not arbitrary YAML.
function skillDefinition() {
  const source = readFileSync(skillPath, "utf8");
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  const name = match?.[1].match(/^name:[ \t]*([a-z0-9-]+)[ \t]*$/m)?.[1];
  const description = match?.[1].match(/^description:[ \t]*>-?[ \t]*\r?\n((?:[ \t]+[^\r\n]*(?:\r?\n|$))+)/m)?.[1]
    ?.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).join(" ");
  if (name !== "simple" || !description) throw new Error("Simple skill metadata is missing or changed format");
  return { id: name, name, description, path: skillPath, content: match[2].trim() };
}

function sameFile(a, b) {
  try { return realpathSync(a) === realpathSync(b); } catch { return a === b; }
}

export default {
  id: "timc0y.simple",
  async setup(ctx) {
    if (!ctx?.session?.get || !ctx.session.hook || !ctx?.skill?.transform) {
      throw new Error("Simple requires the OpenCode V2 plugin API; use the V1 entrypoint on V1");
    }
    const registrations = [];
    const inject = async (event) => {
      if (!Array.isArray(event?.system)) throw new Error("Simple: unsupported OpenCode system context shape");
      let text;
      try {
        if (typeof event.sessionID !== "string" || !event.sessionID) throw new Error("missing session identity");
        const session = await ctx.session.get({ sessionID: event.sessionID });
        const directory = session?.location?.directory;
        if (typeof directory !== "string" || !isAbsolute(directory)) throw new Error("missing session directory");
        const current = assembleContext({ cwd: directory, env: process.env });
        for (const error of current.errors) console.error(`simple opencode: ${error}`);
        text = current.text ? recovery + current.text : "";
        if (!text && !current.complete) text = "Simple context is unavailable. Read the owning sources before relying on repository facts.";
      } catch {
        // The plugin's load directory is NOT a safe fallback for another session.
        text = "Simple could not resolve this session's repository context. No repository profile was injected. " +
          "Establish the active directory and read its nearest SIMPLE.md before relying on repository facts.";
      }
      if (text && !event.system.some((part) => part.type === "text" && part.text === text)) {
        event.system.push({ type: "text", text });
      }
    };
    try {
      registrations.push(await ctx.skill.transform((editor) => {
        const definition = skillDefinition();
        const collisions = editor.list().filter((entry) => entry.id === definition.id || entry.name === definition.name);
        if (collisions.length) {
          if (collisions.every((entry) => sameFile(entry.path, definition.path))) return;
          throw new Error("Another Simple skill is installed. Choose one installation instead of overriding it");
        }
        editor.add(definition);
      }));
      // Title generation deliberately receives no personal/name-format instructions.
      for (const kind of ["context", "compaction", "generate"]) {
        registrations.push(await ctx.session.hook(kind, inject));
      }
    } catch (error) {
      await Promise.allSettled(registrations.map((entry) => entry.dispose()));
      throw error;
    }
    // Successful registrations are owned and disposed by the host on unload.
  }
};
