/* Chi khoi tao ung dung tren trang co app-shell. */
if (document.querySelector(".app-shell") || document.getElementById("appShell")) {
/* ===== Shared renderer: dashboard.js ===== */
/* SiteSafe · Giao diện riêng: dashboard */
function dashboard(){
 const today=new Date().toISOString().slice(0,10);
 const openRisks=db.risks.filter(x=>!['Đã khắc phục','Lưu trữ'].includes(x.status));
 const high=openRisks.filter(x=>x.level==='Cao');
 const overdue=db.actions.filter(x=>x.status!=='Hoàn thành'&&x.due<today);
 const pending=openRisks.filter(x=>x.status==='Mới ghi nhận');
 const matching=openRisks.filter(x=>`${x.id} ${x.title} ${x.zone} ${x.owner}`.toLowerCase().includes(safetyDashboardSearchTerm.toLowerCase()));
 const filtered=matching.filter(x=>safetyDashboardFilter==='high'?x.level==='Cao':safetyDashboardFilter==='pending'?x.status==='Mới ghi nhận':true);
 const zones=db.zones.map(zone=>({zone,count:openRisks.filter(x=>x.zone===zone.name||x.zone.startsWith(`${zone.name} · `)).length})).filter(x=>x.count);
 const inspections=db.inspections.filter(x=>x.status!=='Hoàn thành').slice().sort((a,b)=>`${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)).slice(0,4);
 return `<div class="safety-page safety-dashboard-page">
   <div class="crumb">Cán bộ an toàn / Tổng quan an toàn</div>
   <div class="figma-page-title"><div><h1>Tổng quan an toàn</h1><p>Tổng hợp nguy cơ, lịch kiểm tra và hành động cần theo dõi tại công trường.</p></div><button class="btn btn-primary" data-action="new-risk">＋ Ghi nhận nguy cơ</button></div>
   <div class="data-caption">Riverside – Khối A · Dữ liệu demo lưu trên trình duyệt · Luôn xác minh tại hiện trường.</div>
   <div class="dashboard-filters safety-filter-row"><label>Tìm kiếm<input id="dashboardSearch" type="search" value="${esc(safetyDashboardSearchTerm)}" placeholder="Mã, nội dung hoặc người phụ trách"></label><label>Công trường<select aria-label="Công trường"><option>Riverside – Khối A</option></select></label><label>Bộ lọc<select id="dashboardFilter"><option value="all" ${safetyDashboardFilter==='all'?'selected':''}>Tất cả nguy cơ đang mở</option><option value="high" ${safetyDashboardFilter==='high'?'selected':''}>Ưu tiên cao</option><option value="pending" ${safetyDashboardFilter==='pending'?'selected':''}>Chờ xác nhận</option></select></label></div>
   <div class="figma-stats safety-dashboard-stats">
    <article class="figma-stat"><span>Nguy cơ đang mở</span><strong>${openRisks.length}</strong><small>Chưa khắc phục hoặc lưu trữ</small></article>
    <article class="figma-stat"><span>Ưu tiên cao</span><strong>${high.length}</strong><small>Cần đánh giá tại hiện trường</small></article>
    <article class="figma-stat"><span>Hành động quá hạn</span><strong>${overdue.length}</strong><small>So với ngày ${esc(today)}</small></article>
    <article class="figma-stat"><span>Chờ xác nhận</span><strong>${pending.length}</strong><small>Nguy cơ mới ghi nhận</small></article>
   </div>
   ${overdue.length?`<div class="figma-alert"><strong>⚠ ${overdue.length} hành động đã quá hạn</strong><p>${overdue.slice(0,3).map(x=>`${esc(x.id)} · ${esc(x.title)} · hạn ${esc(x.due)}`).join('<br>')}</p><button class="text-btn" data-page="risks">Mở danh sách nguy cơ để xử lý →</button></div>`:''}
   <div class="safety-grid safety-dashboard-panels">
    <section class="figma-card"><div class="figma-card-head"><div><h2>Nguy cơ theo khu vực</h2><p>Số nguy cơ đang mở trong từng khu vực</p></div></div>${zones.length?zones.map(({zone,count})=>`<div class="safety-zone-row"><div><strong>${esc(zone.name)}</strong><small>${esc(zone.type)}</small></div><span class="fg-pill ${zone.risk==='Cao'?'fg-red':zone.risk==='Trung bình'?'fg-yellow':''}">${count} nguy cơ</span></div>`).join(''):'<div class="safety-ai-empty">Chưa có nguy cơ đang mở.</div>'}</section>
    <section class="figma-card"><div class="figma-card-head"><div><h2>Lịch kiểm tra cần theo dõi</h2><p>Các lịch chưa hoàn thành</p></div><button class="text-btn" data-page="inspections">Xem lịch →</button></div>${inspections.length?inspections.map(x=>`<div class="safety-action-row"><div><strong>${esc(x.id)} · ${esc(x.title)}</strong><small>${esc(x.date)} · ${esc(x.time)} · ${esc(x.assignee)}</small></div>${badge(x.status)}</div>`).join(''):'<p>Không có lịch kiểm tra đang mở.</p>'}</section>
   </div>
   <section class="figma-card"><div class="figma-card-head"><div><h2>Nguy cơ cần theo dõi</h2><p>${filtered.length} nguy cơ phù hợp · chọn một nguy cơ để xem xét.</p></div><button class="btn btn-light btn-sm" data-page="risks">Mở màn hình chi tiết</button></div><div class="table-wrap"><table><thead><tr><th>Mã / Nguy cơ</th><th>Khu vực</th><th>Mức độ</th><th>Trạng thái</th><th>Người phụ trách</th><th>Thao tác</th></tr></thead><tbody>${filtered.map(x=>`<tr><td><strong>${esc(x.title)}</strong><div class="subcell">${esc(x.id)} · ${esc(x.date)}</div></td><td>${esc(x.zone)}</td><td>${badge(x.level)}</td><td>${badge(x.status)}</td><td>${esc(x.owner)}</td><td><button class="text-btn" data-safety-action="open-risk" data-risk-id="${esc(x.id)}">Xem / duyệt</button></td></tr>`).join('')||'<tr><td colspan="6">Không có nguy cơ phù hợp với bộ lọc.</td></tr>'}</tbody></table></div></section>
   <div class="figma-footnote">SiteSafe · Bản mô phỏng phục vụ học tập. Không dùng dữ liệu demo thay cho quyết định an toàn thực tế.</div>
 </div>`;
}


/* ===== Shared renderer: risks.js ===== */
/* SiteSafe · Giao diện riêng: risks */
function risksPage(){let list=db.risks.filter(x=>(`${x.id} ${x.title} ${x.zone} ${x.owner}`.toLowerCase().includes(searchTerm.toLowerCase()))&&(activeFilter==='Tất cả'||x.status===activeFilter||x.level===activeFilter));return `${heading('Nguy cơ / sự cố','Ghi nhận, phân loại, phân công và theo dõi vòng đời xử lý nguy cơ.',btn('+ Ghi nhận nguy cơ','new-risk'))}<section class="panel">${toolbar('Tìm theo mã, tên nguy cơ, khu vực…',['Mới ghi nhận','Đang xử lý','Đã khắc phục','Cao','Trung bình','Thấp'],'Xuất CSV','export-risks')}<div id="tableRegion">${riskTable(list)}</div><div class="footer-note">Vòng đời: Mới ghi nhận → Đang xử lý → Đã khắc phục / Lưu trữ. Xóa dữ liệu nguy cơ được mô phỏng bằng lưu trữ.</div></section>`}


/* ===== Shared renderer: inspections.js ===== */
/* SiteSafe · Giao diện riêng: inspections */
function inspectionsPage(){let list=db.inspections.filter(x=>(`${x.id} ${x.title} ${x.zone} ${x.assignee}`.toLowerCase().includes(searchTerm.toLowerCase()))&&(activeFilter==='Tất cả'||x.status===activeFilter));const next=list.find(x=>x.status==='Đang thực hiện')||list[0];return `<div class="field-reference-page">${heading('Lịch kiểm tra','Lập lịch, theo dõi kết quả và ghi lý do khi đổi lịch hoặc checklist.',btn('+ Lên lịch kiểm tra','new-inspection'))}<div class="data-caption">Dữ liệu minh họa · Riverside – Khối A · Mọi thay đổi được lưu cục bộ.</div><div class="dashboard-filters"><label>Tìm kiếm<input id="searchInput" type="search" class="field-control" placeholder="Mã, khu vực hoặc người kiểm tra…" value="${esc(searchTerm)}"></label><label>Công trường<select class="field-control"><option>Riverside – Khối A</option></select></label><label>Trạng thái<select id="statusFilter" class="field-control">${['Tất cả','Đã lên lịch','Đang thực hiện','Hoàn thành'].map(x=>`<option ${activeFilter===x?'selected':''}>${x}</option>`).join('')}</select></label></div><section class="figma-card"><div class="figma-card-head"><h2>Các cuộc kiểm tra</h2><button class="text-btn" data-action="export-inspections">Xuất CSV</button></div><div class="table-wrap"><table><thead><tr><th>Mã / Khu vực</th><th>Người kiểm tra</th><th>Thời gian</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>${list.map(x=>`<tr><td><div class="cell-title">${esc(x.id)} · ${esc(x.zone)}</div><div class="subcell">${esc(x.title)}</div></td><td>${esc(x.assignee)}</td><td>${esc(x.date)} · ${esc(x.time)}</td><td>${badge(x.status)}</td><td><div class="actions-cell"><button class="text-btn" data-action="edit-inspection" data-id="${x.id}">Sửa</button><button class="text-btn" data-action="advance-inspection" data-id="${x.id}">Cập nhật</button></div></td></tr>`).join('')||`<tr><td colspan="5">${empty('Không có lịch kiểm tra','Hãy tạo lịch mới hoặc đổi bộ lọc.')}</td></tr>`}</tbody></table></div></section><div class="two-col"><section class="figma-card"><h2>${next?`${esc(next.id)} · Kết quả kiểm tra`: 'Kết quả kiểm tra'}</h2><p>${next?`${esc(next.zone)} · ${esc(next.assignee)} · ${esc(next.date)} ${esc(next.time)}`:'Chọn lịch kiểm tra để xem kết quả.'}</p>${next?`<div class="notice">Ghi chú: ${esc(next.note)}. Kết quả chỉ được xác nhận sau khi kiểm tra tại hiện trường.</div><button class="btn btn-primary btn-sm" data-action="advance-inspection" data-id="${next.id}">Cập nhật trạng thái</button>`:''}</section><section class="figma-card"><h2>Lịch tuần</h2><div class="inspection-week-list">${list.map(x=>`<p><strong>${esc(x.date)} · ${esc(x.time)}</strong> · ${esc(x.id)} · ${esc(x.zone)} · ${esc(x.assignee)}</p>`).join('')||'<p>Không có lịch trong bộ lọc hiện tại.</p>'}</div><small>Đổi lịch cần ghi lý do; lịch bị hủy vẫn được lưu trong lịch sử.</small></section></div><p class="reference-foot">safety-inspections.html · Quyền thao tác theo vai trò được gán.</p></div>`}


/* ===== Shared renderer: actions.js ===== */
/* SiteSafe · Giao diện riêng: actions */
function actionsPage(){let list=db.actions.filter(x=>(`${x.id} ${x.title} ${x.owner} ${x.risk}`.toLowerCase().includes(searchTerm.toLowerCase()))&&(activeFilter==='Tất cả'||x.status===activeFilter||x.priority===activeFilter));return `${heading('Hành động khắc phục','Theo dõi biện pháp, người chịu trách nhiệm, hạn hoàn thành và trạng thái.',btn('+ Tạo hành động','new-action'))}<section class="panel">${toolbar('Tìm hành động hoặc mã nguy cơ…',['Chưa thực hiện','Đang thực hiện','Hoàn thành','Cao','Trung bình'],'Xuất CSV','export-actions')}<div class="table-wrap"><table><thead><tr><th>Mã / Hành động</th><th>Nguy cơ liên quan</th><th>Người phụ trách</th><th>Hạn hoàn thành</th><th>Ưu tiên</th><th>Trạng thái</th><th></th></tr></thead><tbody>${list.map(x=>`<tr><td><div class="cell-title">${esc(x.title)}</div><div class="subcell">${esc(x.id)}</div></td><td>${esc(x.risk)}</td><td>${esc(x.owner)}</td><td>${esc(x.due)}</td><td>${badge(x.priority)}</td><td>${badge(x.status)}</td><td><div class="actions-cell"><button class="text-btn" data-action="edit-action" data-id="${x.id}">Sửa</button><button class="text-btn" data-action="advance-action" data-id="${x.id}">Tiến độ</button></div></td></tr>`).join('')||`<tr><td colspan="7">${empty('Không có hành động phù hợp','Thử thay đổi bộ lọc.')}</td></tr>`}</tbody></table></div></section>`}


/* ===== Shared renderer: zones.js ===== */
/* SiteSafe · Giao diện riêng: zones */
function zonesPage(){if(currentRole==='admin')return adminZonesPage();return `${heading(currentRole==='manager'?'Bản đồ rủi ro':'Khu vực công trường','Theo dõi loại công việc, số người làm việc và mức độ rủi ro theo khu vực.', '')}<div class="zone-grid">${db.zones.filter(x=>(`${x.id} ${x.name} ${x.type}`.toLowerCase().includes(searchTerm.toLowerCase()))&&(activeFilter==='Tất cả'||x.risk===activeFilter)).map(x=>`<article class="zone-card"><div class="panel-head"><span class="badge blue">${esc(x.id)}</span>${badge(x.risk)}</div><h3>${esc(x.name)}</h3><p>${esc(x.type)}</p><div class="progress"><span style="width:${x.risk==='Cao'?88:x.risk==='Trung bình'?58:28}%"></span></div><div class="stat-top"><span>${x.workers} người đang làm</span>${badge(x.status)}</div><p>${esc(x.note)}</p><button class="btn btn-light btn-sm" data-action="view-zone" data-id="${x.id}">Xem chi tiết</button></article>`).join('')}</div><section class="content-card" style="margin-top:18px"><h2>Gợi ý ưu tiên từ dữ liệu hiện có</h2><p>Khu vực có mức rủi ro cao nên được kiểm tra trước. Đề xuất này là quy tắc minh họa dựa trên trường “Mức độ”, không thay thế đánh giá của cán bộ an toàn.</p>${btn('Phân tích điểm nóng bằng AI','ai-hotspot','light')}</section>`}


/* ===== Shared renderer: reports.js ===== */
/* SiteSafe · Giao diện riêng: reports */
function reportsPage(){const high=db.risks.filter(x=>x.level==='Cao'&&x.status!=='Đã khắc phục').length,done=db.risks.filter(x=>x.status==='Đã khắc phục').length,open=db.actions.filter(x=>x.status!=='Hoàn thành').length;return `${heading('Báo cáo an toàn','Tổng hợp số liệu mô phỏng, nhận diện điểm cần chú ý và xuất CSV.',btn('Xuất báo cáo CSV','export-all'))}<div class="stats-grid">${stat('Tổng nguy cơ',db.risks.length,'Toàn bộ bản ghi hiện có','⚠')}${stat('Nguy cơ mức cao',high,'Chưa khắc phục','!')}${stat('Đã khắc phục',done,'Nguy cơ đã đóng','✓')}${stat('Việc còn mở',open,'Hành động chưa hoàn thành','☷')}</div><div class="two-col"><section class="content-card"><h2>Tình trạng nguy cơ</h2><p>Tỷ lệ trạng thái trong dữ liệu hiện tại</p><div class="report-bars">${[['Mới ghi nhận',db.risks.filter(x=>x.status==='Mới ghi nhận').length,'#d93645'],['Đang xử lý',db.risks.filter(x=>x.status==='Đang xử lý').length,'#b96a00'],['Đã khắc phục',done,'#18865b']].map(([n,v])=>`<div class="report-row"><span>${n}</span><div class="progress"><span style="width:${db.risks.length?v/db.risks.length*100:0}%;background:${v===done?'#18865b':v?'#1769e0':'#dfe6f0'}"></span></div><strong>${v}</strong></div>`).join('')}</div></section><section class="content-card"><h2>Gợi ý cải thiện</h2><p>Đưa ra quyết định cuối cùng dựa trên kiểm tra thực địa và quy trình của đơn vị.</p><div class="notice">${high?`Có ${high} nguy cơ mức cao chưa khắc phục. Nên kiểm tra biện pháp cô lập khu vực và thời hạn xử lý.`:'Không có nguy cơ mức cao chưa khắc phục trong dữ liệu hiện tại.'}</div>${btn('Tạo báo cáo tóm tắt bằng AI','ai-report')}</section></div><div class="footer-note">Các con số chỉ phản ánh dữ liệu demo trong trình duyệt. Không dùng làm báo cáo an toàn thực tế.</div>`}


/* ===== Shared renderer: checklists.js ===== */
/* SiteSafe · Giao diện riêng: checklists */
function checklistsPage(){if(currentRole==='admin')return adminChecklistsPage();return `${heading('Mẫu checklist','Quản lý mẫu kiểm tra, trạng thái sử dụng và danh sách hạng mục.',btn('+ Tạo mẫu checklist','new-checklist'))}<section class="panel">${toolbar('Tìm tên mẫu hoặc nhóm…',['Đang sử dụng','Bản nháp'],'Xuất CSV','export-checklists')}<div class="table-wrap"><table><thead><tr><th>Mã / Tên mẫu</th><th>Nhóm</th><th>Số hạng mục</th><th>Cập nhật</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>${db.checklists.filter(x=>(`${x.id} ${x.title} ${x.category}`.toLowerCase().includes(searchTerm.toLowerCase()))&&(activeFilter==='Tất cả'||x.status===activeFilter)).map(x=>`<tr><td><div class="cell-title">${esc(x.title)}</div><div class="subcell">${esc(x.id)}</div></td><td>${esc(x.category)}</td><td>${x.items}</td><td>${esc(x.updated)}</td><td>${badge(x.status)}</td><td><div class="actions-cell"><button class="text-btn" data-action="edit-checklist" data-id="${x.id}">Sửa</button><button class="text-btn" data-action="toggle-checklist" data-id="${x.id}">${x.status==='Đang sử dụng'?'Lưu trữ':'Kích hoạt'}</button></div></td></tr>`).join('')||`<tr><td colspan="6">${empty('Chưa có mẫu checklist','Tạo mẫu để bắt đầu.')}</td></tr>`}</tbody></table></div></section>`}


/* ===== Shared renderer: users.js ===== */
/* SiteSafe · Giao diện riêng: users */
function usersPage(){if(currentRole==='admin')return adminUsersPage();return `${heading('Quản lý người dùng','Quản lý hồ sơ demo, vai trò và trạng thái truy cập trong nguyên mẫu.',btn('+ Thêm người dùng','new-user'))}<section class="panel">${toolbar('Tìm tên hoặc email…',['Đang hoạt động','Đã khóa'],'Xuất CSV','export-users')}<div class="table-wrap"><table><thead><tr><th>Người dùng</th><th>Email</th><th>Vai trò</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>${db.users.filter(x=>(`${x.name} ${x.email} ${x.role}`.toLowerCase().includes(searchTerm.toLowerCase()))&&(activeFilter==='Tất cả'||x.status===activeFilter)).map(x=>`<tr><td><div class="cell-title">${esc(x.name)}</div><div class="subcell">${esc(x.id)}</div></td><td>${esc(x.email)}</td><td>${esc(x.role)}</td><td>${badge(x.status)}</td><td><div class="actions-cell"><button class="text-btn" data-action="edit-user" data-id="${x.id}">Sửa</button><button class="text-btn" data-action="toggle-user" data-id="${x.id}">${x.status==='Đang hoạt động'?'Khóa':'Mở khóa'}</button></div></td></tr>`).join('')||`<tr><td colspan="5">${empty('Không tìm thấy người dùng','Đổi từ khóa tìm kiếm.')}</td></tr>`}</tbody></table></div></section>`}


/* ===== Shared renderer: sites.js ===== */
/* SiteSafe · Giao diện riêng: sites */
function adminSitesPage(){
  const list=db.sites.filter(x=>(`${x.id} ${x.name} ${x.manager}`.toLowerCase().includes(searchTerm.toLowerCase()))&&(activeFilter==='Tất cả'||x.status===activeFilter));
  return `<div class="admin-reference">
    <div class="crumb">Quản trị viên / Công trường</div>
    <div class="figma-page-title"><div><h1>Công trường</h1><p>Danh mục dự án và phạm vi vận hành · Tên tệp đề xuất bổ sung.</p></div>${btn('+ Tạo công trường','new-site')}</div>
    <div class="data-caption">Dữ liệu minh họa · 03/10/2026 · Không phải số liệu thực tế</div>
    <div class="dashboard-filters admin-filters"><label>Tìm kiếm<input id="searchInput" placeholder="Mã, nội dung hoặc người phụ trách" value="${esc(searchTerm)}"></label><label>Công trường<select><option>Riverside – Khối A</option></select></label><label>Bộ lọc<select id="statusFilter">${['Tất cả','Đang hoạt động','Tạm dừng','Lưu trữ'].map(x=>`<option ${activeFilter===x?'selected':''}>${x}</option>`).join('')}</select></label></div>
    <div class="admin-site-grid">${list.slice(0,2).map(x=>`<article class="figma-card admin-site-card"><h2>${esc(x.name)}</h2><p>${esc(x.id)} · Địa chỉ minh họa: ${esc(x.address)}</p><div class="admin-status">${badge(x.status)}</div><p>Quản lý: ${esc(x.manager)} · ${x.startDate}–${x.endDate} / ${x.zones} khu vực ${x.status==='Tạm dừng'?'· tạm dừng thi công':''}</p><div class="admin-form-actions"><button class="btn btn-primary btn-sm" data-action="edit-site" data-id="${esc(x.id)}">Chỉnh sửa</button><button class="btn btn-light btn-sm" data-action="view-site-zones" data-id="${esc(x.id)}">Xem khu vực</button>${x.status==='Đang hoạt động'?`<button class="btn btn-light btn-sm" data-action="toggle-site" data-id="${esc(x.id)}">Tạm dừng</button>`:`<button class="btn btn-light btn-sm" data-action="toggle-site" data-id="${esc(x.id)}">Kích hoạt lại</button>`}</div></article>`).join('')}</div>
    <section class="figma-card admin-table-card"><h2>Danh mục công trường</h2><div class="table-wrap"><table><thead><tr><th>Mã / tên</th><th>Quản lý</th><th>Khu vực</th><th>Trạng thái</th></tr></thead><tbody>${list.map(x=>`<tr><td><button class="admin-link" data-action="edit-site" data-id="${esc(x.id)}">${esc(x.id)} · ${esc(x.name)}</button></td><td>${esc(x.manager)}</td><td>${x.zones} đang hoạt động</td><td>${esc(x.status)}</td></tr>`).join('')}</tbody></table></div></section>
    <section class="figma-card"><h2>Mẫu ngắn tạo / chỉnh sửa</h2><form id="adminSiteForm"><div class="admin-form-grid"><div class="form-field"><label>Mã công trường *</label><input value="RS-A" disabled></div><div class="form-field"><label>Tên *</label><input name="name" value="${esc(db.sites[0]?.name||'')}" required></div><div class="form-field admin-span-all"><label>Địa chỉ *</label><input name="address" value="${esc(db.sites[0]?.address||'')}" required></div><div class="form-field"><label>Ngày bắt đầu *</label><input name="startDate" type="date" value="${esc(db.sites[0]?.startDate||'')}" required></div><div class="form-field"><label>Ngày kết thúc dự kiến *</label><input name="endDate" type="date" value="${esc(db.sites[0]?.endDate||'')}" required></div><div class="form-field"><label>Quản lý *</label><input name="manager" value="${esc(db.sites[0]?.manager||'')}" required></div><div class="form-field"><label>Trạng thái *</label><select name="status">${['Đang hoạt động','Tạm dừng','Lưu trữ'].map(x=>`<option ${db.sites[0]?.status===x?'selected':''}>${x}</option>`).join('')}</select></div></div><div class="admin-form-actions"><button class="btn btn-primary btn-sm" type="submit">Lưu công trường</button><button class="btn btn-light btn-sm" type="reset">Hủy</button></div></form></section>
    <section class="figma-card"><h2>Xác nhận lưu trữ công trường</h2><div class="admin-warning">Lưu trữ không xóa bằng chứng<br>Không thể kiểm tra hay nguy cơ mới; dữ liệu lịch sử vẫn được giữ lại.</div><div class="form-field"><label>Lý do *</label><input value="Kết thúc công trường phụ trợ; đã xác nhận hết việc mở."></div><div class="admin-form-actions"><button class="btn btn-primary btn-sm" data-action="archive-site" data-id="${esc(db.sites[0]?.id||'')}">Xác nhận lưu trữ</button><button class="btn btn-light btn-sm" data-action="activate-site" data-id="${esc(db.sites[0]?.id||'')}">Hủy</button></div></section>
    <p class="reference-foot">admin-site-management.html · Quyền thao tác theo vai trò được gán. Mọi thay đổi ghi lịch sử và minh chứng.</p>
  </div>`;
}


/* ===== Shared renderer: ai.js ===== */
/* SiteSafe · Giao diện riêng: ai */
function aiPage(){return `${heading('Trợ lý AI an toàn','Ba luồng AI mô phỏng: phân loại nguy cơ, sinh checklist và phân tích điểm nóng. Kết quả cần được con người kiểm tra.', '')}<div class="notice">Đây là mô phỏng trải nghiệm AI bằng quy tắc cục bộ, không gọi mô hình AI hoặc API bên ngoài. Không tải thông tin nhạy cảm lên nguyên mẫu.</div><div class="ai-grid"><article class="ai-card"><div class="stat-icon">⚠</div><h3>1. Phân loại nguy cơ</h3><p>Đề xuất mức độ, nhóm nguy cơ và biện pháp ban đầu từ mô tả hiện trường.</p>${btn('Bắt đầu phân loại','ai-classify','light')}</article><article class="ai-card"><div class="stat-icon">☑</div><h3>2. Sinh checklist</h3><p>Tạo danh sách kiểm tra theo công việc, khu vực và mức rủi ro.</p>${btn('Tạo checklist','ai-checklist','light')}</article><article class="ai-card"><div class="stat-icon">⌖</div><h3>3. Điểm nóng rủi ro</h3><p>Tóm tắt khu vực cần ưu tiên từ các nguy cơ đang mở.</p>${btn('Phân tích khu vực','ai-hotspot','light')}</article></div><section class="content-card" id="aiWorkspace" style="margin-top:18px"><h2>Không gian làm việc AI</h2><p>Chọn một luồng ở trên. Mỗi luồng có nhập liệu, kiểm tra hợp lệ, trạng thái xử lý, kết quả giải thích và thao tác chấp nhận / chỉnh sửa / từ chối / tạo lại.</p>${empty('Chưa có yêu cầu AI','Chọn một trong ba chức năng để bắt đầu.')}</section>`}

let safetySelectedRiskId='RS-024';
let safetyInspectionSearchTerm='';
let safetyInspectionStatus='Tất cả';
let safetyDashboardSearchTerm='';
let safetyDashboardFilter='all';
const safetyEvidencePreviews={};

function safetyRisksPage(){
 const risks=db.risks.filter(x=>`${x.id} ${x.title} ${x.zone} ${x.owner}`.toLowerCase().includes(searchTerm.toLowerCase()));
 const selected=risks.find(x=>x.id===safetySelectedRiskId)||risks[0];
 if(!selected)return `<div class="safety-page safety-risk-page">${heading('Chi tiết nguy cơ','Xác minh hiện trường, ghi nhận quyết định và theo dõi biện pháp khắc phục.',btn('＋ Ghi nhận nguy cơ','new-risk'))}<section class="figma-card">${empty('Không tìm thấy nguy cơ','Hãy đổi từ khóa tìm kiếm hoặc ghi nhận nguy cơ mới.')}</section></div>`;
 safetySelectedRiskId=selected.id;
 const related=db.actions.filter(x=>x.risk===selected.id||x.risk===selected.title);
 const history=selected.history||[];
 return `<div class="safety-page safety-risk-page">
  <div class="crumb">Cán bộ an toàn / Chi tiết nguy cơ</div>
  <div class="figma-page-title"><div><h1>Chi tiết nguy cơ</h1><p>Xác minh hiện trường, ghi nhận quyết định và theo dõi biện pháp khắc phục.</p></div><button class="btn btn-primary" type="submit" form="safetyDecisionForm">Lưu quyết định</button></div>
  <div class="data-caption">Dữ liệu minh họa · Riverside – Khối A · Quyết định cần được xác minh tại hiện trường.</div>
  <div class="dashboard-filters safety-filter-row"><label>Tìm kiếm<input id="safetyRiskSearch" type="search" value="${esc(searchTerm)}" placeholder="Mã, nội dung hoặc người phụ trách"></label><label>Chọn nguy cơ<select id="safetyRiskSelect">${risks.map(x=>`<option value="${esc(x.id)}" ${x.id===selected.id?'selected':''}>${esc(x.id)} · ${esc(x.title)}</option>`).join('')}</select></label></div>
  <section class="figma-card safety-risk-summary"><div><div class="safety-kicker">${esc(selected.id)} · ${esc(selected.zone)} · Ghi nhận ${esc(selected.date)}</div><h2>${esc(selected.title)}</h2><div class="safety-badges">${badge(selected.level)} ${badge(selected.status)}</div><p>${esc(selected.desc)}</p><p class="safety-subline">Người báo cáo: ${esc(selected.owner)} · Khu vực: ${esc(selected.zone)}</p></div><button class="btn btn-light btn-sm" data-action="edit-risk" data-id="${esc(selected.id)}">Sửa thông tin</button></section>
  <div class="safety-grid safety-evidence-grid">
   <section class="figma-card"><div class="figma-card-head"><div><h2>Minh chứng hiện trường</h2><p>Ảnh và ghi chú được cung cấp kèm báo cáo</p></div></div>${selected.evidence?.length?selected.evidence.map(item=>`<div class="safety-evidence-item"><strong>${esc(item.note)}</strong><small>${esc(item.date)}</small></div>`).join(''):''}${(safetyEvidencePreviews[selected.id]||[]).length?`<div class="safety-evidence-grid">${safetyEvidencePreviews[selected.id].map(file=>file.type.startsWith('image/')?`<figure class="safety-evidence-preview"><img src="${esc(file.url)}" alt="Minh chứng ${esc(file.name)}"><figcaption>${esc(file.name)}</figcaption></figure>`:`<div class="safety-evidence-item"><strong>${esc(file.name)}</strong><small>Tệp đã chọn · chỉ lưu trong phiên trình duyệt</small></div>`).join('')}</div>`:''}<label class="safety-upload"><span>＋ Thêm ảnh hoặc tệp minh chứng</span><small>Chỉ xem trước cục bộ; tệp không tải lên máy chủ hoặc lưu vào dữ liệu demo.</small><input id="safetyEvidenceFiles" type="file" accept="image/*,.pdf" multiple></label>${selected.evidence?.length||(safetyEvidencePreviews[selected.id]||[]).length?'':'<div class="safety-empty-evidence">Chưa có minh chứng cho nguy cơ này. Chọn ảnh/tệp để xem trước tại phiên hiện tại.</div>'}<p class="safety-caption">Không suy diễn mức độ nguy hiểm chỉ từ ảnh; cần kiểm tra thực tế tại khu vực.</p></section>
   <section class="figma-card"><h2>Thông tin xác minh</h2><dl class="safety-facts"><div><dt>Nhóm nguy cơ</dt><dd>${esc(selected.category||'Chưa xác nhận')}</dd></div><div><dt>Mức ưu tiên</dt><dd>${badge(selected.level)}</dd></div><div><dt>Trạng thái</dt><dd>${badge(selected.status)}</dd></div><div><dt>Người phụ trách</dt><dd>${esc(selected.owner)}</dd></div></dl><div class="fg-note">Đề xuất chỉ hỗ trợ tham khảo. Cán bộ an toàn cần kiểm tra tại chỗ trước khi xác nhận biện pháp.</div><button class="btn btn-light btn-sm" data-page="ai">Phân tích bằng AI</button></section>
  </div>
  <section class="figma-card"><div class="figma-card-head"><div><h2>Đánh giá và phân công</h2><p>Ghi rõ quyết định, người chịu trách nhiệm và thời hạn.</p></div></div>
   <form id="safetyDecisionForm" data-risk-id="${esc(selected.id)}">
    <div class="safety-grid"><fieldset class="safety-radio-group"><legend>Quyết định *</legend><label><input type="radio" name="decision" value="Xác nhận" required> Xác nhận</label><label><input type="radio" name="decision" value="Cần bổ sung"> Cần bổ sung</label><label><input type="radio" name="decision" value="Từ chối"> Từ chối</label></fieldset><label class="safety-form-field">Ghi chú / lý do *<textarea name="note" required minlength="5" placeholder="Nêu căn cứ xác minh và yêu cầu tiếp theo">${esc(selected.decisionNote||'')}</textarea></label><label class="safety-form-field">Người phụ trách<select name="owner">${db.users.filter(x=>x.status==='Đang hoạt động').map(x=>`<option ${x.name===selected.owner?'selected':''}>${esc(x.name)}</option>`).join('')}</select></label><label class="safety-form-field">Hạn hoàn thành<input name="due" type="datetime-local" value="${esc(selected.due||'2026-10-21T17:00')}"></label></div>
    <div class="fg-actions"><button class="btn btn-primary" type="submit">Xác nhận và giao hành động</button><button class="btn btn-light" type="button" data-safety-action="risk-request-info">Yêu cầu bổ sung</button><button class="btn btn-light" type="button" data-safety-action="risk-reject">Từ chối có lý do</button></div>
   </form>
  </section>
  <div class="safety-grid">
   <section class="figma-card"><div class="figma-card-head"><div><h2>Hành động khắc phục</h2><p>${related.length} hành động liên quan</p></div></div>${related.length?related.map(x=>`<div class="safety-action-row"><div><strong>${esc(x.id)} · ${esc(x.title)}</strong><small>Người phụ trách: ${esc(x.owner)} · Hạn ${esc(x.due)}</small></div>${badge(x.status)}</div>`).join(''):'<p>Chưa có hành động khắc phục được liên kết.</p>'}<form id="safetyActionForm" data-risk-id="${esc(selected.id)}" class="safety-inline-form"><h3>Giao hành động mới</h3><label class="safety-form-field">Biện pháp *<input name="title" required minlength="5" placeholder="Mô tả biện pháp khắc phục"></label><div class="safety-grid"><label class="safety-form-field">Người phụ trách<select name="owner">${db.users.filter(x=>x.status==='Đang hoạt động').map(x=>`<option>${esc(x.name)}</option>`).join('')}</select></label><label class="safety-form-field">Hạn hoàn thành<input name="due" type="date" required value="2026-10-21"></label></div><button class="btn btn-primary btn-sm" type="submit">Giao hành động</button></form></section>
   <section class="figma-card"><h2>Lịch sử đầy đủ</h2>${history.length?`<ol class="safety-history">${history.map(item=>`<li><small>${esc(item.date)}</small><strong>${esc(item.title)}</strong><span>${esc(item.note)}</span></li>`).join('')}</ol>`:`<p class="safety-history-empty">Chưa có quyết định mới trong phiên demo.</p>`}</section>
  </div>
 </div>`;
}

function safetyInspectionsPage(){
 const list=db.inspections.filter(x=>`${x.id} ${x.title} ${x.zone} ${x.assignee}`.toLowerCase().includes(safetyInspectionSearchTerm.toLowerCase())&&(safetyInspectionStatus==='Tất cả'||x.status===safetyInspectionStatus));
 const next=list.find(x=>x.status==='Đang thực hiện')||list[0];
 return `<div class="safety-page safety-inspections-page"><div class="crumb">Cán bộ an toàn / Lịch kiểm tra</div><div class="figma-page-title"><div><h1>Lịch kiểm tra</h1><p>Lập lịch, theo dõi kết quả và ghi lý do khi đổi lịch hoặc checklist.</p></div><button class="btn btn-primary" data-action="new-inspection">＋ Lên lịch kiểm tra</button></div>
  <div class="data-caption">Dữ liệu minh họa · Riverside – Khối A · Mọi thay đổi được lưu cục bộ.</div>
  <div class="dashboard-filters safety-filter-row"><label>Tìm kiếm<input id="safetyInspectionSearch" type="search" value="${esc(safetyInspectionSearchTerm)}" placeholder="Mã, khu vực hoặc người kiểm tra"></label><label>Công trường<select><option>Riverside – Khối A</option></select></label><label>Bộ lọc<select id="safetyInspectionStatus">${['Tất cả','Đã lên lịch','Đang thực hiện','Hoàn thành'].map(x=>`<option ${safetyInspectionStatus===x?'selected':''}>${x}</option>`).join('')}</select></label></div>
  <section class="figma-card"><div class="figma-card-head"><h2>Các cuộc kiểm tra</h2><button class="text-btn" data-action="export-inspections">Xuất CSV</button></div><div class="table-wrap"><table><thead><tr><th>Mã / Khu vực</th><th>Người kiểm tra</th><th>Thời gian</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>${list.map(x=>`<tr><td><div class="cell-title">${esc(x.id)} · ${esc(x.zone)}</div><div class="subcell">${esc(x.title)}</div></td><td>${esc(x.assignee)}</td><td>${esc(x.date)} · ${esc(x.time)}</td><td>${badge(x.status)}</td><td><div class="actions-cell"><button class="text-btn" data-action="advance-inspection" data-id="${esc(x.id)}">Cập nhật</button><button class="text-btn" data-action="edit-inspection" data-id="${esc(x.id)}">Sửa</button></div></td></tr>`).join('')||`<tr><td colspan="5">${empty('Không có lịch kiểm tra','Hãy tạo lịch mới hoặc đổi bộ lọc.')}</td></tr>`}</tbody></table></div></section>
  <div class="safety-grid"><section class="figma-card"><h2>${next?`${esc(next.id)} · Kết quả kiểm tra`:'Kết quả kiểm tra'}</h2>${next?`<p>${esc(next.zone)} · ${esc(next.assignee)} · ${esc(next.date)} · ${esc(next.time)}</p><div class="fg-note">${esc(next.note)}. Chỉ xác nhận kết quả sau khi kiểm tra tại hiện trường.</div><button class="btn btn-primary btn-sm" data-action="advance-inspection" data-id="${esc(next.id)}">Cập nhật trạng thái</button>`:'<p>Chọn một lịch để xem kết quả.</p>'}</section><section class="figma-card"><h2>Lịch tuần · 18–24/10</h2><div class="inspection-week-list">${list.map(x=>`<p><strong>${esc(x.date)} · ${esc(x.time)}</strong> · ${esc(x.id)} · ${esc(x.zone)} · ${esc(x.assignee)}</p>`).join('')||'<p>Không có lịch trong bộ lọc hiện tại.</p>'}</div><small>Lịch tuần là dữ liệu demo; đổi lịch cần lưu lý do trong lịch sử.</small></section></div>
  <section class="figma-card"><h2>Lên lịch kiểm tra</h2><p>Tạo lịch mới gắn với khu vực, checklist và người thực hiện.</p><form id="safetyInspectionForm"><div class="safety-grid"><label class="safety-form-field">Khu vực *<select name="zone" required>${db.zones.map(x=>`<option>${esc(x.name)}</option>`).join('')}</select></label><label class="safety-form-field">Mẫu checklist *<select name="checklist" required>${db.checklists.filter(x=>x.status==='Đang sử dụng').map(x=>`<option>${esc(x.title)}</option>`).join('')}</select></label><label class="safety-form-field">Người kiểm tra *<select name="assignee" required>${db.users.filter(x=>x.status==='Đang hoạt động').map(x=>`<option>${esc(x.name)}</option>`).join('')}</select></label><label class="safety-form-field">Thời gian *<input type="datetime-local" name="scheduledAt" required value="2026-10-22T08:00"></label><label class="safety-form-field safety-field-wide">Ghi chú<input name="note" placeholder="Hạng mục cần tập trung kiểm tra"></label></div><div class="fg-actions"><button class="btn btn-primary" type="submit">Lưu lịch</button><button class="btn btn-light" type="reset">Hủy</button></div></form></section>
  <p class="reference-foot">Lịch kiểm tra được lưu trong dữ liệu demo trên trình duyệt.</p></div>`;
}

function safetyAiPage(){
 const risk=db.risks.find(x=>x.id==='RS-024')||db.risks[0];
 return ` <div class="safety-page safety-ai-page"><div class="crumb">Cán bộ an toàn / AI phân loại nguy cơ</div><div class="figma-page-title"><div><h1>AI phân loại nguy cơ</h1><p>Gợi ý mức độ và ưu tiên từ mô tả hiện trường; cán bộ an toàn cần xác minh.</p></div><button class="btn btn-primary" type="submit" form="aiForm">Phân tích nguy cơ</button></div><div class="data-caption">Dữ liệu minh họa · 03/10/2026 · Không phải số liệu thực tế.</div>
  <section class="figma-card"><div class="figma-card-head"><div><h2>1. Chọn báo cáo hoặc nhập quan sát</h2><p>AI chỉ đưa ra gợi ý; cán bộ an toàn phải xác minh.</p></div></div><form id="aiForm" data-kind="classify"><div class="safety-ai-fields"><label class="safety-form-field safety-field-wide">Nguy cơ nguồn<select id="aiSource"><option value="">Nhập quan sát mới</option>${db.risks.map(x=>`<option value="${esc(x.id)}" ${x.id===risk?.id?'selected':''}>${esc(x.id)} · ${esc(x.title)}</option>`).join('')}</select></label><label class="safety-form-field safety-field-wide">Mô tả quan sát *<textarea id="aiDescription" required minlength="12" placeholder="Mô tả hiện trường cần đánh giá">${esc(risk?.desc||'')}</textarea><small>Ít nhất 12 ký tự. Không nhập dữ liệu cá nhân.</small></label><label class="safety-form-field">Khu vực *<select id="aiZone" required>${db.zones.map(x=>`<option ${risk?.zone===x.name?'selected':''}>${esc(x.name)}</option>`).join('')}</select></label><label class="safety-form-field">Người có thể bị ảnh hưởng<input id="aiPeople" value="${esc(risk?.peopleAffected||'')}" placeholder="Ví dụ: Tổ công nhân · 6 người"></label><label class="safety-upload safety-field-wide"><span>Thêm ảnh hoặc kéo thả tệp vào đây</span><small id="aiEvidenceNote">JPG, PNG hoặc PDF · tối đa 5 tệp, mỗi tệp không quá 10 MB · chỉ dùng cục bộ.</small><input id="aiEvidence" type="file" accept="image/*,.pdf" multiple aria-describedby="aiEvidenceNote"></label></div><div class="fg-actions"><button class="btn btn-primary" type="submit">Phân tích nguy cơ</button><button class="btn btn-light" type="button" data-safety-action="ai-manual-input">Nhập thủ công</button></div></form></section>
  <section class="figma-card"><div class="figma-card-head"><div><h2>2. Kết quả gợi ý</h2><p>Gợi ý mô phỏng từ quy tắc cục bộ; không thay thế đánh giá tại hiện trường.</p></div></div><div id="aiOutput"><div class="safety-sample-result"><div class="safety-ai-fields"><label class="safety-form-field">Nhóm đề xuất<input readonly value="Chưa phân tích"></label><label class="safety-form-field">Ưu tiên đề xuất<input readonly value="Chưa xác nhận"></label></div><span class="fg-pill fg-yellow">Mẫu trình bày · chưa chạy phân tích</span><div class="table-wrap"><table><thead><tr><th>Nguồn giá trị</th><th>Mức đã ghi nhận</th><th>Ưu tiên AI</th></tr></thead><tbody><tr><td>Người báo cáo · ${esc(risk?.owner||'Chưa xác định')}</td><td>${esc(risk?.level||'Chưa xác định')}</td><td>Chưa có kết quả</td></tr><tr><td>AI · chưa áp dụng</td><td>Chưa có kết quả</td><td>Chưa có kết quả</td></tr><tr><td>Người duyệt · ${esc(profileData.name)}</td><td>Chưa xác nhận bước này</td><td>Chưa xác nhận</td></tr></tbody></table></div><div class="fg-note">Chưa có đề xuất được tạo. Chạy phân tích rồi kiểm tra tại hiện trường trước khi lưu quyết định.</div><div class="ai-actions"><button class="btn btn-primary" type="button" disabled>Chấp nhận lựa chọn</button><button class="btn btn-light" type="button" disabled>Sửa đề xuất</button><button class="btn btn-light" type="button" disabled>Từ chối</button><button class="btn btn-light" type="button" disabled>Tạo lại</button></div></div></div></section>
  <section class="figma-card"><div class="figma-card-head"><div><h2>3. Vì sao có đề xuất này?</h2><p>Đối chiếu nội dung quan sát với dấu hiệu nguy cơ có trong mô tả.</p></div></div><div class="fg-note">AI chỉ là công cụ tham khảo. Không tự động giao việc, đóng nguy cơ hoặc kết luận an toàn; người có trách nhiệm phải xác minh tại hiện trường.</div><div class="fg-actions"><button class="btn btn-light" data-page="risks">Mở bảng duyệt nguy cơ</button></div></section>
  <p class="reference-foot">AI phân loại nguy cơ · Mô phỏng cục bộ, không gửi dữ liệu ra ngoài.</p></div>`;
}


/* ===== Shared renderer: worker-home.js ===== */
/* SiteSafe · Giao diện riêng: worker-home */
function workerHome(){return `${heading('Tổng quan nhân sự hiện trường','Thông tin ca làm, khu vực phụ trách và việc cần hoàn thành.',btn('Hoàn thành checklist','worker-checklist','light')+btn('Báo cáo nguy cơ','worker-report'))}<div class="stats-grid">${stat('Checklist cần làm',2,'Trước khi bắt đầu công việc','☑')}${stat('Nguy cơ đang mở',db.risks.filter(x=>x.status!=='Đã khắc phục').length,'Trong dữ liệu demo','⚠')}${stat('Báo cáo của tôi',db.risks.filter(x=>x.owner==='Nguyễn Văn Nam').length,'Đã gửi trên hệ thống','▤')}${stat('Khu vực',1,'Khối A · Tầng 4','⌖')}</div><section class="content-card"><h2>Nhắc nhở an toàn đầu ca</h2><p>Kiểm tra trang bị bảo hộ, đọc hướng dẫn công việc và báo ngay nếu phát hiện nguy cơ. Không bắt đầu việc nếu điều kiện an toàn chưa được xác nhận.</p>${btn('Mở checklist','worker-checklist')}</section>`}


/* ===== Shared renderer: worker-checklist.js ===== */
/* SiteSafe · Giao diện riêng: worker-checklist */
function workerChecklist(){return `${heading('Checklist của tôi','Tự kiểm tra điều kiện an toàn trước khi bắt đầu công việc.',btn('Tạo checklist đề xuất','open-worker-ai','light')+btn('Lưu kết quả','save-worker-checklist'))}<section class="content-card"><h2>Checklist làm việc trên cao</h2><p>Khối A · Tầng 4 · Cập nhật theo mẫu demo</p>${['Đã được phổ biến biện pháp an toàn đầu ca','Đã kiểm tra dây đai và điểm neo phù hợp','Khu vực mép sàn có lan can / rào chắn','Lối di chuyển không có vật cản','Dụng cụ được kiểm tra trước khi sử dụng','Biết vị trí liên lạc khi có sự cố'].map((x,i)=>`<div class="check-row"><input type="checkbox" id="check-${i}"><label for="check-${i}">${x}<small>${i===2?'Nếu chưa đạt, dừng việc và báo cán bộ an toàn.':'Đánh dấu sau khi đã kiểm tra thực tế.'}</small></label></div>`).join('')}<div class="notice">Nếu có bất kỳ mục quan trọng nào chưa đạt, không xác nhận hoàn thành; báo người giám sát.</div>${btn('Gửi checklist','save-worker-checklist')}</section>`}


/* ===== Shared renderer: worker-report.js ===== */
/* SiteSafe · Giao diện riêng: worker-report */
function workerReport(){return `${heading('Báo cáo nguy cơ','Gửi mô tả quan sát được để cán bộ an toàn xác minh.', '')}<section class="content-card"><form id="workerReportForm"><div class="form-field"><label for="wr-title">Tên nguy cơ *</label><input id="wr-title" name="title" required minlength="5" placeholder="Ví dụ: Dây điện nằm ngang lối đi"></div><div class="form-grid"><div class="form-field"><label for="wr-zone">Khu vực *</label><select id="wr-zone" name="zone">${db.zones.map(z=>`<option>${esc(z.name)}</option>`).join('')}</select></div><div class="form-field"><label for="wr-level">Mức độ quan sát *</label><select id="wr-level" name="level"><option>Chưa xác định</option><option>Cao</option><option>Trung bình</option><option>Thấp</option></select></div></div><div class="form-field"><label for="wr-desc">Mô tả *</label><textarea id="wr-desc" name="desc" required minlength="10" placeholder="Mô tả vị trí, điều kiện và nguy cơ có thể xảy ra"></textarea></div><div class="notice">Mức độ do người báo cáo chọn chỉ là thông tin ban đầu. Cán bộ an toàn cần xác minh.</div><button class="btn btn-primary" type="submit">Gửi báo cáo</button></form></section>`}


/* ===== Shared renderer: worker-history.js ===== */
/* SiteSafe · Giao diện riêng: worker-history */
function workerHistory(){const list=db.risks.filter(x=>x.owner==='Nguyễn Văn Nam'&&(searchTerm===''||`${x.id} ${x.title} ${x.zone} ${x.owner}`.toLowerCase().includes(searchTerm.toLowerCase()))&&(activeFilter==='Tất cả'||x.status===activeFilter));return `<div class="field-reference-page"><div class="crumb">Nhân sự hiện trường / Nguy cơ của tôi</div><div class="figma-page-title"><div><h1>Nguy cơ của tôi</h1><p>Theo dõi phản hồi và bổ sung minh chứng cho báo cáo của bạn.</p></div>${btn('+ Báo nguy cơ','worker-report')}</div><div class="data-caption">Dữ liệu minh họa · Không phải số liệu an toàn thực tế.</div><div class="dashboard-filters"><label>Tìm kiếm<input id="searchInput" class="field-control" placeholder="Mã, nội dung hoặc người phụ trách" value="${esc(searchTerm)}"></label><label>Công trường<select class="field-control"><option>Riverside – Khối A</option></select></label><label>Bộ lọc<select id="statusFilter" class="field-control">${['Tất cả',...new Set(db.risks.filter(x=>x.owner==='Nguyễn Văn Nam').map(x=>x.status))].map(x=>`<option ${activeFilter===x?'selected':''}>${esc(x)}</option>`).join('')}</select></label></div><p class="reference-count">${list.length} báo cáo phù hợp · Nội dung và minh chứng gốc được giữ nguyên.</p><div class="worker-report-list">${list.map(x=>`<article class="worker-report-card"><div><h2>${esc(x.id)} · ${esc(x.title)}</h2><p>${esc(x.zone)} · ${esc(x.date)} · Người phụ trách: ${esc(x.owner)}</p></div><div class="worker-report-meta">${badge(`Ưu tiên ${x.level}`)} ${badge(x.status)}</div><p>${esc(x.desc)}</p>${x.evidence?.length?`<div class="report-evidence"><strong>Minh chứng bổ sung</strong>${x.evidence.map(item=>`<p>${esc(item.date)} · ${esc(item.note)}</p>`).join('')}</div>`:''}<div class="hazard-actions"><button class="btn btn-primary btn-sm" data-action="view-risk" data-id="${x.id}">Xem chi tiết / lịch sử</button><button class="btn btn-light btn-sm" data-action="worker-evidence" data-id="${x.id}">Bổ sung minh chứng</button></div></article>`).join('')||empty('Chưa có báo cáo phù hợp','Gửi báo cáo nguy cơ hoặc đổi bộ lọc.')}<p class="reference-foot">worker-report-history.html · Thay đổi được lưu trong dữ liệu demo.</p></div>`}


/* ===== Shared renderer: manager-home.js ===== */
/* SiteSafe · Giao diện riêng: manager-home */
function managerHome(){return `${heading('Tổng quan công trường','Tổng hợp nguy cơ, khu vực rủi ro và tiến độ hành động khắc phục.',btn('Xem báo cáo','reports','light'))}<div class="stats-grid">${stat('Khu vực đang thi công',db.zones.filter(x=>x.status==='Đang thi công').length,'Được theo dõi','⌖')}${stat('Nguy cơ mức cao',db.risks.filter(x=>x.level==='Cao'&&x.status!=='Đã khắc phục').length,'Cần ưu tiên','⚠')}${stat('Hành động mở',db.actions.filter(x=>x.status!=='Hoàn thành').length,'Cần theo dõi hạn','✓')}${stat('Lịch kiểm tra',db.inspections.length,'Các lịch hiện có','☷')}</div><div class="two-col"><section class="content-card"><h2>Khu vực ưu tiên</h2><p>Ưu tiên các khu vực có nguy cơ cao và xác nhận tiến độ khắc phục trực tiếp.</p>${db.zones.filter(z=>z.risk==='Cao').map(z=>`<div class="risk-item"><div class="risk-symbol">⌖</div><div><strong>${esc(z.name)}</strong><p>${esc(z.note)}</p></div>${badge(z.risk)}</div>`).join('')}</section><section class="content-card"><h2>Hành động chưa hoàn thành</h2><p>${db.actions.filter(x=>x.status!=='Hoàn thành').map(x=>`<div class="check-row"><span>•</span><div><strong>${esc(x.title)}</strong><small>Hạn: ${esc(x.due)} · ${esc(x.owner)}</small></div></div>`).join('')||'Không có việc mở.'}</p>${btn('Theo dõi hành động','actions','light')}</section></div>`}


/* ===== Shared renderer: admin-home.js ===== */
/* SiteSafe · Giao diện riêng: admin-home */
function adminHome(){return `${heading('Tổng quan hệ thống','Quản lý danh mục, người dùng và cấu hình dữ liệu demo.',btn('Quản lý người dùng','users'))}<div class="stats-grid">${stat('Người dùng',db.users.length,'Các tài khoản mẫu','♙')}${stat('Khu vực',db.zones.length,'Danh mục công trường','⌖')}${stat('Mẫu checklist',db.checklists.length,'Mẫu kiểm tra','☑')}${stat('Thông báo chưa đọc',db.notifications.filter(x=>!x.read).length,'Thông báo mô phỏng','♧')}</div><section class="content-card"><h2>Kiểm soát dữ liệu</h2><p>Dữ liệu lưu cục bộ trên trình duyệt bằng LocalStorage. Đây không phải xác thực thật; không sử dụng thông tin tài khoản thật.</p>${btn('Tải bản sao dữ liệu JSON','backup-json','light')} ${btn('Khôi phục dữ liệu demo','reset-demo','danger')}</section>`}


/* ===== Shared renderer: help.js ===== */
/* SiteSafe · Giao diện riêng: help */
function helpPage(){return `${heading('Trợ giúp & hướng dẫn','Hướng dẫn thao tác và giới hạn của nguyên mẫu.', '')}<section class="content-card"><h2>Luồng xử lý nguy cơ</h2><p>Ghi nhận → phân loại → phân công hành động → kiểm tra lại → xác nhận khắc phục → lưu trữ.</p><h2>Trạng thái giao diện</h2><p>Các danh sách có trạng thái rỗng khi không có dữ liệu phù hợp. Biểu mẫu có validation cơ bản. Dữ liệu được lưu trong LocalStorage của trình duyệt.</p><h2>Giới hạn</h2><p>Đăng nhập, phân quyền, thông báo và AI đang được mô phỏng. Không có máy chủ, cơ sở dữ liệu dùng chung hay AI LLM thật. Các thao tác không thay thế quy trình an toàn công trường.</p><h2>Hỗ trợ bàn phím</h2><p>Dùng Tab để di chuyển giữa nút và trường nhập liệu; Enter/Space để kích hoạt nút. Có thể đóng hộp thoại bằng nút Đóng hoặc phím Escape.</p></section>`}


/* ===== Shared renderer: profile.js ===== */
/* SiteSafe · Giao diện riêng: profile */
function profilePage(){const p=profileData;const n=p.notifications||profileDefaults.notifications;const initials=(p.name||roleConfig[currentRole].name).split(/\s+/).slice(-2).map(x=>x[0]).join('').toUpperCase();return `<div class="crumb">Cán bộ an toàn / Hồ sơ cá nhân</div><div class="figma-page-title"><div><h1>Hồ sơ cá nhân</h1><p>Thông tin cá nhân và cách bạn nhận thông báo.</p></div><button class="btn btn-primary" type="submit" form="profileInfoForm">Lưu thay đổi</button></div><div class="data-caption">Dữ liệu minh họa · 03/10/2026 · Không phải số liệu thực tế</div><div class="profile-top-grid"><form class="figma-card profile-card" id="profileInfoForm"><div class="profile-identity"><div class="profile-photo" id="profilePhotoPreview">${profilePhotoUrl?`<img src="${profilePhotoUrl}" alt="Ảnh hồ sơ">`:esc(initials)}</div><div><strong>${esc(p.name||roleConfig[currentRole].name)}</strong><small>${esc(roleConfig[currentRole].avatar)} · Ảnh đại diện mặc định</small></div></div><div class="form-field"><label for="profileName">Họ và tên *</label><input id="profileName" name="name" value="${esc(p.name)}" required maxlength="80"></div><div class="form-field"><label for="profileEmail">Email công việc *</label><input id="profileEmail" name="email" type="email" value="${esc(p.email)}" required maxlength="120"></div><div class="form-field"><label for="profilePhone">Điện thoại</label><input id="profilePhone" name="phone" type="tel" value="${esc(p.phone)}" maxlength="30"></div><div class="profile-actions"><label class="btn btn-primary btn-sm" for="profilePhoto">Đổi ảnh</label><input id="profilePhoto" class="visually-hidden" type="file" accept="image/png,image/jpeg"><button class="btn btn-light btn-sm" type="button" data-action="profile-photo-delete">Xóa ảnh</button></div><p class="profile-hint">Ảnh tối đa 2 MB, JPG hoặc PNG.</p></form><section class="figma-card profile-card"><h2>Quyền và công trường</h2><p class="profile-subtitle">Chỉ đọc · Liên hệ quản trị để thay đổi</p><div class="form-field"><label for="profileRole">Vai trò được cấp</label><input id="profileRole" value="${esc(roleConfig[currentRole].label)}" disabled></div><div class="form-field"><label for="profileSite">Công trường</label><input id="profileSite" value="Riverside – Khối A / RS-A" disabled></div><p class="profile-hint">Thông tin quyền không thay đổi khi bạn sửa hồ sơ. Ảnh tối đa 2 MB, JPG hoặc PNG.</p></section></div><form class="figma-card profile-card profile-section" id="profilePasswordForm"><h2>Cập nhật mật khẩu</h2><div class="profile-form-grid"><div class="form-field"><label for="currentPassword">Mật khẩu hiện tại *</label><input id="currentPassword" name="currentPassword" type="password" autocomplete="current-password" required minlength="4"></div><div class="form-field"><label for="newPassword">Mật khẩu mới *</label><input id="newPassword" name="newPassword" type="password" autocomplete="new-password" required minlength="12"><small>Tối thiểu 12 ký tự, không trùng mật khẩu hiện tại.</small></div><div class="form-field profile-full-field"><label for="confirmNewPassword">Xác nhận mật khẩu mới *</label><input id="confirmNewPassword" name="confirmPassword" type="password" autocomplete="new-password" required minlength="12"></div></div><button class="btn btn-primary btn-sm" type="submit">Cập nhật mật khẩu</button><div class="profile-feedback" id="passwordFeedback" role="status" aria-live="polite"></div></form><form class="figma-card profile-card profile-section" id="profileNotificationsForm"><h2>Tùy chọn thông báo</h2><div class="profile-check-row"><label><input name="risk" type="checkbox" ${n.risk?'checked':''}> Nguy cơ được giao cho tôi</label><label><input name="actions" type="checkbox" ${n.actions?'checked':''}> Hành động đến hạn / quá hạn</label><label><input name="inspections" type="checkbox" ${n.inspections?'checked':''}> Lịch kiểm tra và thay đổi lịch</label><label><input name="ai" type="checkbox" ${n.ai?'checked':''}> Đề xuất AI chờ tôi xem</label></div><div class="profile-form-grid"><div class="form-field"><label>Kênh nhận</label><div class="profile-channel"><label><input name="app" type="checkbox" ${n.app?'checked':''}> Trong ứng dụng</label><label><input name="email" type="checkbox" ${n.email?'checked':''}> Email</label></div></div><div class="form-field"><label for="digestTime">Tần suất email</label><select id="digestTime" name="digest"><option value="07:00" ${n.digest==='07:00'?'selected':''}>Tóm tắt mỗi ngày lúc 07:00</option><option value="12:00" ${n.digest==='12:00'?'selected':''}>Tóm tắt mỗi ngày lúc 12:00</option><option value="18:00" ${n.digest==='18:00'?'selected':''}>Tóm tắt mỗi ngày lúc 18:00</option><option value="immediate" ${n.digest==='immediate'?'selected':''}>Gửi ngay khi có thông báo</option></select></div></div><p class="profile-hint">Cảnh báo an toàn bắt buộc vẫn hiển thị trong ứng dụng theo quyền và công trường.</p><button class="btn btn-primary btn-sm" type="submit">Lưu tùy chọn</button><div class="profile-feedback" id="notificationFeedback" role="status" aria-live="polite"></div></form><div class="notice profile-saved" id="profileSaved" role="status" aria-live="polite" hidden><strong>Đã lưu thông tin</strong><br>Thông tin liên hệ và tùy chọn thông báo đã được cập nhật. Vai trò không thay đổi.</div><p class="profile-foot">profile.html · Quyền thao tác theo vai trò được gán. Mọi thay đổi đều được ghi lại và minh chứng.</p>`}


/* ===== Shared renderer: adminSiteModal.js ===== */
/* SiteSafe · chức năng quản trị */
function adminSiteModal(id=''){
  const old=id?db.sites.find(x=>x.id===id):null;
  modalForm(`${old?'Cập nhật':'Tạo mới'} công trường`,[
    {name:'name',label:'Tên công trường',required:true,value:old?.name||''},
    {name:'address',label:'Địa chỉ',required:true,value:old?.address||''},
    {name:'manager',label:'Quản lý',required:true,value:old?.manager||''},
    {name:'startDate',label:'Ngày bắt đầu',type:'date',required:true,value:old?.startDate||'2026-10-01'},
    {name:'endDate',label:'Ngày kết thúc dự kiến',type:'date',required:true,value:old?.endDate||'2027-10-01'},
    {name:'zones',label:'Số khu vực',type:'number',required:true,value:old?.zones??0},
    {name:'status',label:'Trạng thái',type:'select',options:['Đang hoạt động','Tạm dừng','Lưu trữ'],value:old?.status||'Đang hoạt động'}
  ]);
  $('#entityForm').id='siteEntityForm';
  $('#siteEntityForm').dataset.siteId=id;
}
document.addEventListener('click',e=>{
  const button=e.target.closest('[data-action]');
  if(!button)return;
  const {action,id}=button.dataset;
  if(!['new-site','edit-site','toggle-site','archive-site','activate-site','view-site-zones','archive-zone','activate-zone'].includes(action))return;
  e.preventDefault();e.stopImmediatePropagation();
  if(action==='new-site'||action==='edit-site'){adminSiteModal(action==='edit-site'?id:'');return}
  if(action==='view-site-zones'){
    const site=db.sites.find(x=>x.id===id);
    modalForm(`Khu vực · ${site?.name||id}`,[{name:'zones',label:'Khu vực liên kết',type:'textarea',value:db.zones.map(x=>`${x.id} · ${x.name}`).join('\n')}]);
    $('#modalBody textarea').readOnly=true;
    return;
  }
  if(action==='toggle-site'||action==='archive-site'||action==='activate-site'){
    const site=db.sites.find(x=>x.id===id);
    if(!site){toast('Không tìm thấy công trường.');return}
    site.status=action==='archive-site'?'Lưu trữ':action==='activate-site'?'Đang hoạt động':site.status==='Đang hoạt động'?'Tạm dừng':'Đang hoạt động';
    saveDB();renderPage();toast('Đã cập nhật trạng thái công trường.');return;
  }
  const zone=db.zones.find(x=>x.id===id);
  if(!zone){toast('Không tìm thấy khu vực.');return}
  zone.status=action==='archive-zone'?'Lưu trữ':'Đang thi công';
  saveDB();renderPage();toast('Đã cập nhật trạng thái khu vực.');
});
document.addEventListener('submit',e=>{
  const form=e.target;
  if(form.id==='siteEntityForm'){
    e.preventDefault();e.stopImmediatePropagation();
    const values=Object.fromEntries(new FormData(form).entries());
    const id=form.dataset.siteId;
    let site=id?db.sites.find(x=>x.id===id):null;
    if(site)Object.assign(site,values);
    else{
      const number=Math.max(0,...db.sites.map(x=>Number((x.id.match(/\d+/)||['0'])[0])))+1;
      site={id:`RS-${String(number).padStart(3,'0')}`,...values};
      db.sites.unshift(site);
    }
    site.zones=Number(site.zones);
    saveDB();closeModal();renderPage();toast(id?'Đã cập nhật công trường.':'Đã tạo công trường.');return;
  }
  if(!['adminInviteForm','adminRoleForm','adminSuspendForm','adminZoneForm','adminSiteForm'].includes(form.id))return;
  e.preventDefault();e.stopImmediatePropagation();
  if(form.id==='adminInviteForm'){
    const values=Object.fromEntries(new FormData(form).entries());
    const number=Math.max(0,...db.users.map(x=>Number((x.id.match(/\d+/)||['0'])[0])))+1;
    const email=values.email.trim();
    if(db.users.some(x=>String(x.email||'').toLowerCase()===email.toLowerCase())){toast('Email này đã có trong danh sách thành viên.');return}
    db.users.unshift({id:`U-${String(number).padStart(3,'0')}`,name:email.split('@')[0].replace(/[._-]/g,' '),email,role:values.role,status:'Đang hoạt động',site:values.site});
    saveDB();renderPage();toast('Đã gửi lời mời thành viên.');return;
  }
  if(form.id==='adminRoleForm'||form.id==='adminSuspendForm'){
    const user=db.users.find(x=>x.id===form.dataset.userId);
    if(!user){toast('Không tìm thấy thành viên.');return}
    if(form.id==='adminRoleForm'){
      const values=Object.fromEntries(new FormData(form).entries());
      const activeAdmins=db.users.filter(x=>x.role==='Quản trị hệ thống'&&x.status==='Đang hoạt động');
      if(user.role==='Quản trị hệ thống'&&user.status==='Đang hoạt động'&&values.role!=='Quản trị hệ thống'&&activeAdmins.length<=1){toast('Không thể thay đổi quyền của quản trị viên hoạt động cuối cùng.');return}
      user.role=values.role;user.site=values.site;
    }
    else{
      const admins=db.users.filter(x=>x.role==='Quản trị hệ thống'&&x.status==='Đang hoạt động');
      if(user.role==='Quản trị hệ thống'&&admins.length<=1){toast('Không thể tạm ngưng quản trị viên cuối cùng.');return}
      user.status='Đã khóa';
    }
    saveDB();renderPage();toast(form.id==='adminRoleForm'?'Đã cập nhật quyền thành viên.':'Đã tạm ngưng tài khoản.');return;
  }
  const values=Object.fromEntries(new FormData(form).entries());
  if(form.id==='adminZoneForm'){
    const zone=db.zones.find(x=>x.id===form.dataset.zoneId);
    if(!zone){toast('Không tìm thấy khu vực.');return}
    Object.assign(zone,values);saveDB();renderPage();toast('Đã lưu khu vực.');return;
  }
  const site=db.sites[0];
  if(!site){toast('Không tìm thấy công trường để cập nhật.');return}
  Object.assign(site,values);saveDB();renderPage();toast('Đã lưu công trường.');
});
document.addEventListener('input',e=>{
  if(currentPage!=='sites'||e.target.id!=='searchInput')return;
  searchTerm=e.target.value;const pos=e.target.selectionStart;$('#pageContent').innerHTML=adminSitesPage();const next=$('#searchInput');next.focus();next.setSelectionRange(pos,pos);
});
document.addEventListener('change',e=>{
  if(currentPage!=='sites'||e.target.id!=='statusFilter')return;
  activeFilter=e.target.value;$('#pageContent').innerHTML=adminSitesPage();$('#statusFilter').value=activeFilter;
});


/* ===== Shared renderer: adminUsersPage.js ===== */
/* SiteSafe · chức năng quản trị */
function adminUsersPage(){
  const users=db.users.filter(x=>(`${x.name} ${x.email} ${x.role}`.toLowerCase().includes(searchTerm.toLowerCase()))&&(activeFilter==='Tất cả'||x.status===activeFilter));
  const sites=db.sites.filter(x=>x.status!=='Lưu trữ');
  return `<div class="admin-reference">
    <div class="crumb">Quản trị viên / Người dùng</div>
    <div class="figma-page-title"><div><h1>Người dùng</h1><p>Mời thành viên, gán công trường và quản lý quyền truy cập.</p></div>${btn('+ Mời thành viên','new-user')}</div>
    <div class="data-caption">Dữ liệu minh họa · 03/10/2026 · Không phải số liệu thực tế</div>
    <div class="dashboard-filters admin-filters">
      <label>Tìm kiếm<input id="searchInput" type="search" placeholder="Mã, nội dung hoặc người phụ trách" value="${esc(searchTerm)}"></label>
      <label>Công trường<select aria-label="Công trường">${sites.map(x=>`<option>${esc(x.name)}</option>`).join('')}</select></label>
      <label>Bộ lọc<select id="statusFilter">${['Tất cả','Đang hoạt động','Đã khóa'].map(x=>`<option ${activeFilter===x?'selected':''}>${x}</option>`).join('')}</select></label>
    </div>
    <section class="figma-card admin-table-card"><h2>Thành viên công trường</h2><div class="table-wrap"><table><thead><tr><th>Thành viên</th><th>Vai trò</th><th>Công trường</th><th>Trạng thái / hoạt động</th></tr></thead><tbody>
    ${users.map((x,i)=>`<tr><td><button class="admin-link" data-action="edit-user" data-id="${esc(x.id)}">${esc(x.name)} · ${esc((x.email.split('@')[0]||'').replace('.',' '))}</button></td><td>${esc(x.role)}</td><td>${esc(x.site||sites[i%Math.max(1,sites.length)]?.id||'RS-A')}</td><td>${esc(x.status)} · ${['08:45','09:20','09:30','08:30'][i%4]}</td></tr>`).join('')||'<tr><td colspan="4">Không tìm thấy thành viên phù hợp.</td></tr>'}
    </tbody></table></div></section>
    <div class="admin-two-col">
      <form class="figma-card admin-form-card" id="adminInviteForm"><h2>Mẫu hộp thoại · Mời thành viên</h2>
        <div class="form-field"><label for="inviteEmail">Email *</label><input id="inviteEmail" name="email" type="email" value="binh.vu@riverside.example" required></div>
        <div class="form-field"><label for="inviteRole">Vai trò được gán *</label><select id="inviteRole" name="role"><option>Cán bộ an toàn</option><option>Công nhân</option><option>Quản lý công trường</option><option>Quản trị hệ thống</option></select></div>
        <div class="form-field"><label for="inviteSite">Công trường được phép *</label><select id="inviteSite" name="site">${sites.map(x=>`<option value="${esc(x.id)}">${esc(x.name)}</option>`).join('')}</select></div>
        <small>Chỉ hiện quyền mà quản trị viên hiện tại được cấp phép gán.</small><div class="admin-form-actions"><button class="btn btn-primary btn-sm" type="submit">Gửi lời mời</button><button class="btn btn-light btn-sm" type="reset">Hủy</button></div>
      </form>
      <form class="figma-card admin-form-card" id="adminRoleForm" data-user-id="${esc(users[0]?.id||'')}"><h2>Xác nhận thay đổi quyền</h2>
        <p>${users[0]?`${esc(users[0].name)} → ${esc(users[0].role)} · Công trường → RS-A Người phê duyệt → Đỗ Hạnh`:'Chọn thành viên để thay đổi quyền.'}</p>
        <div class="form-field"><label for="roleTarget">Vai trò mới *</label><select id="roleTarget" name="role"><option>Cán bộ an toàn</option><option>Công nhân</option><option>Quản lý công trường</option><option>Quản trị hệ thống</option></select></div>
        <div class="form-field"><label for="siteTarget">Công trường được gán *</label><select id="siteTarget" name="site">${sites.map(x=>`<option value="${esc(x.id)}">${esc(x.name)}</option>`).join('')}</select></div>
        <div class="form-field"><label for="roleReason">Lý do *</label><input id="roleReason" name="reason" value="Gia nhập tổ cấp pha theo lời mời RS-A." required></div>
        <div class="admin-form-actions"><button class="btn btn-primary btn-sm" type="submit">Xác nhận cấp quyền</button><button class="btn btn-light btn-sm" type="button" data-action="edit-user" data-id="${esc(users[0]?.id||'')}">Giữ nguyên</button></div>
      </form>
    </div>
    <form class="figma-card admin-form-card" id="adminSuspendForm" data-user-id="${esc(users[0]?.id||'')}"><h2>Tạm ngưng tài khoản, không xóa tác giả</h2>
      <div class="form-field"><label for="suspendReason">Lý do tạm ngưng *</label><input id="suspendReason" name="reason" value="Thành viên đã kết thúc phân công tại công trường." required></div>
      <p>Thành viên không đăng nhập được sau khi tạm ngưng. Báo cáo, ảnh và lịch sử do người này tạo vẫn giữ nguyên.</p>
      <div class="admin-form-actions"><button class="btn btn-primary btn-sm" type="submit">Xác nhận tạm ngưng</button><button class="btn btn-light btn-sm" type="reset">Hủy</button></div>
    </form>
    <div class="admin-warning">Không thể tạm ngưng quản trị viên cuối cùng.<br>Đỗ Hạnh là quản trị viên hoạt động cuối cùng trong phạm vi này. Bổ sung quản trị viên hợp lệ trước khi thay đổi.</div>
    <p class="reference-foot">admin-user-management.html · Quyền thao tác theo vai trò được gán. Mọi thay đổi ghi lịch sử và minh chứng.</p>
  </div>`;
}


/* ===== Shared renderer: adminChecklistsPage.js ===== */
/* SiteSafe · chức năng quản trị */
function adminChecklistsPage(){
  const list=db.checklists.filter(x=>(`${x.id} ${x.title} ${x.category}`.toLowerCase().includes(searchTerm.toLowerCase()))&&(activeFilter==='Tất cả'||x.status===activeFilter));
  const active=list[0]||db.checklists[0];
  return `<div class="admin-reference">
    <div class="crumb">Quản trị viên / Mẫu checklist</div>
    <div class="figma-page-title"><div><h1>Mẫu checklist</h1><p>Quản lý nhóm kiểm tra và phiên bản bất biến; mẫu đã phát hành không bị ghi đè.</p></div>${btn('+ Tạo mẫu','new-checklist')}</div>
    <div class="data-caption">Dữ liệu minh họa · 03/10/2026 · Không phải số liệu thực tế</div>
    <div class="dashboard-filters admin-filters">
      <label>Tìm kiếm<input id="searchInput" placeholder="Mã, nội dung hoặc người phụ trách" value="${esc(searchTerm)}"></label>
      <label>Công trường<select><option>Riverside – Khối A</option><option>Riverside – Khối B</option></select></label>
      <label>Bộ lọc<select id="statusFilter">${['Tất cả','Đang sử dụng','Bản nháp','Lưu trữ'].map(x=>`<option ${activeFilter===x?'selected':''}>${x}</option>`).join('')}</select></label>
    </div>
    <section class="figma-card admin-tint-green"><h2>Thư viện mẫu</h2><div class="table-wrap"><table><thead><tr><th>Mẫu / loại công việc</th><th>Phiên bản</th><th>Trạng thái</th><th>Cập nhật bởi</th></tr></thead><tbody>
    ${list.map((x,i)=>`<tr><td><button class="admin-link" data-action="edit-checklist" data-id="${esc(x.id)}">${esc(x.id)} · ${esc(x.title)}</button></td><td>v${i===0?'2.1':'1.3'}</td><td>${x.status==='Đang sử dụng'?'Đã phát hành':esc(x.status)}</td><td>${['Trần An · 01/10','Mai Lan · 28/09','Trần An · 03/10'][i%3]}</td></tr>`).join('')||'<tr><td colspan="4">Không tìm thấy mẫu phù hợp.</td></tr>'}
    </tbody></table></div></section>
    <section class="figma-card admin-tint-pink"><h2>Trình chỉnh sửa: ${active?`${esc(active.id)} v2.2`:'Chưa chọn mẫu'}</h2><p>Bản nháp tạo từ phiên bản đã phát hành.</p>
      <div class="admin-form-grid"><div class="form-field"><label>Tên mẫu *</label><input value="${esc(active?.title||'')}"></div><div class="form-field"><label>Loại công việc *</label><select><option>Làm việc trên cao</option><option>Thiết bị</option><option>Điện</option></select></div>
      <div class="form-field admin-span-all"><label>Nhóm kiểm tra *</label><input value="Bảo vệ mép sàn"></div><div class="form-field admin-span-all"><label>Nội dung mục *</label><input value="Lan can bảo vệ đủ chiều cao và liên tục"></div>
      <div class="form-field"><label>Kiểu trả lời *</label><select><option>Đạt / Không đạt / Không áp dụng</option></select></div><div class="form-field"><label>Quy tắc minh chứng</label><label class="admin-check-label"><input type="checkbox" checked> Bắt buộc ghi chú và ảnh nếu Không đạt</label></div></div>
      <div class="admin-form-actions"><button class="btn btn-primary btn-sm" data-action="edit-checklist" data-id="${esc(active?.id||'')}">+ Thêm mục</button><button class="btn btn-light btn-sm" data-action="edit-checklist" data-id="${esc(active?.id||'')}">+ Thêm nhóm</button><button class="btn btn-light btn-sm" data-action="edit-checklist" data-id="${esc(active?.id||'')}">Lưu nháp</button><button class="btn btn-light btn-sm" data-action="edit-checklist" data-id="${esc(active?.id||'')}">Xem trước</button></div>
    </section>
    <div class="admin-two-col"><section class="figma-card admin-tint-orange"><h2>Xem trước mẫu</h2><strong>Bảo vệ mép sàn · 3 mục</strong><p>1. Lan can bảo vệ đủ chiều cao cao 2. Dải chân chắn ngăn vật rơi 3. Lối tiếp cận có cảnh báo</p><small>Không đạt → yêu cầu ghi chú + ảnh → tạo nguy cơ có liên kết.</small></section><section class="figma-card admin-tint-red"><h2>Lịch sử phiên bản</h2><p>v2.2 · Bản nháp · Trần An · 03/10 v2.1 · Đã phát hành · Trần An · 01/10 · CL-018 v2.0 · Đã lưu trữ · 15/09</p><div class="admin-warning">Giữ phiên bản lịch sử<br>CL-018 / IN-018 dùng TMP-01 v2.1. Mọi thay đổi của mẫu đã phát hành tạo phiên bản riêng.</div></section></div>
    <section class="figma-card"><h2>Phát hành / nhân bản / lưu trữ</h2><div class="admin-form-actions"><button class="btn btn-primary btn-sm" data-action="toggle-checklist" data-id="${esc(active?.id||'')}">Phát hành v2.2</button><button class="btn btn-light btn-sm" data-action="new-checklist">Nhân bản mẫu</button><button class="btn btn-light btn-sm" data-action="toggle-checklist" data-id="${esc(active?.id||'')}">Lưu trữ v2.0</button></div><div class="form-field"><label>Ghi chú thay đổi *</label><input value="Bổ sung kiểm tra điểm neo; không thay lịch sử kiểm tra cũ."></div><p>Xác nhận phát hành chỉ khi có đủ nhóm, nội dung và quy tắc minh chứng.</p><button class="btn btn-primary btn-sm" data-action="toggle-checklist" data-id="${esc(active?.id||'')}">Xác nhận phát hành</button></section>
    <p class="reference-foot">admin-checklist-template-management.html · Quyền thao tác theo vai trò được gán. Mọi thay đổi ghi lịch sử và minh chứng.</p>
  </div>`;
}


/* ===== Shared renderer: adminZonesPage.js ===== */
/* SiteSafe · chức năng quản trị */
function adminZonesPage(){
  const list=db.zones.filter(x=>(`${x.id} ${x.name} ${x.type}`.toLowerCase().includes(searchTerm.toLowerCase()))&&(activeFilter==='Tất cả'||x.status===activeFilter));
  const selected=list[0]||db.zones[0];
  return `<div class="admin-reference">
    <div class="crumb">Quản trị viên / Khu vực</div>
    <div class="figma-page-title"><div><h1>Khu vực</h1><p>Mã khu vực nhất quán cho checklist, nguy cơ, nhân công và sơ đồ.</p></div>${btn('+ Tạo khu vực','new-zone')}</div>
    <div class="data-caption">Dữ liệu minh họa · 03/10/2026 · Không phải số liệu thực tế</div>
    <div class="dashboard-filters admin-filters"><label>Tìm kiếm<input id="searchInput" placeholder="Mã, nội dung hoặc người phụ trách" value="${esc(searchTerm)}"></label><label>Công trường<select><option>Riverside – Khối A</option></select></label><label>Bộ lọc<select id="statusFilter">${['Tất cả','Đang thi công','Tạm dừng','Lưu trữ'].map(x=>`<option ${activeFilter===x?'selected':''}>${x}</option>`).join('')}</select></label></div>
    <section class="figma-card admin-table-card"><h2>Khu vực của Riverside – Khối A</h2><div class="table-wrap"><table><thead><tr><th>Mã / tên</th><th>Vị trí</th><th>Giám sát</th><th>Trạng thái</th></tr></thead><tbody>
    ${list.map((x,i)=>`<tr><td><button class="admin-link" data-action="edit-zone" data-id="${esc(x.id)}">${esc(x.id)} · ${esc(x.name)}</button></td><td>${['Khối A · cao độ tầng 2','Khối A · tầng 1','Phía tây công trường','Phía nam'][i%4]}</td><td>${['Lê Hoàng','Lê Hoàng','Mai Lan','Phạm Dũng'][i%4]}</td><td>${x.status==='Đang thi công'?'Hoạt động':esc(x.status)}</td></tr>`).join('')||'<tr><td colspan="4">Không tìm thấy khu vực phù hợp.</td></tr>'}
    </tbody></table></div><small>Hiện có ${list.length} / ${db.zones.length} khu vực · ${db.zones.filter(x=>x.status==='Đang thi công').length} hoạt động · ${db.zones.filter(x=>x.status!=='Đang thi công').length} lưu trữ.</small></section>
    <section class="figma-card"><h2>Sơ đồ vị trí tham chiếu</h2><div class="admin-zone-map"><small>BẮC ↑ · RIVERSIDE – KHỐI A · SƠ ĐỒ VẬN HÀNH</small><div class="admin-zone-map-row">${list.slice(0,2).map(x=>`<article class="admin-map-zone ${x.risk==='Cao'?'danger':x.risk==='Trung bình'?'warning':'safe'}"><strong>${x.risk==='Cao'?'!':'△'} ${esc(x.name)}</strong><p>${esc(x.workers)} người · ${esc(x.risk)} nguy cơ</p><button class="text-btn" data-action="edit-zone" data-id="${esc(x.id)}">Xem khu vực →</button></article>`).join('')}</div><div class="admin-map-divider">LỐI NỘI BỘ · KHÔNG PHẢI THANG TỶ LỆ</div><div class="admin-zone-map-row">${list.slice(2,4).map(x=>`<article class="admin-map-zone ${x.risk==='Cao'?'danger':x.risk==='Trung bình'?'warning':'safe'}"><strong>${esc(x.id)} · ${esc(x.name)}</strong><p>${esc(x.risk)} · ${esc(x.workers)} người</p></article>`).join('')}</div></div><p class="reference-foot">Quy tắc màu: đỏ nguy cơ cao chưa đóng; vàng nguy cơ trung bình; xanh nguy cơ thấp; xám thiếu dữ liệu.</p></section>
    <section class="figma-card"><h2>Mẫu ngắn tạo / chỉnh sửa</h2><form id="adminZoneForm" data-zone-id="${esc(selected?.id||'')}"><div class="admin-form-grid"><div class="form-field"><label>Mã khu vực *</label><input value="${esc(selected?.id||'')}" disabled></div><div class="form-field"><label>Tên khu vực *</label><input name="name" value="${esc(selected?.name||'')}" required></div><div class="form-field"><label>Vị trí *</label><input value="Khối A · tầng 2 · phía đông"></div><div class="form-field"><label>Người giám sát *</label><input value="Lê Hoàng"></div><div class="form-field admin-span-all"><label>Trạng thái *</label><select name="status">${['Đang thi công','Tạm dừng','Hoàn thành'].map(x=>`<option ${selected?.status===x?'selected':''}>${x}</option>`).join('')}</select></div></div><div class="admin-form-actions"><button class="btn btn-primary btn-sm" type="submit">Lưu khu vực</button><button class="btn btn-light btn-sm" type="reset">Hủy</button></div></form></section>
    <div class="admin-warning">Không thể lưu trữ ${esc(selected?.id||'khu vực')} lúc này.<br>Đang có nguy cơ và hành động chưa xử lý liên quan; chuyển trách nhiệm và xử lý liên kết trước, không xóa hoặc làm ảnh hưởng lịch sử.</div>
    <section class="figma-card"><h2>Xác nhận lưu trữ ${esc(db.zones[db.zones.length-1]?.id||'khu vực')}</h2><p>Khu vực ngừng xuất hiện trong lựa chọn mới. Các báo cáo và ảnh cũ vẫn hiển thị mã, tên và người phụ trách lịch sử.</p><div class="admin-form-actions"><button class="btn btn-primary btn-sm" data-action="archive-zone" data-id="${esc(db.zones[db.zones.length-1]?.id||'')}">Xác nhận lưu trữ</button><button class="btn btn-light btn-sm" data-action="activate-zone" data-id="${esc(db.zones[db.zones.length-1]?.id||'')}">Giữ hoạt động</button></div></section>
    <p class="reference-foot">admin-zone-management.html · Quyền thao tác theo vai trò được gán. Mọi thay đổi ghi lịch sử và minh chứng.</p>
  </div>`;
}


/* ===== Shared SiteSafe core ===== */
/* SiteSafe - CSE122 prototype. Data is mock data persisted in localStorage; AI is a transparent simulation, not a live LLM. */
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const STORE_KEY = 'sitesafe-v2-data';
const PROFILE_KEY = 'sitesafe-demo-profile';
const profileDefaults = {name:'Trần An',email:'an.tran@riverside.example',phone:'090 222 3344',photo:'',notifications:{risk:true,actions:true,inspections:true,ai:false,app:true,email:true,digest:'07:00'}};
function loadProfile(){try{return {...profileDefaults,...JSON.parse(localStorage.getItem(PROFILE_KEY)||'{}')}}catch{return {...profileDefaults}}}
let profileData=loadProfile();let profilePhotoUrl=typeof profileData.photo==='string'&&/^data:image\/(png|jpeg);base64,/.test(profileData.photo)?profileData.photo:'';
let profileSaved=false;
const seed = {
  risks:[
    {id:'RS-024',title:'Lan can tầng 4 chưa hoàn thiện',zone:'Khối A · Tầng 4',level:'Cao',status:'Mới ghi nhận',owner:'Nguyễn Văn Nam',date:'2026-10-20',desc:'Khu vực mép sàn phía Đông chưa có lan can bảo vệ.'},
    {id:'RS-023',title:'Dây điện đi qua lối đi',zone:'Khối A · Tầng 2',level:'Trung bình',status:'Đang xử lý',owner:'Trần Minh Đức',date:'2026-10-19',desc:'Dây điện tạm băng ngang lối di chuyển của công nhân.'},
    {id:'RS-021',title:'Thiếu biển cảnh báo khu vực nâng hạ',zone:'Bãi vật liệu',level:'Cao',status:'Đang xử lý',owner:'Lê Quốc Huy',date:'2026-10-18',desc:'Khu vực hoạt động của cần trục chưa được đặt biển cảnh báo.'},
    {id:'RS-019',title:'Vật liệu xếp chưa gọn',zone:'Kho vật tư',level:'Thấp',status:'Đã khắc phục',owner:'Phạm Văn Long',date:'2026-10-16',desc:'Một số vật liệu để sát lối đi nội bộ.'}
  ],
  inspections:[
    {id:'KT-108',title:'Kiểm tra giàn giáo tầng 4',zone:'Khối A · Tầng 4',date:'2026-10-21',time:'08:30',assignee:'Trần An',status:'Đã lên lịch',note:'Kiểm tra lan can và sàn thao tác'},
    {id:'KT-107',title:'Kiểm tra thiết bị nâng',zone:'Bãi vật liệu',date:'2026-10-20',time:'14:00',assignee:'Nguyễn Văn Nam',status:'Đang thực hiện',note:'Kiểm tra nhật ký bảo dưỡng'},
    {id:'KT-106',title:'Kiểm tra điện tạm',zone:'Khối A · Tầng 2',date:'2026-10-19',time:'09:00',assignee:'Trần An',status:'Hoàn thành',note:'Đã kiểm tra tủ điện'},
    {id:'KT-104',title:'Kiểm tra kho vật tư',zone:'Kho vật tư',date:'2026-10-18',time:'10:00',assignee:'Lê Quốc Huy',status:'Hoàn thành',note:'Đảm bảo lối đi thông thoáng'}
  ],
  actions:[
    {id:'KP-052',title:'Lắp lan can tạm tầng 4',risk:'RS-024',owner:'Nguyễn Văn Nam',due:'2026-10-21',priority:'Cao',status:'Chưa thực hiện',note:'Rào chắn khu vực trong khi chờ lắp lan can'},
    {id:'KP-051',title:'Bọc bảo vệ dây điện',risk:'RS-023',owner:'Trần Minh Đức',due:'2026-10-20',priority:'Trung bình',status:'Đang thực hiện',note:'Dẫn dây qua máng bảo vệ'},
    {id:'KP-049',title:'Bổ sung biển cảnh báo nâng hạ',risk:'RS-021',owner:'Lê Quốc Huy',due:'2026-10-20',priority:'Cao',status:'Đang thực hiện',note:'Bổ sung rào mềm và biển báo'}
  ],
  zones:[
    {id:'KV-01',name:'Khối A · Tầng 4',type:'Thi công trên cao',workers:28,risk:'Cao',status:'Đang thi công',note:'Ưu tiên kiểm tra mép sàn'},
    {id:'KV-02',name:'Khối A · Tầng 2',type:'Lắp đặt hệ thống điện',workers:16,risk:'Trung bình',status:'Đang thi công',note:'Kiểm tra dây dẫn tạm'},
    {id:'KV-03',name:'Bãi vật liệu',type:'Vận chuyển và nâng hạ',workers:12,risk:'Cao',status:'Đang thi công',note:'Phân luồng người và thiết bị'},
    {id:'KV-04',name:'Kho vật tư',type:'Lưu trữ vật liệu',workers:7,risk:'Thấp',status:'Đang thi công',note:'Giữ lối đi thông thoáng'}
  ],
  checklists:[
    {id:'CL-01',title:'An toàn làm việc trên cao',category:'Làm việc trên cao',items:8,status:'Đang sử dụng',updated:'2026-10-15'},
    {id:'CL-02',title:'Kiểm tra thiết bị nâng',category:'Thiết bị',items:12,status:'Đang sử dụng',updated:'2026-10-10'},
    {id:'CL-03',title:'An toàn điện tạm',category:'Điện',items:10,status:'Bản nháp',updated:'2026-10-08'}
  ],
  users:[
    {id:'U-001',name:'Trần An',email:'tran.an@sitesafe.demo',role:'Cán bộ an toàn',status:'Đang hoạt động'},
    {id:'U-002',name:'Nguyễn Văn Nam',email:'nam.nguyen@sitesafe.demo',role:'Công nhân',status:'Đang hoạt động'},
    {id:'U-003',name:'Lê Minh Quân',email:'quan.le@sitesafe.demo',role:'Quản lý công trường',status:'Đang hoạt động'},
    {id:'U-004',name:'Phạm Thu Hà',email:'ha.pham@sitesafe.demo',role:'Quản trị hệ thống',status:'Đang hoạt động'}
  ],
  sites:[
    {id:'RS-A',name:'Riverside – Khối A',address:'Đường Ven Sông, TP.HCM',manager:'Lê Hoàng',startDate:'2026-07-01',endDate:'2027-06-30',zones:6,status:'Đang hoạt động'},
    {id:'RS-B',name:'Riverside – Khối B',address:'Đường Ven Sông, TP.HCM',manager:'Phạm Dũng',startDate:'2026-09-01',endDate:'2027-08-31',zones:3,status:'Tạm dừng'},
    {id:'RS-OLD',name:'Kho phụ trợ',address:'Khu vực cũ',manager:'Phạm Dũng',startDate:'2025-01-01',endDate:'2026-01-01',zones:0,status:'Lưu trữ'}
  ],
  notifications:[{id:'TB-01',title:'Nguy cơ mức cao mới',desc:'RS-024 · Lan can tầng 4 chưa hoàn thiện',time:'10 phút trước',read:false},{id:'TB-02',title:'Sắp đến hạn khắc phục',desc:'KP-051 · Bọc bảo vệ dây điện',time:'1 giờ trước',read:false}]
};
let db = loadDB(); let currentRole=(['help','profile'].includes(document.body.dataset.initialPage)?new URLSearchParams(location.search).get('role'):null)||document.body.dataset.initialRole||'safety'; let currentPage=document.body.dataset.initialPage||new URLSearchParams(location.search).get('page')||'dashboard'; let searchTerm=''; let activeFilter='Tất cả'; let aiResult=null; let aiKind='classify'; let aiTimer=null; let modalConfig=null;
function loadDB(){try{const d=JSON.parse(localStorage.getItem(STORE_KEY));return d&&d.risks?d:structuredClone(seed)}catch{return structuredClone(seed)}}
db.sites ||= structuredClone(seed.sites);
function saveDB(){localStorage.setItem(STORE_KEY,JSON.stringify(db))}
function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),3000)}
const roleConfig={safety:{label:'Cán bộ an toàn',name:'Trần An',avatar:'TA',pages:[['dashboard','▦','Tổng quan an toàn'],['risks','⚠','Chi tiết nguy cơ'],['inspections','☷','Lịch kiểm tra'],['ai','✦','AI phân loại nguy cơ']]},worker:{label:'Nhân sự hiện trường',name:'Nguyễn Văn Nam',avatar:'NN',pages:[['worker-home','▦','Tổng quan nhân sự'],['worker-checklist','☑','Checklist của tôi'],['worker-report','⚠','Báo cáo nguy cơ'],['worker-history','◷','Lịch sử báo cáo']]},manager:{label:'Quản lý công trường',name:'Lê Minh Quân',avatar:'LQ',pages:[['manager-home','▦','Tổng quan công trường'],['zones','⌖','Bản đồ rủi ro'],['actions','✓','Theo dõi khắc phục'],['reports','▥','Báo cáo an toàn'],['inspections','☷','Kế hoạch kiểm tra']]},admin:{label:'Quản trị hệ thống',name:'Phạm Thu Hà',avatar:'PH',pages:[['admin-home','▦','Tổng quan hệ thống'],['users','♙','Người dùng'],['checklists','☑','Mẫu checklist'],['zones','⌖','Khu vực'],['sites','▤','Công trường'],['help','ⓘ','Cấu hình & hướng dẫn']]}};
roleConfig.admin.pages=[['admin-home','▦','Tổng quan hệ thống'],['checklists','☑','Mẫu checklist'],['zones','⌖','Khu vực'],['users','♙','Người dùng'],['sites','▤','Công trường']];
function renderNav(){const c=roleConfig[currentRole];$('#nav').innerHTML=c.pages.map(([id,ico,label])=>`<button class="nav-item ${currentPage===id?'active':''}" aria-current="${currentPage===id?'page':'false'}" data-page="${id}"><span>${ico}</span>${label}</button>`).join('');const roleLabel=$('.role-label');if(roleLabel)roleLabel.textContent=c.label.toLocaleUpperCase('vi');$('#userName').textContent=currentRole==='safety'?profileData.name:c.name;$('#userRole').textContent=c.label;$('#avatar').textContent=c.avatar;const roleSelect=$('#roleSelect');if(roleSelect)roleSelect.value=currentRole;$('#sidebar').classList.toggle('safety-role',currentRole==='safety')}
function heading(title,desc,actions=''){return `<div class="page-heading"><div><div class="eyebrow">SITESAFE / ${esc(roleConfig[currentRole].label)}</div><h1>${title}</h1><p>${desc}</p></div><div class="heading-actions">${actions}</div></div>`}
function btn(label,action,kind='primary',extra=''){return `<button class="btn ${kind==='primary'?'btn-primary':kind==='danger'?'btn-danger':'btn-light'} ${extra}" data-action="${action}">${label}</button>`}
function stat(label,value,note,icon){return `<article class="stat-card"><div class="stat-top"><span>${label}</span><span class="stat-icon">${icon}</span></div><div class="stat-value">${value}</div><div class="stat-note">${note}</div></article>`}
function badge(status){let cls='gray';if(/Cao|Mới ghi nhận|Chưa thực hiện|Quá hạn|Lỗi|Từ chối/i.test(status))cls='red';else if(/Trung bình|Đang xử lý|Đang thực hiện|Đang lên lịch|Bản nháp/i.test(status))cls='orange';else if(/Hoàn thành|Đã khắc phục|Đang hoạt động|Đã duyệt|Đang sử dụng/i.test(status))cls='green';else if(/Đang thi công|Đã ghi nhận/i.test(status))cls='blue';return `<span class="badge ${cls}">${esc(status)}</span>`}
function riskTable(items){if(!items.length)return empty('Chưa có nguy cơ phù hợp','Thử đổi bộ lọc hoặc tạo báo cáo nguy cơ mới.');return `<div class="table-wrap"><table><thead><tr><th>Mã / Nguy cơ</th><th>Khu vực</th><th>Mức độ</th><th>Trạng thái</th><th>Người phụ trách</th><th>Thao tác</th></tr></thead><tbody>${items.map(x=>`<tr><td><div class="cell-title">${esc(x.title)}</div><div class="subcell">${esc(x.id)} · ${esc(x.date)}</div></td><td>${esc(x.zone)}</td><td>${badge(x.level)}</td><td>${badge(x.status)}</td><td>${esc(x.owner)}</td><td><div class="actions-cell"><button class="text-btn" data-action="view-risk" data-id="${x.id}">Chi tiết</button><button class="text-btn" data-action="edit-risk" data-id="${x.id}">Sửa</button></div></td></tr>`).join('')}</tbody></table></div>`}
function empty(title,desc,action=''){return `<div class="empty-state"><div class="empty-icon">⌕</div><strong>${title}</strong><span>${desc}</span>${action?`<div style="margin-top:14px">${action}</div>`:''}</div>`}
function toolbar(placeholder,filters=[],actionLabel='',action=''){return `<div class="toolbar"><input class="field-control search-control" id="searchInput" placeholder="${placeholder}" value="${esc(searchTerm)}" aria-label="Tìm kiếm">${filters.length?`<select class="field-control" id="statusFilter" aria-label="Lọc trạng thái">${['Tất cả',...filters].map(f=>`<option ${activeFilter===f?'selected':''}>${f}</option>`).join('')}</select>`:''}${actionLabel?btn(actionLabel,action):''}</div>`}
function aiForm(kind){aiKind=kind;aiResult=null;const cfg={classify:{title:'Phân loại nguy cơ',desc:'Mô tả điều quan sát được tại hiện trường.',fields:`<div class="form-field"><label for="aiDescription">Mô tả hiện trường *</label><textarea id="aiDescription" required minlength="12" placeholder="Ví dụ: Lan can tầng 4 chưa được lắp, công nhân đang làm gần mép sàn…"></textarea><small>Ít nhất 12 ký tự. Tránh nhập dữ liệu cá nhân.</small></div><div class="form-field"><label for="aiZone">Khu vực</label><select id="aiZone">${db.zones.map(z=>`<option>${esc(z.name)}</option>`).join('')}</select></div>`},checklist:{title:'Sinh checklist an toàn',desc:'Xác định công việc để tạo danh sách kiểm tra ban đầu.',fields:`<div class="form-field"><label for="aiWork">Công việc *</label><input id="aiWork" required minlength="3" placeholder="Ví dụ: Làm việc trên cao"></div><div class="form-field"><label for="aiRisk">Mức độ rủi ro dự kiến</label><select id="aiRisk"><option>Cao</option><option>Trung bình</option><option>Thấp</option></select></div>`},hotspot:{title:'Phân tích điểm nóng',desc:'Tổng hợp nguy cơ đang mở để đề xuất khu vực ưu tiên.',fields:`<div class="form-field"><label for="aiScope">Phạm vi phân tích</label><select id="aiScope"><option>Toàn bộ công trường</option>${db.zones.map(z=>`<option>${esc(z.name)}</option>`).join('')}</select></div><div class="form-field"><label for="aiExtra">Ghi chú bổ sung (không bắt buộc)</label><textarea id="aiExtra" placeholder="Thông tin quan sát thêm…"></textarea></div>`}}[kind];$('#aiWorkspace').innerHTML=`<div class="panel-head"><div><h2>${cfg.title}</h2><div class="panel-sub">${cfg.desc}</div></div><button class="text-btn" data-action="ai-clear">Đóng / làm lại</button></div><form id="aiForm" data-kind="${kind}">${cfg.fields}<div class="modal-actions"><button type="button" class="btn btn-light" data-action="ai-clear">Hủy</button><button class="btn btn-primary" type="submit">Phân tích đề xuất</button></div></form><div id="aiOutput"></div>`;$('#aiWorkspace').scrollIntoView({behavior:'smooth',block:'start'})}
function runAI(form){const kind=form.dataset.kind;const data=kind==='classify'?{aiDescription:$('#aiDescription')?.value||'',aiZone:$('#aiZone')?.value||''}:kind==='checklist'?{aiWork:$('#aiWork')?.value||'',aiRisk:$('#aiRisk')?.value||'Trung bình'}:{aiScope:$('#aiScope')?.value||'Toàn bộ công trường',aiExtra:$('#aiExtra')?.value||''};if(kind==='classify'&&(!data.aiDescription||data.aiDescription.trim().length<12)){toast('Mô tả cần ít nhất 12 ký tự.');$('#aiDescription').focus();return}if(kind==='checklist'&&(!data.aiWork||data.aiWork.trim().length<3)){toast('Hãy nhập tên công việc.');return}const out=$('#aiOutput');out.innerHTML=`<div class="ai-result" style="margin-top:16px"><strong>Đang phân tích yêu cầu…</strong><div class="loading-pulse"></div><div class="loading-pulse" style="width:72%"></div><p>Đang kiểm tra đầu vào và tạo kết quả mô phỏng.</p></div>`;setTimeout(()=>{let result;if(kind==='classify'){const d=data.aiDescription.toLowerCase();const high=/mép sàn|lan can|không có dây an toàn|ngã cao|điện giật|cháy|sập/i.test(d);const medium=/dây điện|lối đi|vật liệu|trượt|vấp/i.test(d);result={title:'Đề xuất phân loại nguy cơ',category:high?'Làm việc trên cao / nguy cơ nghiêm trọng':medium?'Điện / vấp ngã / cản trở lối đi':'Nguy cơ cần xác minh tại hiện trường',level:high?'Cao':medium?'Trung bình':'Chưa đủ dữ liệu',confidence:high?88:medium?73:42,explain:high?'Mô tả có từ khóa liên quan đến mép sàn hoặc làm việc trên cao. Cần xác minh biện pháp bảo vệ tập thể.':medium?'Mô tả có dấu hiệu liên quan dây dẫn hoặc lối đi. Cần kiểm tra điều kiện thực tế.':'Mô tả chưa chứa dấu hiệu đủ rõ để xác định mức độ. Cán bộ an toàn cần bổ sung ảnh, vị trí và hậu quả tiềm ẩn.',action:high?'Cô lập khu vực nguy hiểm; kiểm tra lan can, rào chắn và phương án chống ngã.':medium?'Cảnh báo khu vực; sắp xếp lối đi hoặc bảo vệ dây dẫn; kiểm tra lại tại chỗ.':'Dùng đánh giá thủ công; bổ sung mô tả cụ thể và kiểm tra theo quy trình.',zone:data.aiZone,raw:data.aiDescription,kind};}else if(kind==='checklist'){const high=data.aiRisk==='Cao';result={title:'Checklist đề xuất: '+data.aiWork,category:'Checklist công việc',level:data.aiRisk,confidence:high?81:68,explain:`Danh sách được tạo theo tên công việc “${data.aiWork}” và mức rủi ro ${data.aiRisk.toLowerCase()}. Đây là bản nháp, chưa được chuyên gia xác nhận.`,items:high?['Kiểm tra điều kiện và giấy phép làm việc','Kiểm tra thiết bị bảo hộ cá nhân','Kiểm tra rào chắn và vùng nguy hiểm','Kiểm tra thiết bị / dụng cụ trước khi dùng','Họp phổ biến nguy cơ đầu ca','Xác nhận người giám sát','Dừng việc nếu điều kiện không an toàn']:['Xác nhận khu vực làm việc đã được phổ biến','Kiểm tra thiết bị và bảo hộ cần thiết','Kiểm tra lối đi và vệ sinh khu vực','Ghi nhận bất thường trước khi bắt đầu'],raw:data.aiWork,kind};}else{const scoped=db.risks.filter(r=>r.status!=='Đã khắc phục'&&(data.aiScope==='Toàn bộ công trường'||r.zone===data.aiScope));const counts={};scoped.forEach(r=>counts[r.zone]=(counts[r.zone]||0)+(r.level==='Cao'?2:r.level==='Trung bình'?1:0.5));const top=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];result={title:'Điểm nóng cần xem xét',category:'Ưu tiên kiểm tra',level:scoped.some(r=>r.level==='Cao')?'Cao':'Trung bình',confidence:scoped.length?Math.min(90,55+scoped.length*8):35,explain:scoped.length?`Tổng hợp ${scoped.length} nguy cơ chưa khắc phục trong phạm vi đã chọn. Điểm số ưu tiên chỉ dựa trên mức độ được ghi trong dữ liệu demo.`:'Không tìm thấy nguy cơ đang mở trong phạm vi này. Kết quả có thể thiếu dữ liệu mới.',action:top?`Ưu tiên kiểm tra ${top[0]} trước; xác minh trực tiếp hiện trường và hạn chế rủi ro ngay nếu cần.`:'Bổ sung báo cáo nguy cơ hoặc kiểm tra thủ công.',zone:top?.[0]||data.aiScope,items:scoped.map(r=>`${r.id}: ${r.title} (${r.level})`),kind};}aiResult=result;renderAIResult(result);},650)}
function renderAIResult(r){
 const low=r.confidence<55;
 const impacted=$('#aiPeople')?.value.trim()||'';
 $('#aiOutput').innerHTML=`<div class="ai-result" style="margin-top:16px"><div class="panel-head"><h3>${esc(r.title)}</h3>${badge(low?'AI chưa chắc chắn':`Tin cậy mô phỏng ${r.confidence}%`)}</div><div class="stat-top"><span>Mức ưu tiên đề xuất</span>${badge(r.level)}</div><div class="confidence"><span style="width:${r.confidence}%"></span></div><p><strong>Vì sao có kết quả này?</strong><br>${esc(r.explain)}</p>${r.category?`<p><strong>Nhóm:</strong> ${esc(r.category)}</p>`:''}${r.action?`<p><strong>Đề xuất ban đầu:</strong> ${esc(r.action)}</p>`:''}${r.zone?`<p><strong>Khu vực:</strong> ${esc(r.zone)}</p>`:''}${impacted?`<p><strong>Người có thể bị ảnh hưởng:</strong> ${esc(impacted)}</p>`:''}${r.items?`<ul>${r.items.map(i=>`<li>${esc(i)}</li>`).join('')}</ul>`:''}${low?`<div class="notice error">AI chưa chắc chắn hoặc thiếu dữ liệu. Hãy chỉnh sửa đầu vào, thử lại, bỏ qua đề xuất hoặc sử dụng đánh giá thủ công.</div>`:`<div class="notice">Kết quả có thể sai. Hãy kiểm tra tại hiện trường; không tự động xem đây là quyết định an toàn cuối cùng.</div>`}<div class="ai-actions"><button class="btn btn-primary" data-action="ai-accept">Chấp nhận & lưu</button><button class="btn btn-light" data-action="ai-edit">Sửa kết quả</button><button class="btn btn-light" data-action="ai-regenerate">Tạo lại</button><button class="btn btn-light" data-action="ai-reject">Từ chối / bỏ qua</button><button class="btn btn-light" data-action="ai-manual">Dùng thủ công</button><button class="btn btn-light" data-action="ai-report-error">Báo cáo kết quả</button></div></div>`;
}
function modalForm(title,fields,submitLabel='Lưu thông tin'){modalConfig={title,fields};$('#modalTitle').textContent=title;$('#modalBody').innerHTML=`<form id="entityForm">${fields.map(f=>`<div class="form-field"><label for="f-${f.name}">${f.label}${f.required?' *':''}</label>${f.type==='select'?`<select id="f-${f.name}" name="${f.name}" ${f.required?'required':''}>${f.options.map(o=>`<option ${o===f.value?'selected':''}>${esc(o)}</option>`).join('')}</select>`:f.type==='textarea'?`<textarea id="f-${f.name}" name="${f.name}" ${f.required?'required':''} ${f.minlength?`minlength="${f.minlength}"`:''}>${esc(f.value||'')}</textarea>`:`<input id="f-${f.name}" name="${f.name}" type="${f.type||'text'}" value="${esc(f.value||'')}" ${f.required?'required':''} ${f.minlength?`minlength="${f.minlength}"`:''} ${f.type==='number'?'min="0"':''}>`}${f.help?`<small>${f.help}</small>`:''}</div>`).join('')}<div class="modal-actions"><button type="button" class="btn btn-light" data-action="close-modal">Hủy</button><button type="submit" class="btn btn-primary">${submitLabel}</button></div></form>`;$('#modalBackdrop').classList.add('open');setTimeout(()=>$('#modalBody input,#modalBody select,#modalBody textarea')?.focus(),50)}
function openEntity(type,id){const collection={risk:'risks',inspection:'inspections',action:'actions',zone:'zones',checklist:'checklists',user:'users'}[type];const old=id?db[collection].find(x=>x.id===id):null;const f=(name,label,opts={})=>({name,label,...opts,value:old?.[name]??opts.value??''});const fields={risk:[f('title','Tên nguy cơ',{required:true,minlength:5}),f('zone','Khu vực',{required:true,type:'select',options:db.zones.map(x=>x.name)}),f('level','Mức độ',{required:true,type:'select',options:['Cao','Trung bình','Thấp'],value:'Trung bình'}),f('status','Trạng thái',{required:true,type:'select',options:['Mới ghi nhận','Đang xử lý','Đã khắc phục']}),f('owner','Người phụ trách',{required:true}),f('date','Ngày ghi nhận',{required:true,type:'date',value:'2026-10-20'}),f('desc','Mô tả hiện trường',{type:'textarea',required:true,minlength:10})],inspection:[f('title','Nội dung kiểm tra',{required:true,minlength:3}),f('zone','Khu vực',{required:true,type:'select',options:db.zones.map(x=>x.name)}),f('date','Ngày kiểm tra',{required:true,type:'date',value:'2026-10-21'}),f('time','Giờ kiểm tra',{required:true,type:'time',value:'08:30'}),f('assignee','Người phụ trách',{required:true}),f('status','Trạng thái',{required:true,type:'select',options:['Đã lên lịch','Đang thực hiện','Hoàn thành']}),f('note','Ghi chú',{type:'textarea'})],action:[f('title','Hành động khắc phục',{required:true,minlength:4}),f('risk','Mã nguy cơ liên quan',{required:true,type:'select',options:db.risks.map(x=>x.id)}),f('owner','Người phụ trách',{required:true}),f('due','Hạn hoàn thành',{required:true,type:'date',value:'2026-10-22'}),f('priority','Ưu tiên',{required:true,type:'select',options:['Cao','Trung bình','Thấp'],value:'Trung bình'}),f('status','Trạng thái',{required:true,type:'select',options:['Chưa thực hiện','Đang thực hiện','Hoàn thành']}),f('note','Biện pháp / ghi chú',{type:'textarea',required:true,minlength:5})],zone:[f('name','Tên khu vực',{required:true,minlength:3}),f('type','Loại công việc',{required:true}),f('workers','Số người làm việc',{required:true,type:'number'}),f('risk','Mức độ rủi ro',{required:true,type:'select',options:['Cao','Trung bình','Thấp'],value:'Trung bình'}),f('status','Trạng thái',{required:true,type:'select',options:['Đang thi công','Tạm dừng','Hoàn thành']}),f('note','Ghi chú',{type:'textarea'})],checklist:[f('title','Tên mẫu checklist',{required:true,minlength:3}),f('category','Nhóm công việc',{required:true}),f('items','Số hạng mục',{required:true,type:'number',value:8}),f('status','Trạng thái',{required:true,type:'select',options:['Đang sử dụng','Bản nháp','Lưu trữ'],value:'Bản nháp'})],user:[f('name','Họ tên',{required:true,minlength:3}),f('email','Email',{required:true,type:'email'}),f('role','Vai trò',{required:true,type:'select',options:['Công nhân','Cán bộ an toàn','Quản lý công trường','Quản trị hệ thống']}),f('status','Trạng thái',{required:true,type:'select',options:['Đang hoạt động','Đã khóa'],value:'Đang hoạt động'})]}[type];modalForm(`${old?'Cập nhật':'Tạo mới'} ${({risk:'nguy cơ',inspection:'lịch kiểm tra',action:'hành động khắc phục',zone:'khu vực',checklist:'mẫu checklist',user:'người dùng'})[type]}`,fields);$('#entityForm').dataset.type=type;$('#entityForm').dataset.id=id||''}
function submitEntity(form){const type=form.dataset.type,id=form.dataset.id;const values=Object.fromEntries(new FormData(form).entries());if(type==='risk'&&values.desc.trim().length<10){toast('Mô tả cần ít nhất 10 ký tự.');return}const collection={risk:'risks',inspection:'inspections',action:'actions',zone:'zones',checklist:'checklists',user:'users'}[type];let target=id?db[collection].find(x=>x.id===id):null;if(target)Object.assign(target,values);else{const prefix={risk:'RS',inspection:'KT',action:'KP',zone:'KV',checklist:'CL',user:'U'}[type];const num=String(Math.max(0,...db[collection].map(x=>parseInt((x.id.match(/\d+/)||['0'])[0],10)))+1).padStart(3,'0');target={id:`${prefix}-${num}`,...values};if(type==='checklist'){target.items=Number(target.items);target.updated='2026-10-20'}if(type==='zone')target.workers=Number(target.workers);db[collection].unshift(target)}saveDB();closeModal();toast(id?'Đã cập nhật bản ghi.':'Đã tạo bản ghi mới.');renderPage()}
function closeModal(){$('#modalBackdrop').classList.remove('open');modalConfig=null}
function exportCSV(collection){const rows=db[collection];if(!rows?.length){toast('Không có dữ liệu để xuất.');return}const cols=[...new Set(rows.flatMap(Object.keys))];const csv='\ufeff'+[cols.join(','),...rows.map(r=>cols.map(c=>'"'+String(r[c]??'').replace(/"/g,'""')+'"').join(','))].join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));const a=document.createElement('a');a.href=url;a.download=`sitesafe-${collection}.csv`;a.click();URL.revokeObjectURL(url);toast('Đã tạo tệp CSV.')}
// Điều hướng đến tệp HTML thực tế, để nội dung chính luôn nằm trong HTML.
const siteRootURL = new URL('../', document.currentScript.src);
const pageFiles={
 safety:{dashboard:'safety/safety-dashboard.html',risks:'safety/safety-risks.html',inspections:'safety/safety-inspections.html',actions:'safety/safety-corrective-actions.html',zones:'safety/safety-zones.html',reports:'safety/safety-reports.html',checklists:'safety/safety-checklist-templates.html',ai:'safety/safety-ai-assistant.html'},
 worker:{'worker-home':'worker/worker-dashboard.html','worker-checklist':'worker/worker-checklist.html','worker-report':'worker/worker-report-create.html','worker-history':'worker/worker-report-history.html'},
 manager:{'manager-home':'manager/manager-dashboard.html',zones:'manager/manager-risk-map.html',actions:'manager/manager-corrective-actions.html',reports:'manager/manager-reports.html'},
 admin:{'admin-home':'admin/admin-dashboard.html',users:'admin/admin-users.html',checklists:'admin/admin-checklist-templates.html',zones:'admin/admin-zones.html'}
};
function openPage(page,role=currentRole){
 if(role==='safety'&&window.safetySingleApp)page=({actions:'risks',zones:'risks',reports:'dashboard',checklists:'inspections'})[page]||page;
 const file=page==='help'?'shared-help.html':page==='profile'?'shared-profile.html':pageFiles[role]?.[page];
 if(file&&!(role==='safety'&&window.safetySingleApp)){window.location.assign(new URL(file,siteRootURL).href+(page==='help'||page==='profile'?'?role='+encodeURIComponent(role):''));return}
 currentRole=role;currentPage=page;renderPage();
}
function renderPage(){renderNav();searchTerm='';activeFilter='Tất cả';if(currentPage!=='profile')profileSaved=false;const p=$('#pageContent');const pages={'dashboard':dashboard,'risks':currentRole==='safety'?safetyRisksPage:risksPage,'inspections':currentRole==='safety'?safetyInspectionsPage:inspectionsPage,'actions':actionsPage,'zones':zonesPage,'reports':reportsPage,'checklists':checklistsPage,'users':usersPage,'sites':adminSitesPage,'ai':currentRole==='safety'?safetyAiPage:aiPage,'worker-home':workerHome,'worker-checklist':workerChecklist,'worker-report':workerReport,'worker-history':workerHistory,'manager-home':managerHome,'admin-home':adminHome,'help':helpPage,'profile':profilePage};if(p.dataset.staticReady==='used'||!p.children.length||currentPage!==document.body.dataset.initialPage){p.innerHTML=(pages[currentPage]||dashboard)();}p.dataset.staticReady='used';if(currentPage==='profile'&&profileSaved)$('#profileSaved').hidden=false;}
function handleAction(action,id){const find=(arr)=>arr.find(x=>x.id===id);switch(action){case'new-risk':openEntity('risk');break;case'new-inspection':openEntity('inspection');break;case'new-action':openEntity('action');break;case'new-zone':openEntity('zone');break;case'new-checklist':openEntity('checklist');break;case'new-user':openEntity('user');break;case'edit-risk':openEntity('risk',id);break;case'edit-inspection':openEntity('inspection',id);break;case'edit-action':openEntity('action',id);break;case'edit-zone':openEntity('zone',id);break;case'edit-checklist':openEntity('checklist',id);break;case'edit-user':openEntity('user',id);break;case'view-risk':{const x=find(db.risks);if(!x){toast('Không tìm thấy nguy cơ này.');break}const related=db.actions.filter(a=>a.risk===x.title||a.risk===x.id);modalForm(`${x.id} · ${x.title}`,[]);$('#modalBody').innerHTML=`<div class="risk-detail-grid"><div><span class="risk-detail-label">Khu vực</span><strong>${esc(x.zone)}</strong></div><div><span class="risk-detail-label">Mức độ</span>${badge(x.level)}</div><div><span class="risk-detail-label">Trạng thái</span>${badge(x.status)}</div><div><span class="risk-detail-label">Người phụ trách</span><strong>${esc(x.owner)}</strong></div><div><span class="risk-detail-label">Ngày ghi nhận</span><strong>${esc(x.date)}</strong></div></div><section class="risk-detail-section"><h3>Mô tả hiện trường</h3><p>${esc(x.desc)}</p></section><section class="risk-detail-section"><h3>Hành động khắc phục</h3>${related.length?related.map(a=>`<p><strong>${esc(a.title)}</strong> · ${badge(a.status)} · Hạn ${esc(a.due)}</p>`).join(''):'<p>Chưa có hành động khắc phục được liên kết.</p>'}</section><section class="risk-detail-section"><h3>Minh chứng bổ sung</h3>${x.evidence?.length?x.evidence.map(e=>`<p>${esc(e.date)} · ${esc(e.note)}</p>`).join(''):'<p>Chưa có minh chứng bổ sung.</p>'}</section><div class="modal-actions"><button type="button" class="btn btn-light" data-action="close-modal">Đóng</button><button type="button" class="btn btn-primary" data-action="edit-risk" data-id="${esc(x.id)}">Chỉnh sửa báo cáo</button></div>`;break}case'open-worker-ai':currentPage='ai';renderPage();aiForm('checklist');break;case'worker-evidence':{const x=find(db.risks);if(!x){toast('Không tìm thấy báo cáo cần cập nhật.');break}modalForm(`Bổ sung minh chứng · ${x.id}`,[{name:'note',label:'Ghi chú / minh chứng',type:'textarea',required:true,minlength:5,value:'',help:'Mô tả tình trạng mới hoặc thông tin cần cán bộ an toàn xác minh.'}],'Lưu minh chứng');const form=$('#entityForm');form.dataset.type='risk-evidence';form.dataset.id=x.id;break}case'view-zone':{const x=find(db.zones);modalForm(x.name,[{name:'detail',label:'Chi tiết khu vực',type:'textarea',value:`${x.id}\nLoại công việc: ${x.type}\nSố người: ${x.workers}\nRủi ro: ${x.risk}\nTrạng thái: ${x.status}\nGhi chú: ${x.note}`}]);$('#modalBody textarea').readOnly=true;break}case'advance-inspection':{const x=find(db.inspections);x.status=x.status==='Đã lên lịch'?'Đang thực hiện':x.status==='Đang thực hiện'?'Hoàn thành':'Đã lên lịch';saveDB();renderPage();toast('Đã cập nhật trạng thái kiểm tra.');break}case'advance-action':{const x=find(db.actions);x.status=x.status==='Chưa thực hiện'?'Đang thực hiện':x.status==='Đang thực hiện'?'Hoàn thành':'Chưa thực hiện';saveDB();renderPage();toast('Đã cập nhật tiến độ hành động.');break}case'toggle-checklist':{const x=find(db.checklists);x.status=x.status==='Đang sử dụng'?'Lưu trữ':'Đang sử dụng';saveDB();renderPage();toast('Đã cập nhật trạng thái mẫu.');break}case'toggle-user':{const x=find(db.users);x.status=x.status==='Đang hoạt động'?'Đã khóa':'Đang hoạt động';saveDB();renderPage();toast('Đã cập nhật trạng thái người dùng.');break}case'export-risks':exportCSV('risks');break;case'export-inspections':exportCSV('inspections');break;case'export-actions':exportCSV('actions');break;case'export-checklists':exportCSV('checklists');break;case'export-users':exportCSV('users');break;case'export-all':Object.keys(db).filter(k=>Array.isArray(db[k])).forEach(exportCSV);break;case'ai-classify':aiForm('classify');break;case'ai-checklist':aiForm('checklist');break;case'ai-hotspot':aiForm('hotspot');break;case'ai-report':aiForm('hotspot');break;case'ai-clear':renderPage();break;case'ai-accept':if(!aiResult){toast('Chưa có kết quả để lưu.');break}if(aiResult.kind==='classify'){db.risks.unshift({id:`RS-${String(Date.now()).slice(-3)}`,title:aiResult.raw.slice(0,60),zone:aiResult.zone,level:['Cao','Trung bình','Thấp'].includes(aiResult.level)?aiResult.level:'Trung bình',status:'Mới ghi nhận',owner:roleConfig[currentRole].name,date:'2026-10-20',desc:aiResult.action});saveDB();toast('Đã lưu đề xuất thành nguy cơ nháp. Hãy xác minh thực tế.')}else if(aiResult.kind==='checklist'){db.checklists.unshift({id:`CL-${String(Date.now()).slice(-3)}`,title:aiResult.title.replace('Checklist đề xuất: ',''),category:'AI tạo · cần duyệt',items:aiResult.items.length,status:'Bản nháp',updated:'2026-10-20'});saveDB();toast('Đã lưu checklist ở trạng thái bản nháp.')}else{toast('Đã lưu ghi chú phân tích vào phiên demo.')}break;case'ai-edit':if(!aiResult){break}modalForm('Chỉnh sửa kết quả AI',[{name:'title',label:'Tiêu đề',required:true,value:aiResult.title},{name:'level',label:'Mức độ',type:'select',options:['Cao','Trung bình','Thấp','Chưa đủ dữ liệu'],value:aiResult.level},{name:'action',label:'Đề xuất',type:'textarea',value:aiResult.action||aiResult.explain}]);$('#entityForm').dataset.type='ai-edit';break;case'ai-regenerate':if(aiKind)aiForm(aiKind);break;case'ai-reject':aiResult=null;$('#aiOutput').innerHTML='<div class="notice">Đã bỏ qua kết quả AI. Không có dữ liệu nghiệp vụ nào được thay đổi.</div>';toast('Đã từ chối đề xuất.');break;case'ai-manual':toast('Hãy dùng biểu mẫu nghiệp vụ và đánh giá thủ công.');currentPage='risks';renderPage();openEntity('risk');break;case'ai-report-error':toast('Đã ghi nhận phản hồi trong phiên demo.');break;case'save-worker-checklist':{const checks=$$('input[type=checkbox][id^="check-"]');const unchecked=checks.filter(c=>!c.checked);if(unchecked.length){toast(`Còn ${unchecked.length} hạng mục chưa xác nhận.`)}else toast('Checklist demo đã được xác nhận hoàn thành.');break}case'backup-json':{const u=URL.createObjectURL(new Blob([JSON.stringify(db,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download='sitesafe-backup.json';a.click();URL.revokeObjectURL(u);toast('Đã tải bản sao JSON.');break}case'reset-demo':if(confirm('Khôi phục toàn bộ dữ liệu demo? Thay đổi cục bộ hiện tại sẽ bị mất.')){db=structuredClone(seed);saveDB();renderPage();toast('Đã khôi phục dữ liệu demo.')}break;case'edit-profile':toast('Chỉnh sửa hồ sơ sẽ được bổ sung trong bản có xác thực.');break;case'close-modal':closeModal();break}}
document.addEventListener('click',e=>{const demo=e.target.closest('[data-demo]');if(demo){toast('Đây là thành phần minh họa theo Figma; chức năng chưa được kết nối.');return}});
document.addEventListener('click',e=>{const nav=e.target.closest('[data-page]');if(nav){openPage(nav.dataset.page);$('#sidebar').classList.remove('open');return}const a=e.target.closest('[data-action]');if(a)handleAction(a.dataset.action,a.dataset.id)});
document.addEventListener('submit',e=>{e.preventDefault();if(e.target.id==='entityForm'){if(e.target.dataset.type==='ai-edit'){const vals=Object.fromEntries(new FormData(e.target).entries());if(aiResult)Object.assign(aiResult,{title:vals.title,level:vals.level,action:vals.action});closeModal();renderAIResult(aiResult);toast('Đã cập nhật đề xuất AI; cần kiểm tra trước khi dùng.')}else if(e.target.dataset.type==='risk-evidence'){const risk=db.risks.find(x=>x.id===e.target.dataset.id);if(!risk){toast('Không tìm thấy báo cáo cần cập nhật.');return}risk.evidence=risk.evidence||[];risk.evidence.unshift({date:new Date().toISOString().slice(0,10),note:new FormData(e.target).get('note').toString().trim()});saveDB();closeModal();renderPage();toast('Đã lưu ghi chú minh chứng.')}else submitEntity(e.target)}else if(e.target.id==='aiForm')runAI(e.target);else if(e.target.id==='workerReportForm'){const v=Object.fromEntries(new FormData(e.target).entries());db.risks.unshift({id:`RS-${String(Date.now()).slice(-3)}`,title:v.title,zone:v.zone,level:v.level==='Chưa xác định'?'Trung bình':v.level,status:'Mới ghi nhận',owner:roleConfig[currentRole].name,date:'2026-10-20',desc:v.desc});saveDB();toast('Đã gửi báo cáo demo đến danh sách nguy cơ.');currentPage='worker-history';renderPage()}});
document.addEventListener('input',e=>{if(e.target.id==='dashboardSearch'){const q=e.target.value.toLowerCase();const list=db.risks.filter(x=>x.status!=='Đã khắc phục'&&(`${x.id} ${x.title} ${x.zone} ${x.owner}`.toLowerCase().includes(q)));const region=$('#dashboardRiskRows');if(region)region.innerHTML=riskTable(list.slice(0,4));}});
document.addEventListener('change',e=>{if(e.target.id==='dashboardFilter'){const filter=e.target.value;const region=$('#dashboardRiskRows');if(!region)return;let list=db.risks.filter(x=>x.status!=='Đã khắc phục');if(filter==='high')list=list.filter(x=>x.level==='Cao');if(filter==='pending')list=list.filter(x=>x.status==='Mới ghi nhận');if(filter==='overdue')list=db.actions.filter(x=>x.status!=='Hoàn thành').map(a=>({id:a.id,title:a.title,zone:a.risk,level:a.priority,status:a.status,owner:a.owner,date:a.due}));region.innerHTML=filter==='overdue'?`<div class="table-wrap"><table><thead><tr><th>Mã / Hành động</th><th>Nguy cơ</th><th>Mức độ</th><th>Trạng thái</th><th>Phụ trách</th></tr></thead><tbody>${list.map(x=>`<tr><td>${esc(x.id)} · ${esc(x.title)}</td><td>${esc(x.zone)}</td><td>${badge(x.level)}</td><td>${badge(x.status)}</td><td>${esc(x.owner)}</td></tr>`).join('')}</tbody></table></div>`:riskTable(list.slice(0,4));}});
document.addEventListener('input',e=>{if(e.target.id==='searchInput'){const pos=e.target.selectionStart;searchTerm=e.target.value;const p=currentPage;const renderer={risks:risksPage,inspections:inspectionsPage,actions:actionsPage,checklists:checklistsPage,users:usersPage,zones:zonesPage,'worker-history':workerHistory}[p];if(renderer){$('#pageContent').innerHTML=renderer();const next=$('#searchInput');if(next){next.focus();next.setSelectionRange(pos,pos)}}}});
document.addEventListener('change',e=>{if(e.target.id==='roleSelect'){openPage(roleConfig[e.target.value].pages[0][0],e.target.value)}if(e.target.id==='statusFilter'){activeFilter=e.target.value;const p=currentPage;const renderer={risks:risksPage,inspections:inspectionsPage,actions:actionsPage,checklists:checklistsPage,users:usersPage,zones:zonesPage,'worker-history':workerHistory}[p];if(renderer){$('#pageContent').innerHTML=renderer();const s=$('#statusFilter');if(s)s.value=activeFilter}}});
$('#mobileMenu').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));$('#closeModal').addEventListener('click',closeModal);$('#modalBackdrop').addEventListener('click',e=>{if(e.target.id==='modalBackdrop')closeModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();$('#sidebar').classList.remove('open')}});$('#siteSwitch').addEventListener('click',()=>toast('Nguyên mẫu hiện có một công trường: Riverside – Khối A.'));$('#notifications').addEventListener('click',()=>{const unread=db.notifications.filter(n=>!n.read);modalForm('Thông báo',unread.map((n,i)=>({name:`n${i}`,label:n.title,type:'textarea',value:`${n.desc}\n${n.time}`})));$$('#modalBody textarea').forEach(x=>x.readOnly=true);db.notifications.forEach(n=>n.read=true);saveDB()});
renderPage();
document.addEventListener('input',e=>{
 if(e.target.id==='dashboardSearch'){safetyDashboardSearchTerm=e.target.value;const pos=e.target.selectionStart;$('#pageContent').innerHTML=dashboard();const next=$('#dashboardSearch');next?.focus();next?.setSelectionRange(pos,pos)}
 if(e.target.id==='safetyRiskSearch'){searchTerm=e.target.value;const pos=e.target.selectionStart;$('#pageContent').innerHTML=safetyRisksPage();const next=$('#safetyRiskSearch');next?.focus();next?.setSelectionRange(pos,pos)}
 if(e.target.id==='safetyInspectionSearch'){safetyInspectionSearchTerm=e.target.value;const pos=e.target.selectionStart;$('#pageContent').innerHTML=safetyInspectionsPage();const next=$('#safetyInspectionSearch');next?.focus();next?.setSelectionRange(pos,pos)}
});
document.addEventListener('change',e=>{
 if(e.target.id==='dashboardFilter'){safetyDashboardFilter=e.target.value;$('#pageContent').innerHTML=dashboard()}
 if(e.target.id==='safetyRiskSelect'){safetySelectedRiskId=e.target.value;$('#pageContent').innerHTML=safetyRisksPage()}
 if(e.target.id==='safetyInspectionStatus'){safetyInspectionStatus=e.target.value;$('#pageContent').innerHTML=safetyInspectionsPage()}
 if(e.target.id==='aiSource'&&e.target.value){const risk=db.risks.find(x=>x.id===e.target.value);if(risk){$('#aiDescription').value=risk.desc;const zone=$('#aiZone');if([...zone.options].some(o=>o.value===risk.zone||o.text===risk.zone))zone.value=risk.zone}}
 if(e.target.id==='aiEvidence'){
  const note=$('#aiEvidenceNote');
  const files=[...e.target.files];
  if(files.length>5||files.some(file=>(!file.type.startsWith('image/')&&file.type!=='application/pdf')||file.size>10*1024*1024)){e.target.value='';if(note)note.textContent='JPG, PNG hoặc PDF · tối đa 5 tệp, mỗi tệp không quá 10 MB · chỉ dùng cục bộ.';toast('Chỉ nhận tối đa 5 ảnh/PDF, mỗi tệp không quá 10 MB.');return}
  if(note)note.textContent=files.length?`${files.length} tệp đã chọn trên thiết bị này; chưa tải lên.`:'JPG, PNG hoặc PDF · tối đa 5 tệp, mỗi tệp không quá 10 MB · chỉ dùng cục bộ.';
 }
 if(e.target.id==='safetyEvidenceFiles'){
  const riskId=$('#safetyDecisionForm')?.dataset.riskId;
  if(!riskId)return;
  const selected=[...e.target.files];
  const previews=safetyEvidencePreviews[riskId]||[];
  const accepted=selected.filter(file=>(file.type.startsWith('image/')||file.type==='application/pdf')&&file.size<=10*1024*1024);
  const remaining=Math.max(0,5-previews.length);
  accepted.slice(0,remaining).forEach(file=>previews.push({name:file.name,type:file.type,url:URL.createObjectURL(file)}));
  safetyEvidencePreviews[riskId]=previews;
  if(accepted.length!==selected.length||accepted.length>remaining)toast('Chỉ nhận tối đa 5 ảnh/PDF, mỗi tệp không quá 10 MB.');
  if(previews.length)$('#pageContent').innerHTML=safetyRisksPage();
 }
});
function recordSafetyDecision(risk,decision,note,owner='',due=''){
 risk.decision=decision;
 risk.decisionNote=note;
 if(owner)risk.owner=owner;
 if(due)risk.due=due;
 if(decision==='Xác nhận')risk.status='Đang xử lý';
 risk.history=risk.history||[];
 risk.history.unshift({date:new Date().toLocaleString('vi-VN'),title:`${decision} · ${roleConfig.safety.name}`,note});
 saveDB();
}
document.addEventListener('submit',e=>{
 const form=e.target;
 if(form.id==='safetyDecisionForm'){
  e.preventDefault();
  const values=Object.fromEntries(new FormData(form).entries());
  const risk=db.risks.find(x=>x.id===form.dataset.riskId);
  if(!risk){toast('Không tìm thấy nguy cơ cần duyệt.');return}
  recordSafetyDecision(risk,values.decision,values.note.trim(),values.owner,values.due);
  toast(values.decision==='Xác nhận'?'Đã xác nhận và cập nhật nguy cơ.':'Đã lưu quyết định; trạng thái nguy cơ được giữ nguyên.');
  renderPage();
 }
 if(form.id==='safetyActionForm'){
  e.preventDefault();
  const values=Object.fromEntries(new FormData(form).entries());
  const risk=db.risks.find(x=>x.id===form.dataset.riskId);
  if(!risk){toast('Không tìm thấy nguy cơ cần giao hành động.');return}
  const number=Math.max(0,...db.actions.map(x=>parseInt((x.id.match(/\d+/)||['0'])[0],10)))+1;
  db.actions.unshift({id:`KP-${String(number).padStart(3,'0')}`,title:values.title.trim(),risk:risk.id,owner:values.owner,due:values.due,priority:risk.level,status:'Chưa thực hiện',note:''});
  saveDB();toast('Đã giao hành động khắc phục.');renderPage();
 }
 if(form.id==='safetyInspectionForm'){
  e.preventDefault();
  const values=Object.fromEntries(new FormData(form).entries());
  const [date,time]=values.scheduledAt.split('T');
  const number=Math.max(0,...db.inspections.map(x=>parseInt((x.id.match(/\d+/)||['0'])[0],10)))+1;
  db.inspections.unshift({id:`KT-${String(number).padStart(3,'0')}`,title:values.checklist,checklist:values.checklist,zone:values.zone,date,time,assignee:values.assignee,status:'Đã lên lịch',note:values.note.trim()});
  saveDB();safetyInspectionSearchTerm='';safetyInspectionStatus='Tất cả';toast('Đã lưu lịch kiểm tra.');renderPage();
 }
});
document.addEventListener('click',e=>{
 const action=e.target.closest('[data-safety-action]')?.dataset.safetyAction;
 if(!action)return;
 if(action==='open-risk'){
  safetySelectedRiskId=e.target.closest('[data-safety-action]').dataset.riskId;
  openPage('risks','safety');
  return;
 }
 if(action==='ai-manual-input'){
  $('#aiSource').value='';
  $('#aiDescription').value='';
  $('#aiDescription').focus();
  return;
 }
 const form=$('#safetyDecisionForm');
 const risk=db.risks.find(x=>x.id===form?.dataset.riskId);
 if(!risk){toast('Không tìm thấy nguy cơ cần duyệt.');return}
 if(action==='risk-request-info'||action==='risk-reject'){
  const decision=action==='risk-request-info'?'Cần bổ sung':'Từ chối';
  const noteInput=form.querySelector('[name="note"]');
  const enteredNote=noteInput.value.trim();
  if(enteredNote.length<5){toast(`Hãy nhập ${action==='risk-request-info'?'nội dung cần bổ sung':'lý do từ chối'} (ít nhất 5 ký tự).`);noteInput.focus();return}
  const note=enteredNote;
  recordSafetyDecision(risk,decision,note);
  toast(action==='risk-request-info'?'Đã ghi nhận yêu cầu bổ sung.':'Đã ghi nhận từ chối.');
  renderPage();
 }
});
// Expose only the shared state needed by the separate login module.
Object.defineProperties(window, {
  currentRole: { configurable: true, get: () => currentRole, set: value => { currentRole = value; } },
  currentPage: { configurable: true, get: () => currentPage, set: value => { currentPage = value; } }
});
window.roleConfig = roleConfig;
window.renderPage = renderPage;

}
