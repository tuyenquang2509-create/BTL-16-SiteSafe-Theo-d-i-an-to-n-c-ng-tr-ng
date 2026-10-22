/* SiteSafe · trang 404 */
document.getElementById('goBack').addEventListener('click', () => {
      if (history.length > 1) history.back();
      else location.href = 'index.html';
    });
    document.getElementById('pageSearch').addEventListener('submit', (event) => {
      event.preventDefault();
    });
    document.getElementById('pageQuery').addEventListener('input', (event) => {
      const query = event.target.value.trim().toLocaleLowerCase('vi');
      const pages = [
        {terms:['checklist','kiểm tra'],label:'Checklist',url:'worker/worker-checklist.html'},
        {terms:['nguy cơ','rủi ro'],label:'Nguy cơ',url:'safety/safety-risks.html'},
        {terms:['báo cáo'],label:'Báo cáo',url:'safety/safety-reports.html'},
        {terms:['hồ sơ','profile'],label:'Hồ sơ cá nhân',url:'shared-profile.html'},
        {terms:['tổng quan','dashboard'],label:'Tổng quan',url:'safety/safety-dashboard.html'}
      ];
      const page = pages.find(item => item.terms.some(term => term.includes(query) || query.includes(term)));
      const result = document.getElementById('pageSearchResult');
      if (!query) {
        result.textContent = '';
      } else if (page) {
        result.innerHTML = `Trang phù hợp: <a href="${page.url}">${page.label} →</a>`;
      } else {
        result.textContent = 'Chưa tìm thấy trang phù hợp. Thử “checklist”, “nguy cơ” hoặc “báo cáo”.';
      }
    });
