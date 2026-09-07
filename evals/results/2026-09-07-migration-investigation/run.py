from pathlib import Path
import importlib.util, hashlib, json, shutil, sys
ROOT=Path(__file__).resolve().parents[3]
RECORD=Path(sys.argv[2]).resolve()
spec=importlib.util.spec_from_file_location('behavior',ROOT/'evals/behavior/run.py')
b=importlib.util.module_from_spec(spec);spec.loader.exec_module(b)
b.RECORD=RECORD;b.SUITE=RECORD/'frozen/cases'
b.CASES=('migration-r1','migration-r2')
b.CONDITIONS=('without-example','with-example','without-example-architecture','with-example-architecture')
b.cell_id=lambda c,k:hashlib.sha256(f'migration-diagnosis-v1|{c}|{k}|{b.MODEL}|{b.REASONING}'.encode()).hexdigest()[:16]
original_args=b.codex_args
active_condition=''
def args(prompt,*a,**kw):
    if active_condition.endswith('-architecture'):
        prompt+=' Also read .agents/skills/simple/references/architecture.md before making the decision.'
    return original_args(prompt,*a,**kw)
b.codex_args=args
def skill_into(condition,workspace):
    global active_condition
    active_condition=condition
    selected='without-example' if condition.startswith('without-example') else 'with-example'
    b.copytree(RECORD/'frozen'/selected,workspace/'.agents/skills/simple')
b.skill_into=skill_into
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def verify():
    m=json.loads((RECORD/'manifest.json').read_text())
    for name,h in m['hashes'].items():
        if digest(RECORD/name)!=h:raise RuntimeError('changed input: '+name)
    if digest(ROOT/'evals/behavior/run.py')!=m['base_runner_sha256']:raise RuntimeError('base runner changed')
    if digest(Path(__file__))!=m['adapter_sha256']:raise RuntimeError('adapter changed')
b.verify_freeze=verify
if sys.argv[1]=='freeze':
    if (RECORD/'manifest.json').exists():raise RuntimeError('already frozen')
    for c in b.CASES:
        shutil.copytree(ROOT/'evals/results/2026-09-07-personal-fit/cases/migration-decision',b.SUITE/'cases'/c)
    for k in ('with-example','without-example'):
        shutil.copytree(ROOT/'skills/simple',RECORD/'frozen'/k)
    p=RECORD/'frozen/without-example/references/compatibility.md';p.write_text(p.read_text().split('\n## Example: rename storage, preserve the API')[0]+'\n')
    shutil.copy2(ROOT/'evals/behavior/run.py',RECORD/'frozen/behavior-run.py')
    (RECORD/'frozen/criteria.md').write_text('''Assess each answer on two separate axes. Preservation: existing data and public API survive, old worker retains item_title for 48 hours, relevant verification/recovery and bounded exit are explained, no claimed external effects. Simplicity: preserve one stored title value during overlap using an existing boundary mapping, or justify any extra state with a concrete fixture constraint the mapping cannot satisfy. A second column plus synchronization without such a constraint is a simplicity miss, even if preservation passes. Accept other equally small correct designs. Score the actual artifact, not preferred words. Missing/empty answers are invalid, not design passes. Initial executable verifier only checks artifact presence. Record read paths and cost separately.\n''')
    (RECORD/'frozen/protocol.md').write_text('''Eight sequential Luna medium cells, 2 identical task repeats x 2 example conditions x 2 reading conditions. Current full skill held constant except removal of the compatibility example in without-example arms. Explicit architecture read is added only in architecture arms. Normal arms use unchanged forced-skill/routed-reference instruction. Test variability, example association and retrieval effect; no conclusive causal claim from this size. Freeze before calls, retain completed misses, stop after eight cells, no runtime wording changes within experiment. Lead manual review uses frozen preservation and simplicity criteria. Pass reference: retain item_title storage during overlap, map label in new build, preserve API, then coordinated rename after retirement. Fail reference: immediate rename breaks old worker; preservation-only pass/simplicity-fail reference: add label column and sync despite no named blocker to mapping.\n''')
    m={'model':b.MODEL,'reasoning':b.REASONING,'repeats':2,'cases':b.CASES,'conditions':b.CONDITIONS,'created_at':b.now(),'base_runner_sha256':digest(ROOT/'evals/behavior/run.py'),'adapter_sha256':digest(Path(__file__)),'hashes':{str(p.relative_to(RECORD)):digest(p) for p in (RECORD/'frozen').rglob('*') if p.is_file()},'cells':[{'id':b.cell_id(c,k),'case':c,'condition':k} for c,k in b.cell_order()]}
    (RECORD/'manifest.json').write_text(json.dumps(m,indent=2)+'\n')
    print('Frozen eight cells')
else:
    b.measure()
    p=RECORD/'results.json';rows=json.loads(p.read_text());m=json.loads((RECORD/'manifest.json').read_text())
    for row in rows:
        k='without-example' if row['condition'].startswith('without-example') else 'with-example'
        row['skillCommit']='snapshot-'+hashlib.sha256(json.dumps({p:h for p,h in m['hashes'].items() if p.startswith('frozen/'+k+'/')},sort_keys=True).encode()).hexdigest()
    p.write_text(json.dumps(rows,indent=2)+'\n')
