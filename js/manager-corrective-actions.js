/* manager-corrective-actions.html: mã xử lý dành riêng cho màn hình này.
   script.js quản lý điều hướng và dữ liệu dùng chung. */
/* Chuc nang rieng cho trang: manager-corrective-actions.
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
/* ===== CHỨC NĂNG TRANG: figma-stage9.js ===== */
/* SiteSafe - Giai doan 9: ket noi nut tren giao dien Figma voi luong demo.
   Khong co backend; chi luu localStorage. */
(() => {
    'use strict';
    const page = location.pathname.split('/').pop();
    const screen = document.querySelector('.fg-screen');
    if (!screen)
        return;
    const FLOW = 'sitesafe_workflow_phase3_v1';
    const read = () => { try {
        const d = JSON.parse(localStorage.getItem(FLOW) || '{}');
        return d && typeof d === 'object' ? d : {};
    }
    catch {
        return {};
    } };
    const save = d => localStorage.setItem(FLOW, JSON.stringify(d));
    const notify = m => { const t = document.getElementById('toast'); if (!t)
        return; t.textContent = m; t.classList.add('show'); clearTimeout(notify.timer); notify.timer = setTimeout(() => t.classList.remove('show'), 3800); };
    const field = (section, part) => [...section.querySelectorAll('.fg-field')].find(l => l.querySelector('span')?.textContent.includes(part))?.querySelector('input,textarea,select');
    const sections = [...screen.querySelectorAll('.fg-panel')];
    const section = part => sections.find(s => s.querySelector('h2')?.textContent.includes(part));
    const getValue = (s, p) => field(s, p)?.value.trim() || '';
    const stop = e => { e.preventDefault(); e.stopImmediatePropagation(); };
    const onClick = (test, fn) => window.addEventListener('click', e => { const b = e.target.closest('button'); if (!b || !screen.contains(b) || !test(b))
        return; stop(e); fn(b); }, true);
    if (page === 'worker-report-create.html') {
        const upload = screen.querySelector('.fg-upload input[type=file]');
        if (upload) {
            const preview = document.createElement('div');
            preview.className = 'phase9-evidence-list';
            preview.setAttribute('aria-live', 'polite');
            upload.closest('.fg-upload')?.insertAdjacentElement('afterend', preview);
            upload.addEventListener('change', () => { const files = [...upload.files]; preview.replaceChildren(); files.forEach(f => { const item = document.createElement('div'); item.className = 'phase9-evidence-item'; item.textContent = f.name + ' · ' + (f.size / 1024 / 1024).toFixed(2) + ' MB'; preview.append(item); }); });
        }
        const info = section('Thông tin nguy cơ');
        if (info) {
            const title = field(info, 'Tiêu đề');
            title?.setAttribute('minlength', '5');
            title?.setAttribute('maxlength', '120');
        }
        const heading = screen.querySelector('.fg-heading');
        if (heading) {
            const status = document.createElement('p');
            status.className = 'phase9-subnote';
            status.textContent = 'Biểu mẫu demo: lưu nháp và gửi báo cáo trong trình duyệt; ảnh gốc chưa được tải lên máy chủ.';
            heading.insertAdjacentElement('afterend', status);
        }
    }
    if (page === 'safety-risks.html') {
        const review = section('Bảng duyệt và phân công');
        const decision = field(review, 'Quyết định');
        if (decision) {
            decision.innerHTML = '<option value="Đã xác nhận">Xác nhận</option><option value="Cần bổ sung">Cần bổ sung</option><option value="Từ chối">Từ chối</option>';
        }
        const due = field(review, 'Hạn khắc phục');
        if (due) {
            due.type = 'date';
            due.value = '2026-10-27';
        }
        const main = screen.querySelector('.fg-heading button');
        const apply = (status) => {
            const form = document.getElementById('workflowReviewForm');
            if (!form) {
                notify('Chưa tải được phần xử lý quyết định.');
                return;
            }
            const reason = getValue(review, 'Ghi chú');
            if (reason.length < 5) {
                field(review, 'Ghi chú')?.focus();
                notify('Cần nhập ghi chú hoặc lý do ít nhất 5 ký tự.');
                return;
            }
            document.getElementById('wfDecision').value = status;
            document.getElementById('wfReason').value = reason;
            document.getElementById('wfOwner').value = getValue(review, 'Người phụ trách');
            document.getElementById('wfDue').value = due?.value || '';
            form.requestSubmit();
        };
        onClick(b => b === main || b.textContent.includes('Xác nhận và giao hành động'), () => apply(decision?.value || 'Đã xác nhận'));
        onClick(b => b.textContent.trim() === 'Yêu cầu bổ sung', () => { if (decision)
            decision.value = 'Cần bổ sung'; apply('Cần bổ sung'); });
        onClick(b => b.textContent.trim() === 'Từ chối có lý do', () => { if (decision)
            decision.value = 'Từ chối'; apply('Từ chối'); });
        const verify = section('CA-012');
        if (verify) {
            const check = verify.querySelector('input[type=checkbox]');
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn btn-light';
            btn.textContent = 'Xem các yêu cầu chờ xác minh';
            verify.querySelector('.fg-actions')?.append(btn);
            btn.addEventListener('click', () => { if (!check?.checked) {
                notify('Hãy xác nhận đã kiểm tra minh chứng và hiện trường trước khi xác minh.');
                return;
            } document.getElementById('workflowVerify')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); notify('Chọn hành động đang chờ xác minh ở danh sách bên dưới.'); });
        }
    }
    if (page === 'manager-corrective-actions.html') {
        const before = section('CA-012');
        const create = section('Tạo / giao hành động');
        const top = screen.querySelector('.fg-heading button');
        onClick(b => b === top, () => create?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
        onClick(b => b.textContent.trim() === 'Nộp để xác minh', () => {
            const note = getValue(before, 'Ghi chú hoàn thành');
            if (note.length < 5) {
                notify('Cần nhập ghi chú hoàn thành ít nhất 5 ký tự.');
                return;
            }
            const d = read(), pending = (d.actions || []).filter(x => x.status === 'Đang khắc phục');
            if (!pending.length) {
                notify('Chưa có hành động demo đang khắc phục. Hãy duyệt một nguy cơ trước.');
                return;
            }
            if (pending.length > 1) {
                notify('Có nhiều hành động đang xử lý. Hãy chọn đúng hành động trong danh sách bên dưới để nộp minh chứng.');
                document.getElementById('workflowActions')?.scrollIntoView({ behavior: 'smooth' });
                return;
            }
            const a = pending[0];
            // The Figma card above is static (CA-012), while a is a live demo record.
            // Make the exact target explicit before mutating the workflow.
            if (!window.confirm('Nộp minh chứng cho hành động ' + a.id + ' (nguy cơ ' + a.riskId + ')?\n\nThao tác này chuyển trạng thái sang Chờ xác minh.'))
                return;
            a.status = 'Chờ xác minh';
            a.note = note;
            a.submittedAt = new Date().toLocaleString('vi-VN');
            (d.history ??= []).push({ at: a.submittedAt, type: 'Nộp hoàn thành', actionId: a.id });
            save(d);
            localStorage.removeItem('sitesafe_phase9_action_draft');
            notify(a.id + ' đã được nộp, chờ cán bộ an toàn xác minh.');
            location.reload();
        });
        onClick(b => b.textContent.trim() === 'Lưu nháp', () => { localStorage.setItem('sitesafe_phase9_action_draft', JSON.stringify({ note: getValue(before, 'Ghi chú hoàn thành'), savedAt: new Date().toISOString() })); notify('Đã lưu nháp ghi chú hoàn thành trên trình duyệt.'); });
        onClick(b => b.textContent.trim() === 'Lưu và giao', () => {
            const risk = getValue(create, 'Nguy cơ liên kết').split(' ')[0];
            const title = getValue(create, 'Nội dung');
            const owner = getValue(create, 'Người phụ trách');
            const due = getValue(create, 'Hạn');
            if (!risk || !title || !owner || !due) {
                notify('Vui lòng nhập đầy đủ thông tin hành động.');
                return;
            }
            if (!/^HZ-[A-Z0-9-]+$/i.test(risk)) {
                notify('Mã nguy cơ phải có dạng HZ-024 hoặc HZ-DEMO-...');
                field(create, 'Nguy cơ liên kết')?.focus();
                return;
            }
            if (title.length < 5) {
                notify('Nội dung hành động cần ít nhất 5 ký tự.');
                field(create, 'Nội dung')?.focus();
                return;
            }
            const d = read();
            d.actions ??= [];
            d.history ??= [];
            // Only approved demo reports or the built-in Figma hazard can be assigned.
            const decision = d.decisions?.[risk];
            if (decision && decision.status !== 'Đã xác nhận') {
                notify('Nguy cơ chưa được xác nhận hoặc đã đóng. Không thể giao hành động.');
                return;
            }
            if (!decision && risk !== 'HZ-024') {
                notify('Hãy để Cán bộ an toàn xác nhận nguy cơ này trước khi tạo hành động.');
                return;
            }
            if (d.decisions?.[risk]?.status === 'Đã đóng sau xác minh') {
                notify('Nguy cơ đã đóng, không thể tạo hành động mới.');
                return;
            }
            if (d.actions.some(a => a.riskId === risk && a.status !== 'Đã xác minh đóng')) {
                notify('Nguy cơ đã có hành động đang xử lý. Không tạo trùng.');
                return;
            }
            const id = 'CA-DEMO-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
            d.actions.push({ id, riskId: risk, title, owner, due, status: 'Đang khắc phục', note: '' });
            d.history.push({ at: new Date().toLocaleString('vi-VN'), type: 'Tạo hành động', actionId: id });
            save(d);
            notify('Đã tạo ' + id + ' (demo).');
            location.reload();
        });
        onClick(b => b.textContent.trim() === 'Hủy', () => { create?.querySelectorAll('input').forEach(el => el.value = ''); notify('Đã xóa dữ liệu biểu mẫu chưa lưu.'); });
        const draft = (() => { try {
            return JSON.parse(localStorage.getItem('sitesafe_phase9_action_draft') || 'null');
        }
        catch {
            return null;
        } })();
        if (draft && field(before, 'Ghi chú hoàn thành'))
            field(before, 'Ghi chú hoàn thành').value = draft.note || '';
    }
})();
/* ===== CHỨC NĂNG TRANG: manager-stage22.js ===== */
/* Stage 22: compact live summaries and filtering, without modifying Figma sample numbers. */
(() => {
    'use strict';
    const page = location.pathname.split('/').pop();
    if (!['manager-dashboard.html', 'manager-corrective-actions.html'].includes(page))
        return;
    const KEY = 'sitesafe_workflow_phase3_v1', DATA = 'sitesafe_figma_demo_v1';
    const read = (key) => { try {
        return JSON.parse(localStorage.getItem(key) || 'null') || {};
    }
    catch {
        return {};
    } };
    const snapshot = () => { const f = read(KEY), d = read(DATA); return { actions: Array.isArray(f.actions) ? f.actions : [], hazards: Array.isArray(d.hazards) ? d.hazards : [] }; };
    const norm = x => String(x ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
    const el = (tag, cls) => { const node = document.createElement(tag); node.className = cls; return node; };
    const fmt = n => String(n);
    if (page === 'manager-dashboard.html') {
        const metrics = document.querySelector('.fg-metrics');
        if (!metrics)
            return;
        const wrap = el('section', 'm22-summary');
        wrap.setAttribute('aria-label', 'Thống kê dữ liệu phát sinh');
        wrap.innerHTML = '<div class="m22-summary-title"><strong>Dữ liệu phát sinh trong phiên demo</strong><span>Riêng với số liệu Figma minh họa phía trên</span></div><div class="m22-counts" aria-live="polite"></div>';
        metrics.insertAdjacentElement('afterend', wrap);
        const draw = () => { const s = snapshot(), a = s.actions; const cells = [['Nguy cơ mới', s.hazards.length], ['Đang khắc phục', a.filter(x => x.status === 'Đang khắc phục').length], ['Chờ xác minh', a.filter(x => x.status === 'Chờ xác minh').length], ['Đã đóng', a.filter(x => x.status === 'Đã xác minh đóng').length]]; wrap.querySelector('.m22-counts').replaceChildren(...cells.map(([label, count]) => { const c = el('div', 'm22-count'); const n = el('strong', ''); n.textContent = fmt(count); const t = el('span', ''); t.textContent = label; c.append(n, t); return c; })); };
        window.addEventListener('storage', draw);
        window.addEventListener('pageshow', draw);
        draw();
    }
    if (page === 'manager-corrective-actions.html') {
        const target = document.querySelector('#workflowActions');
        if (!target)
            return;
        const host = target.closest('.workflow-panel');
        const tools = el('div', 'm22-tools');
        tools.innerHTML = '<label>Tìm hành động phát sinh<input type="search" placeholder="Mã, nguy cơ, phụ trách" aria-label="Tìm hành động phát sinh"></label><label>Trạng thái<select aria-label="Lọc trạng thái hành động"><option value="">Tất cả</option><option>Đang khắc phục</option><option>Chờ xác minh</option><option>Đã xác minh đóng</option></select></label><p class="m22-result" role="status"></p>';
        host.insertBefore(tools, target);
        const search = tools.querySelector('input'), status = tools.querySelector('select'), result = tools.querySelector('.m22-result');
        const apply = () => { const data = snapshot().actions, q = norm(search.value), st = status.value; let visible = 0; for (const item of target.querySelectorAll('.workflow-item')) {
            const id = item.querySelector('[data-id]')?.dataset.id || item.querySelector('strong')?.textContent.split(' · ')[0];
            const action = data.find(a => a.id === id);
            const match = !!action && (!st || action.status === st) && norm([action.id, action.riskId, action.owner, action.note, action.status].join(' ')).includes(q);
            item.hidden = !match;
            if (match)
                visible++;
        } result.textContent = `Hiển thị ${visible}/${data.length} hành động phát sinh`; };
        search.addEventListener('input', apply);
        status.addEventListener('change', apply);
        new MutationObserver(apply).observe(target, { childList: true });
        window.addEventListener('storage', apply);
        window.addEventListener('pageshow', apply);
        apply();
    }
})();
