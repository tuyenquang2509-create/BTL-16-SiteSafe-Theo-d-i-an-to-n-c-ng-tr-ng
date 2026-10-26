/* SiteSafe · Giai đoạn 8 · 4 bước / 8 câu hỏi, lưu nháp và kiểm tra trước gửi.
   Các câu hỏi bổ sung là dữ liệu demo; không thay thế mẫu checklist được phê duyệt. */
(()=>{'use strict';
if(document.body.dataset.initialPage!=='worker-checklist')return;
const root=document.querySelector('#checklist-wizard'),screen=document.querySelector('.fg-screen');if(!root||!screen)return;
const key='sitesafe_worker_drafts_v2', dataKey='sitesafe_figma_demo_v1';
const steps=[...root.querySelectorAll('[data-step-content]')], tabs=[...root.querySelectorAll('.ss-stepper button')],questions=[...root.querySelectorAll('.ss-question')];
const titles=['Chuẩn bị','Bảo vệ mép sàn','Thiết bị','Xem lại'];let step=0;
const toast=(s)=>{const el=document.getElementById('toast');if(!el)return;el.textContent=s;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),3500)};
const read=(k)=>{try{return JSON.parse(localStorage.getItem(k)||'{}')}catch{return {}}};
const selected=(q)=>q.querySelector('input[type="radio"]:checked')?.value||'';
const note=(q)=>q.querySelector('textarea');
function update(){
  questions.forEach(q=>{const fail=selected(q)==='Không đạt',wrap=q.querySelector('.ss-note-wrap');wrap.hidden=!fail;note(q).required=fail;q.classList.remove('ss-invalid')});
  const count=questions.filter(q=>selected(q)).length;
  document.getElementById('ss-progress-label').textContent=`Đã trả lời ${count} / 8 mục · Dữ liệu minh họa`;
  tabs.forEach((t,i)=>{t.setAttribute('aria-current',i===step?'step':'false');t.classList.toggle('ss-done',i<step)});
  steps.forEach((el,i)=>el.hidden=i!==step);
  document.getElementById('ss-step-title').textContent=`Bước ${step+1} / 4 · ${titles[step]}`;
  document.getElementById('ss-prev').hidden=step===0;
  document.getElementById('ss-next').hidden=step===3;
  document.getElementById('ss-submit').hidden=step!==3;
  if(step===3)review();
}
function validateGroup(group){for(const q of group){const value=selected(q),n=note(q);if(!value||(value==='Không đạt'&&!n.value.trim())){q.classList.add('ss-invalid');toast(!value?'Vui lòng trả lời tất cả mục trước khi tiếp tục.':'Mục Không đạt cần có ghi chú.');q.scrollIntoView({behavior:'smooth',block:'center'});(value?n:q.querySelector('input[type="radio"]'))?.focus();return false}}return true}
function validateAll(){for(let i=0;i<3;i++){step=i;update();const group=questions.filter(q=>steps[i].contains(q));if(!validateGroup(group))return false}step=3;update();return true}
function review(){const dest=document.getElementById('ss-review-rows');dest.replaceChildren();questions.forEach((q,i)=>{const div=document.createElement('div');div.className='ss-review-row';const title=q.querySelector('strong').textContent;const strong=document.createElement('strong');strong.textContent=title+' — '+(selected(q)||'Chưa trả lời');div.append(strong);if(selected(q)==='Không đạt'){const small=document.createElement('small');small.textContent='Ghi chú: '+note(q).value;div.append(small)}dest.append(div)})}
function saveDraft(){const drafts=read(key);const payload={};screen.querySelectorAll('input,select,textarea').forEach((el,i)=>{if(el.type==='file')return;const k=el.name||el.id||`field_${i}`;if(el.type==='radio'&&!el.checked)return;payload[k]=el.type==='checkbox'?el.checked:el.value});drafts.checklist=payload;localStorage.setItem(key,JSON.stringify(drafts));toast('Đã lưu bản nháp 8 mục trên trình duyệt.');}
function submit(){if(!validateAll())return;if(!document.getElementById('ss-confirm').checked){toast('Vui lòng xác nhận kết quả trước khi gửi.');step=3;update();return}
 const db=read(dataKey),id='CL-'+Date.now().toString().slice(-6),answers=questions.map((q,i)=>({item:i+1,title:q.querySelector('strong').textContent,answer:selected(q),note:note(q).value}));
 (db.checklists??=[]).push({at:new Date().toISOString(),page:'worker-checklist.html',payload:{id,status:'Chờ duyệt',answers,site:screen.querySelector('input[name="demo_field_0"]')?.value||'Riverside – Khối A'}});
 localStorage.setItem(dataKey,JSON.stringify(db));const drafts=read(key);delete drafts.checklist;localStorage.setItem(key,JSON.stringify(drafts));document.getElementById('ss-confirm').checked=false;toast('Đã gửi '+id+' gồm 8 mục vào hàng chờ duyệt (demo).');}
// The older figma-demo.js already restores draft radio values on page load.
root.addEventListener('change',update);
tabs.forEach((t,i)=>t.addEventListener('click',()=>{if(i>step&&step<3&&!validateGroup(questions.filter(q=>steps[step].contains(q))))return;step=i;update()}));
document.getElementById('ss-next').addEventListener('click',()=>{if(!validateGroup(questions.filter(q=>steps[step].contains(q))))return;step=Math.min(3,step+1);update()});
document.getElementById('ss-prev').addEventListener('click',()=>{step=Math.max(0,step-1);update()});
// Intercept legacy demo buttons before their document click listener to prevent double submission.
window.addEventListener('click',e=>{const b=e.target.closest('[data-demo="save-checklist"],[data-demo="submit-checklist"]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();if(b.dataset.demo==='save-checklist')saveDraft();else submit()},true);
update();
})();
