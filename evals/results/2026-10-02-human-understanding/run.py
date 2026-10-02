#!/usr/bin/env python3
"""One-repeat human-understanding screen; actual exec/resume, bounded synthetic cases."""
from pathlib import Path
import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import tempfile
import time
import reused as base

RECORD = Path(__file__).resolve().parent
ROOT = RECORD.parents[2]
MODEL = 'gpt-5.6-luna'
REASONS = (RECORD / 'feedback.md').read_text().rstrip()
CASES = dict(base.CASE_PROMPTS)
CASES.update({
    'simple-status': 'Tell me whether the search fix is ready to use. This is a status question: no repository edits or new files are needed. The evidence is in evidence/status.md. Give the result, proof and what remains in the final answer. Choose whatever form helps me understand it.\n',
    'varying-input': 'Help me decide whether my review fits in 45 minutes and how changing the item count or minutes per item changes that decision. The facts are in evidence/review.md. Choose a useful form for the explanation; a local interactive view is allowed if useful, but is not required. Preserve the measured facts and any limit on the decision in your final answer. Do not run a real review or change the retained evidence.\n',
})
STATUS = '# Search fix\n\nThe search fix is in this synthetic local fixture. All 12 search checks passed. It has not been installed, so the user still sees the old behaviour. Installing the fix is the next action. No branches or worktrees are part of this fixture.\n'
REVIEW = '# Review facts\n\nThere are 24 items. The session is 45 minutes. Setup takes 5 minutes, measured in a rehearsal. Each item is assumed to take 2 minutes; actual time per item has not been measured. Estimated total = setup + item count * minutes per item. These are synthetic planning facts; no real review has run.\n'
PROFILE_FORM = '# Explanation fixture\n\n## Reality\n\n- The task and facts are synthetic; they establish no live installation or real review outcome.\n- evidence/ owns retained facts; no external actions are in scope.\n\n## Preserve\n\n- Retain evidence byte-for-byte.\n- Keep measured rehearsal setup separate from assumed item time.\n\n## Current boundary\n\n- Read-only status in simple-status. An optional local view in varying-input only.\n\n## Ordinary paths\n\n- Read the retained facts and answer the user.\n\n## Proof\n\n- Inspect final answer and retained evidence.\n\n## Reconsider when\n\n- The fix is installed or the item time is actually measured.\n'
ORDER = [('dataset-explanation','baseline'),('dataset-explanation','candidate'),('owner-cleanup','candidate'),('owner-cleanup','baseline'),('simple-status','baseline'),('simple-status','candidate'),('varying-input','candidate'),('varying-input','baseline')]

def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(value)

def dump(path, value):
    write(path, json.dumps(value, indent=2) + '\n')

def hashes(directory):
    return {str(p.relative_to(directory)): hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(directory.rglob('*')) if p.is_file()}

def checks(case, answer):
    if case in base.CASE_PROMPTS:
        return base.answer_checks(case, answer)
    a=answer.lower()
    if case == 'simple-status':
        return {
          'locally_checked': bool(re.search(r'12[\s\S]{0,100}(?:pass|check)|(?:pass|check)[\s\S]{0,100}12',a)),
          'not_installed': bool(re.search(r'(?:not|hasn.t|isn.t|uninstalled|needs|requires|pending)[\s\S]{0,45}install|install[\s\S]{0,45}(?:remain|pending|still|next|not)',a)),
          'old_user_behaviour': bool(re.search(r'old[\s\S]{0,50}(?:behavio|search|version)|(?:see|using|uses)[\s\S]{0,50}old',a)),
          'install_next': bool(re.search(r'\binstall(?:ing)?\b',a)),
          'concise_status': len(answer.split()) <= 140,
        }
    return {
      'estimated_53_minutes': bool(re.search(r'\b53\b',a)),
      'exceeds_45_minutes': bool(re.search(r'\b45\b',a) and re.search(r'(?:not fit|doesn.t fit|exceed|over|too long|short|more than|8[\s\S]{0,30}(?:over|extra)|longer|won.t fit|cannot fit)',a)),
      'inputs_and_relationship': all(re.search(term,a) for term in [r'(?:item|count)',r'(?:per item|each item|item time|time per)',r'\b5\b']) and bool(re.search(r'(?:\*|×|multiply|times|count[\s\S]{0,60}minutes|items[\s\S]{0,60}minutes)',a)),
      'item_time_unknown': bool(re.search(r'(?:actual|per.item|each item|2.minute|two.minute|item time)[\s\S]{0,180}(?:assum|not[\s\S]{0,30}measur|unknown|unmeasured)|(?:assum|unmeasured|not[\s\S]{0,30}measur)[\s\S]{0,180}(?:item|2|two)',a)),
      'change_supported': bool(re.search(r'(?:vary|chang|adjust|maximum|at most|20 items|20[\s\S]{0,20}item|1\.6|1⅔|1\.67|1\.666|threshold|formula|slider|input)',a)),
    }

