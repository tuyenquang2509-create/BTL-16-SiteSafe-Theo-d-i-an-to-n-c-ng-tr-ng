/* safety-reports.html: mã xử lý dành riêng cho màn hình này.
   script.js quản lý điều hướng và dữ liệu dùng chung. */
/* Chuc nang rieng cho trang: safety-reports.
 * Cac xu ly nghiep vu va renderers hien tai van duoc giu trong script.js
 * de tuong thich voi cac lien ket/hanh dong xuyen man hinh.
 */
window.addEventListener('storage', function (event) {
    if (event.key === 'sitesafe-v2-data' && typeof loadDB === 'function') {
        db = loadDB();
        if (typeof renderPage === 'function')
            renderPage();
    }
});
// Tìm kiếm báo cáo đang hiển thị trong bảng.
function filterSafetyReports() {
    const search = document.getElementById('safetyReportSearch');
    const table = document.querySelector('.fg-screen .fg-table');
    if (!search || !table)
        return;
    const keyword = search.value.trim().toLocaleLowerCase('vi');
    table.querySelectorAll('tbody tr').forEach(function (row) {
        const content = row.textContent.toLocaleLowerCase('vi');
        row.hidden = !content.includes(keyword);
    });
}
const safetyReportSearch = document.getElementById('safetyReportSearch');
if (safetyReportSearch) {
    safetyReportSearch.addEventListener('input', filterSafetyReports);
}
