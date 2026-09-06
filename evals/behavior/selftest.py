#!/usr/bin/env python3
"""Prove the root-owned artifact checks before exposing cases to solvers."""
from pathlib import Path
import shutil, subprocess, tempfile
ROOT = Path(__file__).resolve().parent / 'cases'

def verify(case, workspace, accepted, initial=False):
    script = 'initial-verifier.mjs' if initial else 'verifier.mjs'
    result = subprocess.run(['node', str(ROOT/case/script), str(workspace)], capture_output=True, text=True)
    assert (result.returncode == 0) == accepted, f'{case}: expected {accepted}: {result.stdout}{result.stderr}'

with tempfile.TemporaryDirectory(prefix='behavior-selftest-') as directory:
    workspace = Path(directory)/'correction'
    shutil.copytree(ROOT/'correction-preserves/fixture', workspace)
    verify('correction-preserves', workspace, False)
    original = (workspace/'audit.mjs').read_text()
    good = original.replace('createdAt: input.createdAt }', 'createdAt: input.createdAt, summary: `${input.actor.displayName} ${input.action} ${input.target}.` }').replace('return JSON.stringify(event)', 'return event.summary')
    (workspace/'audit.mjs').write_text(good)
    verify('correction-preserves', workspace, True)
    verify('correction-preserves', workspace, True, initial=True)
    for mutation in [good.replace('input.actor.displayName', 'input.actor.id'), good.replace('e.actor.id === id', 'true'), good.replace('e.retentionDays * 86400000', '86400000')]:
        (workspace/'audit.mjs').write_text(mutation)
        verify('correction-preserves', workspace, False)
    workspace = Path(directory)/'easy'
    shutil.copytree(ROOT/'easy-edit/fixture', workspace)
    verify('easy-edit', workspace, False)
    original = (workspace/'cli.mjs').read_text()
    good = original.replace('Upload thing', 'Upload file')
    (workspace/'cli.mjs').write_text(good)
    verify('easy-edit', workspace, True)
    (workspace/'cli.mjs').write_text(good.replace('Uploaded ${arg}', 'Uploaded wrong'))
    verify('easy-edit', workspace, False)
print('Root case selftests passed: known fixes accepted; original and regression mutations rejected.')
