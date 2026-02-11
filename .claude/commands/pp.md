---
name: /pp
description: Rút gọn spec đã implement xong thành bản foundation gọn nhẹ
---

# Condense — Rút gọn Spec

**Sau khi `/s` implement xong → `/pp` kiểm tra code thật → rút gọn spec.**

---

## Input

```
/pp [spec path]       → Rút gọn spec đã implement
```

---

## Workflow

### Bước 1 — Đọc spec + tóm tắt trạng thái

Đọc file spec → đếm checkboxes:

```
Spec: docs/specs/login-form/spec.md
Tasks: 6/8 hoàn thành [x], 2 chưa xong [ ]
```

Nếu còn task `[ ]` chưa xong → **hỏi user**: "Còn tasks chưa xong. Tiếp tục rút gọn hay implement trước?"

### Bước 2 — Kiểm tra code thật

**KHÔNG tin checkbox.** Kiểm tra thực tế:
- File/component có tồn tại không?
- Code có chạy đúng logic trong spec không?
- Có gì khác biệt giữa spec và code thật?

Kết quả:
- **Khác nhỏ** (đổi tên, thêm feature nhỏ) → code thắng, tự điều chỉnh
- **Khác lớn** (thiếu feature, logic khác hẳn) → DỪNG, hỏi user

### Bước 3 — Rút gọn thành Foundation

Chuyển spec đầy đủ → bản ngắn gọn:

```markdown
# [Tên tính năng]

> **Status:** Done | **Created:** YYYY-MM-DD | **Condensed:** YYYY-MM-DD

## 1. Mô tả
[2-3 câu: làm gì, giải quyết vấn đề gì]

## 2. User Flow
[Giữ nguyên — đây là tài liệu quan trọng]

## 3. Technical Design
[Rút gọn — chỉ giữ kiến trúc chính, bỏ chi tiết thừa]

## 4. Code Reference
| Component | Path | Vai trò |
|---|---|---|
| ... | ... | ... |

## 5. Notes
[Giữ edge cases, known issues quan trọng]

<!-- Foundation: YYYY-MM-DD -->
```

**Những gì bị XÓA khi rút gọn:**
- `Implementation Phases` (đã xong, không cần giữ)
- Chi tiết task checkboxes
- Thông tin tạm thời trong Notes

**Những gì được GIỮ:**
- Mô tả + User Flow (tài liệu dùng lâu dài)
- Technical Design (rút gọn)
- Code Reference (cập nhật theo code thật)
- Notes quan trọng

### Bước 4 — Confirm với user

Hiển thị bản foundation → hỏi user OK không trước khi ghi đè.

### Bước 5 — Ghi file + Báo cáo

Ghi foundation vào cùng file spec → báo cáo:

```
Condensed: docs/specs/login-form/spec.md
Before: ~150 dòng | After: ~50 dòng
Status: Done
```

---

## Ví dụ

```
/pp docs/specs/login-form/spec.md
→ Đọc spec (8/8 tasks xong)
→ Kiểm tra code: components tồn tại, logic đúng
→ Rút gọn: bỏ phases, giữ mô tả + design + code ref
→ User confirm → ghi file
→ "Condensed: 150 dòng → 50 dòng"
```

---

## Quy tắc

1. **Kiểm tra code thật** — không tin checkbox
2. **Code thắng** khi khác nhỏ, **hỏi user** khi khác lớn
3. **Confirm trước khi ghi** — không tự ý ghi đè
4. **Giữ User Flow** — đây là tài liệu lâu dài
5. **Chỉ chạy khi `/s` đã xong** — không rút gọn spec chưa implement
