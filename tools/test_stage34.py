#!/usr/bin/env python3
"""Stage 34: audit static navigation and demo action affordances for all four roles."""
from pathlib import Path
from bs4 import BeautifulSoup
import re
root=Path(__file__).resolve().parents[1]
source=(root/'js/script.js').read_text(encoding='utf-8')
known_pages=set(re.findall(r"\['([^']+)','[^']*','[^']+'\]",source))
known_pages.update(['help','profile'])
known_pages.update(re.findall(r"'([\w-]+)':(?:dashboard|risksPage|inspectionsPage|actionsPage|zonesPage|reportsPage|checklistsPage|usersPage|adminSitesPage|aiPage|workerHome|workerChecklist|workerReport|workerHistory|managerHome|adminHome|helpPage|profilePage)",source))
count=0; links=0
for role in ('worker','safety','manager','admin'):
 for path in (root/role).glob('*.html'):
  soup=BeautifulSoup(path.read_text(encoding='utf-8'),'html.parser')
  assert soup.body.get('data-initial-role')==role, path
  for el in soup.select('[data-page]'):
   target=el.get('data-page')
   assert target in known_pages,(path.name,target)
   links+=1
  count+=1
assert count==20,count
inspections=BeautifulSoup((root/'safety/safety-inspections.html').read_text(encoding='utf-8'),'html.parser')
assert len(inspections.select('[data-page="checklists"]'))==2
assert not inspections.select('[data-page="checklist-templates"]')
report=BeautifulSoup((root/'worker/worker-report-create.html').read_text(encoding='utf-8'),'html.parser')
assert len(report.select('[data-demo="submit-report"]'))==2
assert all('chưa được kết nối' not in x.get('title','') for x in report.select('[data-demo]'))
print(f'PASS: {count} role pages, {links} static navigation controls, checklist links and report tooltips')
