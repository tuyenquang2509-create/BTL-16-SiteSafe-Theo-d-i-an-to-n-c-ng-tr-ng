(() => {
    'use strict';

    if (document.body.dataset.initialPage !== 'admin-home') return;

    const STORAGE_KEY = 'sitesafe_admin_sites_v23';
    const defaultSites = [
        { code: 'RS-A', name: 'Riverside – Khối A', manager: 'Lê Hoàng', zones: 6, status: 'Đang thi công' },
        { code: 'RS-B', name: 'Riverside – Khối B', manager: 'Lê Hoàng', zones: 3, status: 'Đang chuẩn bị' }
    ];

    const screen = document.querySelector('.fg-screen');
    if (!screen) return;

    const panels = [...screen.querySelectorAll('.fg-panel')];
    const table = panels.find(panel => panel.querySelector('table.fg-table'))?.querySelector('table');
    const formPanel = panels.find(panel => panel.querySelector('.fg-form-grid'));
    if (!table || !formPanel) return;

    const [codeInput, nameInput, managerInput, statusInput] =
        formPanel.querySelectorAll('.fg-form-grid input, .fg-form-grid select');
    const saveButton = formPanel.querySelector('.fg-actions .btn-primary');
    const cancelButton = formPanel.querySelector('.fg-actions .btn-light');
    const newButton = screen.querySelector('.fg-heading [data-demo="new-site"]');
    const tbody = table.querySelector('tbody');
    const totalMetric = screen.querySelector('.fg-metric strong');

    let sites = loadSites();
    let editingCode = null;

    // 1. Đọc và lưu dữ liệu công trường
    function loadSites() {
        try {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
            return Array.isArray(stored) ? stored : defaultSites.map(site => ({ ...site }));
        } catch {
            return defaultSites.map(site => ({ ...site }));
        }
    }

    function saveSites() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
    }

    // 2. Các hàm hỗ trợ
    function normalizeText(value) {
        return String(value ?? '').normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
    }

    function notify(message) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3300);
    }

    // 3. Tạo bộ lọc công trường
    const filters = document.createElement('div');
    filters.className = 'admin23-tools';
    filters.innerHTML = `
        <label for="siteSearch23">Tìm công trường</label>
        <input id="siteSearch23" type="search" placeholder="Mã, tên, quản lý...">
        <label for="siteStatus23">Trạng thái</label>
        <select id="siteStatus23">
            <option value="">Tất cả</option>
            <option>Đang thi công</option>
            <option>Đang chuẩn bị</option>
            <option>Tạm dừng</option>
            <option>Đã hoàn thành</option>
        </select>
        <span id="siteCount23" aria-live="polite"></span>
    `;
    const sectionHead = table.closest('.fg-panel').querySelector('.fg-section-head');
    sectionHead.after(filters);    const searchInput = filters.querySelector('#siteSearch23');
    const statusFilter = filters.querySelector('#siteStatus23');
    const siteCount = filters.querySelector('#siteCount23');

    statusInput.innerHTML = ['Đang chuẩn bị', 'Đang thi công', 'Tạm dừng', 'Đã hoàn thành']
        .map(status => `<option>${status}</option>`).join('');

    // 4. Hiển thị danh sách và áp dụng bộ lọc
    function renderSites() {
        const keyword = normalizeText(searchInput.value.trim());
        const selectedStatus = statusFilter.value;
        const visibleSites = sites.filter(site => {
            const matchesText = normalizeText(`${site.code} ${site.name} ${site.manager}`).includes(keyword);
            return matchesText && (!selectedStatus || site.status === selectedStatus);
        });

        // Dùng textContent để hiển thị dữ liệu người dùng an toàn.
        tbody.replaceChildren();
        for (const site of visibleSites) {
            const row = tbody.insertRow();
            const nameCell = row.insertCell();
            const strong = document.createElement('strong');
            strong.textContent = site.code;
            nameCell.append(strong, document.createTextNode(` · ${site.name}`));
            row.insertCell().textContent = site.manager;
            row.insertCell().textContent = `${site.zones} khu vực`;
            const badge = document.createElement('span');
            badge.className = `fg-pill ${site.status === 'Đang thi công' ? 'fg-green' : 'fg-yellow'}`;
            badge.textContent = site.status;
            row.insertCell().append(badge);
            const editButton = document.createElement('button');
            editButton.type = 'button';
            editButton.className = 'btn btn-light btn-sm';
            editButton.dataset.editSite = site.code;
            editButton.textContent = 'Sửa';
            row.insertCell().append(editButton);
        }
        if (!visibleSites.length) {
            const cell = tbody.insertRow().insertCell();
            cell.colSpan = 5;
            cell.textContent = 'Không tìm thấy công trường phù hợp.';
        }
        siteCount.textContent = `${visibleSites.length}/${sites.length} công trường`;
        if (totalMetric) totalMetric.textContent = sites.length;
    }

    // 5. Tạo mới, sửa và lưu công trường
    function resetForm() {
        editingCode = null;
        codeInput.disabled = false;
        codeInput.value = '';
        nameInput.value = '';
        managerInput.value = 'Lê Hoàng';
        statusInput.value = 'Đang chuẩn bị';
        saveButton.textContent = 'Lưu công trường';
    }

    function openCreateForm() {
        resetForm();
        formPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        codeInput.focus();
    }

    function openEditForm(siteCode) {
        const site = sites.find(item => item.code === siteCode);
        if (!site) return;
        editingCode = site.code;
        codeInput.value = site.code;
        codeInput.disabled = true;
        nameInput.value = site.name;
        managerInput.value = site.manager;
        statusInput.value = site.status;
        saveButton.textContent = 'Cập nhật công trường';
        formPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        nameInput.focus();
    }

    function saveSite() {
        const oldSite = sites.find(site => site.code === editingCode);
        const site = {
            code: codeInput.value.trim().toUpperCase(),
            name: nameInput.value.trim(),
            manager: managerInput.value.trim(),
            status: statusInput.value,
            zones: oldSite?.zones ?? 0
        };

        if (!/^[A-Z0-9-]{2,20}$/.test(site.code)) {
            notify('Mã công trường phải có 2–20 ký tự chữ, số hoặc dấu gạch ngang.');
            codeInput.focus();
            return;
        }
        if (site.name.length < 3) {
            notify('Vui lòng nhập tên công trường ít nhất 3 ký tự.');
            nameInput.focus();
            return;
        }
        if (!site.manager) {
            notify('Vui lòng chọn người quản lý.');
            managerInput.focus();
            return;
        }
        if (!editingCode && sites.some(item => item.code === site.code)) {
            notify('Mã công trường đã tồn tại.');
            codeInput.focus();
            return;
        }

        if (editingCode) {
            sites = sites.map(item => item.code === editingCode ? site : item);
        } else {
            sites.push(site);
        }
        saveSites();
        renderSites();
        resetForm();
        notify('Đã lưu công trường trong dữ liệu demo.');
    }

    // 6. Gắn sự kiện cho các nút và bộ lọc
    function setupEvents() {
        // Không để JavaScript demo dùng chung xử lý các nút riêng của trang.
        newButton?.removeAttribute('data-demo');
        saveButton?.removeAttribute('data-demo');
        cancelButton?.removeAttribute('data-demo');

        newButton?.removeAttribute('title');
        saveButton?.removeAttribute('title');
        cancelButton?.removeAttribute('title');

        // Tạo công trường mới
        newButton?.addEventListener('click', function (event) {
            event.preventDefault();
            openCreateForm();
        });

        // Lưu hoặc cập nhật công trường
        saveButton?.addEventListener('click', function (event) {
            event.preventDefault();
            saveSite();
        });

        // Hủy thay đổi
        cancelButton?.addEventListener('click', function (event) {
            event.preventDefault();
            resetForm();
            notify('Đã hủy thay đổi chưa lưu.');
        });

        // Sửa công trường trong bảng
        tbody.addEventListener('click', function (event) {
            const button = event.target.closest('[data-edit-site]');
            if (!button) return;

            event.preventDefault();
            openEditForm(button.dataset.editSite);
        });

        // Tìm kiếm và lọc công trường
        searchInput.addEventListener('input', renderSites);
        statusFilter.addEventListener('change', renderSites);
    }

    // 7. Khởi tạo trang
    const header = table.querySelector('thead tr');
    if (header && header.children.length === 4) {
        const cell = document.createElement('th');
        cell.textContent = 'Thao tác';
        header.append(cell);
    }
    setupEvents();
    resetForm();
    renderSites();

    window.addEventListener('storage', event => {
        if (event.key === STORAGE_KEY) {
            sites = loadSites();
            renderSites();
        }
        if (event.key === 'sitesafe-v2-data' && typeof loadDB === 'function') {
            db = loadDB();
            if (typeof renderPage === 'function') renderPage();
        }
    });
})();
