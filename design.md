---
name: Công ty Luật TNHH MTV Từ Liêm
colors:
  primary: '#10399a'
  on-primary: '#ffffff'
  heading: '#11284b'
  on-surface: '#24364d'
  on-surface-variant: '#65758b'
  background: '#ffffff'
  surface: '#f5f7fa'
  surface-container: '#f6f9fd'
  outline-variant: '#dce3ec'
  header-surface: '#f0f5fc'
  footer-surface: '#edf3fb'
  number-accent: '#7496c7'
  focus: '#d3a04a'
---

# Hệ thống thiết kế — Công ty Luật TNHH MTV Từ Liêm

> **Ràng buộc đã được duyệt:** Không tự thêm breadcrumb, tiêu đề trang/bài lặp lại, ngày đăng/chuyên mục hoặc mô tả đầu trang vào các trang nội dung. Các mẫu trang bài viết và gợi ý trong `.agents/skills/` không được dùng để khôi phục các phần này. Quy định cụ thể tại mục 6 có ưu tiên hơn các mô tả kiểu chữ chung. Tiêu đề nội dung bên trong bài, tiêu đề tin trong danh sách, ngày trong nội dung pháp lý và hero trang chủ vẫn được giữ.


Tài liệu tổng hợp từ source React đang sử dụng tại dự án `react-app`, cập nhật ngày 16/10/2026. Các quy định dưới đây ghi lại giao diện hiện tại và các quyết định đã thống nhất để tiếp tục chỉnh sửa nhất quán. Đây là tài liệu thiết kế, không phải xác nhận website đã có backend hoặc dữ liệu nghiệp vụ thực tế.

## 1. Thương hiệu và định hướng

**Tên đầy đủ, chính thức: Công ty Luật TNHH MTV Từ Liêm.** Dùng đúng tên này trong giới thiệu pháp nhân, thông tin công ty, tài liệu, biểu mẫu và nội dung cần xác định đơn vị cung cấp dịch vụ. Tên thương hiệu hiển thị gọn là “Từ Liêm”; một số nội dung hiện tại dùng “Công ty Luật Từ Liêm”. Các tên gọn không thay thế tên đầy đủ trong thông tin pháp nhân.

Thông điệp chính: **“Đồng hành cùng quyền lợi của bạn.”** Nội dung hỗ trợ: “Lắng nghe để hiểu đúng. Phân tích để làm rõ. Cùng bạn lựa chọn hướng giải quyết phù hợp.”

Giao diện trang trọng, rõ ràng, dễ tiếp cận. Nền sáng, chữ xanh đậm, ảnh tòa án và khoảng trắng tạo cảm giác chuyên nghiệp. Nội dung pháp lý cần dễ đọc, tiết chế trang trí; ưu tiên phân cấp tiêu đề, thông tin và hành động cụ thể.

Toàn bộ nội dung tiếng Việt phải đầy đủ dấu. Giữ cách xưng hô nhất quán, thông báo trực tiếp và không khẳng định kết quả khi hệ thống chưa xử lý thực tế.

## 2. Màu sắc và vai trò

| Vai trò | Màu | Cách sử dụng |
| --- | --- | --- |
| Xanh thương hiệu | `#10399a` — `--blue` | Tiêu đề hero, nút chính, liên kết, trạng thái điều hướng đang chọn |
| Xanh hải quân | `#11284b` — `--navy` | Tiêu đề nội dung, nhãn quan trọng, nền thông báo nổi |
| Chữ chính | `#24364d` — `--ink` | Nội dung đọc và chữ biểu mẫu |
| Chữ phụ | `#65758b` — `--muted` | Mô tả, ngày cập nhật, chú thích, hướng dẫn |
| Nền chính | `#ffffff` | Trang nội dung, thẻ, trường nhập liệu |
| Nền phụ | `#f5f7fa` — `--paper` | Khu vực thành viên và các vùng thông tin nhẹ |
| Nền khối trang chủ | `#f6f9fd` | Lĩnh vực hoạt động, bài viết và hoạt động |
| Nền thanh trên | `#f0f5fc` | Thanh tên công ty và khẩu hiệu |
| Nền chân trang | `#edf3fb` | Footer nền sáng, thông tin liên hệ |
| Đường phân cách | `#dce3ec` — `--line` | Viền thẻ, trường nhập, phân cách nội dung |
| Số thứ tự | `#7496c7` | Các mục 01, 02, 03 dưới hero |
| Focus bàn phím | `#d3a04a` | Viền focus của liên kết và nút; mobile đang dùng `#bd852d` |

