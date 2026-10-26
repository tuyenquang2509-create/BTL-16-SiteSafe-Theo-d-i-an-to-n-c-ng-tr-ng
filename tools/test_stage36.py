#!/usr/bin/env python3
"""Stage 36 packaging and release audit (static checks only)."""
from pathlib import Path
import re, subprocess, sys
root=Path(__file__).resolve().parents[1]
pages=list(root.rglob('*.html'))
assert len(pages)==24, f'Expected 24 HTML pages; found {len(pages)}'
for role in ('worker','safety','manager','admin'):
    assert list((root/role).glob('*.html')), f'Missing pages for {role}'
for required in ('README-BAN-GIAO.md','KICH-BAN-QUAY-VIDEO.md','DANH-SACH-KIEM-THU.md'):
    assert (root/required).is_file(), required
workflow=(root/'js/workflow-phase3.js').read_text()
for guard in ('Array.isArray(data.actions)','Array.isArray(data.history)','Array.isArray(data.decisions)','typeof data.decisions'):
    assert guard in workflow, f'Missing defensive workflow guard: {guard}'
result=subprocess.run(['node',str(root/'tools/test_workflow_stage13.js')],capture_output=True,text=True)
assert result.returncode==0, result.stdout+result.stderr
print('PASS: 24 HTML pages, four roles, handoff docs, storage safeguards, workflow test')
