from pathlib import Path
p=Path(__file__).resolve().parents[1]/'js/workflow-phase3.js'
s=p.read_text(encoding='utf8')
assert "window.addEventListener('storage'" in s
assert "window.addEventListener('pageshow'" in s
assert "e.key!==FLOW&&e.key!==KEY" in s
assert "current.status!=='Đang khắc phục'" in s
assert "a.status!=='Đang khắc phục'" in s
assert "closed?'Đã đóng sau xác minh':d.status" in s
print('PASS: cross-tab refresh, state guards, worker closed-status feedback')
