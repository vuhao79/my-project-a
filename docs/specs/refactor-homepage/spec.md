# Refactor Homepage — HTML/CSS sang ANTD Components

> **Status:** Planning | **Created:** 2026-02-11
> **Module:** refactor-homepage

## 1. Mô tả

Chuyển toàn bộ trang chủ Todo App từ HTML/CSS thuần sang ANTD components + theme tokens. ANTD đã cài sẵn (v6.3.0) nhưng chưa được sử dụng. Mục tiêu là loại bỏ custom CSS trong App.css, dùng ANTD components thay thế, và setup App provider cho feedback features.

## 2. User Flow

### Flow: Sử dụng Todo App (không thay đổi)
**Trigger:** User mở app
**Behavior:**
1. Thấy header "Todo App"
2. Nhập task vào input → nhấn "Add" → task xuất hiện trong list
3. Click checkbox → task đánh dấu hoàn thành (strikethrough)
4. Click "Delete" → task bị xóa
5. Thấy stats "X/Y completed" khi có tasks

**Result:** Hành vi giữ nguyên 100%, chỉ thay đổi giao diện

## 3. Technical Design

### Component Mapping (giữ trong App.tsx)

| Hiện tại | Chuyển thành ANTD |
|---|---|
| `<h1>Todo App</h1>` | `<Typography.Title level={1}>` |
| `<input className="todo-input">` | `<Input placeholder="...">` |
| `<button className="todo-add-btn">` | `<Button type="primary">` |
| `<ul className="todo-list">` | `<List dataSource={todos}>` |
| `<li className="todo-item">` | `<List.Item>` |
| `<input type="checkbox">` | `<Checkbox>` |
| `<span className="todo-text">` | `<Typography.Text>` |
| `<button className="todo-delete-btn">` | `<Button type="text" danger>` |
| `<p className="todo-stats">` | `<Typography.Text type="secondary">` |
| `<p className="todo-empty">` | `<Empty description="...">` |

### Theme & Provider Setup

- **Theme:** Light theme (ANTD default)
- **Provider:** Wrap app với `<App>` trong main.tsx
- **Styling:** Dùng `theme.useToken()` + inline styles, xóa App.css
- **index.css:** Giữ lại cho global styles cơ bản (font, body reset)

### State Management

Giữ nguyên `useState` hiện tại — không thay đổi logic.

## 4. Implementation Phases

### Phase A: Setup ANTD Provider
- [ ] A.1 - Wrap app với `<App>` provider trong main.tsx (import `App` từ antd)
- [ ] A.2 - Xóa import App.css trong App.tsx

### Phase B: Chuyển đổi Components
- [ ] B.1 - Header: `<h1>` → `<Typography.Title level={1}>`
- [ ] B.2 - Input + Button: `<input>` + `<button>` → `<Input>` + `<Button type="primary">` với `<Space.Compact>`
- [ ] B.3 - Todo List: `<ul>` → `<List>` với `renderItem`
- [ ] B.4 - Todo Item: checkbox + text + delete → `<Checkbox>` + `<Typography.Text>` + `<Button type="text" danger>`
- [ ] B.5 - Stats: `<p>` → `<Typography.Text type="secondary">`
- [ ] B.6 - Empty state: `<p>` → `<Empty>`

### Phase C: Styling với Theme Tokens
- [ ] C.1 - Import `theme.useToken()` và thay hardcoded values bằng tokens
- [ ] C.2 - Layout spacing dùng `token.marginMD`, `token.paddingLG`...
- [ ] C.3 - Xóa file App.css
- [ ] C.4 - Dọn index.css — giữ lại body reset, xóa phần không cần

## 5. Notes

- ANTD v6.3.0 đã cài trong package.json
- `lucide-react` đã cài nhưng chưa dùng — có thể dùng cho delete icon nếu ANTD không có icon phù hợp
- Logic todo (add, toggle, delete) giữ nguyên 100%, chỉ thay UI
- Không tạo file CSS/SCSS mới (theo skill frontend-antd-components)
