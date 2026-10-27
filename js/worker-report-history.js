/* worker-report-history.html: mã xử lý dành riêng cho màn hình này.
   script.js quản lý điều hướng và dữ liệu dùng chung. */
/* Chuc nang rieng cho trang: worker-report-history.
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
/* ===== CHỨC NĂNG TRANG: worker-stage7.js ===== */
/* SiteSafe · Giai đoạn 7: nâng chất lượng luồng công nhân theo thiết kế PDF.
   Chỉ thao tác trong trình duyệt, không gửi lên máy chủ. */
(() => {
    'use strict';
    const page = document.body.dataset.initialPage || '';
    if (!page.startsWith('worker-'))
        return;
    const screen = document.querySelector('.fg-screen');
    const notice = (msg) => { let t = document.getElementById('toast'); if (!t)
        return; t.textContent = msg; t.classList.add('show'); clearTimeout(notice.t); notice.t = setTimeout(() => t.classList.remove('show'), 3500); };
    const go = (file) => { location.href = file; };
    if (page === 'worker-checklist' && screen) {
        const review = [...screen.querySelectorAll('.fg-panel')].find(x => x.querySelector('h2')?.textContent.toLowerCase().includes('xem lại'));
        const note = screen.querySelector('textarea');
        const radios = [...screen.querySelectorAll('input[name="rail"]')];
        const isFailed = () => radios.find(r => r.checked)?.value === 'Không đạt';
        const update = () => {
            if (note) {
                note.required = isFailed();
                note.setAttribute('aria-required', String(isFailed()));
            }
            const results = [...new Set([...screen.querySelectorAll('input[type="radio"]')].map(r => r.name))].map(n => screen.querySelector(`input[name="${n}"]:checked`)?.value).filter(Boolean);
            const pass = results.filter(x => x === 'Đạt').length, fail = results.filter(x => x === 'Không đạt').length, na = results.filter(x => x === 'Không áp dụng').length;
            const summary = review?.querySelector('.fg-note');
            if (summary)
                summary.textContent = `Các mục đang hiển thị: ${results.length} đã trả lời · ${pass} Đạt · ${fail} Không đạt · ${na} Không áp dụng · Liên kết HZ-024 (minh họa)`;
        };
        radios.forEach(r => r.addEventListener('change', update));
        screen.querySelectorAll('input[type="radio"]').forEach(r => r.addEventListener('change', update));
        update();
        // Existing demo handler captures click; validate before it by registering on window capture.
        window.addEventListener('click', e => {
            const b = e.target.closest('[data-demo="submit-checklist"]');
            if (!b)
                return;
            if (isFailed() && !note?.value.trim()) {
                e.preventDefault();
                e.stopImmediatePropagation();
                note?.focus();
                notice('Vui lòng ghi chú cho mục Không đạt trước khi gửi checklist.');
            }
        }, true);
    }
    if (page === 'worker-report' && screen) {
        // Stage 28: figma-stage9.js owns the evidence preview; avoid duplicate summaries.
        const buttons = [...screen.querySelectorAll('button')];
        buttons.filter(b => b.textContent.trim() === 'Quay lại').forEach(b => b.addEventListener('click', e => { e.preventDefault(); e.stopImmediatePropagation(); go('worker-report-history.html'); }, true));
        buttons.filter(b => b.textContent.includes('AI hỗ trợ phân loại')).forEach(b => b.addEventListener('click', e => { e.preventDefault(); e.stopImmediatePropagation(); notice('Phân loại AI chỉ là đề xuất. Bạn vẫn có thể gửi báo cáo thủ công.'); }, true));
    }
    if (page === 'worker-report-history') {
        const root = document.querySelector('.fg-screen') || document;
        const add = document.createElement('div');
        add.className = 'worker-stage7-toolbar';
        add.innerHTML = '<a class="btn btn-primary" href="worker-report-create.html">+ Báo nguy cơ mới</a><span>Danh sách bản ghi mẫu và báo cáo demo được phân biệt rõ.</span>';
        const target = root.querySelector('.fg-heading') || root.querySelector('.worker-report-list');
        target?.insertAdjacentElement('afterend', add);
    }
})();


/* Worker: lọc đồng thời theo từ khóa và trạng thái; không sửa dữ liệu gốc. */
(() => {
  'use strict';
  if (document.body.dataset.initialPage !== 'worker-history') return;
  const screen = document.querySelector('.fg-screen');
  const search = document.getElementById('searchInput');
  const status = document.getElementById('statusFilter');
  const list = screen?.querySelector('.worker-report-list');
  const count = screen?.querySelector('.reference-count');
  if (!search || !status || !list) return;
  const empty = document.createElement('p');
  empty.className = 'worker-empty-state';
  empty.setAttribute('role','status');
  empty.textContent = 'Không tìm thấy báo cáo phù hợp. Hãy thử từ khóa hoặc trạng thái khác.';
  empty.hidden = true;
  list.appendChild(empty);
  search.setAttribute('aria-label','Tìm kiếm nguy cơ của tôi');
  status.setAttribute('aria-label','Lọc theo trạng thái nguy cơ');
  if (count) count.setAttribute('aria-live','polite');
  const normalize = s => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase().trim();
  function applyFilter() {
    const query = normalize(search.value);
    const selected = normalize(status.value);
    const cards = [...list.querySelectorAll('.worker-report-card')];
    let shown = 0;
    cards.forEach(card => {
      const content = normalize(card.textContent);
      const state = normalize(card.querySelector('.worker-report-meta')?.textContent);
      const match = content.includes(query) && (selected === 'tat ca' || !selected || state.includes(selected));
      card.hidden = !match;
      if (match) shown++;
    });
    empty.hidden = shown !== 0;
    if (count) count.textContent = `${shown} / ${cards.length} báo cáo phù hợp · Dữ liệu minh họa, không phải số liệu thực tế.`;
  }
  search.addEventListener('input',applyFilter);
  status.addEventListener('change',applyFilter);
  applyFilter();
})();
