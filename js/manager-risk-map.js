/**
 * BẢN ĐỒ RỦI RO - QUẢN LÝ CÔNG TRƯỜNG
 * HTML: manager-risk-map.html
 * CSS: manager-risk-map.css
 *
 * Dữ liệu khu vực bên dưới là dữ liệu mẫu. Không có API/máy chủ.
 * Chức năng: chọn khu vực, tìm khu vực, xem bảng và mở việc quá hạn.
 */
(() => {
    'use strict';

    if (document.body.dataset.initialPage !== 'zones' ||
        document.body.dataset.initialRole !== 'manager') {
        return;
    }

    const zones = [
        { id: 'Z-A2', name: 'Tầng 2', risk: 'Cao', open: 8, high: 3, late: 2, inspections: 1, note: 'HZ-024 · Thiếu lan can tại mép sàn' },
        { id: 'Z-A1', name: 'Tầng 1', risk: 'Vừa', open: 6, high: 1, late: 1, inspections: 0, note: 'Nguy cơ tại khu vực tầng 1' },
        { id: 'Z-K1', name: 'Kho vật tư', risk: 'Vừa', open: 4, high: 1, late: 0, inspections: 0, note: 'Nguy cơ tại khu vực kho vật tư' },
        { id: 'Z-C1', name: 'Cổng chính', risk: 'Thấp', open: 2, high: 0, late: 0, inspections: 0, note: 'Nguy cơ tại khu vực cổng chính' }
    ];

    const buttons = [...document.querySelectorAll('[data-zone-index]')];
    const details = document.getElementById('stage21-selected-zone');
    const search = document.getElementById('stage21-zone-search');
    const ranking = document.getElementById('stage21-zone-rank');
    let selectedIndex = 0;

    /** Chuẩn hóa chữ tiếng Việt để tìm kiếm không phân biệt dấu. */
    function normalizeText(value) {
        return String(value).normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D')
            .toLowerCase();
    }

    /** Chọn một khu vực và cập nhật bảng thông tin chi tiết. */
    function selectZone(index) {
        const zone = zones[index];
        if (!zone || !details) return;
        selectedIndex = index;

        buttons.forEach((button, i) => {
            const active = i === index;
            button.setAttribute('aria-pressed', String(active));
            button.classList.toggle('stage21-active', active);
        });

        const title = details.querySelector('h2');
        const badge = details.querySelector('.fg-pill');
        const paragraphs = details.querySelectorAll(':scope > p');
        const showRisksButton = details.querySelector('[data-risk-action="show-zone-risks"]');

        if (title) title.textContent = `Khu vực đã chọn · ${zone.id}`;
        if (badge) {
            badge.textContent = `Rủi ro ${zone.risk.toLowerCase()}`;
            badge.classList.remove('fg-red', 'fg-yellow', 'fg-green');
            badge.classList.add(zone.risk === 'Cao' ? 'fg-red' : zone.risk === 'Vừa' ? 'fg-yellow' : 'fg-green');
        }
        if (paragraphs[0]) {
            paragraphs[0].textContent = `${zone.open} nguy cơ mở · ${zone.high} ưu tiên cao · ${zone.late} hành động quá hạn · ${zone.inspections} kiểm tra đang thực hiện`;
        }
        if (paragraphs[1]) paragraphs[1].textContent = `Nguy cơ nổi bật: ${zone.note}.`;
        if (showRisksButton) showRisksButton.textContent = `Xem ${zone.open} nguy cơ`;

        if (ranking) {
            ranking.querySelectorAll('tbody tr').forEach(row => {
                row.classList.toggle('stage21-rank-selected', row.textContent.includes(zone.id));
            });
        }
    }

    /** Lọc các nút khu vực khi người dùng nhập từ khóa. */
    function filterZones() {
        const keyword = normalizeText(search?.value.trim() || '');
        buttons.forEach((button, index) => {
            const zone = zones[index];
            button.hidden = !normalizeText(`${zone.id} ${zone.name}`).includes(keyword);
        });
    }

    /** Cuộn tới bảng thống kê và làm nổi bật khu vực đang chọn. */
    function showSelectedZoneInTable() {
        if (!ranking) return;
        const row = [...ranking.querySelectorAll('tbody tr')]
            .find(item => item.textContent.includes(zones[selectedIndex].id));
        (row || ranking).scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    /** Chuyển sang trang hành động khắc phục của quản lý. */
    function viewOverdueActions() {
        if (typeof openPage === 'function') openPage('actions', 'manager');
    }

    /** Đăng ký sự kiện cho các nút và ô tìm kiếm. */
    function setupRiskMapEvents() {
        buttons.forEach(button => {
            button.addEventListener('click', () => selectZone(Number(button.dataset.zoneIndex)));
        });
        search?.addEventListener('input', filterZones);

        document.querySelectorAll('[data-risk-action]').forEach(button => {
            button.addEventListener('click', () => {
                if (button.dataset.riskAction === 'show-zone-risks') showSelectedZoneInTable();
                if (button.dataset.riskAction === 'overdue') viewOverdueActions();
            });
        });
    }

    /** Làm mới dữ liệu chung khi tab khác thay đổi. */
    function refreshWhenDataChanges(event) {
        if (event.key !== 'sitesafe-v2-data') return;
        if (typeof loadDB !== 'function') return;
        if (typeof db !== 'undefined') db = loadDB();
        if (typeof renderPage === 'function') renderPage();
    }

    if (details && buttons.length) {
        setupRiskMapEvents();
        selectZone(0);
    }
    window.addEventListener('storage', refreshWhenDataChanges);
})();
