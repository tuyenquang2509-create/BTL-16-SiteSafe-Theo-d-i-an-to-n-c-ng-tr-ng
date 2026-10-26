#!/usr/bin/env python3
"""SiteSafe phase 12 static audit; run with python tools/check_site.py"""
from pathlib import Path
from collections import Counter
import json,subprocess
from bs4 import BeautifulSoup
root=Path(__file__).resolve().parents[1]
issues=[];pages=sorted(root.rglob('*.html'))
for p in pages:
    rel=p.relative_to(root).as_posix();s=BeautifulSoup(p.read_text(encoding='utf-8'),'html.parser')
    if not s.title or not s.title.get_text(strip=True):issues.append((rel,'Thiếu tiêu đề trang'))
    ids=[x.get('id') for x in s.select('[id]')]
    for k,n in Counter(ids).items():
        if n>1:issues.append((rel,f'ID trùng: {k} ({n})'))
    for t in s.select('[src],[href]'):
        v=t.get('src') or t.get('href')
        if not v or v.startswith(('http:','https:','#','mailto:','tel:','data:','javascript:')):continue
        target=(p.parent/v.split('#')[0].split('?')[0]).resolve()
        if not target.exists():issues.append((rel,f'Tài nguyên không tồn tại: {v}'))
    for a in s.select('a[target="_blank"]'):
        if 'noopener' not in (a.get('rel') or []):issues.append((rel,'Liên kết _blank thiếu rel=noopener'))
js=list(root.rglob('*.js'))
for p in js:
    try:
        result=subprocess.run(['node','--check',str(p)],capture_output=True,text=True)
    except FileNotFoundError:
        issues.append(('node','Không tìm thấy Node.js để kiểm tra cú pháp'));break
    if result.returncode:issues.append((p.relative_to(root).as_posix(),'Lỗi cú pháp JavaScript'))
report={'html_count':len(pages),'js_count':len(js),'issues':[{'file':a,'problem':b} for a,b in issues], 'limitations':['Kiểm tra tĩnh, không xác nhận các luồng chức năng chạy đúng','Chưa kiểm tra trực quan đối chiếu Figma']}
(root/'BAO-CAO-KIEM-TRA-12.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
raise SystemExit(1 if issues else 0)
