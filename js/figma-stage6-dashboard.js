/* Stage 6: populate the existing Figma queue table; don't duplicate its card. */
(()=>{'use strict';
const key='sitesafe_figma_demo_v1',flowKey='sitesafe_workflow_phase3_v1';
const get=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')||{}}catch{return {}}};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const host=document.querySelector('.figma-recent tbody');if(!host)return;
const search=document.getElementById('dashboardSearch'),filter=document.getElementById('dashboardFilter');
const title=r=>{const p=r.payload||{};return p.title||p.hazardTitle||p.field_2||'Nguy cơ hiện trường'};
function render(){host.querySelectorAll('[data-live-record]').forEach(e=>e.remove());const d=get(key),f=get(flowKey);const hazards=Array.isArray(d.hazards)?d.hazards:[];const decisions=f.decisions||{};const actions=Array.isArray(f.actions)?f.actions:[];
for(const r of hazards.slice().reverse()){const id=r.payload?.id||r.id||'HZ-DEMO',decision=decisions[id]||{},state=decision.status||'Chờ duyệt';const action=actions.filter(a=>a.riskId===id).slice(-1)[0];const liveState=state==='Đã đóng sau xác minh'?state:action?.status==='Chờ xác minh'?'Chờ xác minh':action?.status==='Đang khắc phục'?'Đang khắc phục':state;const tr=document.createElement('tr');tr.dataset.liveRecord='true';tr.innerHTML=`<td><strong>${esc(id)} · ${esc(title(r))}</strong><span class="stage6-live-tag">Mới</span></td><td>${esc(r.payload?.zone||'—')}</td><td>${esc(r.payload?.severity||'—')}</td><td>${esc(liveState)}</td><td>${esc(decision.owner||r.payload?.reporter||'—')}</td><td><a href="safety-risks.html">Xem / duyệt →</a></td>`;host.prepend(tr)}
const q=(search?.value||'').trim().toLowerCase(),type=filter?.value||'all';for(const row of host.rows){const s=row.textContent.toLowerCase();row.hidden=!!q&&!s.includes(q)||type==='pending'&&!s.includes('chờ duyệt')||type==='high'&&!s.includes('cao')||type==='overdue'&&!s.includes('quá hạn');}}
search?.addEventListener('input',render);filter?.addEventListener('change',render);window.addEventListener('storage',render);render();
})();
