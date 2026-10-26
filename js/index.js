/* index.html: mã xử lý dành riêng cho màn hình này.
   script.js quản lý điều hướng và dữ liệu dùng chung. */
/* SiteSafe · Đăng nhập/đăng ký */
// Demo login gate: client-side only; this is not production authentication.
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    const loginScreen = document.getElementById('loginScreen');
    const appShell = document.getElementById('appShell');
    const loginError = document.getElementById('loginError');
    const togglePassword = document.getElementById('togglePassword');
    const loginView = document.getElementById('loginView');
    const registerView = document.getElementById('registerView');
    const registerForm = document.getElementById('registerForm');
    const registerMessage = document.getElementById('registerMessage');
    const confirmPassword = document.getElementById('confirmPassword');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const showLogin = () => {
        registerView.hidden = true;
        loginView.hidden = false;
        loginError.textContent = '';
    };
    const showRegister = () => {
        loginView.hidden = true;
        registerView.hidden = false;
        registerMessage.textContent = '';
        registerMessage.className = 'auth-message';
    };
    const showApp = () => { loginScreen.style.display = 'none'; appShell.style.display = 'flex'; window.scrollTo(0, 0); };
    document.getElementById('showRegister').addEventListener('click', showRegister);
    document.getElementById('showLogin').addEventListener('click', showLogin);
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        if (!email || password.length < 4) {
            loginError.textContent = 'Email hoặc mật khẩu không chính xác. Kiểm tra lại hoặc đặt lại mật khẩu. Không xóa email đã nhập.';
            return;
        }
        currentRole = 'safety';
        currentPage = roleConfig[currentRole].pages[0][0];
        sessionStorage.setItem('sitesafe-demo-session', JSON.stringify({ email, role: currentRole }));
        loginError.textContent = '';
        renderPage();
        showApp();
    });
    document.getElementById('forgotPassword')?.addEventListener('click', (event) => { event.preventDefault(); loginError.textContent = 'Bản demo chưa gửi email đặt lại mật khẩu. Vui lòng liên hệ quản trị viên.'; });
    togglePassword?.addEventListener('click', () => {
        const input = document.getElementById('loginPassword');
        input.type = input.type === 'password' ? 'text' : 'password';
        togglePassword.setAttribute('aria-label', input.type === 'password' ? 'Hiện mật khẩu' : 'Ẩn mật khẩu');
        togglePassword.setAttribute('aria-pressed', String(input.type === 'text'));
    });
    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (confirmPassword.value !== document.getElementById('registerPassword').value) {
            confirmPassword.setCustomValidity('Mật khẩu xác nhận chưa khớp.');
            confirmPasswordError.hidden = false;
            confirmPassword.focus();
            return;
        }
        confirmPassword.setCustomValidity('');
        confirmPasswordError.hidden = true;
        registerMessage.className = 'auth-message is-success';
        registerMessage.textContent = 'Đã nhận hồ sơ. Tài khoản đang chờ quản trị viên xác minh; bạn chưa có quyền truy cập dữ liệu công trường.';
    });
    confirmPassword.addEventListener('input', () => {
        confirmPassword.setCustomValidity('');
        confirmPasswordError.hidden = true;
        if (registerMessage.classList.contains('is-success')) {
            registerMessage.textContent = '';
            registerMessage.className = 'auth-message';
        }
    });
    document.getElementById('logoutButton')?.addEventListener('click', () => {
        sessionStorage.removeItem('sitesafe-demo-session');
        loginForm.reset();
        registerForm.reset();
        showLogin();
        loginError.textContent = '';
        appShell.style.display = 'none';
        loginScreen.style.display = 'grid';
        window.scrollTo(0, 0);
    });
}
document.addEventListener('submit', (event) => {
    const form = event.target;
    if (form.id === 'profileInfoForm') {
        const values = Object.fromEntries(new FormData(form).entries());
        profileData = { ...profileData, name: String(values.name).trim(), email: String(values.email).trim(), phone: String(values.phone).trim() };
        try {
            localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));
            profileSaved = true;
            renderPage();
        }
        catch (error) {
            console.error('Unable to save profile details.', error);
            toast('Không thể lưu hồ sơ trong bộ nhớ trình duyệt.');
        }
    }
    else if (form.id === 'profileNotificationsForm') {
        const values = new FormData(form);
        profileData.notifications = Object.fromEntries(['risk', 'actions', 'inspections', 'ai', 'app', 'email'].map(key => [key, values.has(key)]));
        profileData.notifications.digest = String(values.get('digest'));
        try {
            localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));
            profileSaved = true;
            renderPage();
        }
        catch (error) {
            console.error('Unable to save notification preferences.', error);
            toast('Không thể lưu tùy chọn trong bộ nhớ trình duyệt.');
        }
    }
    else if (form.id === 'profilePasswordForm') {
        const current = $('#currentPassword').value;
        const password = $('#newPassword').value;
        const confirmation = $('#confirmNewPassword');
        if (password !== confirmation.value) {
            confirmation.setCustomValidity('Mật khẩu xác nhận không khớp.');
            confirmation.reportValidity();
            return;
        }
        confirmation.setCustomValidity('');
        $('#passwordFeedback').textContent = current === password
            ? 'Mật khẩu mới phải khác mật khẩu hiện tại.'
            : 'Bản demo chưa kết nối xác thực. Mật khẩu chưa được thay đổi.';
        form.reset();
    }
}, true);
document.addEventListener('input', (event) => {
    if (event.target.id === 'confirmNewPassword')
        event.target.setCustomValidity('');
});
document.addEventListener('change', (event) => {
    if (event.target.id !== 'profilePhoto')
        return;
    const file = event.target.files[0];
    if (!file)
        return;
    if (!['image/jpeg', 'image/png'].includes(file.type) || file.size > 2 * 1024 * 1024) {
        event.target.value = '';
        toast('Chọn ảnh JPG hoặc PNG có dung lượng tối đa 2 MB.');
        return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', () => {
        if (typeof reader.result !== 'string') {
            toast('Không thể đọc ảnh đã chọn.');
            return;
        }
        profilePhotoUrl = reader.result;
        profileData.photo = profilePhotoUrl;
        try {
            localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));
            profileSaved = true;
            renderPage();
        }
        catch (error) {
            console.error('Unable to save profile photo.', error);
            profilePhotoUrl = '';
            delete profileData.photo;
            event.target.value = '';
            toast('Không thể lưu ảnh trong bộ nhớ trình duyệt.');
        }
    });
    reader.addEventListener('error', () => toast('Không thể đọc ảnh đã chọn.'));
    reader.readAsDataURL(file);
});
document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action="profile-photo-delete"]');
    if (!button)
        return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const previousPhoto = profileData.photo;
    profilePhotoUrl = '';
    delete profileData.photo;
    try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));
        profileSaved = true;
        renderPage();
    }
    catch (error) {
        console.error('Unable to remove profile photo.', error);
        profileData.photo = previousPhoto;
        profilePhotoUrl = typeof previousPhoto === 'string' ? previousPhoto : '';
        toast('Không thể xóa ảnh khỏi bộ nhớ trình duyệt.');
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