Các sắc độ xanh xám gần nhau được gom theo vai trò ở bảng trên. Source từng trang vẫn có biến thể viền và nền nhẹ; khi thêm thành phần, ưu tiên token hiện có. Màu vàng chỉ đóng vai trò focus, không dùng làm màu chủ đạo.

Website hiện chưa có bộ token trạng thái thành công/cảnh báo/lỗi hoàn chỉnh. Với biểu mẫu hiện tại, phải giữ thông báo rõ bằng chữ, không dựa riêng vào màu hoặc dùng màu thành công cho thao tác chưa được gửi.

## 3. Kiểu chữ

### Font và khả năng hiển thị

Font dùng chung: **Liberation Sans Web**, dự phòng `Arial, Helvetica, sans-serif`. Các file font được lưu cùng dự án tại `src/assets/site/fonts/`, nạp bằng `@font-face` với `font-display: swap`.

Có bốn mặt chữ: Regular 400, Bold 700, Italic 400 và Bold Italic 700. Một số khai báo CSS dùng độ đậm 600 hoặc 800, nhưng dự án không có file font riêng cho hai độ đậm này. Không hiểu các giá trị đó là đã có đầy đủ bộ font tương ứng.

Dùng chung font cho nội dung, nút, input, textarea, select và placeholder. Tránh việc biểu mẫu hoặc một trang riêng rơi về font hệ thống khác, gây chênh lệch giữa thiết bị.

### Phân cấp chữ đang sử dụng

| Thành phần | Desktop | Mobile / lưu ý |
| --- | --- | --- |
| Nội dung nền tảng | 15px, line-height 1.65 | Giữ khả năng đọc và xuống dòng tự nhiên |
| Tiêu đề hero | `clamp(35px, 3.65vw, 53px)`, line-height 1.22, đậm | `clamp(30px, 8vw, 39px)` khi chiều rộng ≤ 900px |
| Tiêu đề khối trang chủ | 32px, line-height 1.25 | 28px ở breakpoint ≤ 900px |
| Tiêu đề trang nội dung | Thường 24–26px, đậm | `clamp(21px, 5.6vw, 26px)` cho các tiêu đề được lớp responsive áp dụng |
| Tiêu đề ba tin có trích yếu | 21px, line-height 1.45 | 19px khi chiều rộng ≤ 600px |
| Tiêu đề danh sách tin | 17px, line-height 1.5 | Căn trái, có thể xuống dòng |
| Nhãn khối `.eyebrow` | 15px, đậm, chữ thường theo nội dung | Không viết hoa toàn bộ hoặc giãn chữ rộng |
| Số 01, 02, 03 | 26px, line-height 1 | Xanh nhạt, cùng một cột trên mobile |
| Nhãn biểu mẫu | Thường 13px, đậm | Đặt trên ô nhập |
| Ngày cập nhật, chú thích | Khoảng 12–13px | Không cạnh tranh với nội dung chính |

Tiêu đề dùng xanh hải quân hoặc xanh thương hiệu. Nội dung mô tả dùng xanh xám. Giữ khoảng cách đủ để dấu tiếng Việt không bị cắt. Không tự chuyển toàn bộ tiêu đề, nhãn khối hoặc tên công ty sang chữ hoa giãn cách.

## 4. Bố cục và khoảng cách

### Hệ khung

Khung chung `.wrap` có chiều rộng tối đa **1200px**, thường dùng 90% chiều rộng màn hình. Một số trang nội dung khai báo 92%. Ở chiều rộng ≤ 900px, lớp responsive chuyển khung chung về `calc(100% - 32px)`, tương đương lề 16px mỗi bên.

