/* Giai đoạn 21: chọn khu vực trên sơ đồ Figma, không thay đổi dữ liệu demo. */
(()=>{'use strict';
if(!location.pathname.endsWith('/manager-risk-map.html'))return;
const zones=[
 {id:'Z-A2',title:'Tầng 2',risk:'Cao',open:8,high:3,late:2,inspect:1,featured:'HZ-024 · Thiếu lan can tại mép sàn'},
 {id:'Z-A1',title:'Tầng 1',risk:'Vừa',open:6,high:1,late:1,inspect:0,featured:'Nguy cơ tại khu vực tầng 1'},
 {id:'Z-K1',title:'Kho vật tư',risk:'Vừa',open:4,high:1,late:0,inspect:0,featured:'Nguy cơ tại khu vực kho vật tư'},
 {id:'Z-C1',title:'Cổng chính',risk:'Thấp',open:2,high:0,late:0,inspect:0,featured:'Nguy cơ tại khu vực cổng chính'}
];
const buttons=[...document.querySelectorAll('[data-zone-index]')];
const host=document.getElementById('stage21-selected-zone');
const input=document.getElementById('stage21-zone-search');
const rank=document.getElementById('stage21-zone-rank');
if(!host||!buttons.length)return;
const pill=host.querySelector('.fg-pill');const heading=host.querySelector('h2');
const paragraphs=[...host.querySelectorAll(':scope > p')];
const notes=host.querySelector('.fg-actions');
let active=0;
function select(index){
 const z=zones[index];if(!z)return;active=index;
 buttons.forEach((b,i)=>{b.setAttribute('aria-pressed',String(i===index));b.classList.toggle('stage21-active',i===index)});
 if(heading)heading.textContent=`Khu vực đã chọn · ${z.id}`;
 if(pill){pill.textContent=`Rủi ro ${z.risk.toLowerCase()}`;pill.classList.remove('fg-red','fg-yellow','fg-green');pill.classList.add(z.risk==='Cao'?'fg-red':z.risk==='Vừa'?'fg-yellow':'fg-green')}
 if(paragraphs[0])paragraphs[0].textContent=`${z.open} nguy cơ mở · ${z.high} ưu tiên cao · ${z.late} hành động quá hạn · ${z.inspect} kiểm tra đang thực hiện`;
 if(paragraphs[1])paragraphs[1].textContent=`Nguy cơ nổi bật: ${z.featured}.`;
 if(notes){const first=notes.querySelector('button');if(first)first.textContent=`Xem ${z.open} nguy cơ`}
 if(rank){rank.querySelectorAll('tbody tr').forEach(row=>{row.classList.toggle('stage21-rank-selected',row.textContent.includes(z.id))})}
}
buttons.forEach(b=>b.addEventListener('click',()=>select(Number(b.dataset.zoneIndex))));
if(input)input.addEventListener('input',()=>{
 const q=input.value.trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 buttons.forEach((b,i)=>{const label=`${zones[i].id} ${zones[i].title}`.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();b.hidden=!label.includes(q)});
});
select(0);
})();