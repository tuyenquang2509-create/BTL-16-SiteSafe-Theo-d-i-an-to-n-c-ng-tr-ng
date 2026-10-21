# SiteSafe – Theo dõi an toàn công trường

Nguyên mẫu frontend cho BTL-16 SiteSafe (CSE122 – Phát triển ứng dụng Web cơ bản). Dự án tập trung vào hệ thống nhiều vai trò, nhiều luồng nghiệp vụ, CRUD, vòng đời trạng thái, responsive, dữ liệu cục bộ và trải nghiệm AI có giải thích.

## 1. Ngữ cảnh
Công trường có nhiều khu vực, đội thi công và hoạt động kiểm tra. Thông tin nguy cơ, lịch kiểm tra và biện pháp khắc phục cần được ghi nhận và theo dõi tập trung.

## 2. Phát biểu vấn đề
Nếu nguy cơ được ghi nhận rời rạc, thiếu người phụ trách hoặc không theo dõi trạng thái đến khi đóng, cán bộ an toàn và quản lý khó ưu tiên xử lý; công nhân cũng khó báo cáo và kiểm tra điều kiện làm việc.

## 3. Mục tiêu
- Ghi nhận, phân loại, tìm kiếm và lọc nguy cơ.
- Lập lịch kiểm tra và cập nhật trạng thái thực hiện.
- Tạo hành động khắc phục, gán người phụ trách và hạn hoàn thành.
- Theo dõi khu vực, checklist, báo cáo và người dùng.
- Mô phỏng ba trải nghiệm AI khác nhau: phân loại nguy cơ, sinh checklist, phân tích điểm nóng; có giải thích, độ tin cậy mô phỏng, sửa/từ chối/thử lại và lưu vào luồng nghiệp vụ.

## 4. Các vai trò và luồng người dùng
1. **Công nhân:** xem khu vực của mình → làm checklist đầu ca → gửi báo cáo nguy cơ → theo dõi lịch sử báo cáo.
2. **Cán bộ an toàn:** xem tổng quan → ghi nhận/phân loại nguy cơ → lập lịch kiểm tra → tạo hành động khắc phục → xác nhận trạng thái → xuất báo cáo.
3. **Quản lý công trường:** xem tổng quan → theo dõi điểm nóng theo khu vực → kiểm tra hành động và hạn → xem/xuất báo cáo.
4. **Quản trị hệ thống:** xem tổng quan → quản lý người dùng, khu vực và mẫu checklist.

## 5. Bảng kiểm kê màn hình
| Vai trò | Màn hình | Tệp/điểm vào | Nghiệp vụ | CRUD / trạng thái | AI |
|---|---|---|---|---|---|
| Công nhân | Khu vực của tôi | `worker-home` trong `index.html` | Xem nhắc nhở và số liệu | R | – |
| Công nhân | Checklist của tôi | `worker-checklist` | Xác nhận điều kiện đầu ca | C / chưa đạt, hoàn thành | – |
| Công nhân | Báo cáo nguy cơ | `worker-report` | Gửi mô tả nguy cơ | C / validation | Phân loại là luồng hỗ trợ riêng |
| Công nhân | Lịch sử báo cáo | `worker-history` | Theo dõi báo cáo | R / rỗng | – |
| Cán bộ an toàn | Tổng quan an toàn | `dashboard` | Theo dõi số liệu, nguy cơ ưu tiên | R / dữ liệu demo | – |
| Cán bộ an toàn | Nguy cơ / sự cố | `risks` | Tạo, xem, sửa, lọc, xuất CSV | C/R/U; mới → xử lý → khắc phục | Phân loại nguy cơ |
| Cán bộ an toàn | Kiểm tra hiện trường | `inspections` | Lập lịch, phân công, cập nhật | C/R/U; lên lịch → đang làm → hoàn thành | – |
| Cán bộ an toàn | Hành động khắc phục | `actions` | Gán người, hạn, ưu tiên | C/R/U; chưa làm → đang làm → hoàn thành | – |
| Cán bộ an toàn / Quản lý | Khu vực / bản đồ rủi ro | `zones` | Theo dõi khu vực, mức độ rủi ro | R; admin có C/U | Phân tích điểm nóng |
| Cán bộ an toàn / Quản lý | Báo cáo an toàn | `reports` | Tổng hợp và xuất CSV | R / trạng thái dữ liệu | Tóm tắt/điểm nóng |
| Cán bộ an toàn / Quản trị | Mẫu checklist | `checklists` | Tạo, sửa, kích hoạt, lưu trữ | C/R/U; nháp → sử dụng → lưu trữ | Sinh checklist |
| Quản trị | Người dùng | `users` | Tạo, sửa, khóa/mở khóa | C/R/U; hoạt động ↔ khóa | – |
| Cán bộ an toàn | Trợ lý AI | `ai` | Ba luồng AI có giải thích | Nhập → xử lý → đề xuất → duyệt/sửa/bỏ qua | Phân loại / sinh nội dung / phân tích điểm nóng |
| Tất cả | Trợ giúp | `help` | Hướng dẫn, giới hạn và trạng thái | R | – |
| Tất cả | Hồ sơ cá nhân | `profile` | Thông tin người dùng demo | R | – |