Trang Giới thiệu, Tuyển dụng và Liên hệ dùng nội dung chính cùng cột thông tin bên phải trên desktop; khi màn hình hẹp chuyển thành một cột. Cột phụ không được ép nội dung chính tràn ngang.

Trang Án lệ Án hay dùng một cột nội dung, chung khung nội dung co giãn từ **1200px đến 1600px** với Giới thiệu, Tuyển dụng và Liên hệ. Các khung nội dung cùng lề ngang và điểm bắt đầu bên dưới menu; tin đầu Án lệ không có padding phía trên riêng. Thanh cuộn có vùng dự phòng ổn định; menu dự phòng bề rộng chữ đậm để tránh dịch chuyển khi đổi trang. Trang Thành viên dùng thẻ đăng nhập rộng tối đa **460px**, đặt giữa theo chiều ngang.

### Khoảng trắng

Các khối trang chủ thường dùng khoảng đệm dọc 80px trên desktop; lớp responsive giảm các vùng liên quan xuống khoảng 40px ở ≤ 900px. Khoảng cách nội bộ phổ biến gồm 8, 12, 16, 20, 24, 28 và 32px. Source hiện dùng các giá trị cụ thể theo thành phần, chưa có hệ token spacing tập trung.

Thẻ nội dung thường có đệm 22–28px; thẻ đăng nhập 36px trên desktop và 24px × 20px trên mobile. Ưu tiên khoảng trắng và đường phân cách mảnh thay cho nhiều khung lồng nhau.

### Breakpoint

| Ngưỡng | Hành vi chính |
| --- | --- |
| 901–1100px | Giảm khoảng cách điều hướng; các trang hai cột thu cột phụ còn khoảng 300px |
| ≤ 900px | Menu thu gọn, hero xếp dọc, các lưới chính chuyển một cột, lề chung 16px |
| ≤ 800px | Một số quy tắc bổ sung cho form, footer và thành phần cũ |
| ≤ 600px | Tinh chỉnh tiêu đề tin, phân trang và biểu mẫu thành viên |
| ≥ 1600px | Khung chung mở rộng tối đa 1600px, tăng nhẹ chữ nội dung, hero cao tối thiểu 600px |

Các breakpoint được kế thừa qua CSS layers; cần kiểm tra quy tắc cuối cùng có hiệu lực khi chỉnh sửa. Các chiều rộng kiểm tra thực tế nên gồm 375, 390, 430, 768, 1024 và 1440px.

## 5. Thành phần dùng chung

### Header và điều hướng

Thanh trên hiển thị tên công ty và thông điệp đồng hành. Hàng thương hiệu có logo bên trái, chữ thương hiệu kế bên; desktop có số điện thoại liên hệ bên phải. Logo dùng chung kích thước trên mọi trang: 108px ở desktop, 76px khi màn hình ≤ 900px và 60px khi ≤ 360px; không đổi kích thước theo đường dẫn.

Thứ tự điều hướng: **Trang chủ → Giới thiệu → Án lệ – Án hay → Tuyển dụng – Hợp tác → Thành viên → Liên hệ**. Giữ chữ có dấu và thứ tự đã thống nhất.

Trang đang mở được đánh dấu bằng chữ xanh đậm, gạch dưới và `aria-current="page"`. Ở ≤ 900px, hiển thị nút Menu; các liên kết xếp dọc khi mở. Menu đóng khi đổi trang hoặc nhấn Escape; Escape trả focus về nút mở menu.

### Nút và liên kết

Nút chính dùng nền xanh thương hiệu, chữ trắng, góc bo nhẹ khoảng 3px, chữ đậm. Nút chung có đệm khoảng 12px × 23px. Biến thể ghost dùng nền trong; liên kết phụ dùng chữ xanh, có gạch dưới khi cần thể hiện khả năng tương tác.

Nhãn hành động nêu rõ kết quả: “Gửi yêu cầu hỗ trợ”, “Đọc tiếp”, “Đăng nhập”, “Đăng ký thành viên”. Không dùng một nhãn chung cho nhiều thao tác khác nhau.

