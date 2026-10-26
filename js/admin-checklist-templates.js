/* admin-checklist-templates.html: mã xử lý dành riêng cho màn hình này.
   script.js quản lý điều hướng và dữ liệu dùng chung. */
/* Chuc nang rieng cho trang: admin-checklist-templates.
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
/* ===== CHỨC NĂNG TRANG: figma-demo.js ===== */
/* SiteSafe – lớp tương tác minh họa (giai đoạn 1)
   Dữ liệu chỉ lưu trong trình duyệt; không có máy chủ, email hoặc AI thực. */
(() => {
    'use strict';
    const KEY = 'sitesafe_figma_demo_v1';
    const DRAFT_KEY = 'sitesafe_worker_drafts_v2';
    const load = () => { try {
        return JSON.parse(localStorage.getItem(KEY) || '{}');
    }
    catch {
        return {};
    } };
    const store = (name, payload) => { const data = load(); (data[name] ??= []).push({ at: new Date().toISOString(), page: location.pathname.split('/').pop(), payload }); localStorage.setItem(KEY, JSON.stringify(data)); };
    const notify = (message) => {
        let el = document.getElementById('toast');
        if (!el) {
            el = document.createElement('div');
            el.id = 'toast';
            el.className = 'toast';
            el.setAttribute('role', 'status');
            document.body.appendChild(el);
        }
        el.textContent = message;
        el.classList.add('show');
        clearTimeout(notify.timer);
        notify.timer = setTimeout(() => el.classList.remove('show'), 3800);
    };
    const snapshot = (scope) => {
        const data = {};
        scope.querySelectorAll('input,select,textarea').forEach((el, i) => {
            if (el.type === 'file')
                return;
            const key = el.name || el.id || `field_${i}`;
            if (el.type === 'radio' && !el.checked)
                return;
            data[key] = el.type === 'checkbox' ? el.checked : (el.type === 'radio' ? (el.dataset.answer || el.value) : el.value);
        });
        return data;
    };
    const draftRead = () => { try {
        return JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
    }
    catch {
        return {};
    } };
    const draftSave = (type, screen) => { const drafts = draftRead(); drafts[type] = snapshot(screen); localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts)); };
    const draftRestore = (type, screen) => {
        const saved = draftRead()[type];
        if (!saved)
            return;
        screen.querySelectorAll('input,select,textarea').forEach((el, i) => {
            if (el.type === 'file')
                return;
            const key = el.name || el.id || `field_${i}`;
            if (!(key in saved))
                return;
            if (el.type === 'radio')
                el.checked = (el.dataset.answer || el.value) === saved[key];
            else if (el.type === 'checkbox')
                el.checked = Boolean(saved[key]);
            else
                el.value = saved[key];
        });
    };
    const fieldLabel = (el) => el.closest('label')?.querySelector('span')?.textContent?.replace('*', '').trim() || 'Thông tin';
    const validateReport = (screen) => {
        const required = [...screen.querySelectorAll('.fg-field')].filter(label => label.querySelector('span')?.textContent.includes('*'));
        for (const label of required) {
            const field = label.querySelector('input,textarea,select');
            if (field && !field.value.trim()) {
                notify('Vui lòng nhập: ' + fieldLabel(field));
                field.focus();
                return false;
            }
        }
        const title = required.find(l => l.querySelector('span')?.textContent.includes('Tiêu đề'))?.querySelector('input');
        if (title && (title.value.trim().length < 5 || title.value.trim().length > 120)) {
            notify('Tiêu đề cần từ 5 đến 120 ký tự.');
            title.focus();
            return false;
        }
        const uploads = screen.querySelector('input[type=file]');
        if (uploads) {
            const files = [...uploads.files];
            if (files.length > 5) {
                notify('Chỉ được chọn tối đa 5 tệp.');
                uploads.focus();
                return false;
            }
            if (files.some(f => f.size > 10 * 1024 * 1024 || !(['image/jpeg', 'image/png', 'application/pdf'].includes(f.type)))) {
                notify('Chỉ chấp nhận JPG, PNG hoặc PDF, tối đa 10 MB mỗi tệp.');
                uploads.focus();
                return false;
            }
        }
        return true;
    };
    const scopeFor = (el) => el.closest('.fg-panel,.fg-screen,form') || document.querySelector('.page-content') || document.body;
    const confirmChecklist = (el) => {
        const screen = el.closest('.fg-screen') || document;
        const agree = screen.querySelector('.fg-check input[type="checkbox"]');
        if (agree && !agree.checked) {
            notify('Vui lòng xác nhận kết quả kiểm tra trước khi gửi.');
            agree.focus();
            return;
        }
        const failed = screen.querySelector('input[name="rail"]:checked');
        const note = screen.querySelector('textarea');
        if (failed && failed.parentElement?.textContent.includes('Không đạt') && !note?.value.trim()) {
            notify('Mục không đạt cần có ghi chú.');
            note?.focus();
            return;
        }
        store('checklists', { ...snapshot(screen), status: 'Chờ duyệt', id: 'CL-' + Date.now().toString().slice(-6) });
        const drafts = draftRead();
        delete drafts.checklist;
        localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts));
        notify('Đã gửi checklist vào hàng chờ duyệt (demo).');
    };
    const submitReport = (el, send) => {
        const screen = el.closest('.fg-screen') || document;
        if (send && !validateReport(screen))
            return;
        if (!send) {
            draftSave('report', screen);
            notify('Đã lưu nháp báo cáo. Tải lại trang vẫn giữ nội dung.');
            return;
        }
        const report = { ...snapshot(screen), status: 'Chờ duyệt', id: 'HZ-' + Date.now().toString().slice(-6), createdAt: new Date().toISOString() };
        const fileInput = screen.querySelector('input[type=file]');
        report.evidenceFiles = fileInput ? [...fileInput.files].map(f => ({ name: f.name, size: f.size, type: f.type })) : [];
        store('hazards', report);
        const drafts = draftRead();
        delete drafts.report;
        localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts));
        notify('Đã gửi báo cáo ' + report.id + ' vào hàng chờ duyệt (demo).');
    };
    document.addEventListener('click', e => {
        const btn = e.target.closest('[data-demo]');
        if (!btn)
            return;
        // Capture to prevent legacy generic “chưa kết nối” handler from showing a contradictory message.
        e.preventDefault();
        e.stopPropagation();
        const act = btn.dataset.demo;
        switch (act) {
            case 'save-checklist':
                draftSave('checklist', document.querySelector('.fg-screen') || document);
                notify('Đã lưu nháp checklist; có thể tải lại trang để tiếp tục.');
                break;
            case 'submit-checklist':
                confirmChecklist(btn);
                break;
            case 'save-report':
                submitReport(btn, false);
                break;
            case 'submit-report':
                submitReport(btn, true);
                break;
            case 'next-checklist': {
                const review = [...document.querySelectorAll('h2')].find(x => x.textContent.includes('xem lại'));
                if (review) {
                    review.closest('.fg-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    notify('Đã chuyển đến phần xem lại checklist.');
                }
                else
                    notify('Chưa có bước tiếp theo trên màn hình này.');
                break;
            }
            case 'preview': {
                const panels = [...document.querySelectorAll('.fg-panel')];
                const parent = btn.closest('.fg-panel');
                const i = panels.indexOf(parent);
                (i > 0 ? panels[i - 1] : panels[0])?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                notify('Đã chuyển đến phần nội dung để xem hoặc chỉnh sửa.');
                break;
            }
            case 'export-reports': {
                const rows = [...document.querySelectorAll('table tr')].map(tr => [...tr.querySelectorAll('th,td')].map(td => '"' + td.innerText.trim().replace(/"/g, '""') + '"').join(','));
                if (!rows.length) {
                    notify('Trang này chưa có bảng dữ liệu để xuất.');
                    break;
                }
                const blob = new Blob(['\ufeff' + rows.join('\r\n')], { type: 'text/csv;charset=utf-8' });
                const url = URL.createObjectURL(blob), a = document.createElement('a');
                a.href = url;
                a.download = 'sitesafe-bao-cao-demo.csv';
                a.click();
                setTimeout(() => URL.revokeObjectURL(url), 500);
                notify('Đã xuất bảng đang hiển thị thành CSV.');
                break;
            }
            case 'run-ai':
                notify('Đây là bản mô phỏng giao diện AI; chưa kết nối mô hình AI thực tế.');
                break;
            case 'save-ai':
                store('aiDecisions', snapshot(scopeFor(btn)));
                notify('Đã lưu quyết định AI dạng minh họa trong trình duyệt.');
                break;
            case 'profile-photo-delete': {
                const avatar = document.querySelector('.avatar');
                if (avatar)
                    avatar.textContent = 'TA';
                notify('Đã đặt lại ảnh đại diện minh họa.');
                break;
            }
            case 'worker-report':
                location.href = '../worker/worker-report-create.html';
                break;
            case 'new-site': if (document.body.dataset.initialPage === 'admin-home')
                break;
            case 'new-reports':
                notify('Chức năng tạo mới chưa được triển khai trong giai đoạn này; không có dữ liệu nào bị thay đổi.');
                break;
            default: notify('Chức năng này đang được hoàn thiện.');
        }
    }, true);
    const screen = document.querySelector('.fg-screen');
    if (screen) {
        if (document.body.dataset.initialPage === 'worker-checklist')
            draftRestore('checklist', screen);
        if (document.body.dataset.initialPage === 'worker-report')
            draftRestore('report', screen);
    }
    // Populate the worker history page with reports submitted in this browser.
    if (document.body.dataset.initialPage === 'worker-report-history') {
        const list = document.querySelector('.worker-report-list');
        const records = (load().hazards || []).slice().reverse();
        if (list && records.length) {
            const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
            const titleOf = p => Object.entries(p).find(([k, v]) => typeof v === 'string' && v.toLowerCase().includes('lan can'))?.[1] || p.field_2 || 'Báo cáo nguy cơ';
            const cards = document.createElement('div');
            cards.id = 'demo-submitted-reports';
            cards.innerHTML = '<h2 style="margin:18px 0 12px">Báo cáo đã gửi trong phiên demo</h2>' + records.map(r => {
                const p = r.payload || {};
                return `<article class="worker-report-card demo-report" data-search="${esc(JSON.stringify(p))}"><div><h2>${esc(p.id || 'HZ-DEMO')} · ${esc(titleOf(p))}</h2><p>${esc(new Date(r.at).toLocaleString('vi-VN'))} · Dữ liệu lưu trên trình duyệt</p></div><div class="worker-report-meta"><span class="badge">${esc(p.status || 'Chờ duyệt')}</span></div><p>${esc(p.field_5 || 'Đã tiếp nhận báo cáo minh họa; chưa có xác nhận của cán bộ an toàn.')}</p><small>Minh chứng đã chọn: ${esc((p.evidenceFiles || []).map(f => f.name).join(', ') || 'Chưa có tệp')}</small></article>`;
            }).join('');
            list.prepend(cards);
            const count = document.querySelector('.reference-count');
            if (count)
                count.textContent = `${records.length} báo cáo demo đã gửi · Bản ghi mẫu được giữ riêng.`;
        }
        const search = document.getElementById('searchInput');
        if (search)
            search.addEventListener('input', () => document.querySelectorAll('.demo-report').forEach(card => card.hidden = !card.textContent.toLowerCase().includes(search.value.toLowerCase())));
    }
    // Keep demo labels honest; avoid a tooltip claiming a working action is unconnected.
    document.querySelectorAll('[data-demo]').forEach(b => {
        if (['save-checklist', 'submit-checklist', 'save-report', 'submit-report', 'next-checklist', 'export-reports', 'save-ai'].includes(b.dataset.demo))
            b.removeAttribute('title');
    });
})();
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
