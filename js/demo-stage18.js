/* Giai doan 18: huong dan demo, thong ke va reset co xac nhan. */
(()=>{'use strict';
const DATA='sitesafe_figma_demo_v1',FLOW='sitesafe_workflow_phase3_v1';
const read=k=>{try{const x=JSON.parse(localStorage.getItem(k)||'null');return x&&typeof x==='object'?x:{}}catch{return {}}};
const summary=document.getElementById('demoSummary');if(!summary)return;
const stat=(name,value)=>{const box=document.createElement('div');box.className='demo-stat';const strong=document.createElement('strong');strong.textContent=String(value);const label=document.createElement('span');label.textContent=name;box.append(strong,label);return box};
function refresh(){const data=read(DATA),flow=read(FLOW),hazards=Array.isArray(data.hazards)?data.hazards:[],actions=Array.isArray(flow.actions)?flow.actions:[];summary.replaceChildren(stat('Nguy cơ đã gửi',hazards.length),stat('Đang khắc phục',actions.filter(a=>a.status==='Đang khắc phục').length),stat('Chờ xác minh',actions.filter(a=>a.status==='Chờ xác minh').length),stat('Đã xác minh đóng',actions.filter(a=>a.status==='Đã xác minh đóng').length))}
document.getElementById('demoRefresh').addEventListener('click',refresh);
document.getElementById('demoReset').addEventListener('click',()=>{if(!confirm('Xóa báo cáo nguy cơ mới và toàn bộ quyết định/hành động thuộc luồng demo trong trình duyệt này? Không thể hoàn tác.'))return;const data=read(DATA);if(Object.prototype.hasOwnProperty.call(data,'hazards')){delete data.hazards;localStorage.setItem(DATA,JSON.stringify(data))}localStorage.removeItem(FLOW);refresh();alert('Đã xóa dữ liệu luồng demo. Các bản nháp và dữ liệu quản trị khác được giữ nguyên.')});
window.addEventListener('storage',refresh);refresh();
})();
