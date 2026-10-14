# SiteSafe — Theo dõi an toàn công trường

## 1. Tên đề tài

**SiteSafe — Hệ thống theo dõi an toàn công trường**

- Học phần: CSE122 — Phát triển ứng dụng Web cơ bản.
- Sinh viên thực hiện: Nguyễn Quang Tuyên.
- Trang thực hiện: Lịch kiểm tra (Safety Inspection Management).
- Vai trò sử dụng: Cán bộ an toàn (Safety Officer).

## 2. Tên trang đã thực hiện

**Lịch kiểm tra — Safety Inspection Management**

Tên file dự kiến: `safety-inspection-management.html`

Đây là trang thuộc hệ thống SiteSafe, được thiết kế để hỗ trợ cán bộ an toàn quản lý kế hoạch kiểm tra và theo dõi kết quả kiểm tra tại công trường xây dựng.

## 3. Mục đích của trang

Trang Lịch kiểm tra giúp cán bộ an toàn lập lịch kiểm tra, theo dõi trạng thái các cuộc kiểm tra và quản lý kết quả kiểm tra hiện trường.

Giao diện cung cấp danh sách lịch kiểm tra, thông tin người phụ trách, thời gian thực hiện, trạng thái kiểm tra và các thao tác quản lý lịch. Trang cũng hỗ trợ theo dõi những hạng mục checklist chưa đạt để phục vụ công tác xử lý và khắc phục nguy cơ mất an toàn.

## 4. Các chức năng chính

- Hiển thị danh sách các cuộc kiểm tra theo mã kiểm tra, khu vực, người kiểm tra, thời gian và trạng thái.
- Tìm kiếm lịch kiểm tra theo mã, nội dung hoặc người phụ trách.
- Lọc lịch theo công trường và khoảng thời gian.
- Chuyển đổi giữa chế độ xem danh sách và lịch tuần.
- Xem kết quả kiểm tra, trạng thái checklist và các hạng mục chưa đạt.
- Lập lịch kiểm tra mới thông qua biểu mẫu.
- Đổi lịch hoặc hủy lịch kiểm tra và nhập lý do.
- Cập nhật, hiển thị trạng thái xử lý lịch kiểm tra.

*Các chức năng trên là phạm vi dự kiến; chỉ xác nhận hoàn thành sau khi đã triển khai và kiểm thử thực tế.*

## 5. Công nghệ sử dụng

- **HTML5:** Xây dựng cấu trúc và nội dung trang web.
- **CSS3:** Thiết kế giao diện, bố cục bằng Flexbox/Grid và responsive.
- **JavaScript thuần:** Xử lý tìm kiếm, lọc dữ liệu, chuyển tab, biểu mẫu và các thao tác tương tác.
- **Figma:** Thiết kế giao diện và đối chiếu với sản phẩm web.
- **Git và GitHub:** Quản lý mã nguồn dự án.

## 6. Link Figma

Thiết kế Figma của dự án SiteSafe:

https://www.figma.com/design/FU0CPChHb0LapRRTIAsuIS/BTL-16-%E2%80%93-SiteSafe-%E2%80%93-Theo-d%C3%B5i-an-to%C3%A0n-c%C3%B4ng-tr%C6%B0%E1%BB%9Dng

## 7. Link video trình bày https://youtu.be/tl9hz6HfiqM?si=5Ceq4yX6iTDvSe0c

Video trình bày quá trình thiết kế, xây dựng giao diện, giải thích mã nguồn và demo chức năng của trang Lịch kiểm tra.

**Link video:** Bổ sung đường dẫn video sau khi hoàn thành quay và tải lên kênh theo yêu cầu học phần.

Tên video đề xuất:

`CSE122-GK-SVxx-NguyenQuangTuyen-SafetyInspectionManagement`

Thay `SVxx` bằng mã sinh viên thực tế của em.

## 8. Link GitHub

**Repository GitHub:**  
https://github.com/tuyenquang2509-create/cse122-sitesafe-team01

Thư mục mã nguồn cá nhân cần có các thành phần phù hợp với dự án, ví dụ:

- `index.html` hoặc file HTML của trang.
- `css/style.css`
- `js/main.js`
- `assets/`
- `README.md`

## Giới hạn của sản phẩm

Đây là trang frontend thuộc prototype SiteSafe. Dữ liệu mẫu được sử dụng để minh họa quy trình quản lý lịch kiểm tra. Trang không được xem là hệ thống quản lý an toàn hoàn chỉnh nếu chưa có backend, cơ sở dữ liệu và cơ chế xác thực tương ứng.

Các chức năng chỉ được mô tả là đã hoàn thành khi đã triển khai, chạy thử và kiểm tra hoạt động thực tế.
