# Quy trình tích hợp API vào giao diện (UI) - NutriLife

Tài liệu này hướng dẫn quy trình từng bước để kết nối Backend API với giao diện người dùng dựa trên mô hình đã triển khai cho trang Đăng nhập.

---

## Bước 1: Định nghĩa Kiểu dữ liệu (Types)
Trước khi viết code logic, hãy đảm bảo các kiểu dữ liệu cho Request và Response đã được định nghĩa rõ ràng.
- **Vị trí**: `types/*.type.ts`
- **Nội dung**:
  - Định nghĩa Payload (dữ liệu gửi đi).
  - Định nghĩa cấu trúc dữ liệu trả về trong trường `data` của `ApiResponse`.

## Bước 2: Xây dựng Tầng Dịch vụ (Service Layer)
Tầng này chịu trách nhiệm gọi API thông qua Axios (`publicAxios` cho các API công khai hoặc `privateAxios` cho các API cần token).
- **Vị trí**: `services/*.service.ts`
- **Nguyên tắc**: 
  - Trả về dữ liệu đã được unwrapped (thường là `ApiResponse<T>`).
  - Sử dụng Generics của TypeScript để đảm bảo kiểu dữ liệu an toàn.

## Bước 3: Cập nhật Quản lý Trạng thái (Store - Nếu cần)
Nếu dữ liệu từ API cần được dùng ở nhiều nơi (như thông tin User, Token, hoặc trạng thái Global), hãy cập nhật Zustand Store.
- **Vị trí**: `stores/*.ts`
- **Nội dung**:
  - Thêm state mới.
  - Thêm các actions (hàm xử lý) để cập nhật state.

## Bước 4: Tích hợp vào Component Giao diện (UI)
Kết nối các dịch vụ và store vào component cụ thể.
- **Vị trí**: `app/(route)/page.tsx` hoặc `components/*.tsx`
- **Các việc cần làm**:
  - Import Service và Store action cần thiết.
  - Khởi tạo các state cục bộ (ví dụ: `isLoading`, `errorMsg`).
  - Sử dụng các hook như `useRouter` để điều hướng sau khi thành công.

## Bước 5: Triển khai Logic Xử lý (Handling)
Viết hàm xử lý sự kiện (như `handleSubmit` hoặc `useEffect`).
- **Nội dung**:
  - **Bắt đầu**: Set `isLoading = true`.
  - **Gọi API**: Sử dụng `try-catch` để bắt lỗi.
  - **Thành công**: Cập nhật Store, hiển thị thông báo thành công, điều hướng (nếu cần).
  - **Lỗi**: Hiển thị lỗi từ backend (`res.metadata.message`) hoặc lỗi kết nối.
  - **Kết thúc**: Set `isLoading = false`.

## Bước 6: Tối ưu hóa Trải nghiệm người dùng (UX Polish)
Đảm bảo giao diện phản hồi tốt với người dùng trong suốt quá trình gọi API.
- **Chỉ báo trạng thái**: Hiển thị Loading Spinner trên nút bấm hoặc vùng dữ liệu.
- **Ngăn chặn trùng lặp**: Vô hiệu hóa (disable) nút bấm và các ô nhập liệu khi đang gọi API.
- **Phản hồi trực quan**: Sử dụng Toast hoặc Alert để thông báo kết quả.

---

## Ví dụ tham khảo (Tranh Đăng nhập)
- **Service**: `authService.login(email, password)`
- **Store**: `useAuthStore.loginAction(token, user)`
- **UI**: Nút đăng nhập có `Loader2` animate-spin.
- **Flow**: Đăng nhập thành công -> Lưu Store -> Redirect về trang chủ `/`.
