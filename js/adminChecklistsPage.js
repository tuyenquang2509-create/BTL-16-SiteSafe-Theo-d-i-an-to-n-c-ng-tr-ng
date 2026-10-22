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
