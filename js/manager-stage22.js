/* Stage 22: compact live summaries and filtering, without modifying Figma sample numbers. */
(()=>{'use strict';
const page=location.pathname.split('/').pop();
if(!['manager-dashboard.html','manager-corrective-actions.html'].includes(page))return;
const KEY='sitesafe_workflow_phase3_v1',DATA='sitesafe_figma_demo_v1';
const read=(key)=>{try{return JSON.parse(localStorage.getItem(key)||'null')||{}}catch{return {}}};
const snapshot=()=>{const f=read(KEY),d=read(DATA);return {actions:Array.isArray(f.actions)?f.actions:[],hazards:Array.isArray(d.hazards)?d.hazards:[]}};
const norm=x=>String(x??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();
const el=(tag,cls)=>{const node=document.createElement(tag);node.className=cls;return node};
const fmt=n=>String(n);
if(page==='manager-dashboard.html'){
 const metrics=document.querySelector('.fg-metrics');if(!metrics)return;
 const wrap=el('section','m22-summary');wrap.setAttribute('aria-label','Thống kê dữ liệu phát sinh');
 wrap.innerHTML='<div class="m22-summary-title"><strong>Dữ liệu phát sinh trong phiên demo</strong><span>Riêng với số liệu Figma minh họa phía trên</span></div><div class="m22-counts" aria-live="polite"></div>';
 metrics.insertAdjacentElement('afterend',wrap);
 const draw=()=>{const s=snapshot(),a=s.actions;const cells=[['Nguy cơ mới',s.hazards.length],['Đang khắc phục',a.filter(x=>x.status==='Đang khắc phục').length],['Chờ xác minh',a.filter(x=>x.status==='Chờ xác minh').length],['Đã đóng',a.filter(x=>x.status==='Đã xác minh đóng').length]];wrap.querySelector('.m22-counts').replaceChildren(...cells.map(([label,count])=>{const c=el('div','m22-count');const n=el('strong','');n.textContent=fmt(count);const t=el('span','');t.textContent=label;c.append(n,t);return c}))};
 window.addEventListener('storage',draw);window.addEventListener('pageshow',draw);draw();
}
if(page==='manager-corrective-actions.html'){
 const target=document.querySelector('#workflowActions');if(!target)return;
 const host=target.closest('.workflow-panel');const tools=el('div','m22-tools');
 tools.innerHTML='<label>Tìm hành động phát sinh<input type="search" placeholder="Mã, nguy cơ, phụ trách" aria-label="Tìm hành động phát sinh"></label><label>Trạng thái<select aria-label="Lọc trạng thái hành động"><option value="">Tất cả</option><option>Đang khắc phục</option><option>Chờ xác minh</option><option>Đã xác minh đóng</option></select></label><p class="m22-result" role="status"></p>';
 host.insertBefore(tools,target);
 const search=tools.querySelector('input'),status=tools.querySelector('select'),result=tools.querySelector('.m22-result');
 const apply=()=>{const data=snapshot().actions,q=norm(search.value),st=status.value;let visible=0;for(const item of target.querySelectorAll('.workflow-item')){const id=item.querySelector('[data-id]')?.dataset.id||item.querySelector('strong')?.textContent.split(' · ')[0];const action=data.find(a=>a.id===id);const match=!!action&&(!st||action.status===st)&&norm([action.id,action.riskId,action.owner,action.note,action.status].join(' ')).includes(q);item.hidden=!match;if(match)visible++}result.textContent=`Hiển thị ${visible}/${data.length} hành động phát sinh`;};
 search.addEventListener('input',apply);status.addEventListener('change',apply);
 new MutationObserver(apply).observe(target,{childList:true});
 window.addEventListener('storage',apply);window.addEventListener('pageshow',apply);apply();
}
})();
