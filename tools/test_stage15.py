from pathlib import Path
root=Path(__file__).resolve().parents[1]
html=(root/'manager/manager-reports.html').read_text()
js=(root/'js/manager-reports-stage10.js').read_text()
assert 'data-initial-page="reports"' in html
assert 'data-initial-role="manager"' in html
assert "dataset.initialPage!=='reports'" in js
assert "dataset.initialRole!=='manager'" in js
assert "textContent.toLowerCase().includes('tuần '+p)" in js
assert "sitesafe-bao-cao-da-loc.csv" in js
assert "create.addEventListener('click'" in js
print('PASS: manager reports page guard, week filter, create and CSV handlers')
