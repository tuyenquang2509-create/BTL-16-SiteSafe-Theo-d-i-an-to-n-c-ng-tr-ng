# SiteSafe – Bảng kiểm kê màn hình

|ID|Vai trò|Màn hình|Mục tiêu|Nhiệm vụ|CRUD/trạng thái|Tệp HTML|Người làm|Branch|
|-|-|-|-|-|-|-|-|-|
|SS-01|Nhân sự hiện trường|Khu vực của tôi|Nắm tình hình công việc và cảnh báo|Xem tổng quan, thông báo, lối tắt đến checklist và báo nguy cơ|Read; dữ liệu demo|`worker/worker-dashboard.html`|SV1|`feature/worker-safety-flow`|
|SS-02|Nhân sự hiện trường|Checklist an toàn|Kiểm tra an toàn trước ca|Thực hiện 4 bước, đánh giá 8 mục, lưu nháp, xác nhận và gửi checklist|Draft → submitted; đánh giá đạt/không đạt|`worker/worker-checklist.html`|SV1|`feature/worker-safety-flow`|
|SS-03|Nhân sự hiện trường|Báo cáo nguy cơ|Ghi nhận nguy cơ phát hiện|Nhập thông tin, mô tả, chọn tệp minh chứng, lưu nháp hoặc gửi|Draft → chờ xác minh; dữ liệu demo|`worker/worker-report-create.html`|SV1|`feature/worker-safety-flow`|
|SS-04|Nhân sự hiện trường|Lịch sử báo cáo / Nguy cơ của tôi|Theo dõi tiến độ xử lý báo cáo|Xem danh sách, tìm kiếm, lọc trạng thái, xem phản hồi và tình trạng đóng|Read; chờ duyệt → đã duyệt/từ chối → đã đóng|`worker/worker-report-history.html`|SV1|`feature/worker-safety-flow`|
|SS-05|Cán bộ an toàn|Tổng quan|Theo dõi chỉ số và ưu tiên nguy cơ|Xem KPI, danh sách nguy cơ và truy cập các chức năng nghiệp vụ|Read; cập nhật theo dữ liệu demo|`safety/safety-dashboard.html`|SV2|`feature/safety-operations`|
|SS-06|Cán bộ an toàn|Nguy cơ / sự cố|Xác minh và quản lý nguy cơ|Xem, tìm, lọc nguy cơ; duyệt/từ chối báo cáo; theo dõi trạng thái|Read/Update; chờ duyệt → duyệt/từ chối → xử lý/đóng|`safety/safety-risks.html`|SV2|`feature/safety-operations`|
|SS-07|Cán bộ an toàn|Kiểm tra hiện trường|Theo dõi lịch kiểm tra|Xem lịch, tiến độ và điều hướng tới mẫu checklist|Read; lịch/tiến độ demo|`safety/safety-inspections.html`|SV2|`feature/safety-operations`|
|SS-08|Cán bộ an toàn|Hành động khắc phục|Xác minh kết quả xử lý|Theo dõi hành động, kiểm tra minh chứng, xác nhận đóng nguy cơ|Read/Update; đang khắc phục → chờ xác minh → đã đóng|`safety/safety-corrective-actions.html`|SV2|`feature/safety-operations`|
|SS-09|Cán bộ an toàn|Khu vực công trường|Theo dõi khu vực phụ trách|Xem danh sách và thông tin khu vực, hỗ trợ nhận diện điểm rủi ro|Read; dữ liệu demo|`safety/safety-zones.html`|SV2|`feature/safety-operations`|
|SS-10|Cán bộ an toàn|Báo cáo an toàn|Tổng hợp kết quả an toàn|Xem bảng, thống kê và thông tin báo cáo an toàn|Read; báo cáo demo|`safety/safety-reports.html`|SV2|`feature/safety-operations`|
|SS-11|Cán bộ an toàn|Mẫu checklist|Tra cứu mẫu kiểm tra|Xem và sử dụng danh sách mẫu checklist|Read; mẫu demo|`safety/safety-checklist-templates.html`|SV2|`feature/safety-operations`|
|SS-12|Cán bộ an toàn|Trợ lý AI|Hỗ trợ phân tích nghiệp vụ|Nhập thông tin, xem gợi ý và quyết định sử dụng/bỏ qua|Draft → chấp nhận/từ chối gợi ý; demo|`safety/safety-ai-assistant.html`|SV2|`feature/safety-operations`|
|SS-13|Quản lý công trường|Tổng quan công trường|Giám sát tình hình an toàn|Xem KPI, tiến độ và các thông tin ưu tiên|Read; dữ liệu demo|`manager/manager-dashboard.html`|SV3|`feature/manager-admin`|
|SS-14|Quản lý công trường|Bản đồ rủi ro|Xác định khu vực cần ưu tiên|Xem bản đồ/khu vực và mức độ nguy cơ; lọc, theo dõi trạng thái|Read/filter; dữ liệu demo|`manager/manager-risk-map.html`|SV3|`feature/manager-admin`|
|SS-15|Quản lý công trường|Báo cáo an toàn|Tổng hợp và trình bày kết quả|Lọc kỳ báo cáo, xem số liệu, chi tiết và xuất CSV|Read/export; dữ liệu demo|`manager/manager-reports.html`|SV3|`feature/manager-admin`|
|SS-16|Quản lý công trường|Theo dõi khắc phục|Phân công và kiểm soát hành động|Tạo hành động cho nguy cơ được duyệt, theo dõi, nộp minh chứng xác minh|Create/Read/Update; đang khắc phục → chờ xác minh|`manager/manager-corrective-actions.html`|SV3|`feature/manager-admin`|
|SS-17|Quản trị hệ thống|Tổng quan hệ thống|Theo dõi dữ liệu quản trị|Xem thống kê tài khoản, khu vực và cấu hình demo|Read; dữ liệu demo|`admin/admin-dashboard.html`|SV3|`feature/manager-admin`|
|SS-18|Quản trị hệ thống|Người dùng|Quản lý tài khoản và vai trò|Tạo/sửa tài khoản, lọc, khóa/mở khóa; kiểm tra email trùng|Create/Read/Update; hoạt động ↔ khóa|`admin/admin-users.html`|SV3|`feature/manager-admin`|
|SS-19|Quản trị hệ thống|Khu vực công trường|Quản lý danh mục khu vực|Thêm, sửa và quản lý thông tin khu vực công trường|Create/Read/Update; dữ liệu demo|`admin/admin-zones.html`|SV3|`feature/manager-admin`|
|SS-20|Quản trị hệ thống|Mẫu checklist|Quản lý mẫu checklist|Tạo/sửa và quản lý trạng thái mẫu checklist|Create/Read/Update; kích hoạt/lưu trữ demo|`admin/admin-checklist-templates.html`|SV3|`feature/manager-admin`|
|SS-21|Tất cả vai trò|Hồ sơ cá nhân|Xem thông tin người dùng|Xem hồ sơ và vai trò của tài khoản demo|Read|`shared-profile.html`|SV3|`feature/manager-admin`|
|SS-22|Tất cả vai trò|Trợ giúp|Hiểu cách dùng và giới hạn bản demo|Xem hướng dẫn thao tác, quy trình và lưu ý|Read|`shared-help.html`|SV3|`docs/project-docs`|
|SS-23|Khách / Tất cả|Trang vào hệ thống|Truy cập và chọn luồng sử dụng|Mở trang đầu, truy cập giao diện demo|Read/navigation|`index.html`|SV3|`docs/project-docs`|
|SS-24|Tất cả vai trò|Trang không tìm thấy (404)|Thông báo đường dẫn không hợp lệ|Hiển thị lỗi và hỗ trợ quay về trang phù hợp|Read/navigation|`404.html`|SV3|`docs/project-docs`|