Thành phần tương tác trên mobile ưu tiên vùng chạm tối thiểu 44px; liên kết menu có chiều cao tối thiểu 48px. Đây là tiêu chí khi bổ sung hoặc rà soát thành phần, không phải khẳng định mọi nút hiện tại đã đạt ngưỡng này.

### Thẻ và đường phân cách

Thẻ trắng trên nền nhạt, viền xanh xám 1px, góc bo nhỏ khoảng 3–6px. Thẻ lĩnh vực trang chủ có đường nhấn xanh ở mép trên. Tránh bóng đổ mạnh; danh sách tin ưu tiên đường phân cách ngang và khoảng trắng.

### Biểu mẫu

Nhãn đặt trên trường nhập và có liên kết ngữ nghĩa bằng `label`. Trường có nền trắng, viền xanh xám, bo nhẹ 3px, padding thường 11px × 13px. Textarea cho phép tăng chiều cao. Desktop có thể đặt hai trường song song; mobile xếp thành một cột.

Dùng kiểu dữ liệu phù hợp như `email`, `tel`, `password` và `autocomplete`. Thông báo lỗi hoặc trạng thái phải cụ thể, có thể đọc bằng công nghệ hỗ trợ. Không điền sẵn danh tính người dùng giả hoặc tự coi người dùng là đã đăng nhập.

### Hộp thoại và thông báo

Hộp thoại dùng native `dialog`, nền trắng, lớp phủ xanh tối có độ trong, giới hạn chiều cao theo viewport và cuộn nội dung bên trong. Có tiêu đề được tham chiếu bằng ARIA, nút đóng rõ ràng và hỗ trợ Escape.

Hộp thoại tài khoản rộng tối đa 540px, mobile chừa 16px mỗi bên. Thông báo phản hồi của biểu mẫu thành viên đặt ngay trong form với `role="status"`. Toast chung đặt giữa ở gần đáy màn hình; không che thao tác quan trọng.

## 6. Quy định cho từng trang

Các trang nội dung không hiển thị cụm đầu trang gồm breadcrumb, tiêu đề trang lặp lại, ngày đăng và tên mục. Nội dung chính bắt đầu ngay sau khoảng đệm của trang. Tên trang chỉ giữ trong tiêu đề trình duyệt và heading ẩn phục vụ trình đọc màn hình. Bỏ cả dòng mô tả ngắn đầu trang (`page-subtitle`, `forum-desc`). Giữ tiêu đề và trích yếu bên trong từng bài, nhãn biểu mẫu, thông báo chức năng và hero trang chủ. Không khôi phục cụm đầu trang này khi thêm bài mới.


### Trang chủ `/`

Hero desktop chia thành vùng chữ bên trái và ảnh tòa án bên phải. Vùng chữ gồm nhãn công ty, thông điệp chính, mô tả và hai hành động. **Khối chữ và nhóm nút căn trái**; không tự chuyển về căn giữa.

Ảnh hiển thị tự nhiên, không phủ gradient tối lên ảnh. Slider có chú thích và các nút chọn ảnh. Hiện tự chuyển khoảng 3,2 giây, dừng khi hover hoặc focus; chuyển cảnh khoảng 0,75 giây. Khi phát triển thêm, cần xem xét tùy chọn giảm chuyển động, không coi đây là tính năng đã có.

Ba mục sau hero: “Tiếp nhận trực tiếp”, “Phạm vi công việc rõ ràng”, “Đồng hành tại địa phương”. Desktop chia ba cột và căn giữa từng mục. **Mobile xếp dọc, căn trái cả số và chữ**; cột số rộng 36px, khoảng cách sang chữ 17px. Ba số phải cùng một lề và ba phần chữ phải cùng một lề. Không thêm lại các đường chia dọc đã bỏ.

