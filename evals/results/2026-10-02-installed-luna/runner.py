from pathlib import Path
from datetime import datetime, timezone
import argparse,hashlib,json,os,queue,shutil,signal,subprocess,tempfile,threading,time
try: import tomllib
except ModuleNotFoundError: import tomli as tomllib
p=argparse.ArgumentParser();p.add_argument('mode',choices=['discover','run']);p.add_argument('--target',required=True);args=p.parse_args()
RECORD=Path(__file__).resolve().parent;ROOT=RECORD.parents[2];HOME=Path.home()
PROTOCOL=json.loads((RECORD/'registered-protocol.json').read_text()); TARGET=RECORD/args.target;TARGET.mkdir(exist_ok=True)
PLUGIN=HOME/'.codex/plugins/cache/timc0y-simple/simple'/PROTOCOL['plugin_version']
SKILL=PLUGIN/'skills/simple/SKILL.md'
def write(p,v): p.parent.mkdir(parents=True,exist_ok=True);p.write_text(v if isinstance(v,str) else json.dumps(v,indent=2)+'\n')
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def state(root): return {str(p.relative_to(root)):sha(p) for p in root.rglob('*') if p.is_file() and '.git' not in p.relative_to(root).parts}
config_before=sha(HOME/'.codex/config.toml')
source={str(p.relative_to(PLUGIN)):sha(p) for p in PLUGIN.rglob('*') if p.is_file()}
expected_commit=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip();assert expected_commit==PROTOCOL['source_commit']
for f in ['scripts/hook.mjs','hooks/hooks.json','skills/simple/SKILL.md','skills/simple/references/writing.md']:
 assert source[f]==hashlib.sha256(subprocess.check_output(['git','show',expected_commit+':'+f],cwd=ROOT)).hexdigest()
class Native:
 def __init__(self,workspace,runtime,output,readonly=False):
  self.output=output;self.events=[];self.queue=queue.Queue();self.seq=0
  for name in ['state','logs','tmp']: (runtime/name).mkdir(parents=True,exist_ok=True)
  policy=['(version 1)','(allow default)',f'(deny file-write* (literal "{HOME/".codex/config.toml"}"))',f'(deny file-write* (subpath "{HOME/".codex/plugins"}"))',f'(deny file-write* (subpath "{HOME/".agents/skills"}"))',f'(deny file-write* (subpath "{ROOT}"))',f'(deny file-read-data (subpath "{ROOT}"))']
  for name in ['.claude-plugin/marketplace.json','.codex-plugin/plugin.json']:
   policy.append(f'(allow file-read* (literal "{ROOT/name}"))')
  if readonly: policy.append(f'(deny file-write* (subpath "{workspace}"))')
  profile=' '.join(policy);write(output/'sandbox.sb',profile+'\n')
  env=os.environ.copy();env['CODEX_SQLITE_HOME']=str(runtime/'state');env['TMPDIR']=str(runtime/'tmp')
  command=['sandbox-exec','-p',profile,'codex','app-server','--stdio','--disable','apps','--disable','memories','--disable','multi_agent','--disable','multi_agent_v2','--disable','skill_mcp_dependency_install','--enable','code_mode_host','-c','sqlite_home='+json.dumps(str(runtime/'state')),'-c','log_dir='+json.dumps(str(runtime/'logs'))]
  write(output/'settings.json',{'argv':command,'cwd':str(workspace),'environment_overrides':{k:env[k] for k in ['CODEX_SQLITE_HOME','TMPDIR']},'actual_home_and_codex_home_unchanged':True,'installed_hooks_unmodified':True,'hook_trust_bypass':False,'inline_hooks':False})
  self.stderr=(output/'stderr.log').open('w');self.trace=(output/'events.jsonl').open('w');self.requests=(output/'requests.jsonl').open('w')
  self.process=subprocess.Popen(command,cwd=workspace,env=env,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=self.stderr,text=True,bufsize=1,start_new_session=True)
  def reader():
   for line in self.process.stdout:
    try: d=json.loads(line)
    except ValueError: d={'unparsed':line}
    stamped={'atNs':time.time_ns(),'event':d};self.events.append(stamped);self.trace.write(json.dumps(stamped)+'\n');self.trace.flush();self.queue.put(d)
  self.reader=threading.Thread(target=reader,daemon=True);self.reader.start()
  try:
   self.request('initialize',{'clientInfo':{'name':'simple-installed-luna','version':'0.8.1'},'capabilities':{'experimentalApi':True}})
   self.send({'method':'initialized','params':{}})
  except Exception:
   self.close();raise
 def send(self,d):
  self.requests.write(json.dumps(d)+'\n');self.requests.flush();self.process.stdin.write(json.dumps(d)+'\n');self.process.stdin.flush()
 def receive(self,predicate,timeout=45):
  end=time.monotonic()+timeout;status=time.monotonic()+30
  while time.monotonic()<end:
   try: d=self.queue.get(timeout=1)
   except queue.Empty:
    if self.process.poll() is not None: raise RuntimeError('native app-server exited')
    if time.monotonic()>status: print(json.dumps({'target':args.target,'waiting_seconds':round(timeout-(end-time.monotonic()))}),flush=True);status+=30
    continue
   if 'method' in d and 'id' in d:
    self.send({'id':d['id'],'error':{'code':-32000,'message':'No interactive approval or external service actions in this evaluation'}})
   if predicate(d): return d
  raise TimeoutError('native response timeout')
 def request(self,method,params):
  self.seq+=1;number=self.seq;self.send({'id':number,'method':method,'params':params})
  d=self.receive(lambda d:d.get('id')==number);assert 'error' not in d,d.get('error');return d['result']
 def hooks(self,workspace):
  data=self.request('hooks/list',{'cwds':[str(workspace)]});write(self.output/'hooks-list.json',data)
  hs=[h for e in data['data'] for h in e['hooks'] if h.get('pluginId')=='simple@timc0y-simple']
  assert len(hs)==4 and {h['eventName'] for h in hs}=={'sessionStart','subagentStart','preToolUse','postToolUse'}
  assert all(h['source']=='plugin' and h['enabled'] and h['trustStatus']=='trusted' for h in hs)
  assert all(h['command']=='node "'+str(PLUGIN/'scripts/hook.mjs')+'"' for h in hs)
  return hs
 def close(self):
  if self.process.poll() is None:
   os.killpg(self.process.pid,signal.SIGTERM)
   try: self.process.wait(timeout=5)
   except subprocess.TimeoutExpired: os.killpg(self.process.pid,signal.SIGKILL);self.process.wait(timeout=5)
  self.reader.join(timeout=5);self.trace.close();self.requests.close();self.stderr.close()
