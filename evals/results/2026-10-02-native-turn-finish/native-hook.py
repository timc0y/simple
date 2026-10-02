import json, os, subprocess, sys, time
from pathlib import Path
cell = Path(__file__).resolve().parent
settings = json.loads((cell / 'wrapper-settings.json').read_text())
source = sys.stdin.read()
env = os.environ.copy()
env['CLAUDE_PLUGIN_ROOT'] = settings['plugin']
env['PLUGIN_ROOT'] = settings['plugin']
result = subprocess.run(['node', str(Path(settings['plugin']) / 'scripts/hook.mjs')], input=source, text=True, capture_output=True, env=env)
with (cell / 'native-hooks.jsonl').open('a') as out:
    out.write(json.dumps({'atNs':time.time_ns(),'input':json.loads(source),'exitCode':result.returncode,'stdout':result.stdout,'stderr':result.stderr}) + chr(10))
sys.stdout.write(result.stdout)
sys.stderr.write(result.stderr)
sys.exit(result.returncode)
