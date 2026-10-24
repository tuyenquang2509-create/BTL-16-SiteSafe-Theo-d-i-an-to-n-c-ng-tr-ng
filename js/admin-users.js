/* Chuc nang rieng cho trang: admin-users.
 * Cac xu ly nghiep vu va renderers hien tai van duoc giu trong script.js
 * de tuong thich voi cac lien ket/hanh dong xuyen man hinh.
 */
window.addEventListener('storage', function (event) {
  if (event.key === 'sitesafe-v2-data' && typeof loadDB === 'function') {
    db = loadDB();
    if (typeof renderPage === 'function') renderPage();
  }
});
