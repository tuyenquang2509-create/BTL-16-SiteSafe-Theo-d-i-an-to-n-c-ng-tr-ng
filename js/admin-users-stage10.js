/* SiteSafe stage 10: filter the Figma admin user list; leave role-change workflow in script.js. */
(()=>{'use strict';if(document.body.dataset.initialPage!=='users'||document.body.dataset.initialRole!=='admin')return;
function init(){const root=document.querySelector('.admin-reference');if(!root)return;
const input=root.querySelector('#searchInput'),select=root.querySelector('#statusFilter'),table=root.querySelector('.admin-table-card table');if(!table)return;
const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();
function apply(){const q=normalize((input?.value||'').trim()),state=select?.value||'Tất cả';let count=0;table.querySelectorAll('tbody tr').forEach(row=>{const visible=(!q||normalize(row.textContent).includes(q))&&(state==='Tất cả'||row.cells[3]?.textContent.includes(state));row.hidden=!visible;if(visible)count++});let info=root.querySelector('#stage10AdminCount');if(!info){info=document.createElement('p');info.id='stage10AdminCount';info.className='stage10-count';table.closest('.admin-table-card')?.append(info)}info.textContent=`Đang hiển thị ${count} thành viên.`;}
input?.addEventListener('input',apply);select?.addEventListener('change',apply);apply();
// Existing script.js handles invitation, permission updates and suspension via form submit.
// Prevent the generic placeholder button handler from showing an inaccurate demo message.
root.querySelectorAll('#adminInviteForm [data-demo],#adminRoleForm [data-demo],#adminSuspendForm [data-demo]').forEach(btn=>{btn.removeAttribute('data-demo');btn.removeAttribute('title')});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();})();
