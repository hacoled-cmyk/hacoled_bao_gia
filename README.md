# HACOLED — Không Gian Làm Việc Báo Giá (Quotation Workspace)

Hệ thống tạo cấu hình báo giá và tính định mức linh kiện màn hình LED nội bộ của **HACOLED** (Phiên bản V4.5).

Ứng dụng giữ nguyên 100% giao diện, câu chữ, màu sắc, phong cách thiết kế Trống Đồng Đông Sơn, phân nhóm sản phẩm và quy trình quen thuộc mà đội ngũ HACOLED đang sử dụng.

---

## 🌟 Cấu Trúc Ứng Dụng

- **Bản Web Độc Lập (`index.html`)**: Chạy trực tiếp trên trình duyệt, Vercel, hoặc GitHub Pages mà không cần cấu hình server. Dữ liệu 224 sản phẩm và 216 định mức linh kiện từ file Google Sheets gốc được nhúng sẵn đầy đủ.
- **Mã Nguồn Google Apps Script (`apps_script/`)**:
  - `Code.gs`: Xử lý phía máy chủ Apps Script, nạp dữ liệu khởi tạo, tính linh kiện dự thảo.
  - `Index.html`: Khung HTML chuẩn, bố cục sidebar + working grid theo bản sắc HACOLED.
  - `Styles.html`: Toàn bộ CSS (chế độ sáng/tối, họa tiết Trống Đồng, responsive).
  - `Scripts.html`: Xử lý giao diện người dùng, điều hướng mượt mà, gọi hàm máy chủ an toàn.
  - `appsscript.json`: Cấu hình manifest và runtime V8.

---

## 🚀 Tính Năng Chính

### 1. BƯỚC 01 — Chọn hình thức báo giá
- **Báo giá bán linh kiện**: Module LED, nguồn, card và phụ kiện
- **Báo giá khách hàng thông thường**: Màn hình hoàn chỉnh, thi công và dịch vụ
- **Báo giá dự án / đấu thầu**: Dự án, khối lượng và hồ sơ đấu thầu
- **Báo giá đại lý / đối tác**: Chính sách cho đại lý và đối tác

### 2. BƯỚC 02 — Thông tin báo giá & Chọn Hãng / Model
- Nhập thông tin Khách hàng / đơn vị.
- Chọn **Hãng / nhóm sản phẩm**: TDLED, Qiangli, Dahua, Lampro, HIK, Shenzhen, Sky, Longrun, Cảm ứng, Poster...
- Chọn **Model**: Danh mục tương ứng theo hãng đã chọn, hiển thị kích thước module (ví dụ: `320 × 160 mm`) và phân nhóm (Trong nhà / Ngoài trời).
- Nhập số lượng, mã dự án / tham chiếu, và ghi chú.

### 3. Công Cụ Tính Linh Kiện (BOM Calculator)
- Nhập kích thước màn hình: Chiều ngang (mm) và Chiều cao (mm).
- Bấm **Tính linh kiện**:
  - Tự động quy đổi số module dự kiến theo trục ngang $\times$ trục dọc.
  - Tính kích thước và diện tích thực tế làm tròn theo bước module.
  - Ước tính số bộ nguồn 5V60A và số card thu tín hiệu theo bảng định mức kỹ thuật gốc.
  - Hiển thị model card thu và nguồn đề xuất cùng cảnh báo kỹ thuật.

### 4. Tạo Báo Giá Nháp & In
- Bấm **Tạo báo giá nháp**: Hiển thị bảng tóm tắt cấu hình dự thảo.
- Bấm **In bản nháp**: Xuất bản in sạch sẽ, chuẩn văn bản.
