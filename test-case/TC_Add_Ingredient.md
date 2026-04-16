# Kịch bản kiểm thử: Chức năng Thêm Nguyên Liệu (Add Ingredient)

**Mô-đun:** Quản lý Nguyên liệu (Ingredient Management)
**Giới thiệu:**
Tập hợp các kịch bản kiểm thử đảm bảo người quản trị (Admin) có thể thêm mới nguyên liệu vào hệ thống một cách chính xác. Chức năng này bao gồm việc nhập thông tin cơ bản, các chỉ số dinh dưỡng (tính trên 100g), hình ảnh đại diện, gán nhãn nguồn gốc (USDA, Manual, Calculated) và các cảnh báo dị ứng (Allergens) thông qua payload `FormData`.

### Bảng Test Case

| Mã TC | Tên kịch bản | Các bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Trạng thái |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **TC_ING_01** | Thêm mới nguyên liệu đầy đủ thông tin hợp lệ | 1. Mở form "Thêm nguyên liệu".<br>2. Nhập đầy đủ Tên, Mô tả, Dinh dưỡng (Calo, Protein, Carb, Fat).<br>3. Chọn Ảnh đại diện hợp lệ.<br>4. Lựa chọn Source là `Manual`.<br>5. Nhấn "Lưu". | Tên: Cà chua<br>Calo: 18<br>Image: `tomato.jpg`<br>Source: Manual | Thông báo "Thêm nguyên liệu thành công". Hệ thống đóng Modal form và dòng "Cà chua" xuất hiện ở vị trí đầu tiên hoặc đúng logic sắp xếp trong danh sách (kèm badge Manual). | Pass |
| **TC_ING_02** | Bỏ trống các trường bắt buộc | 1. Mở form "Thêm nguyên liệu".<br>2. Bỏ trống `Tên nguyên liệu` hoặc một trong các chỉ số `Calo`.<br>3. Nhấn "Lưu". | Tên: [Rỗng]<br>Calo: [Rỗng] | Không gửi request lên server (chặn ở form). Hiển thị text báo lỗi màu đỏ (VD: "Tên nguyên liệu không được để trống") bên dưới các trường tương ứng. | Pass |
| **TC_ING_03** | Nhập định lượng âm hoặc nhập chữ vào trường dinh dưỡng | 1. Tại trường Protein hoặc Calo, nhập giá trị âm (VD: -5) hoặc chứa ký tự chữ (VD: 10g).<br>2. Nhấn "Lưu". | Protein: `-5` hoặc `10g` | Form validate, báo lỗi "Giá trị dinh dưỡng phải lớn hơn hoặc bằng 0 và là số". | Pass |
| **TC_ING_04** | Nhập tên nguyên liệu đã tồn tại | 1. Mở form "Thêm nguyên liệu".<br>2. Nhập tên một nguyên liệu đã có trong Database (VD: Cà chua).<br>3. Điền đúng các trường còn lại và "Lưu". | Tên: Cà chua (đã có) | Server trả về lỗi 409 hoặc 400. Giao diện hiển thị cảnh báo (Toast hoặc Alert): "Tên nguyên liệu này đã tồn tại trong hệ thống". | Pass |
| **TC_ING_05** | Tải ảnh nguyên liệu sai định dạng / dung lượng quá lớn | 1. Mở form "Thêm nguyên liệu".<br>2. Ở mục "Image", chọn 1 file `.pdf` hoặc ảnh nặng `> 5MB`. | Image: `test.pdf` hoặc `hi-res.png (10MB)` | Chặn preview ảnh, cảnh báo lỗi upload: "Vui lòng chọn ảnh định dạng JPG/PNG và dung lượng dưới 5MB". | Pass |
| **TC_ING_06** | Thêm thành công cấu trúc Allergens (Dị ứng) | 1. Mở form.<br>2. Nhập Tên: Đậu phộng.<br>3. Ở mục `Allergens`, chọn/đánh dấu "Peanut".<br>4. Nhấn "Lưu". | Allergens check: `Peanuts` | Dữ liệu nguyên liệu lưu thành công. Khi load lại ở ngoài bảng danh sách, nguyên liệu "Đậu phộng" có gắn tag cảnh báo dị ứng chính xác. | Pass |
| **TC_ING_07** | Gửi form với FormData (Xử lý chuỗi JSON và File) API Call | 1. Điền từ A-Z một nguyên liệu hợp lệ, gồm cả chữ và ảnh.<br>2. Nhấn "Lưu" (Bật F12 theo dõi tab Network). | Tất cả input hợp lệ, có Image | Payload được gửi theo dạng `multipart/form-data`. Thông tin chữ được parse đúng các kiểu (String, Number). API trả về mã 201 Created. | Pass |
| **TC_ING_08** | Lọc và Hiển thị Badge theo Nguồn dữ liệu (Source) | 1. Thêm 1 nguyên liệu mới.<br>2. Trong lúc thêm, chọn Source = `USDA`.<br>3. Nhấn "Lưu" thành công và ra xem bảng. | Source: `USDA` | Trong bảng quản lý (List view), nguyên liệu vừa tạo phải xuất hiện một tag/badge có màu sắc tương ứng (VD: xanh dương với chữ USDA) để phân biệt với Manual và Calculated. | Pass |
