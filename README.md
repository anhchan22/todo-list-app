
### 📌 Project Requirements: **Todo-List Application**

1. **Authentication**

   * User **Login**
   * User **Logout**
   * User **Register / Sign up**

2. **Task Management (CRUD)**

   * **Create, Read, Update, Delete** tasks

3. **Sử dụng API để lưu trữ dữ liệu**

   - **Base URL:** `http://localhost:8080`
   - **Xác thực:** JWT Bearer Token - lưu token trong `localStorage` và gửi kèm header `Authorization: Bearer <token>` cho mọi request có yêu cầu đăng nhập
   - **Endpoints:**
     
     **Authentication:**
     - `POST /api/auth/register` — Đăng ký tài khoản mới
       - Body: `{ username, password, email }`
       - Response: `{ code: 1000, result: { id, username, email, role, ... } }`
     - `POST /api/auth/login` — Đăng nhập, nhận JWT token
       - Body: `{ username, password }`
       - Response: `{ code: 1000, result: { token: "eyJ..." } }`
     - `GET /api/auth/myInfo` — Lấy thông tin user hiện tại (cần token)
       - Response: `{ code: 1000, result: { id, username, email, role, tasks: [] } }`
     - `PUT /api/auth/myInfo` — Cập nhật thông tin user hiện tại (cần token)
       - Body: `{ username?, password?, email? }`
     - `POST /api/auth/logout` — Đăng xuất, vô hiệu hóa token (cần token)
       - Response: `{ code: 1000, message: "Logout thành công!" }`
     
     **Task Management (User):**
     - `GET /api/tasks/myTasks?page=0&size=10` — Lấy danh sách task của user hiện tại (phân trang, cần token)
       - Response: `{ code: 1000, result: { content: [...], totalElements, totalPages, ... } }`
     - `POST /api/tasks` — Tạo task mới (cần token, yêu cầu ADMIN role)
       - Body: `{ title, description?, dueDate? }`
       - Response: `{ result: { id, title, description, status, dueDate, priority, ... } }`
     - `GET /api/tasks/{id}` — Lấy thông tin chi tiết 1 task (cần token)
     - `PUT /api/tasks/{id}` — Cập nhật task (cần token, yêu cầu ADMIN role)
       - Body: `{ title?, description?, dueDate?, status?, priority? }`
     - `DELETE /api/tasks/{id}` — Xóa task (cần token, yêu cầu ADMIN role)
       - Response: `204 No Content`
   
   - **Cấu trúc dữ liệu Task:**
     ```json
     {
       "id": 1,
       "user": { "id": 1, "username": "...", "email": "..." },
       "title": "string (bắt buộc)",
       "description": "string (tùy chọn)",
       "status": "CANCELED | TODO | IN_PROGRESS | DONE",
       "dueDate": "YYYY-MM-DD (tùy chọn)",
       "priority": "LOW | MEDIUM | HIGH | URGENT (tùy chọn)",
       "createdAt": "datetime",
       "updatedAt": "datetime"
     }
     ```
   
   - **Response Format chuẩn:**
     ```json
     {
       "code": 1000,
       "message": "Optional message",
       "result": { ... }
     }
     ```
   - Quy ước xử lý lỗi và trạng thái:
     - 401/403 → xóa token, điều hướng về `/login`, hiển thị toast thông báo
     - Hiển thị loading khi gọi API; toast cho thành công/thất bại
     - Validate phía client: `title` bắt buộc, `deadline` hợp lệ

4. **Phân 3 trang/nhóm: Total Tasks, Pending, Completed**

   - Cách triển khai: 3 tab hoặc 3 route con (`/dashboard/all`, `/dashboard/pending`, `/dashboard/completed`) hoặc dùng filter + URL query (`?view=pending`)
   - Định nghĩa:
     - Total Tasks: tất cả task của user
     - Pending: `completed = false`
     - Completed: `completed = true`
   - Sắp xếp mặc định: deadline tăng dần; task không có deadline nằm sau cùng (ở All/Pending). Có thể đẩy task đã hoàn thành xuống cuối ở All
   - Hành vi:
     - Toggle hoàn thành trực tiếp trong danh sách
     - Edit/Delete trong mọi tab; danh sách cập nhật tức thì sau thao tác
     - Giữ nguyên tab hiện tại sau reload (ưu tiên lưu qua query string)
   - Trạng thái rỗng: hiển thị empty state phù hợp từng tab
   - Khả năng mở rộng: phân trang phía client khi số lượng lớn (tùy chọn)