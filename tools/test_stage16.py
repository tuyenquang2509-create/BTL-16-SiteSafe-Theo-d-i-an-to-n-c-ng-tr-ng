#!/usr/bin/env python3
"""Kiểm tra hồi quy giai đoạn 16: mã báo cáo và bộ lọc."""
from pathlib import Path
from bs4 import BeautifulSoup
import re
root=Path(__file__).resolve().parents[1]
page=BeautifulSoup((root/'manager/manager-reports.html').read_text(encoding='utf-8'),'html.parser')
ids=[int(x) for x in re.findall(r'RP-(\d+)',page.select_one('.fg-table').get_text(' ',strip=True))]
assert 41 in ids, 'Dữ liệu Figma có RP-041, cần tính đến khi sinh mã mới'
js=(root/'js/manager-reports-stage10.js').read_text(encoding='utf-8')
assert 'existingIds' in js and 'Math.max(40,...existingIds' in js, 'Chưa tính mã từ bảng Figma'
assert max([40,*ids])+1 == 42, 'Mã tiếp theo cần là RP-042'
assert 'normalize(tr.textContent).includes(q)' in js, 'Tìm kiếm báo cáo chưa hỗ trợ bỏ dấu'
admin=(root/'js/admin-users-stage10.js').read_text(encoding='utf-8')
assert 'normalize(row.textContent).includes(q)' in admin, 'Tìm kiếm thành viên chưa hỗ trợ bỏ dấu'
assert 'row.cells[3]?.textContent.includes(state)' in admin, 'Bộ lọc trạng thái phải dùng đúng cột'
print('PASS: RP-041 đã tồn tại → mã bản nháp tiếp theo RP-042')
print('PASS: Tìm kiếm không dấu trên báo cáo và thành viên')
print('PASS: Bộ lọc thành viên sử dụng cột trạng thái')
