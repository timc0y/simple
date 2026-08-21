export const meta = {
  name: 'simple-skill-evals',
  description: 'Run all Simple eval cases with sonnet solvers under no-skill, v0.5, and forge conditions, then grade each solution',
  phases: [
    { title: 'Solve', detail: '16 cases x 3 conditions, sonnet', model: 'sonnet' },
    { title: 'Grade', detail: 'strict grading against each case criteria' },
  ],
}

const SOLUTION = {
  type: 'object',
  properties: { solution: { type: 'string' } },
  required: ['solution'],
  additionalProperties: false,
}
const VERDICT = {
  type: 'object',
  properties: {
    pass: { type: 'boolean' },
    failures: { type: 'array', items: { type: 'string' } },
    notable: { type: 'string' },
  },
  required: ['pass', 'failures', 'notable'],
  additionalProperties: false,
}

const jobs = []
for (const name of args.cases) {
  for (const cond of args.conditions) jobs.push({ name, cond })
}
log(`${jobs.length} solve jobs across ${args.conditions.length} conditions`)

const results = await pipeline(
  jobs,
  ({ name, cond }) => {
    const caseDir = `${args.caseRoot}/${name}`
    const methodology = cond.skillDir
      ? `You have the "Simple" skill available. First read ${cond.skillDir}/SKILL.md and follow it. Load files under ${cond.skillDir}/references/ only when the task needs them.`
      : `No skill or methodology is loaded. Where the task says "Use Simple" or names a Simple mode or reference, interpret it with your own best engineering judgement.`
    return agent(
      `You are completing one task of an engineering evaluation. Work exactly as instructed and return only the deliverable the task asks for.

${methodology}

Read the task at ${caseDir}/prompt.md. If ${caseDir}/SIMPLE.md exists, treat it as the nearest repository SIMPLE.md profile for the task. Do not read anything else inside ${args.caseRoot} and do not look for grading criteria.

Produce your final answer, write it verbatim to ${args.outDir}/raw/${name}__${cond.name}.md using the Write tool (create the file; overwrite if present), and return the same text as {solution}. Do not modify any other file.`,
      { label: `solve:${name}:${cond.name}`, phase: 'Solve', model: 'sonnet', schema: SOLUTION }
    )
  },
  (res, { name, cond }) => {
    if (!res) return null
    return agent(
      `You are grading one solution from an engineering evaluation. Read the grading criteria at ${args.repo}/evals/${name}/graders/criteria.md and, if it exists, the task fixture at ${args.repo}/evals/${name}/SIMPLE.md for context. Grade strictly and evidence-based: pass=true only if the solution meets the pass conditions and avoids every fail condition. In failures, list each concrete violated condition with a short quote from the solution as evidence. In notable, record anything remarkable, good or bad, in one or two sentences.

Solution to grade:

${res.solution}`,
      { label: `grade:${name}:${cond.name}`, phase: 'Grade', schema: VERDICT, effort: 'low' }
    ).then((v) => (v ? { caseName: name, condition: cond.name, ...v } : null))
  }
)

const flat = results.filter(Boolean)
const tally = {}
for (const r of flat) {
  tally[r.condition] = tally[r.condition] || { pass: 0, fail: 0 }
  tally[r.condition][r.pass ? 'pass' : 'fail']++
}
log(`tally: ${JSON.stringify(tally)}`)
return { tally, results: flat }
