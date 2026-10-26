/* SiteSafe Giai doan 3 - workflow demo across pages, no backend. */
(()=>{'use strict';
 const KEY='sitesafe_figma_demo_v1',FLOW='sitesafe_workflow_phase3_v1';
 const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')||f}catch{return f}};
 const save=x=>localStorage.setItem(FLOW,JSON.stringify(x));
 // Restore safe defaults if demo storage was edited or contains old/incomplete data.
 const get=()=>{const raw=read(FLOW,{});const data=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};return {
  ...data,
  decisions:data.decisions&&typeof data.decisions==='object'&&!Array.isArray(data.decisions)?data.decisions:{},
  actions:Array.isArray(data.actions)?data.actions:[],
  history:Array.isArray(data.history)?data.history:[]
 }};
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const notify=msg=>{let t=document.querySelector('#toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.append(t)}t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3500)};
 const reports=()=>{const items=read(KEY,{}).hazards;return Array.isArray(items)?items:[]};
 const now=()=>new Date().toLocaleString('vi-VN');
 const append=(parent,html)=>{if(parent)parent.insertAdjacentHTML('beforeend',html)};
 const page=location.pathname.split('/').pop();
 const panel=(heading,body)=>`<section class="fg-panel workflow-panel"><div class="fg-section-head"><h2>${heading}</h2></div>${body}</section>`;
 const reportTitle=r=>{const p=r.payload||{};return Object.values(p).find(v=>typeof v==='string'&&v.toLowerCase().includes('lan can'))||p.field_2||'Nguy cơ được gửi từ hiện trường'};
 const reportList=()=>reports().slice().reverse().map(r=>{const p=r.payload||{},f=get(),id=p.id||'HZ-DEMO',decision=f.decisions[id];return `<article class="workflow-item"><div><strong>${esc(id)} · ${esc(reportTitle(r))}</strong><small>Gửi ${esc(new Date(r.at).toLocaleString('vi-VN'))} · ${esc(decision?.status||'Chờ duyệt')}</small></div><button class="btn btn-light btn-sm" type="button" data-workflow="select-report" data-id="${esc(id)}">Xem / duyệt</button></article>`}).join('');
 const workflow=get();
 let inlineReviewButton=null;
 if(page==='safety-risks.html'){
   const screen=document.querySelector('.fg-screen');
   const reviewPanel=[...(screen?.querySelectorAll?.('.fg-panel')||[])].find(item=>item.querySelector('h2')?.textContent.includes('Bảng duyệt và phân công'));
   const reviewActions=reviewPanel?.querySelector('.fg-actions');
   if(reviewActions){
    inlineReviewButton=reviewActions.querySelector('.btn-primary');
    const originalLabel=inlineReviewButton?.textContent||'Xác nhận và giao hành động';
    reviewPanel.addEventListener('input',()=>{if(inlineReviewButton)inlineReviewButton.textContent=originalLabel});
    reviewPanel.addEventListener('change',()=>{if(inlineReviewButton)inlineReviewButton.textContent=originalLabel});
    const result=document.createElement('p');result.id='wfInlineReviewStatus';result.className='workflow-result';result.setAttribute('role','status');result.setAttribute('aria-live','polite');
    reviewActions.insertAdjacentElement('afterend',result);
   }
   const html=panel('Hàng chờ duyệt · báo cáo từ nhân sự hiện trường',`<p class="workflow-hint">Dữ liệu demo được chia sẻ giữa các trang trong cùng trình duyệt. Chọn báo cáo để duyệt; báo cáo mẫu HZ-024 vẫn được giữ nguyên.</p><div id="workflowInbox">${reportList()||'<p>Chưa có báo cáo mới. Hãy gửi một báo cáo từ trang Nhân sự hiện trường.</p>'}</div>`)+panel('Quyết định duyệt nguy cơ · phiên demo',`<form id="workflowReviewForm"><label class="fg-field"><span>Mã nguy cơ</span><input id="wfHazardId" value="HZ-024" required></label><div class="fg-form-grid"><label class="fg-field"><span>Quyết định *</span><select id="wfDecision"><option value="Đã xác nhận">Xác nhận</option><option value="Cần bổ sung">Yêu cầu bổ sung</option><option value="Từ chối">Từ chối</option></select></label><label class="fg-field"><span>Người phụ trách</span><input id="wfOwner" value="Lê Hoàng"></label><label class="fg-field"><span>Hạn khắc phục</span><input id="wfDue" type="date" value="2026-10-27"></label><label class="fg-field fg-wide"><span>Ghi chú / lý do *</span><textarea id="wfReason" required minlength="5">Đã kiểm tra nội dung và minh chứng; cần khắc phục theo quy trình.</textarea></label></div><div class="fg-actions"><button class="btn btn-primary" type="submit">Lưu quyết định và cập nhật trạng thái</button></div></form><div id="wfReviewStatus" role="status"></div>`);
   append(screen,html+panel('Xác minh minh chứng khắc phục',`<div id="workflowVerify"></div>`));
 }
 if(page==='manager-corrective-actions.html'){
  append(document.querySelector('.fg-screen'),panel('Hành động phát sinh từ quyết định duyệt',`<div id="workflowActions"></div><p class="workflow-hint">Nộp hoàn thành chỉ chuyển sang <strong>Chờ xác minh</strong>; cán bộ an toàn mới được xác nhận đóng.</p>`));
 }
 if(page==='worker-report-history.html'){
  append(document.querySelector('.fg-screen'),panel('Phản hồi từ cán bộ an toàn',`<div id="workflowFeedback"></div>`));
 }
 const draw=()=>{
  const data=get();
  const actions=document.getElementById('workflowActions');if(actions)actions.innerHTML=data.actions.length?data.actions.slice().reverse().map(a=>`<article class="workflow-item"><div><strong>${esc(a.id)} · ${esc(a.riskId)}</strong><small>Phụ trách: ${esc(a.owner)} · Hạn: ${esc(a.due)} · ${esc(a.status)}</small><small>${esc(a.note||'')}</small></div>${a.status==='Đang khắc phục'?`<button class="btn btn-primary btn-sm" data-workflow="submit-evidence" data-id="${esc(a.id)}">Nộp để xác minh</button>`:''}</article>`).join(''):'<p>Chưa có hành động mới từ quy trình duyệt. Các bản ghi minh họa Figma vẫn hiển thị phía trên.</p>';
  const verify=document.getElementById('workflowVerify');if(verify){const pending=data.actions.filter(a=>a.status==='Chờ xác minh');verify.innerHTML=pending.length?pending.map(a=>`<article class="workflow-item"><div><strong>${esc(a.id)} · ${esc(a.riskId)}</strong><small>Minh chứng: ${esc(a.note)} · Nộp ${esc(a.submittedAt)}</small></div><button class="btn btn-primary btn-sm" data-workflow="verify-action" data-id="${esc(a.id)}">Xác minh và đóng</button></article>`).join(''):'<p>Chưa có hành động nào được nộp để xác minh.</p>'}
  const feedback=document.getElementById('workflowFeedback');if(feedback){const ownIds=new Set(reports().map(r=>r.payload?.id).filter(Boolean));const entries=Object.entries(data.decisions).filter(([id])=>ownIds.has(id));feedback.innerHTML=entries.length?entries.map(([id,d])=>{const closed=data.actions.some(a=>a.riskId===id&&a.status==='Đã xác minh đóng');const status=closed?'Đã đóng sau xác minh':d.status;return `<article class="workflow-item"><div><strong>${esc(id)} · ${esc(status)}</strong><small>${esc(d.at)} · ${esc(d.reason)}</small></div></article>`}).join(''):'<p>Chưa có phản hồi cho các nguy cơ bạn đã gửi trong trình duyệt này.</p>'}
  const status=document.getElementById('wfReviewStatus');if(status){const id=document.getElementById('wfHazardId')?.value;const d=data.decisions[id];status.textContent=d?`${id}: ${d.status} · ${d.at}`:''}
  const inlineStatus=document.getElementById('wfInlineReviewStatus');
  if(inlineStatus){
   const id=document.getElementById('wfHazardId')?.value||'HZ-024',decision=data.decisions[id];
   const action=data.actions.find(item=>item.riskId===id&&item.status!=='Đã xác minh đóng');
   if(decision?.status==='Đã xác nhận'&&action){
    const due=action.due?new Date(`${action.due}T00:00:00`).toLocaleDateString('vi-VN'):'chưa đặt hạn';
    inlineStatus.textContent=`Đã xác nhận ${id} và giao ${action.id} cho ${action.owner} · hạn ${due} · ${action.status}.`;
   }else if(decision){
    inlineStatus.textContent=`Đã lưu quyết định ${id}: ${decision.status}.`;
   }else{
    inlineStatus.textContent='Chọn quyết định, nhập ghi chú và nhấp nút để ghi nhận xử lý.';
   }
  }
 };
 document.addEventListener('click',e=>{
  const b=e.target.closest('[data-workflow]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();
  const act=b.dataset.workflow,id=b.dataset.id;
  if(act==='verify-action'){
   const data=get(),a=data.actions.find(x=>x.id===id);if(!a||a.status!=='Chờ xác minh'){notify('Hành động chưa sẵn sàng để xác minh.');return}
   // The Figma evidence checklist is a prerequisite for verification, not merely navigation.
   const evidencePanel=typeof document.querySelectorAll==='function'?[...document.querySelectorAll('.fg-panel')].find(panel=>panel.querySelector('h2')?.textContent.includes('CA-012')):null;
   const evidenceChecked=evidencePanel?.querySelector('input[type=checkbox]');
   if(evidenceChecked&&!evidenceChecked.checked){
    notify('Hãy xác nhận đã kiểm tra minh chứng và hiện trường trước khi đóng nguy cơ.');
    evidenceChecked.focus();return;
   }
   if(!confirm('Xác minh hành động '+id+' cho nguy cơ '+a.riskId+'? Chỉ xác nhận khi đã kiểm tra minh chứng và hiện trường.'))return;
   a.status='Đã xác minh đóng';a.verifiedAt=now();data.decisions[a.riskId]={...(data.decisions[a.riskId]||{}),status:'Đã đóng sau xác minh',at:now(),reason:'Cán bộ an toàn xác nhận trong phiên demo.'};data.history.push({at:now(),type:'Xác minh đóng',actionId:id});save(data);draw();if(evidenceChecked)evidenceChecked.checked=false;notify('Đã xác minh và đóng '+a.riskId+' trong dữ liệu demo.');return;
  }
  if(act==='select-report'){document.getElementById('wfHazardId').value=id;document.getElementById('workflowReviewForm').scrollIntoView({behavior:'smooth'});draw();return}
  if(act==='submit-evidence'){
   const current=get().actions.find(x=>x.id===id);if(!current||current.status!=='Đang khắc phục'){notify('Hành động không còn ở trạng thái Đang khắc phục.');draw();return}
   const note=prompt('Mô tả minh chứng sau khắc phục (ít nhất 5 ký tự):');if(note===null)return;if(note.trim().length<5){notify('Vui lòng nhập mô tả ít nhất 5 ký tự.');return}
   const data=get(),a=data.actions.find(x=>x.id===id);if(!a||a.status!=='Đang khắc phục'){notify('Trạng thái hành động đã thay đổi.');draw();return}
   a.status='Chờ xác minh';a.note=note.trim();a.submittedAt=now();data.history.push({at:now(),type:'Nộp hoàn thành',actionId:id});save(data);draw();notify('Đã nộp để xác minh; nguy cơ chưa được đóng.');return;
  }
 },true);
 document.addEventListener('submit',e=>{
  if(e.target.id!=='workflowReviewForm')return;e.preventDefault();e.stopImmediatePropagation();
  const id=document.getElementById('wfHazardId').value.trim(),status=document.getElementById('wfDecision').value,reason=document.getElementById('wfReason').value.trim(),owner=document.getElementById('wfOwner').value.trim(),due=document.getElementById('wfDue').value;
  if(!id||reason.length<5){notify('Nhập mã nguy cơ và ghi chú ít nhất 5 ký tự.');return}
  if(status==='Đã xác nhận'&&(!owner||!due)){notify('Cần chọn người phụ trách và hạn khắc phục.');return}
  const data=get();
  const previous=data.decisions[id];
  if(previous?.status==='Đã đóng sau xác minh'){
   notify('Nguy cơ đã được xác minh và đóng. Không thể duyệt lại trong phiên demo.');return;
  }
  const existingAction=data.actions.find(a=>a.riskId===id&&a.status!=='Đã xác minh đóng');
  if(status!=='Đã xác nhận'&&data.actions.some(a=>a.riskId===id&&a.status!=='Đã xác minh đóng')){
   notify('Nguy cơ đang có hành động khắc phục. Không thể đổi thành từ chối hoặc cần bổ sung.');return;
  }
  if(status==='Đã xác nhận'&&existingAction){
   const unchanged=previous?.status===status&&previous.reason===reason&&previous.owner===owner&&previous.due===due&&existingAction.owner===owner&&existingAction.due===due;
   if(unchanged){
    draw();if(inlineReviewButton)inlineReviewButton.textContent='Đã lưu';
    notify('Quyết định và hành động đã được lưu trước đó.');return;
   }
   existingAction.owner=owner;existingAction.due=due;
   data.decisions[id]={status,reason,owner,due,at:now()};
   data.history.push({at:now(),type:'Cập nhật quyết định',riskId:id,actionId:existingAction.id});
   save(data);draw();if(inlineReviewButton)inlineReviewButton.textContent='Đã lưu';
   notify('Đã lưu cập nhật quyết định và hành động '+existingAction.id+'.');return;
  }
  data.decisions[id]={status,reason,owner,due,at:now()};data.history.push({at:now(),type:status,riskId:id});
  if(status==='Đã xác nhận'&&!data.actions.some(a=>a.riskId===id))data.actions.push({id:'CA-DEMO-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,6),riskId:id,owner,due,status:'Đang khắc phục',note:''});
  save(data);draw();if(inlineReviewButton)inlineReviewButton.textContent='Đã lưu';
  notify('Đã lưu quyết định '+id+' ('+status+').');
 },true);
 // Synchronize visible workflow panels when another role updates the same demo in another tab.
 if(typeof window!=='undefined')window.addEventListener('storage',e=>{if(e.key!==FLOW&&e.key!==KEY&&e.key!==null)return;const inbox=document.getElementById('workflowInbox');if(inbox)inbox.innerHTML=reportList()||'<p>Chưa có báo cáo mới. Hãy gửi một báo cáo từ trang Nhân sự hiện trường.</p>';draw()});
 if(typeof window!=='undefined')window.addEventListener('pageshow',()=>{const inbox=document.getElementById('workflowInbox');if(inbox)inbox.innerHTML=reportList()||'<p>Chưa có báo cáo mới. Hãy gửi một báo cáo từ trang Nhân sự hiện trường.</p>';draw()});
 draw();
})();
