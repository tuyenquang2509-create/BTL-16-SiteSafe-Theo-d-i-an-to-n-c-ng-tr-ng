/* Chuc nang rieng cho trang: safety-inspections.
 * Cac xu ly nghiep vu va renderers hien tai van duoc giu trong script.js
 * de tuong thich voi cac lien ket/hanh dong xuyen man hinh.
 */
window.addEventListener('storage', function (event) {
  if (event.key === 'sitesafe-v2-data' && typeof loadDB === 'function') {
    db = loadDB();
    if (typeof renderPage === 'function') renderPage();
  }
});

function setupInspectionReferenceLayout() {
  var screen = document.querySelector('.fg-screen');
  if (!screen) return;

  var caption = screen.querySelector('.fg-caption');
  var filterPanel = screen.querySelector('.fg-panel');
  if (!caption || !filterPanel) return;

  var roleSelect = document.querySelector('.sidebar > .form-field');
  var userChip = document.querySelector('.topbar .user-chip');
  var topbarRight = document.querySelector('.topbar-right');
  if (roleSelect && userChip && topbarRight) {
    var roleSwitcher = document.createElement('details');
    roleSwitcher.className = 'inspection-role-switcher';
    var trigger = document.createElement('summary');
    trigger.setAttribute('aria-label', 'Chuyển vai trò');
    trigger.title = 'Chuyển vai trò';
    userChip.replaceWith(trigger);
    trigger.append(userChip);
    roleSwitcher.append(trigger, roleSelect);
    topbarRight.append(roleSwitcher);
  }

  var search = screen.querySelector('#stage20-inspection-search');
  if (search) search.value = '';

  filterPanel.classList.remove('fg-panel');
  filterPanel.classList.add('inspection-filters');
  var filterHeading = filterPanel.querySelector('.fg-section-head');
  if (filterHeading) filterHeading.remove();

  var listPanel = screen.querySelector('#stage20-inspection-table')?.closest('.fg-panel');
  var weekPanel = screen.querySelector('.fg-columns .fg-panel:nth-child(2)');
  if (!listPanel || !weekPanel) return;

  var tabs = document.createElement('div');
  tabs.className = 'inspection-view-tabs';
  tabs.setAttribute('aria-label', 'Chế độ xem lịch kiểm tra');
  tabs.innerHTML = '<button class="btn btn-primary" type="button" aria-current="page" data-inspection-target="list">Danh sách</button><button class="btn btn-light" type="button" data-inspection-target="week">Lịch tuần</button>';
  filterPanel.after(tabs);

  tabs.addEventListener('click', function (event) {
    var button = event.target.closest('[data-inspection-target]');
    if (!button) return;
    var target = button.dataset.inspectionTarget === 'week' ? weekPanel : listPanel;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    tabs.querySelectorAll('button').forEach(function (tab) {
      var active = tab === button;
      tab.classList.toggle('btn-primary', active);
      tab.classList.toggle('btn-light', !active);
      if (active) tab.setAttribute('aria-current', 'page');
      else tab.removeAttribute('aria-current');
    });
  });

  var schedulePanel = Array.from(screen.querySelectorAll('.fg-panel')).find(function (panel) {
    return panel.textContent.includes('Lên lịch kiểm tra');
  });
  var scheduleHeading = schedulePanel && schedulePanel.querySelector('h2');
  if (scheduleHeading && schedulePanel) {
    scheduleHeading.textContent = 'Mẫu hộp thoại · Lên lịch kiểm tra';
    var changePanel = document.createElement('section');
    changePanel.className = 'fg-panel';
    changePanel.innerHTML = '<div class="fg-section-head"><div><h2>Đổi lịch / Hủy có lý do</h2></div></div><label class="fg-field"><span>Lý do *</span><input type="text" value="Khu vực tạm dừng thi công, chuyển kiểm tra sang 05/10." /></label><div class="fg-actions"><button class="btn btn-primary" type="button" data-demo="preview" title="Minh họa giao diện — chức năng này chưa được kết nối">Xác nhận đổi lịch</button><button class="btn btn-light" type="button" data-demo="preview" title="Minh họa giao diện — chức năng này chưa được kết nối">Xác nhận hủy</button><button class="btn btn-light" type="button" data-demo="preview" title="Minh họa giao diện — chức năng này chưa được kết nối">Gửi lịch</button></div><p class="fg-muted">Thông báo người kiểm tra; ghi kết quả và ảnh chứng minh, không xóa lịch sử.</p>';
    schedulePanel.after(changePanel);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupInspectionReferenceLayout);
} else {
  setupInspectionReferenceLayout();
}
