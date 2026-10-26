#!/usr/bin/env python3
"""Kiểm tra tĩnh riêng cho cơ chế xác nhận nộp minh chứng giai đoạn 30."""
from pathlib import Path
root=Path(__file__).resolve().parents[1]
s=(root/'js/figma-stage9.js').read_text(encoding='utf-8')
assert "window.confirm('Nộp minh chứng cho hành động '+a.id" in s
assert s.index('if(!window.confirm(') < s.index("a.status='Chờ xác minh'")
assert "if(pending.length>1)" in s
assert "if(!pending.length)" in s
assert "localStorage.removeItem('sitesafe_phase9_action_draft')" in s
assert len(list(root.rglob('*.html')))==24
print('PASS: xác nhận đúng mã hành động trước khi nộp, giữ kiểm tra 0/nhiều hành động, 24 trang HTML')