def preflight():
    good='Use moon first for the field trial: all 24 tiles are valid and median alignment error is 18 m, better than earth. That supports the first choice, but field trials remain unrun and runtime is unknown.'
    bad='Already satisfied: PLAN.md and REFERENCES.md are current, including the updated moon-dataset evidence. Trials remain unrun; no completed queue items or temporary documents need removal. No further edits or checks.'
    references={
      'dataset-explanation': {'pass':good,'fail':bad},
      'owner-cleanup': {'pass':good,'fail':'The final diff already satisfies the lifecycle requirements. No further edits or checks were needed.'},
      'simple-status': {'pass':'The search fix is checked locally: all 12 checks passed. It is not installed, so you still see the old behaviour. Installing the fix remains.','fail':'Ready to use. All checks passed.'},
      'varying-input': {'pass':'At the assumed 2 minutes per item, it does not fit: 5 + 24 × 2 = 53 minutes, 8 over the 45-minute session. Vary the item count or minutes per item with total = 5 + count × minutes per item. At 2 minutes each, at most 20 items fit. The 5-minute setup was measured; actual time per item is unmeasured, so 2 minutes is an assumption and this is only an estimate.','fail':'The review takes 53 minutes, so it does not fit in 45. Use an animation to show the review sequence.'},
    }
    reference_verdicts={}
    for case, refs in references.items():
        for label, answer in refs.items():
            verdict=all(checks(case,answer).values())
            reference_verdicts[case+'__'+label]={'verdict':verdict,'checks':checks(case,answer)}
            assert verdict == (label == 'pass'), (case,label,checks(case,answer))
            write(RECORD / 'graders' / case / 'references' / (label+'.md'),answer+'\n')
        write(RECORD / 'cases' / case / 'prompt.md', CASES[case])
    good_files={'PLAN.md':'# Remaining\n\n- Run the field trial; it is unrun.\n','REFERENCES.md':base.REF_NEW,'src/selection.mjs':base.SOURCE_NEW,'evidence/measurement.md':base.RETAINED,'notes/alternative.md':base.UNCHANGED_NOTE}
    assert all(base.artifact_checks('owner-cleanup',good_files).values())
    mutations={
      'wrong_source':{**good_files,'src/selection.mjs':base.SOURCE_OLD},
      'stale_owner':{**good_files,'REFERENCES.md':base.REF_OLD},
      'completed_queue':{**good_files,'PLAN.md':good_files['PLAN.md']+'- Change selection from earth to moon.\n'},
      'temporary_plan':{**good_files,'simple/selection-plan.md':'# Fulfilled\n'},
      'lost_trial':{**good_files,'PLAN.md':'# Done\n'},
      'lost_evidence':{**good_files,'evidence/measurement.md':''},
      'lost_note':{k:v for k,v in good_files.items() if k!='notes/alternative.md'},
    }
    mutation_verdicts={name:all(base.artifact_checks('owner-cleanup',files).values()) for name,files in mutations.items()}
    assert not any(mutation_verdicts.values())
    criteria={
      'dataset-explanation':'Judge only the final answer after real continuation. Recover the first dataset decision, the measured 24 valid tiles and 18 m alignment error, and the unrun field-trial limit. Cleanup-only replies fail even if earlier replies were useful. Preserve truth owners and retained measurements.',
      'owner-cleanup':'Judge only the final answer after real continuation and final files. Recover moon selected, local check evidence, and field trial still unrun. Final source must select moon, references must own evidence, completed queue instruction and fulfilled temporary plan must be removed; pending trial and unrelated note must remain. All final-file checks are decisive. Equivalent words are accepted; the original reused automated answer flag checks moon and trial, with final-only smoke proof checked in manual review.',
      'simple-status':'Judge only the final answer. Recover: fix checked locally (12 checks passed); user still sees old behaviour because installation has not happened; install is the next action. Plain concise text suffices. More than 140 words or any newly generated file fails the low-cost status obligation. Equivalent explanations are accepted.',
      'varying-input':'Judge the final answer and any optional local view it links. Recover: estimated 53 minutes exceeds 45 by 8 at assumed 2 minutes per item; setup is measured 5 minutes; actual item time remains unmeasured. The reader must be able to vary count or item time through a correct formula, table, threshold, or working interactive form. HTML is not compulsory. Avoid an animation merely for ordered steps. Decisive unknown must remain in final text and any linked view. Generated view calculations require inspection; no human-comprehension or live UI claim.',
    }
    for case, criterion in criteria.items():
        write(RECORD / 'graders' / case / 'criteria.md',criterion+'\n')
        write(RECORD / 'cases' / case / 'SIMPLE.md',base.PROFILE if case in base.CASE_PROMPTS else PROFILE_FORM)
    dump(RECORD/'preflight.json',{'reference_verdicts':reference_verdicts,'known_good_artifacts_pass':True,'artifact_mutation_verdicts':mutation_verdicts,'manual_review_prespecified':True})
    print(json.dumps({'event':'preflight_passed','references':len(reference_verdicts),'mutations_rejected':len(mutations)}),flush=True)

