# Kịch bản kiểm thử: Chức năng Đăng nhập (Login)

**Giới thiệu:**
Dưới đây là tập hợp các kịch bản kiểm thử (Test Cases) được tùy chỉnh cho chức năng đăng nhập của ứng dụng AI Food. Các kịch bản này bao gồm đăng nhập thành công, thất bại với các nguyên nhân (sai mật khẩu, email chưa đăng ký, sai định dạng), các hành vi của giao diện người dùng và kiểm soát lỗi từ máy chủ.

### Bảng Test Case

| Mã TC | Tên kịch bản | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Trạng thái |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **TC_DN_01** | Đăng nhập thành công | 1. Truy cập trang Đăng nhập.<br>2. Nhập Email/Pass hợp lệ.<br>3. Nhấn "Đăng nhập". | Email: user@test.com<br>Pass: 123456 | Hệ thống chuyển hướng về Trang chủ. Token được lưu vào Cookie hoặc Local Storage. | Pass |
| **TC_DN_02** | Đăng nhập sai mật khẩu | 1. Truy cập trang Đăng nhập.<br>2. Nhập Email đúng nhưng Pass sai.<br>3. Nhấn "Đăng nhập". | Email: user@test.com<br>Pass: wrongpass | Hiển thị thông báo lỗi: "Email hoặc mật khẩu không chính xác". | Pass |
| **TC_DN_03** | Đăng nhập Email chưa đăng ký | 1. Nhập Email chưa được đăng ký trong hệ thống.<br>2. Nhập mật khẩu bất kỳ.<br>3. Nhấn "Đăng nhập". | Email: notexist@test.com<br>Pass: 123456 | Hiển thị thông báo: "Tài khoản không tồn tại" hoặc "Email đã được sử dụng/chưa đúng". | Pass |
| **TC_DN_04** | Bỏ trống Email | 1. Bỏ trống trường Email<br>2. Nhập mật khẩu.<br>3. Nhấn "Đăng nhập". | Email: [Rỗng]<br>Pass: 123456 | Dừng gửi form, hiển thị cảnh báo: "Vui lòng nhập Email" dưới ô input. | Pass |
| **TC_DN_05** | Bỏ trống Mật khẩu | 1. Nhập Email hợp lệ.<br>2. Bỏ trống trường Mật khẩu.<br>3. Nhấn "Đăng nhập". | Email: user@test.com<br>Pass: [Rỗng] | Dừng gửi form, hiển thị cảnh báo: "Vui lòng nhập Mật khẩu" dưới ô input. | Pass |
| **TC_DN_06** | Sai định dạng Email | 1. Nhập Email sai định dạng (thiếu @, thiếu phần miền).<br>2. Nhập mật khẩu.<br>3. Nhấn "Đăng nhập". | Email: usertest<br>Pass: 123456 | Dừng gửi form, hiển thị lỗi định dạng: "Email không hợp lệ". | Pass |
| **TC_DN_07** | Đăng nhập khi tài khoản bị khóa | 1. Nhập Email/Pass đúng của tài khoản đang bị vô hiệu hóa.<br>2. Nhấn "Đăng nhập". | Email: banned@test.com<br>Pass: 123456 | Báo lỗi lấy từ server: "Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ bộ phận hỗ trợ". | Pass |
| **TC_DN_08** | Chức năng Hiển thị/Ẩn mật khẩu | 1. Nhập vào trường mật khẩu.<br>2. Nhấn biểu tượng "Con mắt" (Show/Hide password). | Pass: 123456 | Mật khẩu chuyển đổi từ dạng dấu chấm `••••••` sang văn bản rõ `123456` và ngược lại. | Pass |
| **TC_DN_09** | Xử lý khi lỗi mạng/Server (Lỗi 500/Mất mạng) | 1. Nhập Email/Pass hợp lệ.<br>2. Ngắt kết nối mạng hoặc giả lập Server lỗi.<br>3. Nhấn "Đăng nhập". | Email: user@test.com<br>Pass: 123456 | Trạng thái nút là "Đang xử lý/Loading" rồi báo lỗi chung: "Có lỗi xảy ra, vui lòng thử lại sau". Ứng dụng không bị crash. | Pass |