> Các mục trong bảng là màn hình SPA được điều hướng bằng JavaScript. Nếu giảng viên yêu cầu mỗi màn hình là một tệp HTML riêng, hãy tách từng view thành tệp theo quy tắc `role-function-action.html`.

## 6. Trạng thái được mô phỏng
- Dữ liệu có kết quả và danh sách rỗng khi bộ lọc không khớp.
- Validation biểu mẫu bắt buộc, định dạng email và độ dài tối thiểu.
- Trạng thái nghiệp vụ: mới ghi nhận, đang xử lý, đã khắc phục; đã lên lịch, đang thực hiện, hoàn thành; chưa thực hiện, đang thực hiện, hoàn thành; bản nháp, đang sử dụng, lưu trữ; người dùng hoạt động/đã khóa.
- Trạng thái AI đang xử lý, kết quả, mức tin cậy mô phỏng thấp, giải thích, chấp nhận/lưu, sửa, tạo lại, từ chối, dùng thủ công và báo cáo kết quả.

## 7. Tính năng AI và giới hạn
1. **Phân loại nguy cơ:** dùng từ khóa trong mô tả để tạo mức độ, nhóm nguy cơ, lý do và biện pháp ban đầu.
2. **Sinh checklist:** tạo danh sách kiểm tra dựa trên công việc và mức độ rủi ro.
3. **Phân tích điểm nóng:** tổng hợp nguy cơ chưa khắc phục theo khu vực.

Đây là mô phỏng frontend theo quy tắc cục bộ, **không phải AI/LLM thật**. Kết quả cần chuyên gia kiểm tra; không dùng làm quyết định an toàn thực tế. Mục đích là trình diễn luồng sản phẩm AI theo yêu cầu học phần.

## 8. Công nghệ
- HTML semantic, CSS responsive, JavaScript thuần.
- `localStorage` để lưu dữ liệu mock trong trình duyệt.
- Xuất CSV và sao lưu JSON phía client.
- Không có backend, xác thực thật hoặc cơ sở dữ liệu dùng chung.

## 9. Chạy dự án
1. Giải nén ZIP.
2. Mở thư mục bằng VS Code.
3. Mở `index.html` trực tiếp hoặc chạy bằng extension Live Server.
4. Chuyển vai trò tại thanh bên để kiểm tra các luồng khác nhau.

## 10. Thành viên nhóm và phân công
Điền tên thành viên thật trước khi nộp. Mỗi thành viên phải có lát cắt dọc hoàn chỉnh: phân tích → thiết kế → HTML/CSS/JS → dữ liệu → responsive → nhánh Git → PR → video OBS.

| Thành viên | Lát cắt gợi ý | Nhánh |
|---|---|---|
| Hoàng Minh Tiến | Công nhân: checklist và báo cáo nguy cơ | `feature/worker-safety-flow` |
| Nguyễn Quang Tuyên | Cán bộ an toàn: nguy cơ, kiểm tra, khắc phục | `feature/safety-operations` |
| Ngô Thanh Tùng | Quản lý/quản trị: khu vực, báo cáo, người dùng, tích hợp | `feature/manager-admin` |

## 11. Quy trình Git đề xuất
- `main`: bản ổn định; `dev`: tích hợp; `feature/...`, `fix/...`, `docs/...`: nhánh công việc.
- Không commit trực tiếp toàn bộ trên `main`.
- Ví dụ: `feat: add risk classification workflow`, `fix: validate empty risk description`, `style: improve mobile sidebar`, `docs: update screen inventory`.
- Mỗi PR cần mô tả thay đổi, ảnh/video kiểm thử, người đánh giá và kết quả kiểm thử.

## 12. Trello / GitHub Projects
Tạo 5 cột: **TỒN ĐỌNG → CẦN LÀM → ĐANG LÀM → CHỜ DUYỆT → HOÀN THÀNH**. Mỗi thẻ ghi mã TASK, người làm, hạn, tệp, nhánh, commit/PR và đường dẫn video OBS.

