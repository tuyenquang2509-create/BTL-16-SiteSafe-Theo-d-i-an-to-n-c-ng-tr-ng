/* SiteSafe giai đoạn 23 - quản lý danh mục công trường demo. */
(()=>{
 'use strict';
 if(document.body.dataset.initialPage!=='admin-home')return;
 const KEY='sitesafe_admin_sites_v23';
 const initial=[{code:'RS-A',name:'Riverside – Khối A',manager:'Lê Hoàng',zones:6,status:'Đang thi công'}, {code:'RS-B',name:'Riverside – Khối B',manager:'Lê Hoàng',zones:3,status:'Đang chuẩn bị'}];
 const read=()=>{try{const a=JSON.parse(localStorage.getItem(KEY));return Array.isArray(a)?a:initial.map(x=>({...x}));}catch{return initial.map(x=>({...x}));}};
 let sites=read(),editing=null;
 const screen=document.querySelector('.fg-screen');
 const panels=[...screen.querySelectorAll('.fg-panel')];
 const table=panels.find(p=>p.querySelector('table.fg-table'));
 const formPanel=panels.find(p=>p.querySelector('.fg-form-grid'));
 if(!table||!formPanel)return;
 const fields=[...formPanel.querySelectorAll('.fg-form-grid input,.fg-form-grid select')];
 const [code,name,manager,status]=fields;
 const formActions=formPanel.querySelector('.fg-actions');
 const saveBtn=formActions.querySelector('.btn-primary');
 const cancelBtn=formActions.querySelector('.btn-light');
 const headingBtn=screen.querySelector('.fg-heading [data-demo="new-site"]');
 const tbody=table.querySelector('tbody');
 const metric=screen.querySelector('.fg-metric strong');
 const tools=document.createElement('div');tools.className='admin23-tools';
 tools.innerHTML='<label for="siteSearch23">Tìm công trường</label><input id="siteSearch23" type="search" placeholder="Mã, tên, quản lý..."/><label for="siteStatus23">Trạng thái</label><select id="siteStatus23"><option value="">Tất cả</option><option>Đang thi công</option><option>Đang chuẩn bị</option><option>Tạm dừng</option><option>Đã hoàn thành</option></select><span id="siteCount23" aria-live="polite"></span>';
 table.querySelector('.fg-section-head').after(tools);
 status.innerHTML=['Đang chuẩn bị','Đang thi công','Tạm dừng','Đã hoàn thành'].map(x=>`<option>${x}</option>`).join('');
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const normalized=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();
 const notice=msg=>{let el=document.getElementById('toast');if(el){el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),3300)}};
 function render(){
  const q=normalized(tools.querySelector('input').value),filter=tools.querySelector('select').value;
  const filtered=sites.filter(x=>(!filter||x.status===filter)&&normalized([x.code,x.name,x.manager].join(' ')).includes(q));
  tbody.innerHTML=filtered.map(x=>`<tr><td><strong>${escape(x.code)}</strong> · ${escape(x.name)}</td><td>${escape(x.manager)}</td><td>${x.zones} khu vực</td><td><span class="fg-pill ${x.status==='Đang thi công'?'fg-green':'fg-yellow'}">${escape(x.status)}</span></td><td><button type="button" class="btn btn-light btn-sm" data-edit-site="${escape(x.code)}">Sửa</button></td></tr>`).join('')||'<tr><td colspan="5">Không tìm thấy công trường phù hợp.</td></tr>';
  const head=table.querySelector('thead tr');if(head.children.length===4){const th=document.createElement('th');th.textContent='Thao tác';head.append(th)}
  tools.querySelector('#siteCount23').textContent=`${filtered.length}/${sites.length} công trường`;
  if(metric)metric.textContent=sites.length;
 }
 function reset(){editing=null;code.disabled=false;code.value='';name.value='';manager.value='Lê Hoàng';status.value='Đang chuẩn bị';saveBtn.textContent='Lưu công trường';}
 function edit(item){editing=item.code;code.value=item.code;code.disabled=true;name.value=item.name;manager.value=item.manager;status.value=item.status;saveBtn.textContent='Cập nhật công trường';formPanel.scrollIntoView({behavior:'smooth',block:'start'});name.focus();}
 // Capture before figma-demo, so generic demo handler cannot swallow actions.
 document.addEventListener('click',e=>{
  const b=e.target.closest('[data-edit-site], [data-demo="new-site"]');
  if(!b || !screen.contains(b))return;
  e.preventDefault();e.stopImmediatePropagation();
  if(b.dataset.editSite){const item=sites.find(x=>x.code===b.dataset.editSite);if(item)edit(item);return;}
  if(b===headingBtn){reset();formPanel.scrollIntoView({behavior:'smooth',block:'start'});code.focus();return;}
  const value={code:code.value.trim().toUpperCase(),name:name.value.trim(),manager:manager.value.trim(),status:status.value,zones:editing?(sites.find(x=>x.code===editing)?.zones||0):0};
  if(!/^[A-Z0-9-]{2,20}$/.test(value.code)){notice('Mã công trường phải có 2–20 ký tự chữ, số hoặc dấu gạch ngang.');code.focus();return;}
  if(value.name.length<3){notice('Vui lòng nhập tên công trường ít nhất 3 ký tự.');name.focus();return;}
  if(!value.manager){notice('Vui lòng chọn người quản lý.');manager.focus();return;}
  if(!editing&&sites.some(x=>x.code===value.code)){notice('Mã công trường đã tồn tại.');code.focus();return;}
  if(editing){sites=sites.map(x=>x.code===editing?value:x)}else sites.push(value);
  localStorage.setItem(KEY,JSON.stringify(sites));render();reset();notice('Đã lưu công trường trong dữ liệu demo.');
 },true);
 cancelBtn.removeAttribute('data-demo');cancelBtn.removeAttribute('title');
 cancelBtn.addEventListener('click',e=>{e.preventDefault();reset();notice('Đã hủy thay đổi chưa lưu.');});
 [headingBtn,saveBtn].forEach(b=>b.removeAttribute('title'));
 tools.querySelector('input').addEventListener('input',render);tools.querySelector('select').addEventListener('change',render);
 reset();render();
})();