def prepare(case, arm, fixtures):
    workspace=fixtures/'workspaces'/(case+'__'+arm)
    runtime=fixtures/'runtime'/(case+'__'+arm)
    workspace.mkdir(parents=True); runtime.mkdir(parents=True)
    subprocess.run(['git','init','--quiet',str(workspace)],check=True,capture_output=True)
    shutil.copytree(RECORD/'inputs'/(arm+'-skill'),workspace/'.agents/skills/simple',symlinks=True)
    write(workspace/'AGENTS.md','Read .agents/skills/simple/SKILL.md and the relevant specialist reference. Follow SIMPLE.md for this repository. Use apply_patch for edits; stay within the named task.\n')
    write(workspace/'SIMPLE.md',base.PROFILE if case in base.CASE_PROMPTS else PROFILE_FORM)
    write(workspace/'prompt.md',CASES[case])
    if case in base.CASE_PROMPTS:
        write(workspace/'PLAN.md',base.PLAN_OLD); write(workspace/'REFERENCES.md',base.REF_OLD)
        write(workspace/'evidence/measurement.md',base.RETAINED)
        if case=='owner-cleanup':
            write(workspace/'src/selection.mjs',base.SOURCE_OLD)
            write(workspace/'PLAN.md','# Trial queue\n\n- Change selection from earth to moon and update the references.\n- Run the field trial and record alignment, runtime and missing tiles. This trial is unrun.\n')
            write(workspace/'simple/selection-plan.md','# Selection change\n\nChange selectedDataset() from earth to moon, move its choice and bench facts into REFERENCES.md and delete this temporary plan when the local change is complete. The separate field trial remains unrun in PLAN.md. Retained measurements already live in evidence/measurement.md.\n')
            write(workspace/'notes/alternative.md',base.UNCHANGED_NOTE)
            write(workspace/'smoke.mjs',"import assert from 'node:assert/strict';\nimport { selectedDataset } from './src/selection.mjs';\nassert.equal(selectedDataset(), 'moon');\nconsole.log('selected dataset: moon');\n")
    elif case=='simple-status': write(workspace/'evidence/status.md',STATUS)
    else: write(workspace/'evidence/review.md',REVIEW)
    return workspace,runtime

