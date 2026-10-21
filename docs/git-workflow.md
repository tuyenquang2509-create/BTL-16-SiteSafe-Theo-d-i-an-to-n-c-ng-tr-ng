# Quy trình Git và kiểm thử

## Nhánh
- `main`: bản ổn định để demo.
- `dev`: tích hợp tính năng.
- `feature/worker-safety-flow`: checklist và báo cáo công nhân.
- `feature/safety-operations`: nguy cơ, kiểm tra, hành động và AI.
- `feature/manager-admin`: khu vực, báo cáo, người dùng và tích hợp.
- `docs/project-docs`: README, screen inventory, khai báo AI.

## Chuỗi công việc
TASK trên Trello/GitHub Projects → tạo nhánh → code → commit có ý nghĩa → push → PR → người khác đánh giá → merge vào `dev` → kiểm thử tích hợp → merge `main`.

## Checklist kiểm thử
- [ ] Chuyển đổi đủ bốn vai trò.
- [ ] Tạo/sửa nguy cơ và kiểm tra validation.
- [ ] Lọc danh sách và xử lý kết quả rỗng.
- [ ] Tạo lịch kiểm tra, cập nhật trạng thái.
- [ ] Tạo hành động khắc phục, cập nhật trạng thái.
- [ ] Tạo checklist, kích hoạt/lưu trữ.
- [ ] Tạo người dùng, khóa/mở khóa.
- [ ] Thử đủ ba luồng AI, cả đầu vào không hợp lệ và kết quả độ tin cậy thấp.
- [ ] Chấp nhận, sửa, tạo lại và từ chối kết quả AI.
- [ ] Kiểm tra giao diện desktop, tablet, mobile và Console.
- [ ] Xuất CSV / sao lưu JSON.
- [ ] Quay OBS và gắn video với commit/PR.
