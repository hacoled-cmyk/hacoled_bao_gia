# Phần Mềm Tạo Báo Giá Màn Hình LED & Thiết Bị Tự Động HACOLED

Hệ thống tính toán kỹ thuật và tự động hóa bảng báo giá thiết bị màn hình LED, màn hình ghép LCD, màn hình tương tác thông minh và dịch vụ bảo trì cho **Công ty Cổ phần Công nghệ HACO Việt Nam**.

Ứng dụng giải quyết triệt để bài toán **"Giá module biến động theo thị trường, không có giá niêm yết cố định"** bằng cơ chế **Smart LED Pricing Engine**: Chỉ cần nhập giá nhập module hiện tại của thị trường và tỷ lệ lợi nhuận mong muốn, hệ thống sẽ tự động bóc tách vật tư và tính giá bán hoàn chỉnh trọn gói.

---

## 🌟 Tính Năng Nổi Bật

### 1. Bộ Tính Kích Thước & Bóc Tách Cấu Hình LED Tự Động (Smart LED Calculator)
- **Tự động quy đổi module**: Nhập kích thước mong muốn (Dài x Cao mm) hoặc chọn tỷ lệ vàng (16:9, 4:3, 21:9), hệ thống tự động làm tròn theo bước module thực tế (320x160mm, 192x192mm...).
- **Độ phân giải & Ma trận hiển thị**: Tính chính xác tổng số tấm module (ngang x dọc), diện tích thực tế ($m^2$), độ phân giải chuẩn (pixels) và số Megapixels.
- **Tự động bóc tách vật tư kỹ thuật**:
  - **Card thu tín hiệu (Colorlight / Novastar)**: Tự động tính số lượng card theo năng lực tải pixel.
  - **Bộ nguồn 5V-60A (Chuanglian / CZCL)**: Tự động tính số bộ nguồn theo công suất tải thực tế.
  - **Linh kiện dự phòng (Spare parts)**: Tự động tính 2% module và 5% bộ nguồn đồng lô sản xuất theo tiêu chuẩn nghiệm thu.
  - **Khung sắt hộp mạ kẽm & Nẹp nhôm/Alu trang trí**: Tự động tính theo diện tích $m^2$ và chu vi màn hình.
  - **Bộ xử lý hình ảnh (Video Processor)**: Tự động gợi ý model tương thích với độ phân giải màn hình (Colorlight X4M, Novastar VX400, VX600, VX1000 4K...).

### 2. Cơ Chế Tính Giá Bán Biến Động Thị Trường (Dynamic Market Pricing)
- Không bắt buộc dùng giá niêm yết cố định.
- Mỗi dự án chỉ cần:
  1. Nhập **Giá nhập Module (VNĐ/tấm)** theo báo giá mới nhất từ nhà sản xuất (Qiangli, GKGD, Royal, Unilumin...).
  2. Kéo thanh chọn **Biên lợi nhuận / Markup (%)** (từ 5% giá thợ đến 80% bán lẻ) hoặc nhập đơn giá trực tiếp.
  3. Bấm **[⚡ CẬP NHẬT GIÁ BÁN]**: Hệ thống tính toán và điền đồng loạt vào toàn bộ bảng báo giá I, II, III, IV, V, VI.

### 3. Kho Mẫu Báo Giá Đa Dạng (Presets)
- **Màn hình LED trong nhà (Indoor)**: P1.25, P1.53, P1.86, P2.0, P2.5, P3.0, P4.0.
- **Màn hình LED ngoài trời (Outdoor IP65)**: P2.5, P3.0, P4.0, P5.0, P6.0, P10.
- **Màn hình ghép LCD Video Wall**: 55" viền 1.74mm / 0.88mm tấm nền BOE, giá treo pop-out thủy lực, Matrix Controller 4K.
- **Màn hình tương tác thông minh (HDFocus)**: 65", 75", 86", 98", 105" Dual OS Android + OPS Windows 11.
- **Dịch vụ kỹ thuật & Sửa chữa**: Sửa mạch điểm chết pixel, thay nguồn sụt áp, thay card hỏng LAN, bảo trì định kỳ.

### 4. Bảng Báo Giá A4 Trực Quan & Xuất Dữ Liệu Đa Nền Tảng
- **Live Preview A4**: Hiển thị song song bản in A4 chuẩn trang in văn bản 210 x 297mm.
- **Đọc số tiền bằng chữ tiếng Việt chuẩn kế toán**: Tự động xử lý chính xác theo quy tắc tiếng Việt ("Một trăm hai mươi lăm triệu...").
- **Thuế GTGT & Chiết khấu**: Hỗ trợ 0%, 8% (Nghị định 72), 10%.
- **Xuất File Word (.doc)**: Giữ nguyên 100% định dạng bảng biểu, font Times New Roman chuẩn gửi đối tác.
- **Xuất File Excel (.xlsx)**: Tạo file Excel bảng tính kế toán có đầy đủ cột mục và công thức.
- **In ấn & Lưu PDF trực tiếp**: Chuẩn A4 không bị lệch lề.
- **Đồng bộ sang Phần mềm Hợp Đồng HACO**: Nút bấm chuyển dữ liệu trực tiếp sang app `phan_mem_tao_hop_dong_haco`.
- **Lưu trữ lịch sử báo giá (Local Storage)**: Lưu, tìm kiếm, sửa lại và nhân bản báo giá cũ nhanh chóng ngay trên trình duyệt mà không cần cài đặt database.

---

## 🚀 Triển Khai & Cài Đặt

### 1. Chạy trực tiếp trên trình duyệt
Ứng dụng được đóng gói toàn bộ vào 1 file `index.html`. Bạn có thể mở trực tiếp file `index.html` bằng bất kỳ trình duyệt nào (Chrome, Edge, Cốc Cốc, Safari) mà không cần cài đặt Node.js hay máy chủ web.

### 2. Triển khai lên Vercel
1. Kết nối repository này với tài khoản Vercel của bạn.
2. Bấm **Deploy**. Vercel sẽ tự động nhận diện và cung cấp tên miền hoạt động tức thì.

---

## 🏢 Bản Quyền & Thương Hiệu
- **Đơn vị phát triển**: Công ty Cổ phần Công nghệ HACO Việt Nam (HACOLED)
- **Mã số thuế**: 0108701064
- **Hotline**: 034 232 4488 - 0944 070 797
- **Website**: https://hacoled.com
