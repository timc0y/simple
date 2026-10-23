// OpenCode entrypoint: only the default export is a plugin factory.
// Each instance uses the host's project directory, not the process cwd.
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { assembleContext } from "../../scripts/context.mjs";

const skillsDir = resolve(fileURLToPath(new URL("../../skills/", import.meta.url)));

export default async (input = {}) => {
  const projectDirectory = input.directory || input.worktree || input.project?.worktree ||
    input.project?.root || process.cwd();
  const read = () => assembleContext({ cwd: projectDirectory, env: process.env });
  return {
    config: async (config) => {
      config.skills ??= {};
      config.skills.paths ??= [];
      if (!config.skills.paths.includes(skillsDir)) config.skills.paths.push(skillsDir);
    },
    "experimental.session.compacting": async (_input, output) => {
      const current = read();
      if (!current.blocks.length) return;
      output.context ??= [];
      output.context.push(
        "Recover the active task, corrections and durable obligations using these Simple sources. " +
        "For mutable status, verify current state; the compaction summary is not proof of freshness.\n\n" +
        current.text
      );
    },
    "experimental.chat.system.transform": async (_input, output) => {
      const current = read();
      if (!current.blocks.length) return;
      output.system ??= [];
      output.system.push(current.text);
    }
  };
};
