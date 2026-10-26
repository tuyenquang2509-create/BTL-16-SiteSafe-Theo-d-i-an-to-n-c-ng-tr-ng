/**
 * DASHBOARD QUẢN LÝ CÔNG TRƯỜNG
 * HTML: manager-dashboard.html
 * CSS: manager-dashboard.css
 *
 * Các số liệu trong HTML là dữ liệu minh họa cố định.
 * File này xử lý các nút của dashboard và việc tải lại dữ liệu chung.
 */
(() => {
    'use strict';

    if (document.body.dataset.initialPage !== 'manager-home' ||
        document.body.dataset.initialRole !== 'manager') {
        return;
    }

    /** Mở một màn hình thuộc vai trò quản lý. */
    function goToManagerPage(page) {
        if (typeof openPage === 'function') {
            openPage(page, 'manager');
        } else {
            console.warn('Chưa tải được chức năng điều hướng chung.');
        }
    }

    /** Xem các hành động khắc phục quá hạn. */
    function viewOverdueActions() {
        goToManagerPage('actions');
    }

    /** Mở bản đồ rủi ro của công trường. */
    function viewRiskMap() {
        goToManagerPage('zones');
    }

    /** Mở danh sách hành động khắc phục. */
    function viewCorrectiveActions() {
        goToManagerPage('actions');
    }

    /** Gắn sự kiện cho ba nút nghiệp vụ của dashboard. */
    function setupDashboardButtons() {
        const actions = {
            overdue: viewOverdueActions,
            'risk-map': viewRiskMap,
            actions: viewCorrectiveActions
        };

        document.querySelectorAll('[data-manager-action]').forEach(button => {
            button.addEventListener('click', () => {
                const handler = actions[button.dataset.managerAction];
                if (handler) handler();
            });
        });
    }

    /** Đọc lại dữ liệu khi tab khác của SiteSafe lưu thay đổi. */
    function refreshWhenDataChanges(event) {
        if (event.key !== 'sitesafe-v2-data') return;
        if (typeof loadDB !== 'function') return;

        // Các biến/hàm này do script.js dùng chung cung cấp.
        if (typeof db !== 'undefined') db = loadDB();
        if (typeof renderPage === 'function') renderPage();
    }

    setupDashboardButtons();
    window.addEventListener('storage', refreshWhenDataChanges);
})();
