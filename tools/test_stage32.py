from pathlib import Path
root=Path(__file__).resolve().parents[1]
w=(root/'js/workflow-phase3.js').read_text(encoding='utf-8')
l=(root/'js/live-phase5.js').read_text(encoding='utf-8')
assert 'ownIds=new Set(reports().map(r=>r.payload?.id).filter(Boolean))' in w
assert 'Object.entries(data.decisions).filter(([id])=>ownIds.has(id))' in w
assert "a?.status==='Đã xác minh đóng'" in l
assert 'statusOf(r.id,s)' in l
print('Stage 32 static regression checks: PASS')
