# SiteSafe – HTML ưu tiên, JS xử lý tương tác

- Mỗi trang HTML chứa sẵn giao diện ban đầu: tiêu đề, bảng, nút và khối nội dung.
- `script.js` không dựng lại nội dung HTML khi trang được tải lần đầu; các thao tác thêm/sửa/xóa và lọc vẫn có thể dựng lại phần dữ liệu động.
- Menu điều hướng và chuyển vai trò sử dụng file HTML riêng khi có; các trang chưa có file tương ứng (ví dụ quản trị công trường) vẫn dùng cơ chế dự phòng trong JS.
- Đã sửa lỗi mở thông báo (`$` thành `$$`).
- Dữ liệu mô phỏng lưu trong localStorage của trình duyệt, không phải hệ thống backend.
- Đây là bản cải tiến bảo toàn chức năng, **không phải** bản đã loại bỏ toàn bộ HTML động trong JS. Hãy kiểm thử trên trình duyệt trước khi gộp vào main.

Chạy: `python -m http.server 8000` trong thư mục giải nén rồi mở `http://localhost:8000/index.html`.


## Cấu trúc thư mục

- `admin/`, `worker/`, `manager/`, `safety/`: các trang HTML theo vai trò, giữ nguyên tên file.
- `js/`: tất cả JavaScript, gồm `script.js`, `index.js` và các module.
- `css/`: tất cả CSS.
- Thư mục gốc: `index.html`, `404.html`, `shared-help.html`, `shared-profile.html`, `README.md`.

Đã cập nhật đường dẫn CSS/JS của HTML, đường dẫn điều hướng trong `js/script.js` và gợi ý ở trang 404. Đường dẫn điều hướng được tính từ thư mục gốc của ứng dụng, không phụ thuộc vào trang hiện tại.

Chạy bằng máy chủ tĩnh ở thư mục này (ví dụ `python -m http.server 8000`), rồi mở `http://localhost:8000/index.html`. Hãy thử lại đăng nhập, menu, đổi vai trò, biểu mẫu và CRUD trước khi đưa lên `main`.
