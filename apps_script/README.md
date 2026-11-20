# HACOLED Apps Script V4.5 — sửa lỗi trang trắng khi bấm menu

**Nguồn dữ liệu duy nhất:** Google Sheets đã chuyển từ file Excel gốc ID `1fjU0OFK1pYMH7-66tbiHNPf4LZf4maHcpco52iMZMyI`.

## Nguyên nhân và thay đổi

File `Index.html` có thẻ `<base target="_top">` để liên kết ngoài có thể mở khỏi iframe Google Apps Script, trong khi các mục menu **Tạo báo giá**, **Tính linh kiện**, **Tổng quan** dùng liên kết `#config`, `#bom`, `#home`. Do không đặt đích riêng, liên kết nội bộ đã có thể điều hướng trang ngoài iframe và hiển thị trắng.

- Đặt `target="_self"` trên liên kết điều hướng trong trang.
- Ở `Scripts.html`, chặn điều hướng mặc định (`preventDefault`) rồi dùng `scrollIntoView` trong chính ứng dụng; không sửa `window.top` hoặc chuyển trang.
- Giữ lại trạng thái hãng/model và biểu mẫu khi di chuyển giữa các chức năng.
- Giữ `doGet(e)` ở đầu `Code.gs` và toàn bộ logic tải dữ liệu cùng 4 hình thức báo giá.
- Không chỉnh sửa sheet, dữ liệu, công thức, hệ số, hoặc giá bán.

## Cài đặt

1. Vào dự án Apps Script **đang phục vụ Web App** của HACOLED.
2. Thay đồng bộ 4 file `Code.gs`, `Index.html`, `Styles.html`, `Scripts.html` bằng bản V4.5 (có thể giữ nguyên file manifest nếu đang chạy).
3. Lưu và chạy `kiemTraWebApp` trong Apps Script Editor để xác nhận server + template.
4. Chọn **Deploy → Manage deployments → Edit → New version → Deploy**, sau đó mở lại URL `/exec`.
5. Bấm **Tổng quan**, **Tạo báo giá**, **Tính linh kiện** và xác nhận URL Web App không thay đổi, biểu mẫu xuất hiện, hãng/model còn nguyên.
6. Kiểm tra thực thi bằng nút **Tính linh kiện** khi đã chọn model và nhập kích thước; phần báo giá vẫn là **bản nháp chưa có giá được duyệt**.

**Không dùng nút Run `doGet` để xem giao diện.** Nếu vẫn trắng sau cập nhật, kiểm tra đúng triển khai `New version` và nhật ký `Executions` trong Apps Script.