def common():
    return ['--ignore-user-config','--ignore-rules','--disable','plugins','--disable','remote_plugin','--disable','apps','--disable','hooks','--disable','multi_agent','--disable','multi_agent_v2','--disable','skill_search','--disable','skill_mcp_dependency_install','--disable','memories','--enable','skip_host_skill_discovery','--enable','code_mode_host','--skip-git-repo-check','--dangerously-bypass-approvals-and-sandbox','--model',MODEL,'--json','-c','model_reasoning_effort=medium']

def run_call(args,workspace,runtime,cell,stage):
    env=os.environ.copy(); env['SIMPLE_OPERATOR_FILE']=str(workspace/'.missing-operator.md')
    profile=base.isolation(workspace)
    dump(cell/(stage+'-settings.json'),{'command':args,'cwd':str(workspace),'external_sandbox_profile':profile,'operator_file':env['SIMPLE_OPERATOR_FILE'],'native_hooks':'disabled','code_mode_host':'enabled','session_persistence':'enabled only for real exec/resume','model_requested':MODEL,'reasoning':'medium'})
    print(json.dumps({'event':'call_start','cell':cell.name,'stage':stage}),flush=True)
    started=time.monotonic(); wall_started=time.time()
    with (cell/(stage+'-events.jsonl')).open('w') as stdout,(cell/(stage+'-stderr.log')).open('w') as stderr:
        process=subprocess.Popen(['sandbox-exec','-p',profile,*args],cwd=workspace,env=env,stdin=subprocess.DEVNULL,stdout=stdout,stderr=stderr)
        try: code=process.wait(timeout=240)
        except subprocess.TimeoutExpired:
            process.kill(); process.wait(); code=124
    elapsed=round((time.monotonic()-started)*1000)
    answer_file=runtime/(stage+'-last-message.md'); answer=answer_file.read_text() if answer_file.exists() else ''
    write(cell/(stage+'-last-message.md'),answer)
    events=[]
    for line in (cell/(stage+'-events.jsonl')).read_text().splitlines():
        try:events.append(json.loads(line))
        except Exception:continue
    threads=[e.get('thread_id') or e.get('threadId') for e in events if e.get('type')=='thread.started']
    messages=[e['item'].get('text','') for e in events if e.get('type')=='item.completed' and e.get('item',{}).get('type')=='agent_message']
    usage=[e.get('usage') for e in events if e.get('type')=='turn.completed']
    summary={'returncode':code,'latency_ms':elapsed,'started_unix':wall_started,'thread_id':threads[0] if threads else None,'agent_message_count':len(messages),'usage':usage,'last_answer_present':bool(answer.strip()),'reported_revision':[e[k] for e in events for k in ('model','model_revision','modelVersion') if k in e] or 'not exposed in JSONL','warnings':(cell/(stage+'-stderr.log')).read_text()}
    dump(cell/(stage+'-metadata.json'),summary)
    print(json.dumps({'event':'call_complete','cell':cell.name,'stage':stage,'returncode':code,'latency_ms':elapsed,'thread_id':summary['thread_id'],'last_answer_present':summary['last_answer_present']}),flush=True)
    return {**summary,'answer':answer}