Các khối tiếp theo gồm giới thiệu, lĩnh vực hoạt động, tuyển dụng – hợp tác, bài viết – hoạt động và liên hệ. Nhãn khối dùng kiểu chữ thống nhất, không thêm lại các nhãn số “01 / ĐẤT ĐAI”, “02 / DÂN SỰ”, “03 / TỐ TỤNG” trong thẻ lĩnh vực.

### Giới thiệu `/gioi-thieu`

Bản nội dung Giới thiệu do người dùng cung cấp hiển thị một H1: “Công ty Luật TNHH MTV Từ Liêm — Kết nối luật sư và cộng tác viên địa phương”; ba đề mục trong bài dùng H2. Đây là tiêu đề nội dung được yêu cầu rõ, không phải khối tiêu đề SEO lặp lại. Vẫn cấm breadcrumb, ngày đăng/chuyên mục và mô tả đầu trang. Tiêu đề SEO và mô tả tìm kiếm lấy đúng bản người dùng gửi; nút cuối bài dẫn đến `/tuyen-dung`. Không tự chèn thêm đoạn giới thiệu CTA, ảnh hoặc nội dung ngoài bản đã duyệt.


Các bài xếp cũ trước, mới sau bằng `publicationOrder` tăng dần trong `src/data/about.js`. Giữ toàn bộ nội dung bài hiện có, không tạo bài giả. Tiêu đề cột bên phải ghi Tin tức, bỏ chữ mới nhất.

Nhãn menu chỉ ghi “Giới thiệu”. Đây là mục chung cho giới thiệu công ty, website, mô hình và chương trình hoạt động; các nội dung bổ sung sẽ được tổ chức tại đây khi có nội dung được duyệt.

Bài Giới thiệu bắt đầu trực tiếp bằng nội dung và các đề mục trong bài; desktop có cột Tin tức bên phải. Không hiển thị breadcrumb, tiêu đề bài lặp lại ở đầu trang, ngày đăng, chuyên mục hoặc dòng mô tả đầu trang. Tên bài mặc định dùng cho tiêu đề trình duyệt và heading ẩn; bản Giới thiệu được người dùng yêu cầu H1 cụ thể ở trên là ngoại lệ, hiển thị đúng một H1 nội dung. Giữ tên pháp nhân đầy đủ, nội dung bài và các đề mục bên trong. Không khôi phục các thành phần đã bỏ khi thay nội dung hoặc thêm bài mới.

### Tuyển dụng – Hợp tác `/tuyen-dung`

Thứ tự cố định: yêu cầu chung/nguyên tắc hợp tác → ba nhóm Luật sư cộng tác, Cộng tác viên hỗ trợ, Cộng tác viên pháp lý → biểu mẫu hồ sơ → tin tuyển dụng riêng lẻ ở cuối. Phần tin riêng lấy từ `recruitmentPosts` trong `src/data/recruitment.js`, tách khỏi các nhóm cố định; chưa có tin thì hiển thị trạng thái trống. Khi bổ sung bài, tăng `publicationOrder` theo thứ tự đăng.

Có phần yêu cầu chung, nguyên tắc phối hợp, các vị trí hợp tác và biểu mẫu hồ sơ. Thẻ vị trí có tên, mô tả và hành động đăng ký; chọn vị trí đưa người dùng đến biểu mẫu và điền vị trí tương ứng. Bố cục responsive, nội dung dài xuống dòng tự nhiên.

Các quy định trách nhiệm chuyên môn và nội dung tuyển dụng phải được giữ nguyên khi chỉ chỉnh giao diện. Biểu mẫu hiện tại là minh họa, chưa gửi hoặc lưu hồ sơ thực tế.

### Án lệ Án hay `/an-le`

Một mục tin tức đơn giản, một cột. **Không có ô tìm kiếm, bộ lọc lĩnh vực, danh mục phân loại hoặc cột phụ.**

Mỗi trang tối đa 10 tin, xếp bài mới đăng trước, bài cũ sau bằng trường `publicationOrder` giảm dần. Trường này độc lập với năm ban hành án lệ và ngày sửa nội dung. Không hiển thị ngày giờ đăng hoặc dòng Cập nhật. Năm trong số hiệu án lệ vẫn giữ nguyên. Ba tin đầu của trang có tiêu đề, trích yếu và “Đọc tiếp”. Các tin tiếp theo chỉ hiển thị danh sách tiêu đề, không lặp lại đoạn trích yếu.

