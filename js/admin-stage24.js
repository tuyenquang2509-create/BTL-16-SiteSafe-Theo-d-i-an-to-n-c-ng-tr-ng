/* SiteSafe 24: data consistency and clear feedback on the admin user screen. */
(()=>{'use strict';
if(document.body.dataset.initialRole!=='admin'||document.body.dataset.initialPage!=='users')return;
function init(){
 const root=document.querySelector('.admin-reference');if(!root)return;
 const form=root.querySelector('#adminInviteForm');
 if(form){
   const note=document.createElement('p');note.className='admin-stage24-note';note.setAttribute('role','note');
   note.textContent='Chế độ demo: lời mời được lưu cục bộ; hệ thống không gửi email thật.';
   form.append(note);
 }
 const role=root.querySelector('#adminRoleForm');
 if(role){const hint=document.createElement('p');hint.className='admin-stage24-note';hint.textContent='Không thể hạ quyền quản trị viên hoạt động cuối cùng.';role.append(hint)}
 const list=root.querySelector('.admin-table-card');
 if(list){const hint=document.createElement('p');hint.className='admin-stage24-note';hint.textContent='Danh sách minh họa ban đầu; thay đổi đã lưu sẽ hiển thị khi ứng dụng cập nhật dữ liệu.';list.append(hint)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