## 13. Minh chứng OBS
Quay riêng các luồng màn hình đã được duyệt. Trong video cần có người thực hiện, giải thích HTML/CSS/JS, thao tác thành công và ít nhất một trường hợp validation/trạng thái rỗng. Gắn liên kết video với commit/PR tương ứng.

## 14. Khai báo sử dụng AI
- **Công cụ:** ChatGPT.
- **Câu lệnh:** Đọc tài liệu yêu cầu CSE122 và xây dựng nguyên mẫu frontend SiteSafe nhiều vai trò.
- **AI sinh ra:** cấu trúc HTML/CSS/JavaScript, dữ liệu mock, luồng CRUD và trải nghiệm AI mô phỏng.
- **Sinh viên chỉnh sửa:** cần rà soát, kiểm thử, điều chỉnh theo Figma được duyệt và phân công thực tế của nhóm.
- **Cách kiểm chứng:** kiểm tra console, biểu mẫu, lưu LocalStorage, responsive, CSV, các trạng thái nghiệp vụ và luồng AI.
- **Điều học được:** cần hiểu mã, kiểm chứng kết quả, xử lý lỗi và tự thực hiện thay đổi khi bảo vệ.

## 15. Các việc còn cần hoàn tất trước khi nộp
- Thay mockup bằng đúng liên kết Figma đã được giảng viên duyệt; xuất ảnh mockup desktop/mobile vào `design/mockups/`.
- Điền tên thành viên, phân công, hạn và link repository/PR/Trello/OBS thật.
- Kiểm thử trực tiếp trên Chrome/DevTools và ghi nhận các lỗi còn lại.
- Nếu yêu cầu giảng viên là HTML riêng cho mọi màn hình, tách SPA hiện tại thành các tệp `role-function-action.html`.

## Đối chiếu giao diện Figma

Màn hình **Tổng quan an toàn · Desktop** được đối chiếu với frame `6:31863` trong file Figma SiteSafe. Các thành phần đã tinh chỉnh gồm:

- Sidebar xanh đậm `#112C3D`, màu nhấn teal `#087F8C`, nền xanh nhạt `#EAF3F8`.
- Thanh công cụ, tiêu đề trang, nhãn dữ liệu minh họa và bộ lọc ba cột.
- Bốn thẻ chỉ số theo bố cục 2 × 2, cảnh báo hành động quá hạn, biểu đồ xu hướng và danh sách việc cần xem xét.
- Tìm kiếm và bộ lọc trên bảng nguy cơ ở dashboard; liên kết tới màn hình nghiệp vụ tương ứng.

Figma: https://www.figma.com/design/FU0CPChHb0LapRRTIAsuIS/BTL-16-%E2%80%93-SiteSafe-%E2%80%93-Theo-d%C3%B5i-an-to%C3%A0n-c%C3%B4ng-tr%C6%B0%E1%BB%9Dng?node-id=6-31863

**Lưu ý:** các số liệu trên dashboard là dữ liệu minh họa theo frame thiết kế, không phải số liệu công trường thật. AI, xác thực và backend vẫn đang được mô phỏng ở frontend.


## Cập nhật giao diện theo Figma (20/10/2026)

- Bảng màu được đồng bộ theo tông xanh teal, xanh navy và nền xanh xám rất nhạt; sidebar tối, vùng nội dung sáng.
- Font Inter, cỡ chữ và khoảng cách biểu mẫu được tinh chỉnh theo tham chiếu Figma.
- Giao diện đăng nhập và đăng ký được bố cục theo ảnh tham chiếu; form đăng ký kiểm tra các trường bắt buộc, độ dài mật khẩu và xác nhận mật khẩu.
- Đăng ký chỉ mô phỏng việc gửi hồ sơ chờ quản trị viên duyệt; không tạo tài khoản thật hoặc lưu thông tin đăng ký. Đăng nhập demo mở vai trò Cán bộ an toàn; có thể chuyển vai trò trong thanh bên.
- Trang hồ sơ có thể cập nhật thông tin liên hệ và tùy chọn thông báo trong LocalStorage; quyền và công trường chỉ đọc. Đổi mật khẩu chỉ hiển thị giới hạn của bản demo, không thay đổi mật khẩu thật.
- `404.html` cung cấp lối về trang chủ, quay lại, và tìm các trang phổ biến trong nguyên mẫu.
- Liên kết Figma: https://www.figma.com/design/FU0CPChHb0LapRRTIAsuIS/BTL-16-%E2%80%93-SiteSafe-%E2%80%93-Theo-d%C3%B5i-an-to%C3%A0n-c%C3%B4ng-tr%C6%B0%E1%BB%9Dng?node-id=6-31177&t=SG9z7sGKYyI5KBpX-
- Đăng nhập và dữ liệu hiện là demo front-end; chưa có xác thực máy chủ.
