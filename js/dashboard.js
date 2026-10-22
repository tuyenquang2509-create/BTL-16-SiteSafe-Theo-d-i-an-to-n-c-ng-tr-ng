/* SiteSafe · Giao diện riêng: dashboard */
function dashboard(){
 const open=db.risks.filter(x=>x.status!=='Đã khắc phục').length;
 const high=db.risks.filter(x=>x.level==='Cao'&&x.status!=='Đã khắc phục').length;
 const overdue=db.actions.filter(x=>x.status!=='Hoàn thành'&&x.due<'2026-10-20').length || 3;
 const pending=Math.max(5,db.risks.filter(x=>x.status==='Mới ghi nhận').length+3);
 const chart=[8,6,9,5,11,7,10];
 return `<div class="figma-dashboard">
  <div class="crumb">Cán bộ an toàn / Tổng quan an toàn</div>
  <div class="figma-page-title"><div><h1>Tổng quan an toàn</h1><p>Đầu ca 03/10 · cập nhật 08:55 · tập trung những việc cần bạn xem xét.</p></div><button class="btn btn-primary" data-page="risks">Xem hàng chờ duyệt</button></div>
  <div class="data-caption">Dữ liệu minh họa · 03/10/2026 · Không phải số liệu thực tế</div>
  <div class="dashboard-filters">
   <label>Tìm kiếm<input id="dashboardSearch" type="search" placeholder="⌕  Mã, nội dung hoặc người phụ trách"></label>
   <label>Công trường<select id="dashboardSite"><option>Riverside – Khối A</option><option>Toàn bộ công trường</option></select></label>
   <label>Bộ lọc<select id="dashboardFilter"><option value="all">Hôm nay · tất cả khu vực</option><option value="high">Ưu tiên cao</option><option value="overdue">Quá hạn</option><option value="pending">Chờ duyệt</option></select></label>
  </div>
  <div class="figma-stats">
   <article class="figma-stat"><span>Nguy cơ đang mở</span><strong>${Math.max(24,open)}</strong><small>6 khu vực đang theo dõi</small></article>
   <article class="figma-stat"><span>Ưu tiên cao</span><strong>${Math.max(7,high)}</strong><small>Cần kiểm tra trong ca</small></article>
   <article class="figma-stat"><span>Hành động quá hạn</span><strong>${overdue}</strong><small>Nhắc người phụ trách</small></article>
   <article class="figma-stat"><span>Chờ duyệt</span><strong>${pending}</strong><small>Chưa xác nhận nguy cơ</small></article>
  </div>
  <div class="figma-alert"><strong>⚠ &nbsp;${overdue} hành động đã quá hạn</strong><p>Z-A2 có 2 việc, Z-A1 có 1 việc. Xem hạn và người phụ trách trước khi giao thêm việc.</p><button class="text-btn" data-page="actions">Xem hành động khắc phục →</button></div>
  <div class="figma-dashboard-columns">
   <section class="figma-card trend-card"><div class="figma-card-head"><div><h2>Xu hướng nguy cơ mới</h2><p>27/09–03/10/2026 · nguồn: báo cáo hiện trường</p></div><span class="figma-pill">Nguy cơ ghi nhận mới</span></div>
    <div class="figma-chart">${chart.map((n,i)=>`<div class="figma-bar-col"><b>${n}</b><div class="figma-bar" style="height:${n*10}px"></div><small>${['27/9','28/9','29/9','30/9','1/10','2/10','3/10'][i]}</small></div>`).join('')}</div>
    <div class="figma-legend"><span><i></i>Nguy cơ ghi nhận mới</span><span><i class="pale"></i>Đã xử lý</span></div>
   </section>
   <section class="figma-card queue-card"><div class="figma-card-head"><div><h2>Việc cần xem xét</h2><p>Ưu tiên theo mức độ và thời hạn</p></div><button class="text-btn" data-page="risks">Xem tất cả →</button></div>
    <div class="figma-queue-item"><span class="queue-icon danger">!</span><div><strong>Lan can tầng 4 chưa hoàn thiện</strong><p>RS-024 · Khối A · Tầng 4</p></div><span class="badge red">Cao</span></div>
    <div class="figma-queue-item"><span class="queue-icon warning">⌁</span><div><strong>Dây điện đi qua lối đi</strong><p>RS-023 · Khối A · Tầng 2</p></div><span class="badge orange">Trung bình</span></div>
    <div class="figma-queue-item"><span class="queue-icon danger">!</span><div><strong>Thiếu biển cảnh báo khu vực nâng hạ</strong><p>RS-021 · Bãi vật liệu</p></div><span class="badge red">Cao</span></div>
   </section>
  </div>
  <section class="figma-card figma-recent"><div class="figma-card-head"><div><h2>Nguy cơ cần theo dõi</h2><p>Các nguy cơ đang mở trong công trường</p></div><button class="btn btn-light btn-sm" data-page="risks">Mở danh sách</button></div><div id="dashboardRiskRows">${riskTable(db.risks.filter(x=>x.status!=='Đã khắc phục').slice(0,4))}</div></section>
  <div class="figma-footnote">SiteSafe · Bản mô phỏng phục vụ học tập. Luôn xác minh tại hiện trường trước khi đưa ra quyết định an toàn.</div>
 </div>`
}
