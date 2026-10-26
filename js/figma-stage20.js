/* Giai doan 20: tim kiem cuoc kiem tra va chuyen nhap quan sat thu cong. */
(function(){
  'use strict';
  function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase().trim();}
  function initInspection(){
    var table=document.getElementById('stage20-inspection-table');
    var search=document.getElementById('stage20-inspection-search');
    var week=document.getElementById('stage20-inspection-week');
    var site=document.getElementById('stage20-inspection-site');
    var counter=document.getElementById('stage20-inspection-count');
    if(!table||!search)return;
    var rows=Array.from(table.querySelectorAll('tbody tr'));
    function update(){
      var q=norm(search.value), visible=0;
      var weekValue=norm(week&&week.value),siteValue=norm(site&&site.value);
      rows.forEach(function(row){
        var hay=norm(row.textContent);
        var matched=!q||hay.includes(q);
        // Dữ liệu mẫu chỉ có một công trường và một tuần; lựa chọn "Khác" không có bản ghi.
        if(weekValue&&weekValue.includes('khac'))matched=false;
        if(siteValue&&siteValue.includes('khac'))matched=false;
        row.classList.toggle('stage20-hidden',!matched);
        if(matched)visible++;
      });
      if(counter)counter.textContent='Hiển thị '+visible+'/'+rows.length+' cuộc kiểm tra trong dữ liệu minh họa';
    }
    search.addEventListener('input',update);
    if(week)week.addEventListener('change',update);
    if(site)site.addEventListener('change',update);
    update();
  }
  function initAI(){
    var manual=document.querySelector('[data-stage20-manual]');
    if(!manual)return;
    manual.addEventListener('click',function(){
      var textarea=document.querySelector('.fg-screen textarea');
      if(textarea){textarea.focus();textarea.scrollIntoView({block:'center',behavior:'smooth'});}
      var toast=document.getElementById('toast');
      if(toast){toast.textContent='Bạn có thể nhập mô tả hiện trường thủ công rồi chọn Phân tích nguy cơ.';toast.classList.add('show');}
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){initInspection();initAI();});
  else{initInspection();initAI();}
})();
