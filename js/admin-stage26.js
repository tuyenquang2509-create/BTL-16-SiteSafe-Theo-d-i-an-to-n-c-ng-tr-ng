/* SiteSafe stage 26: resilient admin user filters after dynamic re-render. */
(()=>{'use strict';
if(document.body.dataset.initialRole!=='admin'||document.body.dataset.initialPage!=='users')return;
const normalize=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();
let filterState={search:'',status:'Tất cả',site:'all'};
function apply(root){
 const table=root.querySelector('.admin-table-card table');if(!table)return;
 const search=root.querySelector('#searchInput');const status=root.querySelector('#statusFilter');
 const site=root.querySelector('.admin-filters select[aria-label="Công trường"]');
 if(search)search.value=filterState.search;
 if(status)status.value=filterState.status;
 if(site){
  if(!site.querySelector('option[value="all"]')){const option=document.createElement('option');option.value='all';option.textContent='Tất cả công trường';site.prepend(option)}
  [...site.options].forEach(option=>{if(option.value!=='all'&&!/^RS-/.test(option.value)){
   const match=option.textContent.match(/Khối\s+([A-Z])/i);if(match)option.value='RS-'+match[1].toUpperCase();
  }});
  site.value=filterState.site;
  if(site.selectedIndex<0){filterState.site='all';site.value='all'}
 }
 let count=0;
 for(const row of table.querySelectorAll('tbody tr')){
  const cells=row.cells;
  if(cells.length<4)continue;
  const matchesSearch=!filterState.search||normalize(row.textContent).includes(normalize(filterState.search));
  const matchesStatus=filterState.status==='Tất cả'||normalize(cells[3].textContent).includes(normalize(filterState.status));
  const matchesSite=filterState.site==='all'||cells[2].textContent.trim()===filterState.site;
  row.hidden=!(matchesSearch&&matchesStatus&&matchesSite);
  if(!row.hidden)count++;
 }
 root.querySelector('#stage10AdminCount')?.remove();
 let label=root.querySelector('#stage26AdminCount');if(!label){label=document.createElement('p');label.id='stage26AdminCount';label.className='stage26-admin-count';label.setAttribute('role','status');table.closest('.admin-table-card')?.append(label)}
 label.textContent=`Đang hiển thị ${count} thành viên.`;
}
function init(){
 const container=document.querySelector('#pageContent');if(!container)return;
 const sync=()=>{const root=container.querySelector('.admin-reference');if(root)apply(root)};
 // Delegation survives replacement of #pageContent by script.js after a save.
 container.addEventListener('input',e=>{if(e.target.id==='searchInput'){e.stopPropagation();filterState.search=e.target.value;sync()}});
 container.addEventListener('change',e=>{
  if(e.target.id==='statusFilter'){e.stopPropagation();filterState.status=e.target.value;}
  else if(e.target.matches('.admin-filters select[aria-label="Công trường"]')){e.stopPropagation();filterState.site=e.target.value;}
  else return;
  sync();
 });
 const observer=new MutationObserver(records=>{
  if(records.some(r=>[...r.addedNodes].some(node=>node.nodeType===1&&(
   node.matches?.('.admin-reference')||node.querySelector?.('.admin-reference')
  ))))sync();
 });
 observer.observe(container,{childList:true,subtree:true});sync();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

