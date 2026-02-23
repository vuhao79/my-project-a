# Tasks Phase 3 — UI Components & Project Detail Page

> **Status:** Done | **Created:** 2026-02-23

## 1. Mô tả

Xây dựng UI layer cho tính năng Tasks: trang Project Detail hiển thị thông tin project + Kanban board quản lý tasks. Hỗ trợ CRUD tasks qua Modal, drag & drop sắp xếp, và filter/sort.

**Dựa trên data layer đã hoàn thành:** Task type, useTasks hook (CRUD + optimistic updates), query keys.

## 2. User Flow

1. User click ProjectCard → navigate đến `/projects/:projectId`
2. Trang Project Detail hiển thị: nút Back, tên project, mô tả, thống kê (tổng tasks, theo status)
3. Bên dưới là Kanban board 3 cột: **Todo** | **In Progress** | **Done**
4. User click "Add Task" → Modal form hiện ra → điền title, description, priority, due_date → Save
5. Task mới xuất hiện ở cột Todo (mặc định)
6. User drag task từ cột này sang cột khác → cập nhật status
7. User drag task lên/xuống trong cùng cột → cập nhật position
8. User click task card → Modal edit hiện ra → sửa thông tin → Save
9. User click delete trên task card → confirm → xóa task
10. User dùng filter bar để lọc theo priority, due_date hoặc sort

## 3. Technical Design

### Components cần tạo

| File | Mô tả |
|------|--------|
| `features/projects/hooks/useProject.ts` | Hook fetch single project by ID (dùng `queryKeys.projects.detail`) |
| `features/tasks/pages/ProjectDetailPage.tsx` | Trang chính: header + stats + board |
| `features/tasks/components/TaskBoard.tsx` | Kanban board container, 3 cột, drag & drop context |
| `features/tasks/components/TaskColumn.tsx` | Một cột kanban (nhận status, danh sách tasks, drop zone) |
| `features/tasks/components/TaskCard.tsx` | Card hiển thị 1 task (title, priority badge, due date, actions) |
| `features/tasks/components/TaskFormModal.tsx` | Modal form tạo/sửa task |
| `features/tasks/components/TaskFilters.tsx` | Filter bar: priority, due date, sort options |

### State Management
- **Server state:** React Query qua `useTasks(projectId)` + `useProject(projectId)`
- **UI state:** `useState` cho modal open/close, editing task, filter values
- **Drag state:** `@hello-pangea/dnd` (hoặc `dnd-kit`) cho drag & drop

### Drag & Drop Logic
- Khi drop task sang cột khác → `updateTask({ id, status: newStatus })`
- Khi drop task trong cùng cột → reorder position → batch update positions
- Dùng optimistic update đã có trong useTasks

### Dependencies cần cài
- `@hello-pangea/dnd` — drag & drop library (fork maintained của react-beautiful-dnd)

## 4. Implementation Phases

### Phase A: Foundation — useProject hook + ProjectDetailPage skeleton
- [x] A.1 - Tạo `useProject(projectId)` hook fetch single project
- [x] A.2 - Tạo `ProjectDetailPage` với header (back button, project name, description)
- [x] A.3 - Thêm stats bar (total tasks, count by status)
- [x] A.4 - Cập nhật route trong `App.tsx` trỏ đến ProjectDetailPage

### Phase B: Kanban Board — hiển thị tasks
- [x] B.1 - Tạo `TaskCard` component (title, priority badge, due date, edit/delete actions)
- [x] B.2 - Tạo `TaskColumn` component (header với count, danh sách TaskCards)
- [x] B.3 - Tạo `TaskBoard` component (3 cột, chia tasks theo status)

### Phase C: Task CRUD — Modal form
- [x] C.1 - Tạo `TaskFormModal` (create mode: title, description, priority, due_date)
- [x] C.2 - Thêm edit mode cho TaskFormModal (load data task hiện tại)
- [x] C.3 - Wire up create/edit/delete actions với useTasks hook

### Phase D: Drag & Drop
- [x] D.1 - Cài `@hello-pangea/dnd` và setup DragDropContext trong TaskBoard
- [x] D.2 - Implement drag task giữa các cột (update status)
- [x] D.3 - Implement drag task trong cùng cột (reorder position)

### Phase E: Filters & Sort
- [x] E.1 - Tạo `TaskFilters` component (priority filter, due date filter, sort select)
- [x] E.2 - Integrate filters vào ProjectDetailPage, filter tasks trước khi render board

## 5. Notes

- `queryKeys.projects.detail(id)` đã được define trong constants nhưng chưa có hook sử dụng
- TaskForm.tsx hiện tại đang empty → sẽ thay bằng TaskFormModal.tsx
- Pattern theo CreateProjectModal: `Form.useForm()`, `App.useApp()` cho message, `confirmLoading`
- Antd components dùng: Card, Tag, Modal, Form, Input, Select, DatePicker, Button, Row/Col, Space, Spin, Empty
- Edge cases: empty board (no tasks), long title truncation, overdue date highlight
