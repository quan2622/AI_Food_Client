# Kịch bản kiểm thử: Chức năng Gợi ý món ăn thông minh (AI Food Recommendation)

**Mô-đun:** Gợi ý dinh dưỡng / AI Recommendations
**Giới thiệu:**
Tập hợp các kịch bản kiểm thử cho chức năng AI tự động gợi ý món ăn dựa trên lượng calo/macros còn lại trong ngày, mục tiêu dinh dưỡng cá nhân và lịch sử ăn uống. Đảm bảo thuật toán cung cấp dữ liệu chính xác, và người dùng có thể dễ dàng thêm các món này vào nhật ký của mình.

### Bảng Test Case

| Mã TC | Tên kịch bản | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Trạng thái |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **TC_REC_01** | Khởi tạo gợi ý đầu ngày (Chưa ăn gì) | 1. Đăng nhập vào ngày mới (nhật ký calo trống).<br>2. Vào mục "Gợi ý thông minh". | Dữ liệu tiêu thụ: 0 calo đã nạp | Hiển thị danh sách các món ăn gợi ý mang tính cân bằng (bữa sáng, trưa, tối) phù hợp với mục tiêu chuẩn trong ngày. | Pass |
| **TC_REC_02** | Gợi ý dựa trên lượng dinh dưỡng (Calo/Macros) còn lại | 1. Đã log vài món trong ngày (ví dụ ăn sáng/trưa hết 1500 kcal, mục tiêu là 2000 kcal).<br>2. Vào "Gợi ý thông minh". | Mục tiêu: 2000. Đã ăn: 1500.<br>Còn lại: 500 kcal. | AI gợi ý các món ăn phụ hoặc bữa tối có tổng calo xung quanh mức 500 kcal và bù đắp các Macros (Protein/Fat/Carb) còn thiếu. | Pass |
| **TC_REC_03** | Lọc gợi ý theo dị ứng (Allergens) | 1. Cài đặt Profile: Dị ứng với "Lạc/Đậu phộng".<br>2. Yêu cầu làm mới danh sách gợi ý. | Profile có `allergies: ["Peanut"]` | Danh sách trả về tuyệt đối KHÔNG chứa các món ăn được đánh dấu có thành phần Đậu phộng/Lạc. | Pass |
| **TC_REC_04** | Xem chi tiết dinh dưỡng của món ăn được gợi ý | 1. Trong danh sách gợi ý, bấm vào thẻ/tên một món ăn bất kỳ.<br>2. Đọc thông tin. | ID Món ăn gợi ý | Hiển thị bảng mô tả chi tiết: Hình ảnh, nguyên liệu, và biểu đồ/Nutrition facts (Calo, Protein, Carbs, Fat) của riêng món đó. | Pass |
| **TC_REC_05** | Xác nhận và Log trực tiếp món được gợi ý | 1. Chọn một món ăn ưng ý trong danh sách gợi ý.<br>2. Nhấn nút "Thêm vào bữa ăn" (Log Meal). | Chọn món "Ức gà luộc" ở bữa tối | Thông báo thành công: "Đã thêm vào nhật ký nhật". Quay lại trang chủ, progress bar của Calo và Macros được cập nhật tương ứng. | Pass |
| **TC_REC_06** | Làm mới/Tái tạo (Regenerate) danh sách gợi ý | 1. Vào danh sách gợi ý (đang hiển thị List A).<br>2. Nhấn nút "Gợi ý khác" / "Tiếp tục quét". | Hành động: Click `Regenerate` | Nút có trạng thái tải (Loading). Bảng danh sách được cập nhật bằng tập hợp món ăn khác (List B) phù hợp cùng tiêu chí. | Pass |
| **TC_REC_07** | Vượt quá mục tiêu calo vẫn yêu cầu gợi ý | 1. Nhật ký trong ngày đã vượt quá số calo cho phép (Ví dụ lố 200 kcal).<br>2. Vào xem mục "Gợi ý thông minh". | Calo còn lại: `< 0` | Hệ thống đưa ra cảnh báo: "Bạn đã đạt giới hạn dinh dưỡng hôm nay" và có thể gợi ý các hoạt động tiêu hao thể lực, thức uống zero calo, hoặc trà thay vì món ăn nặng. | Pass |
| **TC_REC_08** | Hiệu suất table và Responsive | 1. Tạo danh sách gợi ý từ ứng dụng.<br>2. Co giãn kích thước trình duyệt hoặc mở bằng màn hình điện thoại. | Màn hình Mobile/Tablet | Trình bày bảng (Table) hoặc các Cards món ăn tự động xuống dòng/ẩn bớt các cột ít quan trọng, cuộn trang mượt mà không bị vỡ layout (không overflow). | Pass |
| **TC_REC_09** | Xử lý lỗi API (Timeout/Error) | 1. Bấm yêu cầu Gợi ý món ăn mới.<br>2. Giả lập kết nối mạng chậm (>15s) hoặc tắt server AI. | Lỗi Timeout / 500 API | Ứng dụng hiển thị Skeleton/Loader rồi timeout, thông báo "Hệ thống AI gợi ý đang bảo trì hoặc mất kết nối, vui lòng thử lại sau". | Pass |
