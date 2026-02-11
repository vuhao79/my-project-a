---
name: /s
description: Implement code theo spec hoặc mô tả task - có load skills liên quan
---

# Execute — Implement Code

**Đọc spec (nếu có) → Load skills → Viết code → Cập nhật spec.**

---

## Input

```
/s [mô tả task]                        → Chạy độc lập
/s [spec path] [phase]                  → Implement theo spec + phase cụ thể
/s [spec path]                          → Implement phase tiếp theo chưa xong
```

---

## Workflow

### Bước 1 — Đọc spec (nếu có)

Nếu input có spec path (`docs/specs/.../spec.md`):
- Đọc file spec để hiểu context
- Xác định phase cần implement (từ input hoặc tìm phase đầu tiên còn `[ ]`)
- Liệt kê các task cần làm

Nếu không có spec → bỏ qua, dùng mô tả task trực tiếp.

### Bước 2 — Load skills liên quan

Quét `.claude/skills/*/SKILL.md` → load skill phù hợp với task:
- UI components → `frontend-antd-components`
- Thêm skill khác nếu có trong project

### Bước 3 — Implement

Viết code theo:
- Spec (nếu có)
- Skill guidelines đã load
- Best practices của project

### Bước 4 — Cập nhật spec (nếu có)

- Đánh dấu `[x]` cho task đã hoàn thành
- Cập nhật Notes nếu phát hiện vấn đề
- Ghi lại file spec

### Bước 5 — Báo cáo

```
Done:
- Skills đã dùng: [danh sách]
- Tasks hoàn thành: [danh sách]
- Spec updated: [path] (nếu có)
```

---

## Ví dụ

```
/s thêm nút logout vào navbar
→ Load skills → Implement → Báo cáo

/s docs/specs/login-form/spec.md Phase A
→ Đọc spec → Load skills → Implement Phase A → Đánh dấu [x] → Báo cáo

/s docs/specs/login-form/spec.md
→ Đọc spec → Tìm phase chưa xong → Implement → Đánh dấu [x] → Báo cáo
```

---

## Quy tắc

1. **Luôn load skills** trước khi code — không bỏ qua
2. **Tuân theo skill guidelines** — nếu có conflict thì hỏi user
3. **Cập nhật spec** sau khi implement — đánh dấu `[x]` task đã xong
4. **Không sửa spec design** — nếu cần thay đổi thiết kế, dùng `/p` trước