Bấm tiêu đề hoặc “Đọc tiếp” mở nội dung bằng hộp thoại hiện có. Khi tổng số tin vượt 10, hiện nút “Trước”, thông tin trang hiện tại và nút “Sau”; vô hiệu hóa nút khi đến đầu hoặc cuối. Trang hiện tại được lưu trong query `?page=2`. Hiện dữ liệu có 5 tin nên chưa xuất hiện phân trang.

### Liên hệ `/lien-he`

Biểu mẫu tiếp nhận thông tin và yêu cầu hỗ trợ, kèm thông tin văn phòng. Font phải đồng bộ với các trang khác. Trường bắt buộc có đánh dấu rõ; radio chọn phương thức tư vấn và danh sách tệp đính kèm phải dễ thao tác trên mobile.

Không tự báo yêu cầu đã gửi thành công khi chưa có hệ thống tiếp nhận. Source hiện chỉ kiểm tra biểu mẫu và thông báo minh họa.

### Diễn đàn `/dien-dan`

Diễn đàn vẫn truy cập trực tiếp tại `/dien-dan`, không nằm trong thanh menu chính. Trang tái sử dụng giao diện trao đổi đã giữ lại, gồm Tin nhanh, Trao đổi vụ việc và Thông báo tài chính. Tiêu đề là “Diễn đàn”, không có lời chào tài khoản giả định, nút xem mẫu hoặc nút đăng xuất. Trang Thành viên vẫn dành cho giao diện đăng nhập.

Dữ liệu trong trang Diễn đàn là minh họa. Phản hồi thử chỉ tồn tại tạm thời trong bộ nhớ giao diện, mất khi tải lại hoặc rời trang; chưa có hệ thống lưu trữ hay phân quyền. Các mục minh họa không phải dữ liệu nội bộ thực tế.

Diễn đàn có nút icon kính lúp ở đầu khung hội thoại; mặc định ẩn ô nhập. Bấm icon sẽ mở ô tìm kiếm và tự focus; nhấn Escape đóng, xóa bộ lọc và trả focus về icon. Tìm kiếm trong kênh đang chọn, theo nội dung, người gửi và tên file; hỗ trợ nhập không dấu, hiển thị số kết quả, xóa tìm kiếm và trạng thái không tìm thấy. Khi đổi kênh, từ khóa được xóa. Thanh soạn tin đặt nút Đính kèm file có icon kẹp giấy ở trái và nút Gửi trao đổi có icon gửi ở phải, thông tin giới hạn file hiển thị nhỏ gọn. Nút Đính kèm file cho phép chọn tối đa 5 file, mỗi file tối đa 10 MB; có thể bỏ file trước khi gửi, gửi riêng file hoặc kèm nội dung. Mỗi tin có file hiển thị tên, dung lượng và liên kết tải xuống. Bản nháp được giữ riêng theo kênh trong phiên hiện tại. File chưa được tải lên máy chủ; liên kết tải xuống chỉ hoạt động trong phiên trình duyệt đã đính kèm, mất khi rời hoặc tải lại trang.

### Thành viên `/thanh-vien`

Mặc định hiển thị ngay hai ô **Tên đăng nhập** và **Mật khẩu**, nút **Đăng nhập**, cùng hai hành động **Đăng ký thành viên** và **Quên mật khẩu?**. Sau khi điền đủ hai ô, bấm Đăng nhập hoặc nhấn Enter sẽ chuyển đến `/dien-dan` để xem thử. Đây chỉ là điều hướng minh họa: không gửi hoặc lưu tên đăng nhập/mật khẩu, không tạo phiên xác thực và không bảo vệ đường dẫn diễn đàn.

Không hiển thị hai nút “Xem mẫu CTV”, “Xem mẫu giám đốc”. Không tự chuyển sang màn hình “Nguyễn Văn A” sau khi nhập dữ liệu bất kỳ.

