# SiteSafe – cấu trúc 2 CSS + 2 JS mỗi trang

Mỗi HTML nạp **css/style.css** (CSS dùng chung), **css/<tên-trang>.css** (CSS trang), **js/script.js** (JavaScript dùng chung), và **js/<tên-trang>.js** (JavaScript trang).

Các trang thuộc các thư mục `admin/`, `worker/`, `manager/`, `safety/`; trang đăng nhập và trang dùng chung vẫn ở thư mục gốc. Đường dẫn tương đối đã được cập nhật.

## Lưu ý về cách tổ chức hiện tại

Để hạn chế làm hỏng những tính năng cũ, `style.css` vẫn bao gồm các quy tắc CSS của các mô-đun cũ theo đúng thứ tự ban đầu. File CSS riêng chứa quy tắc liên quan tới trang (một phần trùng với CSS chung, không đổi kết quả hiển thị). `script.js` vẫn chứa các hàm dựng giao diện và xử lý liên trang vốn trước đây nằm trong nhiều file JS; file JS riêng xử lý việc đồng bộ dữ liệu giữa các tab (riêng `index.js` xử lý đăng nhập và `404.js` xử lý trang 404). Vì thế, đây là bản **giảm số lượng liên kết và bảo toàn tương thích**, chưa phải bản tách triệt để toàn bộ logic nghiệp vụ theo từng trang.

## Kiểm tra

Đã kiểm tra cú pháp JS và đường dẫn tài nguyên cục bộ. Chưa kiểm thử toàn bộ hành vi bằng trình duyệt. Trước khi merge vào main, cần thử đăng nhập, điều hướng vai trò, CRUD, tìm kiếm, lọc và modal.


## Cập nhật giao diện theo PDF Figma
- Đăng nhập/đăng ký: bố cục hai cột navy và xanh nhạt theo trang 2–3.
- Các trang nghiệp vụ: cập nhật màu sắc, sidebar, topbar, thẻ và nút theo hệ thống thiết kế.
- Không thay đổi các file JavaScript hay luồng đăng nhập demo.
- Mỗi HTML tiếp tục nạp 2 CSS và 2 JS.
- Đây là bước đồng bộ giao diện cơ sở; chưa phải bản tái dựng chính xác từng màn hình của toàn bộ 20 trang PDF.
