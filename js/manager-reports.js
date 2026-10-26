/*
 * SiteSafe - Báo cáo an toàn của Quản lý công trường
 * Các thao tác của trang: tìm kiếm, lọc, tạo bản nháp, xem chi tiết, xuất CSV.
 * Dữ liệu bản nháp lưu trên trình duyệt (localStorage), không có máy chủ.
 */
(() => {
    'use strict';

    if (document.body.dataset.initialRole !== 'manager' ||
        document.body.dataset.initialPage !== 'reports') return;

    const STORAGE_KEY = 'sitesafe_manager_reports_stage10'; // Giữ khóa cũ để không mất bản nháp.
    const $ = selector => document.querySelector(selector);
    const table = $('#reportsTable');
    const form = $('#reportForm');
    const searchInput = $('#reportSearch');
    const periodSelect = $('#reportPeriod');
    const dialog = $('#reportDetailDialog');
    const detailList = $('#reportDetailList');
    const tbody = table?.querySelector('tbody');
    if (!tbody || !form) return;

    // 1. Đọc / lưu dữ liệu bản nháp.
    function readDrafts() {
        try {
            const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.warn('Không đọc được bản nháp:', error);
            return [];
        }
    }

    function saveDrafts(drafts) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
    }

    function showMessage(message) {
        const toast = $('#toast');
        if (!toast) return alert(message);
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
    }

    function normalizeText(value) {
        return String(value || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D')
            .toLowerCase();
    }

    // 2. Đưa bản nháp từ localStorage vào bảng.
    function renderDrafts() {
        tbody.querySelectorAll('tr[data-draft-id]').forEach(row => row.remove());

        for (const report of readDrafts()) {
            const row = document.createElement('tr');
            row.dataset.draftId = report.id;
            const values = [report.id + ' · ' + report.title, report.period, report.author];
            values.forEach(value => {
                const cell = row.insertCell();
                cell.textContent = value; // textContent tránh chèn HTML không mong muốn.
            });
            const status = row.insertCell();
            const pill = document.createElement('span');
            pill.className = 'fg-pill fg-yellow';
            pill.textContent = 'Bản nháp';
            status.append(pill);
            const actions = row.insertCell();
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'btn btn-light view-report';
            button.textContent = 'Xem';
            actions.append(button);
            tbody.prepend(row);
        }
        filterReports();
    }

    // 3. Tìm kiếm và lọc theo kỳ.
    function filterReports() {
        const keyword = normalizeText(searchInput?.value.trim());
        const period = periodSelect?.value || 'all';
        let count = 0;
        const dates = { '40': '27/09', '39': '20/09', '38': '13/09' };

        for (const row of tbody.rows) {
            const text = normalizeText(row.textContent);
            const reportPeriod = normalizeText(row.cells[1]?.textContent);
            const matchesSearch = !keyword || text.includes(keyword);
            const matchesPeriod = period === 'all' ||
                (period === 'month' && reportPeriod.includes('thang')) ||
                (period !== 'month' && (reportPeriod.includes('tuan ' + period) ||
                    reportPeriod.includes(dates[period] || '___')));
            row.hidden = !(matchesSearch && matchesPeriod);
            if (!row.hidden) count++;
        }
        $('#reportCount').textContent = `Đang hiển thị ${count} báo cáo.`;
    }

    // 4. Mở / đóng biểu mẫu tạo bản nháp.
    function openReportForm() {
        form.hidden = false;
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        form.querySelector('[name="title"]').focus();
    }

    function closeReportForm() {
        form.hidden = true;
    }

    // 5. Tạo mã mới, lưu bản nháp và làm mới bảng.
    function createReport(event) {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        const drafts = readDrafts();
        const ids = [...tbody.rows]
            .map(row => Number(row.cells[0]?.textContent.match(/RP-(\d+)/)?.[1] || 0));
        const nextId = Math.max(40, ...ids) + 1;
        const id = 'RP-' + String(nextId).padStart(3, '0');
        drafts.unshift({ id, title: data.title.trim(), period: data.period, author: data.author.trim() });
        try {
            saveDrafts(drafts);
        } catch (error) {
            showMessage('Không lưu được bản nháp trên trình duyệt.');
            return;
        }
        form.reset();
        closeReportForm();
        renderDrafts();
        showMessage('Đã lưu bản nháp ' + id + '.');
    }

    // 6. Xem chi tiết một hàng báo cáo.
    function showReportDetail(row) {
        const labels = ['Mã / báo cáo', 'Kỳ báo cáo', 'Người tạo', 'Trạng thái'];
        detailList.replaceChildren();
        labels.forEach((label, index) => {
            const term = document.createElement('dt');
            term.textContent = label;
            const value = document.createElement('dd');
            value.textContent = row.cells[index]?.textContent.trim() || 'Chưa có';
            detailList.append(term, value);
        });
        if (typeof dialog.showModal === 'function') dialog.showModal();
        else dialog.setAttribute('open', '');
    }

    // 7. Xuất những hàng đang hiển thị thành file CSV.
    function exportReportsCSV() {
        const visibleRows = [...tbody.rows].filter(row => !row.hidden);
        const data = [
            ['Mã / báo cáo', 'Kỳ báo cáo', 'Người tạo', 'Trạng thái'],
            ...visibleRows.map(row => [...row.cells].slice(0, 4).map(cell => cell.textContent.trim()))
        ];
        const csv = '\uFEFF' + data.map(row => row
            .map(value => '"' + value.replace(/"/g, '""') + '"')
            .join(',')).join('\r\n');
        const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = 'sitesafe-bao-cao-da-loc.csv';
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        showMessage(`Đã xuất ${visibleRows.length} báo cáo.`);
    }

    // 8. Gắn sự kiện với các phần tử HTML.
    searchInput?.addEventListener('input', filterReports);
    periodSelect?.addEventListener('change', filterReports);
    $('#openReportForm')?.addEventListener('click', openReportForm);
    $('#openReportFormBottom')?.addEventListener('click', openReportForm);
    $('#cancelReportForm')?.addEventListener('click', closeReportForm);
    $('#exportReportsCsv')?.addEventListener('click', exportReportsCSV);
    form.addEventListener('submit', createReport);
    tbody.addEventListener('click', event => {
        const button = event.target.closest('.view-report');
        if (button) showReportDetail(button.closest('tr'));
    });
    dialog?.addEventListener('click', event => {
        if (event.target === dialog) dialog.close();
    });

    // Dữ liệu có thể được sửa ở tab khác.
    window.addEventListener('storage', event => {
        if (event.key === STORAGE_KEY) renderDrafts();
        if (event.key === 'sitesafe-v2-data' && typeof loadDB === 'function') {
            db = loadDB();
            if (typeof renderPage === 'function') renderPage();
        }
    });

    renderDrafts();
})();
