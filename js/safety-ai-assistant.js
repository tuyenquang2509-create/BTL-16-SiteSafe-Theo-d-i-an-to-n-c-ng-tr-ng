/* Page-specific behavior for the safety risk analysis screen. */
(function () {
  'use strict';

  var sample = {
    description:
      'Mép sàn phía đông tầng 2 chưa lắp lan can. Tổ cốp pha tiếp cận bằng lối chưa giới hạn.',
    zone: 'RS-A / Z-A2',
    people: 'Tổ cốp pha · 6 người'
  };
  var source = document.getElementById('aiSource');
  var description = document.getElementById('aiDescription');
  var zone = document.getElementById('aiZone');
  var people = document.getElementById('aiPeople');
  var output = document.getElementById('aiOutput');

  function showEmptyResult() {
    if (!output) return;
    output.innerHTML =
      '<div class="fg-section-head"><div><h2>2. Kết quả gợi ý</h2></div></div>' +
      '<p>Nhập mô tả quan sát rồi chọn <strong>Phân tích nguy cơ</strong> để nhận gợi ý.</p>';
  }

  if (source && description && zone && people) {
    source.addEventListener('change', function () {
      if (source.value === 'HZ-024') {
        description.value = sample.description;
        zone.value = sample.zone;
        people.value = sample.people;
      } else {
        description.value = '';
        zone.value = '';
        people.value = '';
      }
      showEmptyResult();
      description.focus();
    });
  }

  document.addEventListener(
    'submit',
    function (event) {
      var form = event.target;
      if (!form || form.id !== 'aiForm' || !description) return;

      var original = description.value;
      var context = [];
      if (source && source.value !== 'new') {
        context.push('Mã báo cáo nguồn: ' + source.value);
      }
      if (people && people.value.trim()) {
        context.push('Người có thể bị ảnh hưởng: ' + people.value.trim());
      }
      if (!context.length) return;

      description.value = original + '\n' + context.join('. ');
      var analyzedValue = description.value;
      window.setTimeout(function () {
        if (description.value === analyzedValue) description.value = original;
      }, 0);
    },
    true
  );

  document.addEventListener(
    'click',
    function (event) {
      var button = event.target.closest('[data-action]');
      if (!button) return;

      if (button.dataset.action === 'ai-regenerate') {
        var form = document.getElementById('aiForm');
        if (!form) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        form.requestSubmit();
      } else if (
        button.dataset.action === 'ai-accept' &&
        document.body.dataset.initialPage === 'ai'
      ) {
        var level = document.querySelector('#aiOutput .stat-top .badge');
        if (!level || level.textContent.trim() !== 'Chưa đủ dữ liệu') return;
        event.preventDefault();
        event.stopImmediatePropagation();
        var toast = document.getElementById('toast');
        if (toast) {
          toast.textContent = 'Gợi ý chưa đủ dữ liệu. Hãy bổ sung mô tả hoặc đánh giá thủ công trước khi lưu.';
          toast.classList.add('show');
          window.setTimeout(function () {
            toast.classList.remove('show');
          }, 3000);
        }
      }
    },
    true
  );

  window.addEventListener('storage', function (event) {
    if (event.key === 'sitesafe-v2-data' && typeof loadDB === 'function') {
      db = loadDB();
      if (typeof renderPage === 'function') renderPage();
    }
  });
})();
