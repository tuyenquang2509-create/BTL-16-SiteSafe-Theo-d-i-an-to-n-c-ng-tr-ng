# SiteSafe — Prototype frontend đa màn hình

Dự án demo HTML, CSS và JavaScript thuần cho bài tập lớn theo dõi an toàn công trường.

## Chạy trên máy
1. Giải nén `SiteSafe_Full.zip`.
2. Mở thư mục bằng VS Code.
3. Mở `index.html` trên trình duyệt hoặc cài Live Server và bấm **Open with Live Server**.
4. Điều hướng các màn hình bằng menu bên trái.

## Màn hình đã dựng
- Tổng quan (dashboard)
- Bản đồ rủi ro (sơ đồ minh họa)
- Checklist an toàn (checkbox và tiến độ)
- Nguy cơ / sự cố
- Kiểm tra hiện trường
- Hành động khắc phục
- Khu vực công trường
- Công trường
- Báo cáo an toàn (biểu đồ minh họa, xuất CSV)
- Mẫu checklist
- Người dùng
- Trợ lý AI (3 luồng mô phỏng: phân loại nguy cơ, tạo checklist, điểm nóng rủi ro)

## Tính năng
- Điều hướng SPA bằng hash URL.
- Tìm kiếm và lọc trên bảng dữ liệu.
- Thêm / sửa dữ liệu demo bằng modal.
- Cập nhật checkbox checklist.
- Sinh kết quả AI theo quy tắc JavaScript cục bộ.
- Xuất dữ liệu demo ra CSV.
- Responsive cho màn hình nhỏ.

## Giới hạn quan trọng
- Đây là frontend prototype, không có backend, xác thực thật, phân quyền bảo mật hoặc cơ sở dữ liệu.
- Dữ liệu chỉ nằm trong bộ nhớ trang; tải lại trang sẽ đưa dữ liệu về mẫu ban đầu.
- Bản đồ là sơ đồ minh họa, không phải bản đồ địa lý.
- Trợ lý AI không gọi mô hình AI thật; kết quả chỉ là quy tắc demo và không thay thế đánh giá an toàn chuyên môn.
- Figma MCP đang chặn truy cập bổ sung do giới hạn gói Starter, nên không thể kiểm tra từng frame và xác nhận khớp pixel với toàn bộ file. Bộ màn hình này được dựng từ các vai trò/chức năng SiteSafe đã nêu trong dự án, cần đối chiếu lại với từng frame Figma để tinh chỉnh chi tiết.
