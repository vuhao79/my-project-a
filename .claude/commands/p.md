---
name: /p
description: Tạo hoặc cập nhật spec cho tính năng - chỉ lên kế hoạch, không viết code
---

# Planning — Tạo Spec

**CHỈ viết spec, KHÔNG implement code.**

---

## Input

```
/p [tên tính năng] [mô tả]       → CREATE (tạo spec mới)
/p [spec path]                    → RESUME (xem + cập nhật spec đã có)
/p [spec path] [mô tả thêm]      → RESUME + bổ sung yêu cầu mới
```

---

## Workflow

### MODE: CREATE (file chưa tồn tại)

**Bước 1 — Hỏi để hiểu rõ:**
- Tính năng này giải quyết vấn đề gì?
- Có bao nhiêu bước/màn hình chính?
- Có liên quan đến API, database, hay chỉ UI?
- Hỏi thêm nếu chưa đủ rõ. **Không đoán.**

**Bước 2 — Tạo file spec** tại `docs/specs/{tên-tính-năng}/spec.md`:

```markdown
# [Tên tính năng]

> **Status:** Planning | **Created:** YYYY-MM-DD

## 1. Mô tả
[Tính năng làm gì, giải quyết vấn đề gì]

## 2. User Flow
1. User làm gì...
2. Hệ thống phản hồi gì...
3. Kết quả cuối cùng...

## 3. Technical Design
- Components cần tạo/sửa
- State management
- API calls (nếu có)

## 4. Implementation Phases

### Phase A: [Tên]
- [ ] A.1 - [Task cụ thể]
- [ ] A.2 - [Task cụ thể]

### Phase B: [Tên]
- [ ] B.1 - [Task cụ thể]
- [ ] B.2 - [Task cụ thể]

## 5. Notes
[Ghi chú, edge cases, điều cần lưu ý]
```

**Bước 3 — DỪNG.** Báo: "Spec đã tạo tại `docs/specs/.../spec.md`"

---

### MODE: RESUME (file đã tồn tại)

**Bước 1 — Đọc spec** → tóm tắt trạng thái hiện tại:
- Bao nhiêu task xong `[x]` / chưa xong `[ ]`
- Phase nào đang thực hiện

**Bước 2 — Xử lý yêu cầu:**
- Đánh dấu task hoàn thành → `[x]`
- Thêm yêu cầu mới → thêm Phase mới
- Sửa thiết kế → cập nhật Technical Design
- Ghi bug → thêm vào Notes

**Bước 3 — Ghi lại file → DỪNG.**

---

## Quy tắc

1. **Chỉ viết spec** — không tạo code, không tạo component
2. **Hỏi cho rõ** — không bao giờ đoán yêu cầu
3. **Dừng sau khi lưu** — spec xong là xong
4. **Implement bằng `/s`** — khi muốn code, dùng lệnh `/s` trong prompt mới
