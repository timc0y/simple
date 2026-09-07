from pathlib import Path
import importlib.util,hashlib,json,shutil,sys
ROOT=Path(__file__).resolve().parents[3]
RECORD=Path(sys.argv[2]).resolve()
spec=importlib.util.spec_from_file_location('behavior',ROOT/'evals/behavior/run.py')
b=importlib.util.module_from_spec(spec);spec.loader.exec_module(b)
b.RECORD=RECORD;b.SUITE=RECORD/'frozen/cases';b.CONDITIONS=('current','candidate')
b.cell_id=lambda c,k:hashlib.sha256(f'representation-check-v1|{c}|{k}|{b.MODEL}|{b.REASONING}'.encode()).hexdigest()[:16]
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def skill_into(k,w):b.copytree(RECORD/'frozen'/f'{k}-skill',w/'.agents/skills/simple')
b.skill_into=skill_into
def verify():
    m=json.loads((RECORD/'manifest.json').read_text())
    for p,h in m['hashes'].items():
        if digest(RECORD/p)!=h:raise RuntimeError('changed frozen input '+p)
    if digest(ROOT/'evals/behavior/run.py')!=m['base_runner_sha256']:raise RuntimeError('base runner changed')
    if digest(Path(__file__))!=m['adapter_sha256']:raise RuntimeError('adapter changed')
b.verify_freeze=verify
if sys.argv[1]=='freeze':
    if (RECORD/'manifest.json').exists():raise RuntimeError('already frozen')
    sources=sorted(p for p in (RECORD/'source-cases').iterdir() if p.is_dir())
    if len(sources)!=3:raise RuntimeError('expected exactly three cases')
    b.CASES=tuple(f'{p.name}-r{i}' for p in sources for i in (1,2))
    for source in sources:
        rc,out,err,_=b.run_process(['node',str(source/'selftest.mjs')],source,60)
        if rc:raise RuntimeError(f'{source}: {out} {err}')
        for i in (1,2):shutil.copytree(source,b.SUITE/'cases'/f'{source.name}-r{i}')
    for k in b.CONDITIONS:shutil.copytree(RECORD/f'{k}-source',RECORD/'frozen'/f'{k}-skill')
    shutil.copy2(ROOT/'evals/behavior/run.py',RECORD/'frozen/behavior-run.py')
    shutil.copy2(RECORD/'protocol.md',RECORD/'frozen/protocol.md')
    m={'created_at':b.now(),'model':b.MODEL,'reasoning':b.REASONING,'conditions':b.CONDITIONS,'cases':b.CASES,'repeats':2,'hashes':{str(p.relative_to(RECORD)):digest(p) for p in (RECORD/'frozen').rglob('*') if p.is_file()},'base_runner_sha256':digest(ROOT/'evals/behavior/run.py'),'adapter_sha256':digest(Path(__file__)),'cells':[{'id':b.cell_id(c,k),'case':c,'condition':k} for c,k in b.cell_order()]}
    (RECORD/'manifest.json').write_text(json.dumps(m,indent=2)+'\n');print('Frozen twelve cells')
else:
    m=json.loads((RECORD/'manifest.json').read_text());b.CASES=tuple(m['cases']);b.measure()
    p=RECORD/'results.json';rows=json.loads(p.read_text())
    for row in rows:
        prefix='frozen/'+row['condition']+'-skill/'
        row['skillCommit']='snapshot-'+hashlib.sha256(json.dumps({p:h for p,h in m['hashes'].items() if p.startswith(prefix)},sort_keys=True).encode()).hexdigest()
    p.write_text(json.dumps(rows,indent=2)+'\n')
