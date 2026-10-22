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
