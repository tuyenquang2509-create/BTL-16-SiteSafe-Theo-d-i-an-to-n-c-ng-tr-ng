/* admin-users.html: mã xử lý dành riêng cho màn hình này.
   script.js quản lý điều hướng và dữ liệu dùng chung. */
/* Chuc nang rieng cho trang: admin-users.
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
/* ===== CHỨC NĂNG TRANG: admin-stage24.js ===== */
/* SiteSafe 24: data consistency and clear feedback on the admin user screen. */
(() => {
    'use strict';
    if (document.body.dataset.initialRole !== 'admin' || document.body.dataset.initialPage !== 'users')
        return;
    function init() {
        const root = document.querySelector('.admin-reference');
        if (!root)
            return;
        const form = root.querySelector('#adminInviteForm');
        if (form) {
            const note = document.createElement('p');
            note.className = 'admin-stage24-note';
            note.setAttribute('role', 'note');
            note.textContent = 'Chế độ demo: lời mời được lưu cục bộ; hệ thống không gửi email thật.';
            form.append(note);
        }
        const role = root.querySelector('#adminRoleForm');
        if (role) {
            const hint = document.createElement('p');
            hint.className = 'admin-stage24-note';
            hint.textContent = 'Không thể hạ quyền quản trị viên hoạt động cuối cùng.';
            role.append(hint);
        }
        const list = root.querySelector('.admin-table-card');
        if (list) {
            const hint = document.createElement('p');
            hint.className = 'admin-stage24-note';
            hint.textContent = 'Danh sách minh họa ban đầu; thay đổi đã lưu sẽ hiển thị khi ứng dụng cập nhật dữ liệu.';
            list.append(hint);
        }
    }
    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', init);
    else
        init();
})();
/* ===== CHỨC NĂNG TRANG: admin-stage26.js ===== */
/* SiteSafe stage 26: resilient admin user filters after dynamic re-render. */
(() => {
    'use strict';
    if (document.body.dataset.initialRole !== 'admin' || document.body.dataset.initialPage !== 'users')
        return;
    const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
    let filterState = { search: '', status: 'Tất cả', site: 'all' };
    function apply(root) {
        const table = root.querySelector('.admin-table-card table');
        if (!table)
            return;
        const search = root.querySelector('#searchInput');
        const status = root.querySelector('#statusFilter');
        const site = root.querySelector('.admin-filters select[aria-label="Công trường"]');
        if (search)
            search.value = filterState.search;
        if (status)
            status.value = filterState.status;
        if (site) {
            if (!site.querySelector('option[value="all"]')) {
                const option = document.createElement('option');
                option.value = 'all';
                option.textContent = 'Tất cả công trường';
                site.prepend(option);
            }
            [...site.options].forEach(option => {
                if (option.value !== 'all' && !/^RS-/.test(option.value)) {
                    const match = option.textContent.match(/Khối\s+([A-Z])/i);
                    if (match)
                        option.value = 'RS-' + match[1].toUpperCase();
                }
            });
            site.value = filterState.site;
            if (site.selectedIndex < 0) {
                filterState.site = 'all';
                site.value = 'all';
            }
        }
        let count = 0;
        for (const row of table.querySelectorAll('tbody tr')) {
            const cells = row.cells;
            if (cells.length < 4)
                continue;
            const matchesSearch = !filterState.search || normalize(row.textContent).includes(normalize(filterState.search));
            const matchesStatus = filterState.status === 'Tất cả' || normalize(cells[3].textContent).includes(normalize(filterState.status));
            const matchesSite = filterState.site === 'all' || cells[2].textContent.trim() === filterState.site;
            row.hidden = !(matchesSearch && matchesStatus && matchesSite);
            if (!row.hidden)
                count++;
        }
        root.querySelector('#stage10AdminCount')?.remove();
        let label = root.querySelector('#stage26AdminCount');
        if (!label) {
            label = document.createElement('p');
            label.id = 'stage26AdminCount';
            label.className = 'stage26-admin-count';
            label.setAttribute('role', 'status');
            table.closest('.admin-table-card')?.append(label);
        }
        label.textContent = `Đang hiển thị ${count} thành viên.`;
    }
    function init() {
        const container = document.querySelector('#pageContent');
        if (!container)
            return;
        const sync = () => { const root = container.querySelector('.admin-reference'); if (root)
            apply(root); };
        // Delegation survives replacement of #pageContent by script.js after a save.
        container.addEventListener('input', e => { if (e.target.id === 'searchInput') {
            e.stopPropagation();
            filterState.search = e.target.value;
            sync();
        } });
        container.addEventListener('change', e => {
            if (e.target.id === 'statusFilter') {
                e.stopPropagation();
                filterState.status = e.target.value;
            }
            else if (e.target.matches('.admin-filters select[aria-label="Công trường"]')) {
                e.stopPropagation();
                filterState.site = e.target.value;
            }
            else
                return;
            sync();
        });
        const observer = new MutationObserver(records => {
            if (records.some(r => [...r.addedNodes].some(node => node.nodeType === 1 && (node.matches?.('.admin-reference') || node.querySelector?.('.admin-reference')))))
                sync();
        });
        observer.observe(container, { childList: true, subtree: true });
        sync();
    }
    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', init);
    else
        init();
})();
