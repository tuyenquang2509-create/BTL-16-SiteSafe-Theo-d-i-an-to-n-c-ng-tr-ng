# BTL-16 – SiteSafe – Theo dõi an toàn công trường

## CSE122 – Phát triển ứng dụng Web cơ bản

**Nhóm:** Tùng – Tiến – Tuyên  
**Sản phẩm:** SiteSafe – Theo dõi an toàn công trường  
**Loại:** Frontend prototype, nhiều vai trò, CRUD, responsive, JavaScript và AI mock.

## 1. Phân công

| Thành viên | Vai trò chính | Nhánh |
|---|---|---|
| Tùng | Nhân sự hiện trường | `feature/tung-worker` |
| Tiến | Cán bộ an toàn | `feature/tien-safety` |
| Tuyên | Quản lý công trường + Quản trị viên | `feature/tuyen-manager-admin` |

Mỗi thành viên phải hoàn thành một lát cắt dọc: Figma → HTML → CSS → JavaScript → dữ liệu → responsive → Git → PR → OBS.

## 2. Branch strategy

```text
main
└── dev
    ├── feature/tung-worker
    ├── feature/tien-safety
    ├── feature/tuyen-manager-admin
    ├── fix/<bug-name>
    └── docs/<document-name>
```

Không code trực tiếp trên `main`.

## 3. Quy trình

1. Nhận task.
2. Checkout `dev`.
3. Tạo branch riêng.
4. Code + test.
5. Commit theo Conventional Commits.
6. Push branch.
7. Tạo Pull Request vào `dev`.
8. Thành viên khác review.
9. Sửa theo review.
10. Merge vào `dev`.
11. Test tích hợp.
12. Chỉ khi ổn định mới merge `dev` → `main`.

## 4. Quy ước commit

```text
feat: add worker safety checklist
feat: render hazard data from mock json
fix: validate empty hazard form
style: improve mobile navigation
refactor: split reusable ui modules
docs: update screen list
```

Không dùng commit kiểu `update`, `done`, `final`, `fix code`.

## 5. Cấu trúc

```text
project-root/
├── README.md
├── docs/
├── design/
├── pages/
│   ├── worker/
│   ├── safety/
│   ├── manager/
│   └── admin/
├── assets/
│   └── data/
├── css/
└── js/
    └── modules/
```

## 6. Chạy dự án

Khuyến nghị dùng VS Code + Live Server.

Mở:

```text
pages/login.html
```

hoặc:

```text
pages/worker/worker-safety-checklist.html
```

## 7. AI features

- AI-1: Hazard Classifier
- AI-2: Checklist Generator
- AI-3: Risk Hotspot Insight

Luồng AI:

```text
Nhập
↓
Validation
↓
Đang xử lý
↓
Kết quả
↓
Giải thích
↓
Chấp nhận / Sửa / Từ chối / Tạo lại
↓
Lưu
```

## 8. Minh chứng

Mỗi giao diện thực tế được duyệt cần gắn với:
- Figma/Canva
- HTML/CSS/JS
- commit
- Pull Request
- video OBS
- task tương ứng

## Thành viên

- Tùng – Worker
- Tiến – Safety Officer
- Tuyên – Site Manager + Admin
