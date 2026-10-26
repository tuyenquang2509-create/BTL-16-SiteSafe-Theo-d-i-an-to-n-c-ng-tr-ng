/* SiteSafe stage 10: interactive manager report table. Browser-only demo. */
(()=>{'use strict';
if((document.body.dataset.initialPage!=='reports'||document.body.dataset.initialRole!=='manager'))return;
const KEY='sitesafe_manager_reports_stage10';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return []}};
const save=v=>localStorage.setItem(KEY,JSON.stringify(v));
const notify=msg=>{const t=document.getElementById('toast');if(t){t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3500)}else alert(msg)};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function init(){const root=document.querySelector('.fg-screen');if(!root)return;
const heading=root.querySelector('.fg-heading');const table=root.querySelector('.fg-table');if(!heading||!table)return;
const tbody=table.querySelector('tbody');if(!tbody)return;
const filterFields=[...root.querySelectorAll('.fg-form-grid .fg-field')];const search=filterFields[0]?.querySelector('input');const period=filterFields[2]?.querySelector('select');
if(search){search.value='';search.placeholder='Tìm mã, nội dung hoặc người tạo';}
if(period){period.innerHTML='<option value="all">Tất cả kỳ báo cáo</option><option value="40">Tuần 40</option><option value="39">Tuần 39</option><option value="38">Tuần 38</option>';}
// Keep Figma rows and append local draft records into the same table.
function render(){tbody.querySelectorAll('tr[data-stage10]').forEach(el=>el.remove());
for(const report of read()){const tr=document.createElement('tr');tr.dataset.stage10='1';tr.innerHTML=`<td>${esc(report.id)} · ${esc(report.title)}</td><td>${esc(report.period)}</td><td>${esc(report.author)}</td><td><span class="fg-pill fg-yellow">Bản nháp</span></td><td><button type="button" class="btn btn-light" data-stage10-view="${esc(report.id)}">Xem</button></td>`;tbody.prepend(tr);}
const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();const q=normalize((search?.value||'').trim()),p=period?.value||'all';let count=0;
[...tbody.rows].forEach(tr=>{const match=(!q||normalize(tr.textContent).includes(q))&&(p==='all'||tr.cells[1]?.textContent.toLowerCase().includes('tuần '+p)||tr.cells[1]?.textContent.includes(({40:'27/09',39:'20/09',38:'13/09'})[p]));tr.hidden=!match;if(match)count++});
let status=root.querySelector('#stage10ReportCount');if(!status){status=document.createElement('p');status.id='stage10ReportCount';status.className='stage10-count';table.closest('.fg-panel')?.append(status)}status.textContent=`Đang hiển thị ${count} báo cáo.`;
}
search?.addEventListener('input',render);period?.addEventListener('change',render);
const btn=heading.querySelector('[data-demo="export-reports"]');if(btn){btn.removeAttribute('data-demo');btn.removeAttribute('title');btn.textContent='+ Tạo báo cáo';btn.addEventListener('click',()=>{let box=root.querySelector('#stage10CreateReport');if(box){box.hidden=!box.hidden;return}box=document.createElement('form');box.id='stage10CreateReport';box.className='fg-panel stage10-form';box.innerHTML='<h2>Tạo báo cáo an toàn (demo)</h2><div class="fg-form-grid"><label class="fg-field"><span>Tên báo cáo *</span><input name="title" required minlength="5" placeholder="Báo cáo an toàn tuần 40"></label><label class="fg-field"><span>Kỳ báo cáo *</span><select name="period"><option>27/09–03/10</option><option>20/09–26/09</option><option>13/09–19/09</option></select></label><label class="fg-field"><span>Người tạo *</span><input name="author" required value="Lê Hoàng"></label></div><div class="fg-actions"><button class="btn btn-primary" type="submit">Lưu bản nháp</button><button class="btn btn-light" type="button" id="stage10Cancel">Hủy</button></div><p class="stage10-count">Bản nháp chỉ được lưu trên trình duyệt này, chưa phát hành báo cáo thật.</p>';heading.after(box);box.querySelector('#stage10Cancel').addEventListener('click',()=>box.hidden=true);box.addEventListener('submit',e=>{e.preventDefault();const d=Object.fromEntries(new FormData(box));const items=read();const existingIds=[...tbody.rows].map(r=>(r.cells[0]?.textContent||'').match(/RP-(\d+)/)?.[1]).filter(Boolean).map(Number);const id='RP-'+String(Math.max(40,...existingIds,...items.map(x=>Number(x.id.replace(/\D/g,''))||0))+1).padStart(3,'0');items.unshift({id,...d});save(items);box.reset();box.hidden=true;render();notify('Đã lưu '+id+' ở trạng thái bản nháp (demo).')});});}
const actionPanel=[...root.querySelectorAll('.fg-panel')].find(p=>p.querySelector('h2')?.textContent.trim()==='Tạo báo cáo');
if(actionPanel){
 const actionButtons=[...actionPanel.querySelectorAll('button')];
 const create=actionButtons.find(b=>b.textContent.trim()==='Tạo báo cáo');
 const exportBtn=actionButtons.find(b=>b.textContent.trim()==='Xuất CSV');
 if(create){create.removeAttribute('data-demo');create.removeAttribute('title');create.addEventListener('click',()=>{btn?.click();const form=root.querySelector('#stage10CreateReport');if(form){form.hidden=false;form.scrollIntoView({behavior:'smooth',block:'center'});}})}
 if(exportBtn){exportBtn.removeAttribute('data-demo');exportBtn.removeAttribute('title');exportBtn.addEventListener('click',()=>{
  const visible=[...tbody.rows].filter(r=>!r.hidden);
  const csv='\uFEFF'+[['Mã / báo cáo','Kỳ báo cáo','Người tạo','Trạng thái'],...visible.map(r=>[...r.cells].slice(0,4).map(c=>c.textContent.trim()))].map(row=>row.map(v=>'"'+v.replace(/"/g,'""')+'"').join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='sitesafe-bao-cao-da-loc.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  notify('Đã xuất '+visible.length+' báo cáo đang hiển thị.');
 })}
}
// Stage 25: show read-only details for both Figma rows and locally created drafts.
const dialog=document.createElement('dialog');dialog.className='stage25-report-dialog';
dialog.setAttribute('aria-labelledby','stage25ReportTitle');
dialog.innerHTML='<div class="stage25-report-content"><h2 id="stage25ReportTitle">Chi tiết báo cáo</h2><dl></dl><p class="stage25-report-note">Chế độ demo: đây là thông tin tóm tắt từ bảng, không phải báo cáo trên máy chủ.</p><form method="dialog"><button class="btn btn-primary" type="submit">Đóng</button></form></div>';
table.closest('.fg-panel')?.append(dialog);
function showDetail(row){
 const labels=['Mã / báo cáo','Kỳ báo cáo','Người tạo','Trạng thái'];const list=dialog.querySelector('dl');list.replaceChildren();
 labels.forEach((label,i)=>{const dt=document.createElement('dt');dt.textContent=label;const dd=document.createElement('dd');dd.textContent=row.cells[i]?.textContent.trim()||'Chưa có';list.append(dt,dd)});
 if(typeof dialog.showModal==='function')dialog.showModal();else{dialog.setAttribute('open','');dialog.querySelector('button')?.focus()}
}
dialog.querySelector('form').addEventListener('submit',()=>dialog.removeAttribute('open'));
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close?.()});
tbody.addEventListener('click',e=>{const view=e.target.closest('button');if(!view)return;const row=view.closest('tr');if(!row)return;
 if(view.classList.contains('stage25-detail')||view.hasAttribute('data-stage10-view')){e.preventDefault();e.stopPropagation();showDetail(row)}
});
tbody.querySelectorAll('button[data-demo="preview"]').forEach(button=>{button.removeAttribute('data-demo');button.removeAttribute('title');button.classList.add('stage25-detail')});

render();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