def capture(command,cwd):
 d=subprocess.run(command,cwd=cwd,text=True,capture_output=True);return {'argv':command,'returncode':d.returncode,'stdout':d.stdout,'stderr':d.stderr}
write(TARGET/'identity.json',{'target':args.target,'commit':expected_commit,'plugin_version':PROTOCOL['plugin_version'],'codex_version':subprocess.check_output(['codex','--version'],text=True).strip(),'source_hashes':source,'config_sha256_before':config_before})
with tempfile.TemporaryDirectory(prefix='simple-installed-luna-') as temp:
 runtime_root=Path(temp);write(TARGET/'runtime-path.txt',str(runtime_root)+'\n')
 if args.mode=='discover':
  output=TARGET/'discovery';output.mkdir(exist_ok=True);workspace=runtime_root/'workspace';workspace.mkdir()
  n=None
  try:
   n=Native(workspace,runtime_root/'runtime',output);hs=n.hooks(workspace)
   models=n.request('model/list',{});exact=any(d.get('id')==PROTOCOL['model'] or d.get('model')==PROTOCOL['model'] for d in models['data']);assert exact
   write(output/'outcome.json',{'valid':True,'model_turns':0,'events':[h['eventName'] for h in hs],'sources':['plugin'],'plugin_id':'simple@timc0y-simple','all_trusted':True,'exact_model_available':True})
   print(json.dumps({'target':args.target,'discovery_passed':True,'model_turns':0}),flush=True)
  finally:
   if n:n.close()
 else:
  assert json.loads((TARGET/'discovery/outcome.json').read_text())['valid']
  outcomes=[]
  for case in PROTOCOL['cases_in_order']:
   output=TARGET/'cells'/case;output.mkdir(parents=True,exist_ok=False)
   cell=runtime_root/case;workspace=cell/'workspace';shutil.copytree(RECORD/'inputs/cases'/case,workspace)
   subprocess.run(['git','init','--quiet',str(workspace)],check=True);subprocess.run(['git','add','--all'],cwd=workspace,check=True)
   before=state(workspace);write(output/'original-file-hashes.json',before);n=None;start=time.monotonic();failure=None;result={}
   print(json.dumps({'target':args.target,'case':case,'event':'cell_start'}),flush=True)
   try:
    n=Native(workspace,cell/'runtime',output,case=='schedule');n.hooks(workspace)
    thread=n.request('thread/start',{'model':PROTOCOL['model'],'cwd':str(workspace),'approvalPolicy':'never','sandbox':'danger-full-access','ephemeral':True,'multiAgentMode':'explicitRequestOnly','config':{'model_reasoning_effort':PROTOCOL['effort']}})
    write(output/'thread-start.json',thread);assert thread['model']==PROTOCOL['model'] and thread['reasoningEffort']==PROTOCOL['effort']
    threadid=thread['thread']['id'];prompt=(workspace/'prompt.md').read_text().replace('{INSTALLED_SKILL}',str(SKILL));write(output/'prompt.md',prompt)
    n.request('turn/start',{'threadId':threadid,'model':PROTOCOL['model'],'effort':PROTOCOL['effort'],'input':[{'type':'text','text':prompt},{'type':'skill','name':'simple','path':str(SKILL)}]})
    done=n.receive(lambda d:d.get('method')=='turn/completed' and d.get('params',{}).get('threadId')==threadid,PROTOCOL['timeout_per_turn_seconds'])
    write(output/'turn-completed.json',done);assert done['params']['turn']['status']=='completed',done['params']['turn']
    time.sleep(.2)
    messages=[e for e in n.events if e['event'].get('method')=='item/completed' and e['event'].get('params',{}).get('item',{}).get('type')=='agentMessage']
    finals=[e for e in messages if e['event']['params']['item'].get('phase')=='final_answer'];last=(finals or messages)[-1];answer=last['event']['params']['item']['text'];write(output/'last-message.md',answer+'\n')
    hookevents=[e for e in n.events if e['event'].get('method')=='hook/completed' and e['event'].get('params',{}).get('run',{}).get('sourcePath')==str(PLUGIN/'hooks/hooks.json')]
    summaries=[e['event']['params']['run'] for e in hookevents];write(output/'native-hooks.json',hookevents)
    session=any(h['eventName']=='sessionStart' and h['status']=='completed' for h in summaries)
    post=[e for e in hookevents if e['event']['params']['run']['eventName']=='postToolUse']
    reconciliation=[e for e in post if any('Before your final response' in entry['text'] for entry in e['event']['params']['run']['entries'])]
    write(output/'final-file-hashes.json',state(workspace));shutil.copytree(workspace,output/'final-artifacts',ignore=shutil.ignore_patterns('.git'))
    check={'native_session_start':session,'stop_executions':sum(h['eventName']=='stop' for h in summaries),'all_hook_runs_completed':all(h['status']=='completed' for h in summaries),'post_tool_context_before_final':bool(reconciliation) and all(e['atNs']<last['atNs'] for e in reconciliation),'reconciliation_count':len(reconciliation),'fixture_unchanged':state(workspace)==before,'final_matches_last_completed_agent':messages[-1]['event']['params']['item']['text']==answer,'patch_format':capture(['git','diff','--check'],workspace)}
    if case=='barcode':check['independent']=capture(['node',str(RECORD/'verify-barcode.mjs'),str(workspace)],ROOT);check['smoke']=capture(['npm','test'],workspace)
    check['native_valid']=session and check['stop_executions']==0 and check['all_hook_runs_completed'] and check['final_matches_last_completed_agent'] and (check['post_tool_context_before_final'] if case=='barcode' else check['reconciliation_count']==0 and check['fixture_unchanged'])
    check['artifact_valid']=check['patch_format']['returncode']==0 and (check['independent']['returncode']==0 and check['smoke']['returncode']==0 if case=='barcode' else check['fixture_unchanged'])
    write(output/'checks.json',check)
    usage=[e['event']['params'] for e in n.events if e['event'].get('method')=='thread/tokenUsage/updated'];write(output/'usage.json',usage)
    result={'target':args.target,'case':case,'model_called':True,'requested_model':PROTOCOL['model'],'reported_model':thread['model'],'effort':thread['reasoningEffort'],'native_valid':check['native_valid'],'artifact_valid':check['artifact_valid'],'latency_ms':round((time.monotonic()-start)*1000),'manual_grade_pending':True}
   except Exception as e:
    failure=str(e);result={'target':args.target,'case':case,'native_valid':False,'error':failure,'latency_ms':round((time.monotonic()-start)*1000)}
   finally:
    if n:n.close()
   write(output/'result.json',result);outcomes.append(result);write(TARGET/'run-summary.json',outcomes);print(json.dumps(result),flush=True)
   if failure or not result.get('native_valid'):raise RuntimeError('Setup/native validity failure; stopping without another model turn: '+str(result))
assert sha(HOME/'.codex/config.toml')==config_before
assert source=={str(p.relative_to(PLUGIN)):sha(p) for p in PLUGIN.rglob('*') if p.is_file()}
write(TARGET/'cleanup.json',{'runtime_removed':True,'owned_processes_stopped':True,'config_unchanged':True,'installed_plugin_unchanged':True,'raw_evidence_retained':True})
