# Kịch bản kiểm thử: Tải ảnh và Nhận diện món ăn (AI Food Recognition)

**Mô-đun:** Nhận diện bằng AI / Upload & Scan
**Giới thiệu:**
Tập hợp các kịch bản kiểm thử (Test Cases) nhằm đảm bảo chức năng tải ảnh (từ file hoặc camera) và sử dụng AI (Computer Vision) để nhận diện món ăn hoạt động chính xác. Bao gồm luồng upload, xử lý với AI, hiển thị thông tin dinh dưỡng và các trường hợp lỗi (ảnh sai định dạng, ảnh không phải đồ ăn, lỗi API...).

### Bảng Test Case

| Mã TC | Tên kịch bản | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Trạng thái |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **TC_AI_01** | Tải ảnh món ăn hợp lệ & Nhận diện thành công | 1. Mở tính năng Tải ảnh.<br>2. Chọn một ảnh chụp rõ món ăn (VD: Phở bò).<br>3. Bấm "Nhận diện". | File: `pho_bo.jpg` (dung lượng < 5MB). | Nút chuyển sang trạng thái "Đang phân tích". Hệ thống trả về kết quả đúng (Phở bò), hiển thị thành phần dinh dưỡng và ước lượng khẩu phần (VD: tính theo 100g). | Pass |
| **TC_AI_02** | Tải file không được hỗ trợ | 1. Mở tính năng Tải ảnh.<br>2. Chọn một file không phải là ảnh hộp lệ (VD: file text, PDF). | File: `document.pdf` | Form upload chặn tệp từ đầu hoặc hệ thống báo lỗi: "Vui lòng chọn ảnh có định dạng JPG, JPEG, PNG, WEBP". | Pass |
| **TC_AI_03** | Tải ảnh có kích thước vượt mức cho phép | 1. Chọn một bức ảnh lớn (VD: > 10MB - tùy giới hạn hệ thống).<br>2. Tiến hành upload. | File: `large_image.jpg` (15MB) | Hệ thống cảnh báo: "Kích thước ảnh quá lớn, vui lòng chọn ảnh dưới X MB". Không gọi API nhận diện. | Pass |
| **TC_AI_04** | Nhận diện ảnh KHÔNG phải đồ ăn | 1. Chọn một biểu tượng, ảnh đồ vật (VD: cái bàn, ô tô) hoặc ảnh người.<br>2. Bấm "Nhận diện". | File: `car.png` | AI phân tích và trả lời: "Không tìm thấy món ăn trong ảnh" hoặc cung cấp kết quả với độ trật tin cậy rất thấp và yêu cầu chụp/tải lại ảnh khác. | Pass |
| **TC_AI_05** | Nhận diện ảnh có nhiều món ăn cùng lúc | 1. Tải lên một ảnh mâm cơm (có cơm, rau, thịt).<br>2. Bấm "Nhận diện". | File: `mam_com.jpg` | Hệ thống có thể nhận diện và gợi ý nhiều món ăn dạng danh sách (VD: Cơm trắng, Rau luộc, Thịt kho) để người dùng dễ dàng chọn và tích vào các món muốn log. | Pass |
| **TC_AI_06** | Điều chỉnh kết quả sau khi AI nhận diện (Sửa khẩu phần) | 1. Sau khi AI trả kết quả món ăn thành công.<br>2. Người dùng chọn lại khối lượng hoặc thay đổi kích cỡ phần ăn (từ 100g thành 250g). | Size đổi từ `100g` -> `250g` | Bảng thông tin dinh dưỡng (Calo, Protein, Fat, Carb) tự động tĩnh toán và cập nhật lại tương ứng với khối lượng mới. | Pass |
| **TC_AI_07** | Huỷ và chụp/tải lại ảnh khác | 1. Sau khi chọn ảnh đầu tiên nhưng đổi ý (chưa quét AI) hoặc kết quả quét sai.<br>2. Chọn "Chụp lại" hoặc "Xóa ảnh". | Hành động: Click `Xóa/Chụp lại` | Giao diện quay lại bước Upload ban đầu (hoặc bật lại camera). Toàn bộ dữ liệu của ảnh trước bị xóa. | Pass |
| **TC_AI_08** | Lưu món ăn vào nhật ký (Log meal) | 1. Xác nhận các thông số món ăn đã nhận diện thành công.<br>2. Nhấn nút "Lưu / Thêm vào nhật ký". | Dữ liệu món ăn và dinh dưỡng (đã xác nhận) | Món ăn được lưu thành công vào nhật ký mục tiêu trong ngày. Chuyển hướng người dùng về màn hình theo dõi số liệu bữa ăn hằng ngày. | Pass |
| **TC_AI_09** | Xử lý khi Lỗi API / Lỗi mạng trong quá trình nhận diện | 1. Mở ứng dụng, thao tác upload ảnh.<br>2. Ngắt mạng rồi nhấn "Nhận diện" hoặc API/Model AI có lỗi xử lý. | Network disconnected/Lỗi Server 5xx | Nút tiến trình dừng loading, thông báo: "Không thể kết nối đến máy chủ nhận diện, vui lòng thử lại". Ứng dụng không bị đứng/treo. | Pass |
