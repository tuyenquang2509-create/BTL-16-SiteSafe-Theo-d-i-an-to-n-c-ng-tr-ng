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
    db.users.unshift({id:`U-${String(number).padStart(3,'0')}`,name:email.split('@')[0].replace(/[._-]/g,' '),email,role:values.role,status:'Đang hoạt động',site:values.site});
    saveDB();renderPage();toast('Đã gửi lời mời thành viên.');return;
  }
  if(form.id==='adminRoleForm'||form.id==='adminSuspendForm'){
    const user=db.users.find(x=>x.id===form.dataset.userId);
    if(!user){toast('Không tìm thấy thành viên.');return}
    if(form.id==='adminRoleForm'){
      const values=Object.fromEntries(new FormData(form).entries());
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