Đăng ký mở hộp thoại gồm họ tên, số điện thoại, email và nội dung đề nghị tham gia. Quy trình dự kiến là công ty xét duyệt và cấp tài khoản; không tự kích hoạt sau khi đăng ký. Quên mật khẩu mở hộp thoại nhập email hoặc số điện thoại đã đăng ký.

**Trạng thái hiện tại:** chỉ có giao diện và kiểm tra dữ liệu nhập, chưa có backend xác thực, xét duyệt, lưu đơn đăng ký hoặc khôi phục mật khẩu. Khi bấm gửi phải thông báo rõ chưa gửi/chưa kết nối, không giả lập thành công. Chỉ hiển thị tên thành viên khi sau này có phiên đăng nhập hợp lệ.

## 7. Tài nguyên và tổ chức source

| Phạm vi | Nguồn chính |
| --- | --- |
| Tên công ty, menu, metadata | `src/data/site.js` |
| Khung website | `src/layouts/SiteLayout.jsx` |
| Header, footer, hộp thoại, toast | `src/components/` |
| Nội dung từng trang | `src/pages/` |
| Slider và các thành phần chức năng | `src/features/` |
| Dữ liệu tin án lệ, tuyển dụng, ảnh | `src/data/` |
| Logo, ảnh và font đang dùng | `src/assets/site/` |
| Kiểu nền tảng | `src/styles/base.css` |
| Kiểu theo trang | `src/styles/home.css`, `about.css`, `cases.css`, `recruitment.css`, `contact.css`, `member.css` |
| Font chung và responsive | `src/styles/responsive.css` |
| Điều chỉnh cho React | `src/styles/react.css` |
| Điểm nhập CSS và thứ tự layers | `src/index.css` |
| Bản HTML/CSS lưu đối chiếu | `legacy/` — không phải source giao diện đang chạy |

Thứ tự CSS layers: `base → pages → responsive → react`. Cần kiểm tra lớp ưu tiên trước khi thêm override. Tái sử dụng component và dữ liệu hiện có; chỉnh giao diện React trong source, không chỉnh HTML lưu trữ để thay đổi website.

Giữ nguyên logo và ảnh người dùng đã cung cấp. Các ảnh tòa án đang được tham chiếu qua `src/data/slides.js` và `src/data/images.js`. Không thay thế bằng ảnh tạo mới khi chưa có yêu cầu.

Website dùng React, Vite và React Router. Đường dẫn nội bộ ưu tiên dạng gọn, không có đuôi `.html`; các liên kết cũ được chuyển sang đường dẫn tương ứng. Hosting phục vụ bản build `dist`, có fallback về `index.html` để mở trực tiếp và tải lại các trang React.

## 8. Hướng dẫn tái tạo giao diện hoặc dùng với Stitch

Mô tả định hướng: “Website tiếng Việt cho Công ty Luật TNHH MTV Từ Liêm, trang trọng và gần gũi. Nền trắng cùng các mảng xanh rất nhạt, chữ sans-serif rõ ràng, tiêu đề xanh hải quân, nút xanh thương hiệu. Nhiều khoảng thở, góc bo nhỏ, ảnh tòa án chân thực. Bố cục nội dung căn trái, ưu tiên khả năng đọc và thao tác trên điện thoại.”

Ví dụ mô tả thành phần:

- **Hero:** “Chia hai vùng trên máy tính: thông điệp xanh đậm bên trái, ảnh tòa án bên phải; nội dung và hai hành động đều căn trái. Trên điện thoại xếp chữ trước, ảnh sau, giữ ảnh sáng tự nhiên.”
- **Tin án lệ:** “Một cột tin tức tiết chế. Ba bài đầu có tiêu đề và trích yếu; những bài sau là danh sách tiêu đề với đường phân cách mảnh. Cuối danh sách chỉ hiện phân trang khi có nhiều hơn một trang.”
- **Thành viên:** “Thẻ đăng nhập trắng đặt giữa nền xanh xám rất nhạt, logo nhỏ, hai nhãn và ô nhập hiện sẵn, nút xanh toàn chiều rộng; dưới nút có đăng ký chờ duyệt và quên mật khẩu. Không có thông tin cá nhân giả định.”