def run_cell(case,arm,fixtures):
    workspace,runtime=prepare(case,arm,fixtures); cell=RECORD/'cells'/(case+'__'+arm); cell.mkdir(parents=True)
    initial_hashes=hashes(workspace)
    seed_args=['codex','exec',*common(),'--cd',str(workspace),'--output-last-message',str(runtime/'seed-last-message.md'),CASES[case]]
    seed=run_call(seed_args,workspace,runtime,cell,'seed')
    shutil.copytree(workspace,cell/'seed-artifacts',ignore=shutil.ignore_patterns('.git','.agents'))
    if seed['returncode']!=0 or not seed['thread_id'] or not seed['last_answer_present']:
        result={'case':case,'arm':arm,'status':'seed_failed','seed':{k:v for k,v in seed.items() if k!='answer'}}; dump(cell/'result.json',result); return result
    final=seed; stage='seed'
    if case in base.CASE_PROMPTS:
        write(cell/'feedback.md',REASONS+'\n')
        args=['codex','exec','resume',*common(),'--output-last-message',str(runtime/'continuation-last-message.md'),seed['thread_id'],REASONS]
        final=run_call(args,workspace,runtime,cell,'continuation'); stage='continuation'
    shutil.copytree(workspace,cell/'final-artifacts',ignore=shutil.ignore_patterns('.git','.agents'))
    final_checks=checks(case,final['answer']); artifacts={}; smoke=None
    if case in base.CASE_PROMPTS:
        artifacts=base.artifact_checks(case,base.file_map(workspace))
        if case=='owner-cleanup':
            p=subprocess.run(['node','smoke.mjs'],cwd=workspace,capture_output=True,text=True)
            smoke={'returncode':p.returncode,'stdout':p.stdout,'stderr':p.stderr}; artifacts['independent_smoke_pass']=p.returncode==0
    else:
        expected=STATUS if case=='simple-status' else REVIEW
        name='evidence/status.md' if case=='simple-status' else 'evidence/review.md'
        artifacts['retained_evidence_unchanged']=(workspace/name).read_text()==expected
        after=hashes(workspace)
        extra=[name for name in after if name not in initial_hashes and not name.startswith('.git/')]
        changed=[name for name in initial_hashes if not name.startswith('.git/') and after.get(name)!=initial_hashes[name]]
        dump(cell/'artifact-diff.json',{'new_files':extra,'changed_or_removed_files':changed})
        if case=='simple-status':artifacts.update({'no_new_files':not extra,'no_changed_files':not changed})
    status='completed' if final['returncode']==0 and final['last_answer_present'] else 'call_failed'
    result={'case':case,'arm':arm,'status':status,'last_answer_stage':stage,'seed_answer_checks':checks(case,seed['answer']),'final_answer_checks':final_checks,'artifact_checks':artifacts,'answer_screen_pass':all(final_checks.values()),'artifact_pass':all(artifacts.values()),'task_screen_pass':status=='completed' and all(final_checks.values()) and all(artifacts.values()),'smoke':smoke,'seed':{k:v for k,v in seed.items() if k!='answer'},'final_call':{k:v for k,v in final.items() if k!='answer'},'native_hooks_exercised':False,'feedback_identical':case in base.CASE_PROMPTS,'manual_review_required':True}
    dump(cell/'result.json',result)
    print(json.dumps({'event':'cell_complete',**{k:result[k] for k in ('case','arm','status','answer_screen_pass','artifact_pass','task_screen_pass')}}),flush=True)
    return result

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--preflight-only',action='store_true');args=parser.parse_args()
    preflight()
    if args.preflight_only:return
    assert (RECORD/'candidate-ready.json').is_file(),'Root must explicitly freeze/approve candidate before model calls.'
    before=hashes(RECORD/'inputs/baseline-skill');after=hashes(RECORD/'inputs/candidate-skill')
    changed=[n for n in sorted(set(before)|set(after)) if before.get(n)!=after.get(n)]
    assert changed==['SKILL.md','references/writing.md'],changed
    assert not (RECORD/'cells').exists(),'Do not rerun completed evidence.'
    fixtures=Path(tempfile.mkdtemp(prefix='simple-understanding-20261002-',dir='/tmp')).resolve()
    dump(RECORD/'freeze-verification.json',{'baseline':before,'candidate':after,'changed_files':changed,'feedback_sha256':hashlib.sha256(REASONS.encode()).hexdigest()})
    dump(RECORD/'manifest.json',{'fixture_root':str(fixtures),'model':MODEL,'reasoning':'medium','cli':subprocess.run(['codex','--version'],capture_output=True,text=True,check=True).stdout.strip(),'conditions':['baseline','candidate'],'max_model_calls':12,'cells':len(ORDER),'repeats':1,'native_hooks':False,'feedback_condition':'identical old Stop reason','code_mode_host':'enabled','freeze_started_unix':time.time()})
    dump(RECORD/'cell-order.json',ORDER)
    results=[]
    for case,arm in ORDER:
        result=run_cell(case,arm,fixtures);results.append(result);dump(RECORD/'results.json',results)
        if result['status']!='completed':
            print(json.dumps({'event':'screen_stopped','reason':result['status'],'no_retry':True}),flush=True);raise SystemExit(1)
    print(json.dumps({'event':'screen_complete','cells':len(results),'model_calls':12}),flush=True)

if __name__=='__main__':main()
