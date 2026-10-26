(()=>{
  'use strict';
  const pages=[
    ['dashboard','▦','Tổng quan an toàn'],
    ['risks','⚠','Chi tiết nguy cơ'],
    ['inspections','☷','Lịch kiểm tra'],
    ['ai','✦','AI phân loại nguy cơ']
  ];
  const aliases={
    'corrective-actions':'risks',
    actions:'risks',
    zones:'risks',
    reports:'dashboard',
    checklists:'inspections'
  };
  roleConfig.safety.pages=pages;
  currentRole='safety';
  const requested=document.documentElement.dataset.safetyPage||document.body.dataset.initialPage;
  const available=new Set(pages.map(([id])=>id));
  currentPage=available.has(requested)?requested:(aliases[requested]||'dashboard');
  renderPage();
})();