Chỉnh từng phạm vi cụ thể, giữ lại thứ bậc nội dung và quyết định đã duyệt. Nếu có xung đột, ưu tiên yêu cầu mới nhất của người dùng; cập nhật tài liệu này theo thay đổi đã thống nhất thay vì tự khôi phục bố cục cũ.

## 9. Checklist khi tiếp tục chỉnh sửa

- Tên pháp nhân đúng: **Công ty Luật TNHH MTV Từ Liêm**.
- Tiếng Việt đầy đủ dấu; font thống nhất giữa các trang và biểu mẫu.
- Không tràn ngang ở mobile; nội dung dài xuống dòng tự nhiên.
- Khối chữ và nút hero căn trái; 01, 02, 03 căn trái trên mobile.
- Án lệ giữ một mục tin tức, không thêm lại tìm kiếm hoặc chia lĩnh vực.
- Hai ô đăng nhập hiển thị ngay; không có nút xem mẫu hoặc danh tính giả.
- Kiểm tra bàn phím, focus, đóng hộp thoại bằng Escape và nhãn trường nhập.
- Thông báo đúng trạng thái thực tế, phân biệt giao diện với xử lý backend.
- Chạy lint/build và kiểm thử phù hợp khi sửa code; kiểm tra đường dẫn trực tiếp sau khi triển khai.

### Nội dung tuyển dụng đã thống nhất

Trang `/tuyen-dung` hiển thị đúng một H1 nội dung “Tuyển luật sư và cộng tác viên” theo yêu cầu riêng; không thêm khối tiêu đề hoặc metadata lặp lại. Các mục 1–5 và “Cách gửi hồ sơ ứng tuyển” dùng H2. Ba đề mục trong mỗi vị trí dùng H3: “Đối tượng và tiêu chuẩn”, “Công việc”, “Nguyên tắc thu nhập”. Giữ nguyên nội dung do Công ty cung cấp, không tự thêm thu nhập, hạn tuyển hoặc địa chỉ làm việc.

Ba nút gửi hồ sơ chọn sẵn vị trí tương ứng trong biểu mẫu, không yêu cầu tài khoản. Biểu mẫu có họ tên, điện thoại, email, vị trí, phạm vi hoạt động, giới thiệu ngắn và CV PDF. Bản local chỉ kiểm tra dữ liệu phía trình duyệt, chưa gửi hoặc lưu hồ sơ; không thông báo thành công giả. Giữ giới hạn CV hiện có 25 MB.

Tiêu đề SEO: “Tuyển luật sư và cộng tác viên | Công ty Luật Từ Liêm”. Mô tả tìm kiếm: “Luật Từ Liêm tuyển luật sư cộng tác, cộng tác viên khách hàng và pháp lý trên toàn quốc. Hợp tác theo vụ việc, ưu tiên luật sư Hà Nội. Gửi CV trực tuyến.” Không hiển thị hướng dẫn SEO trong bài, không gắn JobPosting cho trang giới thiệu ba vị trí. Trang công khai không đặt noindex; hồ sơ và dữ liệu nội bộ không được công khai.

### Responsive cho màn hình rộng

Khung chung dùng `--site-content-width: clamp(1200px, calc(100vw - 160px), 1600px)` và rộng tối đa 90% viewport. Header, menu, footer và các trang nội dung dùng cùng trục ngang. Ở ≤ 900px, giữ lề 16px và bố cục một cột.

Banner desktop nằm trong cùng khung giới hạn thay vì kéo ảnh đến mép màn hình; cột chữ/ảnh giữ tỷ lệ 46%/54%. Khối chữ và nút căn trái. Ở ≥ 1600px, chữ nội dung 17–18px, tiêu đề hero tối đa 64px; dòng văn bản dài giới hạn khoảng 80ch. Không phóng toàn bộ website bằng zoom hoặc transform.
