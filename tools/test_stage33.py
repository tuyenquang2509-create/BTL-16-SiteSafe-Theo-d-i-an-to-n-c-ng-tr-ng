#!/usr/bin/env python3
"""Check stage33's 20 role pages and common UI stylesheet."""
from pathlib import Path
from bs4 import BeautifulSoup
root=Path(__file__).resolve().parents[1]
roles={'worker':'Nhân sự hiện trường','safety':'Cán bộ an toàn','manager':'Quản lý công trường','admin':'Quản trị hệ thống'}
count=0
for role,label in roles.items():
 for page in sorted((root/role).glob('*.html')):
  soup=BeautifulSoup(page.read_text(encoding='utf-8'),'html.parser')
  assert soup.body.get('data-initial-role')==role, page
  assert soup.select_one('#userRole').get_text(strip=True)==label, page
  assert any(x.get('href')=='../css/stage33-ui.css' for x in soup.select('link[rel=stylesheet]')), page
  count+=1
assert count==20,count
assert (root/'css/stage33-ui.css').exists()
print('PASS: 20 role pages have consistent role labels and stage33 responsive CSS')
