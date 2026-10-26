from pathlib import Path
root=Path(__file__).resolve().parents[1]
live=(root/'js/live-phase5.js').read_text(encoding='utf-8')
safety=(root/'js/figma-stage6-dashboard.js').read_text(encoding='utf-8')
assert "statusOf=(id,s)" in live
assert "Chờ xác minh" in live and "Đang khắc phục" in live
assert "a.status===status.value" in live
assert "data-p17-summary" in live
assert "const liveState=" in safety
assert "${esc(liveState)}" in safety
print('PASS: Stage 17 consistency checks')
