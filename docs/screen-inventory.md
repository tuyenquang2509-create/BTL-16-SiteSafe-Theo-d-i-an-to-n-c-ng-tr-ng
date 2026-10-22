# SiteSafe – Screen inventory

| ID | Vai trò | Màn hình | Mục tiêu | Nhiệm vụ | CRUD/trạng thái | AI | Người làm | Branch | OBS |
|---|---|---|---|---|---|---|---|---|---|
| SS-01 | Công nhân | Khu vực của tôi | Nắm việc cần làm | Xem nhắc nhở và khu vực | Read | – | SV1 | feature/worker-safety-flow | Chưa quay |
| SS-02 | Nhân sự hiện trường | Checklist an toàn | Kiểm tra trước ca theo 4 bước | Chọn ngữ cảnh, đánh giá 8 mục, ghi chú và đính kèm minh chứng cho mục không đạt, lưu nháp, xác nhận và gửi duyệt | Draft → submitted for review; mục nguy cơ nghiêm trọng liên kết sang danh sách nguy cơ | – | SV1 | feature/worker-safety-flow | Chưa quay |
| SS-03 | Nhân sự hiện trường | Báo nguy cơ | Ghi nhận nguy cơ quan sát được | Chọn khu vực, mô tả, đính kèm ảnh/tài liệu, xác nhận, gửi hoặc lưu nháp | Draft → chờ xác minh; đính kèm tối đa 5 tệp | Có thể dùng phân loại | SV1 | feature/worker-safety-flow | Chưa quay |
| SS-04 | Nhân sự hiện trường | Nguy cơ của tôi | Theo dõi phản hồi và bổ sung minh chứng | Tìm kiếm, lọc trạng thái, xem dòng thời gian, bổ sung chứng cứ, yêu cầu lưu trữ | Read / detail / evidence / archive with history | – | SV1 | feature/worker-safety-flow | Chưa quay |
| SS-05 | Cán bộ an toàn | Tổng quan | Ưu tiên xử lý | Xem KPI và nguy cơ mới | Read / data demo | – | SV2 | feature/safety-operations | Chưa quay |
| SS-06 | Cán bộ an toàn | Nguy cơ / sự cố | Quản lý nguy cơ | Tạo, xem, sửa, tìm, lọc, xuất | C/R/U; mới → xử lý → khắc phục | Phân loại nguy cơ | SV2 | feature/safety-operations | Chưa quay |
| SS-07 | Cán bộ an toàn | Kiểm tra hiện trường | Lập lịch kiểm tra | Tạo, sửa, cập nhật tiến độ | C/R/U; lên lịch → thực hiện → hoàn thành | – | SV2 | feature/safety-operations | Chưa quay |
| SS-08 | Cán bộ an toàn | Hành động khắc phục | Theo dõi biện pháp | Gán người và hạn | C/R/U; chưa làm → đang làm → hoàn thành | – | SV2 | feature/safety-operations | Chưa quay |
| SS-09 | Quản lý | Khu vực / bản đồ rủi ro | Ưu tiên khu vực | Xem mức rủi ro và người làm | Read | Phân tích điểm nóng | SV3 | feature/manager-admin | Chưa quay |
| SS-10 | Quản lý | Báo cáo an toàn | Tổng hợp tình hình | Xem KPI và xuất CSV | Read/export | Tóm tắt/điểm nóng mô phỏng | SV3 | feature/manager-admin | Chưa quay |
| SS-11 | Cán bộ an toàn / Admin | Mẫu checklist | Quản lý mẫu | Tạo, sửa, kích hoạt/lưu trữ | C/R/U | Sinh checklist | SV2/SV3 | feature/manager-admin | Chưa quay |
| SS-12 | Admin | Người dùng | Quản lý tài khoản demo | Tạo, sửa, khóa/mở khóa | C/R/U | – | SV3 | feature/manager-admin | Chưa quay |
| SS-13 | Cán bộ an toàn | Trợ lý AI | Hỗ trợ nghiệp vụ | Nhập, kiểm tra, xem giải thích, duyệt/sửa/bỏ qua | Draft → accepted/rejected | 3 luồng riêng | SV2 | feature/safety-operations | Chưa quay |
| SS-14 | Tất cả | Trợ giúp | Hiểu giới hạn hệ thống | Đọc hướng dẫn | Read | – | SV3 | docs/project-docs | Chưa quay |
| SS-15 | Tất cả | Hồ sơ cá nhân | Xem hồ sơ demo | Xem thông tin vai trò | Read | – | SV3 | feature/manager-admin | Chưa quay |
