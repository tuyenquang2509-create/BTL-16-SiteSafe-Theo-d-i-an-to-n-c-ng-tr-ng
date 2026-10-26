/* admin-zones.html: mã xử lý dành riêng cho màn hình này.
   script.js quản lý điều hướng và dữ liệu dùng chung. */
/* Chuc nang rieng cho trang: admin-zones.
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
/* ===== CHỨC NĂNG TRANG: admin-stage11.js ===== */
/* SiteSafe - Admin Stage 11. Independent local demo storage; no server. */
(() => {
    'use strict';
    const isZones = location.pathname.endsWith('admin-zones.html');
    const isTemplates = location.pathname.endsWith('admin-checklist-templates.html');
    if (!isZones && !isTemplates)
        return;
    const screen = document.querySelector('.fg-screen');
    const table = screen?.querySelector('.fg-table');
    const panel = screen?.querySelectorAll('.fg-panel')[1];
    if (!screen || !table || !panel)
        return;
    const key = isZones ? 'sitesafe_admin_zones_stage11' : 'sitesafe_admin_templates_stage11';
    const seed = isZones ? [
        { id: 'Z-A2', name: 'Tầng 2', type: 'Khu thi công', owner: 'Lê Hoàng', status: 'Đang hoạt động' },
        { id: 'Z-A1', name: 'Tầng 1', type: 'Khu thi công', owner: 'Lê Hoàng', status: 'Đang hoạt động' },
        { id: 'Z-K1', name: 'Kho vật tư', type: 'Kho', owner: 'Mai Lan', status: 'Đang hoạt động' },
        { id: 'Z-B1', name: 'Bãi tập kết', type: 'Bãi vật tư', owner: 'Lê Hoàng', status: 'Đang hoạt động' },
        { id: 'Z-OLD', name: 'Kho tạm', type: 'Khu vực cũ', owner: 'Mai Lan', status: 'Đã lưu trữ' }
    ] : [
        { id: 'TMP-01', name: 'Làm việc trên cao', type: 'Làm việc trên cao', version: 'v2.1', status: 'Đã phát hành', items: 'Kiểm tra dây an toàn\nKiểm tra lan can' },
        { id: 'TMP-02', name: 'Điện tạm', type: 'Công tác điện', version: 'v1.4', status: 'Đã phát hành', items: 'Kiểm tra tủ điện' },
        { id: 'TMP-03', name: 'Kho vật tư', type: 'Kho vật tư', version: 'v1.2', status: 'Đã phát hành', items: 'Kiểm tra lối thoát hiểm' },
        { id: 'TMP-04', name: 'Giàn giáo', type: 'Giàn giáo', version: 'v0.9', status: 'Bản nháp', items: 'Kiểm tra chân đế' }
    ];
    const safe = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    let rows;
    try {
        const x = JSON.parse(localStorage.getItem(key));
        rows = Array.isArray(x) ? x : structuredClone(seed);
    }
    catch {
        rows = structuredClone(seed);
    }
    let editing = null;
    const save = () => localStorage.setItem(key, JSON.stringify(rows));
    const toast = msg => { const t = document.getElementById('toast'); if (t) {
        t.textContent = msg;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 3200);
    } };
    const title = panel.querySelector('h2');
    const form = panel.querySelector('.fg-form-grid');
    const actions = panel.querySelector('.fg-actions');
    const head = screen.querySelector('.fg-heading');
    const toolbar = document.createElement('div');
    toolbar.className = 'stage11-toolbar';
    toolbar.innerHTML = '<label>Tìm kiếm <input id="stage11-search" type="search" placeholder="Mã hoặc tên..."></label><label>Trạng thái <select id="stage11-filter"><option value="">Tất cả</option>' + (isZones ? '<option>Đang hoạt động</option><option>Đã lưu trữ</option>' : '<option>Đã phát hành</option><option>Bản nháp</option><option>Đã lưu trữ</option>') + '</select></label><span id="stage11-count" aria-live="polite"></span>';
    table.closest('.fg-panel').querySelector('.fg-section-head').after(toolbar);
    const tbody = table.querySelector('tbody');
    const fields = isZones ? `<label class="fg-field"><span>Mã khu vực *</span><input name="id" required maxlength="24" placeholder="Z-M1"></label><label class="fg-field"><span>Tên khu vực *</span><input name="name" required maxlength="80"></label><label class="fg-field"><span>Loại khu vực *</span><input name="type" required maxlength="80"></label><label class="fg-field"><span>Người phụ trách *</span><input name="owner" required maxlength="80"></label>` : `<label class="fg-field"><span>Mã mẫu *</span><input name="id" required maxlength="24" placeholder="TMP-05"></label><label class="fg-field"><span>Tên mẫu *</span><input name="name" required maxlength="100"></label><label class="fg-field"><span>Loại công việc *</span><input name="type" required maxlength="80"></label><label class="fg-field"><span>Phiên bản *</span><input name="version" required pattern="v[0-9]+\\.[0-9]+" placeholder="v1.0"></label><label class="fg-field stage11-wide"><span>Các mục kiểm tra * (mỗi dòng một mục)</span><textarea name="items" required rows="4" placeholder="Kiểm tra thiết bị bảo hộ"></textarea></label>`;
    form.innerHTML = fields;
    const formEl = document.createElement('form');
    formEl.id = 'stage11-form';
    form.before(formEl);
    formEl.append(form);
    actions.innerHTML = isZones ? '<button class="btn btn-primary" type="submit" form="stage11-form">Lưu khu vực</button><button class="btn btn-light" type="button" data-stage11="cancel">Hủy</button>' : '<button class="btn btn-primary" type="submit" form="stage11-form" value="draft">Lưu bản nháp</button><button class="btn btn-light" type="button" data-stage11="publish">Phát hành phiên bản</button><button class="btn btn-light" type="button" data-stage11="cancel">Hủy</button>';
    const input = n => formEl.elements.namedItem(n);
    function reset(scroll = false) { editing = null; formEl.reset(); if (title)
        title.textContent = isZones ? 'Tạo khu vực' : 'Tạo mẫu checklist'; input('id').readOnly = false; if (scroll)
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    function edit(id) { const row = rows.find(x => x.id === id); if (!row)
        return; editing = id; Object.keys(row).forEach(k => { const el = input(k); if (el)
        el.value = row[k]; }); input('id').readOnly = true; if (title)
        title.textContent = 'Chỉnh sửa · ' + id; panel.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    function render() {
        const q = toolbar.querySelector('#stage11-search').value.toLowerCase().trim(), filter = toolbar.querySelector('#stage11-filter').value;
        const visible = rows.filter(x => (!filter || x.status === filter) && (!q || [x.id, x.name, x.type, x.owner, x.version].join(' ').toLowerCase().includes(q)));
        tbody.innerHTML = visible.map(x => `<tr><td>${safe(x.id)} · ${safe(x.name)}</td><td>${safe(x.type)}</td><td>${isZones ? safe(x.owner) : safe(x.version)}</td><td><span class="fg-pill ${x.status === 'Đang hoạt động' || x.status === 'Đã phát hành' ? 'fg-green' : 'fg-yellow'}">${safe(x.status)}</span></td><td><button type="button" class="btn btn-light" data-stage11="edit" data-id="${safe(x.id)}">Sửa</button> <button type="button" class="btn btn-light" data-stage11="toggle" data-id="${safe(x.id)}">${x.status === 'Đã lưu trữ' ? 'Khôi phục' : 'Lưu trữ'}</button></td></tr>`).join('') || '<tr><td colspan="5">Không tìm thấy dữ liệu phù hợp.</td></tr>';
        toolbar.querySelector('#stage11-count').textContent = visible.length + ' / ' + rows.length + ' bản ghi';
    }
    function collect() { const data = {}; for (const el of formEl.querySelectorAll('[name]'))
        data[el.name] = el.value.trim(); return data; }
    function commit(publish) {
        if (!formEl.reportValidity())
            return;
        const data = collect();
        if (rows.some(x => x.id.toLowerCase() === data.id.toLowerCase() && x.id !== editing)) {
            toast('Mã này đã tồn tại.');
            input('id').focus();
            return;
        }
        if (!isZones) {
            if (!/^v\d+\.\d+$/.test(data.version)) {
                toast('Phiên bản cần dạng v1.0.');
                return;
            }
            if (publish && !data.items.split('\n').some(x => x.trim())) {
                toast('Mẫu cần ít nhất một mục kiểm tra.');
                return;
            }
        }
        const old = rows.find(x => x.id === editing);
        if (!isZones && old && old.status === 'Đã phát hành' && old.version === data.version) {
            toast('Mẫu đã phát hành phải dùng phiên bản mới khi sửa.');
            input('version').focus();
            return;
        }
        data.status = isZones ? (old?.status || 'Đang hoạt động') : (publish ? 'Đã phát hành' : 'Bản nháp');
        if (old)
            Object.assign(old, data);
        else
            rows.unshift(data);
        save();
        render();
        toast(publish ? 'Đã phát hành phiên bản demo.' : 'Đã lưu dữ liệu trong trình duyệt.');
        reset();
    }
    formEl.addEventListener('submit', e => { e.preventDefault(); commit(false); });
    toolbar.addEventListener('input', render);
    toolbar.addEventListener('change', render);
    // Capture stops old generic modal handlers and placeholder demo notices.
    document.addEventListener('click', e => {
        const b = e.target.closest('[data-stage11], [data-action="new-zone"], [data-action="new-checklist"]');
        if (!b)
            return;
        e.preventDefault();
        e.stopImmediatePropagation();
        const act = b.dataset.stage11 || 'new';
        if (act === 'new') {
            reset(true);
            return;
        }
        if (act === 'cancel') {
            reset();
            return;
        }
        if (act === 'publish') {
            commit(true);
            return;
        }
        const id = b.dataset.id;
        if (act === 'edit') {
            edit(id);
            return;
        }
        if (act === 'toggle') {
            const x = rows.find(r => r.id === id);
            if (!x)
                return;
            x.status = x.status === 'Đã lưu trữ' ? (isZones ? 'Đang hoạt động' : 'Bản nháp') : 'Đã lưu trữ';
            save();
            render();
            toast('Đã cập nhật trạng thái demo.');
        }
    }, true);
    render();
    reset();
})();
