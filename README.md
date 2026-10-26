# Website Công ty Luật Từ Liêm — React

Website đã chuyển sang React + Vite. Các trang được render bằng component JSX; không nhúng HTML cũ, không dùng iframe hoặc `dangerouslySetInnerHTML` để dựng giao diện.

## Chạy local

Yêu cầu: Node.js 22.12 trở lên và npm.

```bash
npm install
npm run dev
```

Mở URL Vite in trong terminal. Bản dùng để kiểm tra lần chuyển đổi này chạy tại `http://127.0.0.1:5178` bằng:

```bash
npm run dev -- --host 127.0.0.1 --port 5178 --strictPort
```

Lệnh này khởi động React/Vite. Không dùng `python3 -m http.server` cho source React.

## Vị trí chỉnh sửa

| Nội dung                                              | Vị trí                       |
| ----------------------------------------------------- | ---------------------------- |
| Thông tin công ty, số điện thoại, menu, tiêu đề trang | `src/data/site.js`           |
| Ảnh và chú thích slider                               | `src/data/slides.js`         |
| Bản đồ import ảnh                                     | `src/data/images.js`         |
| Các lĩnh vực và phần tuyển dụng tại trang chủ         | `src/data/home.js`           |
| Án lệ, bộ lọc và dữ liệu hộp thoại                    | `src/data/cases.js`          |
| Vị trí tuyển dụng, mô tả và quyền lợi                 | `src/data/recruitment.js`    |
| Header, menu mobile, footer, hộp thoại, thông báo     | `src/components/`            |
| Nội dung 5 trang công khai                            | `src/pages/`                 |
| Slider, thẻ án lệ, thẻ tuyển dụng và thành viên       | `src/features/`              |
| Bố cục chung và cập nhật tiêu đề khi đổi trang        | `src/layouts/SiteLayout.jsx` |
| CSS chung, theo trang và responsive                   | `src/styles/`                |
| Ảnh và font được Vite đóng gói                        | `src/assets/site/`           |
| Khai báo đường dẫn React Router                       | `src/App.jsx`                |

CSS chia thành các lớp `base`, `pages`, `responsive`, `react`. CSS từng trang có tiền tố `.page-about`, `.page-cases`, `.page-recruitment`, `.page-contact`; CSS thành viên nằm trong `.portal` để tránh ảnh hưởng trang khác.

Để đổi một slide, thêm ảnh vào `src/assets/site/`, khai báo import trong `src/data/images.js`, rồi cập nhật mục tương ứng trong `src/data/slides.js`.

## Đường dẫn

- `/`: Trang chủ.
- `/gioi-thieu`: Giới thiệu công ty.
- `/tuyen-dung`: Tuyển dụng – Hợp tác.
- `/an-le`: Án lệ Án hay.
- `/lien-he`: Liên hệ.
- `/thanh-vien`: Thành viên minh họa.
- Đường dẫn cũ `/index.html#thanh-vien` và `/#thanh-vien` tự chuyển đến trang thành viên.

Các menu dùng URL không có đuôi `.html`. Các URL `.html` cũ tự chuyển sang URL gọn tương ứng bằng React Router, giữ tham số truy vấn và vị trí neo; `/index.html` chuyển về `/`. Vite dev và Vite preview hỗ trợ mở trực tiếp/tải lại các đường dẫn này. Khi triển khai SPA lên hosting sau này cần cấu hình trả về `index.html` cho các route; lần chuyển đổi này chưa thay đổi cấu hình hoặc bản Vercel.

## Phạm vi chức năng

- Giữ giao diện, ảnh, font, nội dung tiếng Việt và bố cục responsive hiện tại.
- Menu mobile, slider, tìm/lọc án lệ, hộp thoại và biểu mẫu được quản lý bằng state/event React.
- Từ khóa tìm án lệ kết hợp với bộ lọc đang chọn; có trạng thái không tìm thấy kết quả.
- Xem trước tên tệp đính kèm chạy trên trình duyệt, không upload dữ liệu.
- Các biểu mẫu, đăng nhập, dashboard CTV và giám đốc vẫn là minh họa: chưa có backend, xác thực hoặc lưu trữ. Thông báo gửi biểu mẫu nêu rõ chưa gửi/lưu dữ liệu, không báo đã tiếp nhận thực tế.
- Phản hồi trong dashboard chỉ tồn tại trong phiên hiển thị, mất khi tải lại trang.

## Kiểm tra

```bash
npm run lint
npm run build
npm run test:e2e
```

Kiểm tra E2E dùng Playwright, tự khởi động hoặc sử dụng Vite đang chạy ở cổng 5178. Có hai cấu hình desktop 1440px và mobile 390px, kèm kiểm tra responsive ở 375, 430, 768 và 1024px. Bao gồm tải lại từng route, điều hướng không tải document, menu, slider, bộ lọc, hộp thoại, biểu mẫu, tệp đính kèm và thành viên.

Nếu máy không có Chrome tại `/usr/bin/google-chrome`, có thể dùng Chromium của Playwright:

```bash
npx playwright install chromium
```

Hoặc đặt `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` trỏ đến Chrome/Chromium đã cài.

Kiểm tra thêm bản build production local:

```bash
E2E_BASE_URL=http://127.0.0.1:5179 npm run test:e2e
```

Lệnh này dùng Vite preview. Cần chạy `npm run build` trước.

## Bản gốc và lịch sử

- `legacy/static/`: snapshot HTML/CSS/JavaScript/ảnh/font tại thời điểm bắt đầu chuyển đổi, dùng để đối chiếu hoặc khôi phục.
- `legacy/original-assets/`: thư mục tài nguyên gốc được chuyển khỏi root, giữ nguyên nội dung.
- `legacy/react-starter/`: bộ khung React mẫu ban đầu.

Source hoạt động nằm trong `src/`; không chỉnh các bản `legacy/` để thay đổi ứng dụng React. Các tệp HTML cũ đã được chuyển vào `legacy/`, không bị loại bỏ khỏi bản lưu trữ.

Thay đổi hiện chỉ nằm local trên branch `refactor/react-components`. Chưa commit, push hay triển khai Vercel.
