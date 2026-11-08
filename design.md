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


Tài liệu của frontend React/Vite Luật Từ Liêm. Các quy định ghi lại quyết định thiết kế đã thống nhất và các luồng frontend đối chiếu với source ngày 06/11/2026. Khi chỉnh UI, kiểm tra component, dữ liệu API và CSS đang áp dụng trước khi dùng các thông số tham chiếu trong tài liệu. Việc frontend có tích hợp API không xác nhận backend của một môi trường cụ thể đang chạy.

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

Font nền tảng: **Liberation Sans Web**, dự phòng `Arial, Helvetica, sans-serif`. Các file font được lưu cùng dự án tại `src/assets/site/fonts/`, nạp bằng `@font-face` với `font-display: swap`. Trang chủ dùng **Be Vietnam Pro** với Liberation Sans Web làm font dự phòng. Một số dòng chữ trang trí ở đầu trang dùng **Playfair Display**.

Liberation Sans Web có bốn mặt chữ cục bộ: Regular 400, Bold 700, Italic 400 và Bold Italic 700. Kiểm tra font thực tế được trình duyệt nạp ở từng khu vực khi thay đổi độ đậm hoặc cỡ chữ.

Dùng chung font cho nội dung, nút, input, textarea, select và placeholder. Tránh việc biểu mẫu hoặc một trang riêng rơi về font hệ thống khác, gây chênh lệch giữa thiết bị.

### Phân cấp chữ đang sử dụng

| Thành phần | Desktop | Mobile / lưu ý |
| --- | --- | --- |
| Nội dung nền tảng | 15px, line-height 1.45 trong `base.css` | CSS theo trang có thể ghi đè; giữ khả năng đọc và xuống dòng tự nhiên |
| Tiêu đề hero | `clamp(35px, 3.65vw, 53px)`, line-height 1.22, đậm | `clamp(30px, 8vw, 39px)` khi chiều rộng ≤ 900px |
| Tiêu đề khối trang chủ | 32px, line-height 1.25 | 28px ở breakpoint ≤ 900px |
| Tiêu đề trang nội dung | Thường 24–26px, đậm | `clamp(21px, 5.6vw, 26px)` cho các tiêu đề được lớp responsive áp dụng |
| Tiêu đề ba tin có trích yếu | 21px, line-height 1.45 | 19px khi chiều rộng ≤ 600px |
| Tiêu đề danh sách tin | 17px, line-height 1.5 | Căn trái, có thể xuống dòng |
| Nhãn khối `.eyebrow` | 15px, đậm, chữ thường theo nội dung | Không viết hoa toàn bộ hoặc giãn chữ rộng |
| Số 01, 02, 03 | 26px, line-height 1 | Xanh nhạt, cùng một cột trên mobile |
| Nhãn biểu mẫu | Thường 13px, đậm | Đặt trên ô nhập |
| Ngày cập nhật, chú thích | Khoảng 12–13px | Không cạnh tranh với nội dung chính |

Tiêu đề dùng xanh hải quân hoặc xanh thương hiệu. Nội dung mô tả dùng xanh xám. Giữ khoảng cách đủ để dấu tiếng Việt không bị cắt. Theo yêu cầu mới, mọi tiêu đề được tạo mới hoặc chỉnh sửa phải hiển thị CHỮ IN HOA có đầy đủ dấu tiếng Việt; ưu tiên `text-transform: uppercase` và giữ nguyên dữ liệu nguồn. Ngoại lệ: các đề mục H2 trong bài Giới thiệu chỉ viết hoa chữ cái đầu câu. Kiểm tra desktop/mobile, cho phép xuống dòng tự nhiên; không tự viết hoa nhãn menu, nút hoặc đoạn văn và không tự giãn rộng chữ.

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

Thanh thông tin nhanh hiển thị giờ làm việc và thông điệp đồng hành. Hàng thương hiệu có logo và tên công ty bên trái; desktop có thông tin liên hệ theo cấu hình công ty và nút tư vấn bên phải. Header dùng chung trên các trang công khai; khi chỉnh kích thước logo hoặc chữ, kiểm tra `site-chrome.css` ở desktop, mobile và trạng thái sau khi cuộn.

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

Khối “Về chúng tôi” dùng mẫu đã duyệt: nền `#f6f9fd`, ảnh văn phòng luật bên trái và nội dung bên phải trên desktop. Tiêu đề “Gần hơn với khách hàng. / Rõ hơn trong từng việc.”, hai đoạn mô tả thường, nút “Đọc giới thiệu công ty”. Nhãn khối viết hoa nhỏ kèm nét vàng và nút viền vàng nhạt là ngoại lệ theo mẫu cho riêng khối này. Mobile xếp ảnh trước nội dung thành một cột, giữ chú thích ảnh và nút có vùng chạm tối thiểu 44px; đoạn cuối không dùng khung trích dẫn.

Hero desktop chia thành vùng chữ bên trái và ảnh tòa án bên phải. Vùng chữ gồm thông điệp chính, mô tả, các nút hành động và ba giá trị “Tận tâm”, “Minh bạch”, “Chuyên nghiệp”. **Khối chữ và nhóm nút căn trái**; không tự chuyển về căn giữa.

Ảnh hiển thị tự nhiên, không phủ gradient tối lên ảnh. Slider có chú thích và các nút chọn ảnh. `HeroSlider` tự chuyển sau khoảng 4,2 giây khi có nhiều ảnh và dừng khi rê chuột hoặc đưa focus vào vùng ảnh. Khi sửa slider, kiểm tra riêng hiệu ứng CSS và bộ đếm tự chuyển ảnh với tùy chọn giảm chuyển động.

Ba mục sau hero: “Tiếp nhận trực tiếp”, “Phạm vi công việc rõ ràng”, “Đồng hành tại địa phương”. Theo feedback mới, mỗi mục là một thẻ trắng có viền xanh xám, bo góc 12px, biểu tượng nét xanh bên trái: tai nghe, tài liệu có dấu kiểm và vị trí. Biểu tượng có nền xanh nhạt và đường phân cách mảnh với chữ. Desktop chia ba cột; mobile xếp dọc, cách nhau 12px và căn trái nội dung. Giữ liên kết từng thẻ đến đề mục tương ứng trong trang Giới thiệu; không thêm lại số thứ tự.

Các khối tiếp theo gồm giới thiệu, lĩnh vực hoạt động, tuyển dụng – hợp tác, bài viết – hoạt động và liên hệ. Nhãn khối dùng kiểu chữ thống nhất, không thêm lại các nhãn số “01 / ĐẤT ĐAI”, “02 / DÂN SỰ”, “03 / TỐ TỤNG” trong thẻ lĩnh vực.

Khối “Thông tin từ công ty” trên mobile: mỗi mục đóng/mở nằm trong một khung trắng có viền xanh xám, bo góc 12px, cách nhau 12px. Giữ dấu chỉ trạng thái và thao tác đóng/mở bằng `details`/`summary`, vùng bấm tiêu đề cao tối thiểu 44px. Khi mở, nội dung nằm bên trong cùng khung; desktop tiếp tục hiển thị ba thẻ bài viết.

Khối “Tuyển dụng – Hợp tác” trên trang chủ theo mẫu mới: nền trắng, nhóm nhãn và tiêu đề có nét xanh bên trái; mô tả nằm dưới. Ba vị trí xếp dọc thành thẻ xanh nhạt bo góc 12px, có biểu tượng cân công lý, nhóm người và cặp tài liệu bên trái, đường phân cách mảnh, mũi tên bên phải. Desktop giữ bố cục ngang hai cột: tiêu đề, mô tả và nút bên trái; ba thẻ bên phải. Mobile chuyển một cột, co giãn và xuống dòng tự nhiên. Giữ hành động mở biểu mẫu ứng tuyển theo vị trí.

### Giới thiệu `/gioi-thieu`

Danh sách Tin tức: mỗi tin có khung trắng, tiêu đề xuống dòng đầy đủ. Chỉ chia cột ảnh khi có ảnh tải được; tin không ảnh dùng toàn bộ chiều rộng, kể cả mobile. Không tự thêm ảnh minh họa không liên quan.

Bản nội dung Giới thiệu do người dùng cung cấp hiển thị một H1: “Công ty Luật TNHH MTV Từ Liêm — Kết nối luật sư và cộng tác viên địa phương”; ba đề mục trong bài dùng H2. Đây là tiêu đề nội dung được yêu cầu rõ, không phải khối tiêu đề SEO lặp lại. Vẫn cấm breadcrumb, ngày đăng/chuyên mục và mô tả đầu trang. Tiêu đề SEO và mô tả tìm kiếm lấy đúng bản người dùng gửi; nút cuối bài dẫn đến `/tuyen-dung`. Không tự chèn thêm đoạn giới thiệu CTA, ảnh hoặc nội dung ngoài bản đã duyệt.

Tiêu đề nội dung bài Giới thiệu dùng xanh thương hiệu `#10399a` theo phản hồi mới.

Đoạn mở đầu “Một người hiểu chuyện, một người hiểu luật, cùng phối hợp có thể giúp khách hàng bớt nhiều bước đường.” dùng chữ thường về độ đậm (400), giữ nguyên nội dung. Ngoại lệ theo phản hồi mới: các đề mục H2 trong bài Giới thiệu chỉ viết hoa chữ cái đầu câu, không viết hoa toàn bộ; mobile ≤ 900px dùng cỡ 18px, line-height 1.45 để giảm độ lớn.

Hai cụm “luật sư chuyên nghiệp và cộng tác viên tại địa phương” và “cộng tác viên hỗ trợ khách hàng hoặc cộng tác viên pháp lý” trong đoạn văn dùng độ đậm thường, theo ảnh phản hồi. Giữ nguyên chữ và cách nhấn mạnh ở những đoạn khác.


Giao diện lấy danh sách bài Giới thiệu qua API; `src/data/about.js` chứa nội dung cục bộ dùng để đối chiếu với bản đã duyệt. Giữ toàn bộ nội dung bài hiện có, không tạo bài giả. Tiêu đề cột bên phải ghi Tin tức, bỏ chữ mới nhất.

Nhãn menu chỉ ghi “Giới thiệu”. Đây là mục chung cho giới thiệu công ty, website, mô hình và chương trình hoạt động; các nội dung bổ sung sẽ được tổ chức tại đây khi có nội dung được duyệt.

Bài Giới thiệu bắt đầu trực tiếp bằng nội dung và các đề mục trong bài; desktop có cột Tin tức bên phải. Không hiển thị breadcrumb, tiêu đề bài lặp lại ở đầu trang, ngày đăng, chuyên mục hoặc dòng mô tả đầu trang. Tên bài mặc định dùng cho tiêu đề trình duyệt và heading ẩn; bản Giới thiệu được người dùng yêu cầu H1 cụ thể ở trên là ngoại lệ, hiển thị đúng một H1 nội dung. Giữ tên pháp nhân đầy đủ, nội dung bài và các đề mục bên trong. Không khôi phục các thành phần đã bỏ khi thay nội dung hoặc thêm bài mới.

### Tuyển dụng – Hợp tác `/tuyen-dung`

Tiêu đề hiển thị “TUYỂN LUẬT SƯ – CỘNG TÁC VIÊN” màu xanh thương hiệu trên một dòng; ở chiều rộng ≤ 600px, cỡ chữ co giãn theo màn hình để không tràn ngang. Chỉ đổi tiêu đề hiển thị, không đổi dữ liệu hoặc API tuyển dụng.

Theo phản hồi mobile mới, tăng nhẹ tiêu đề lên `clamp(15px, 4.8vw, 24px)`, letter-spacing -0.02em; giảm đoạn giới thiệu còn 14px, line-height 1.55. Giữ kiểu chữ và kích thước desktop hiện tại.

Bốn thẻ trong menu tuyển dụng giữ bố cục và thứ tự hiện có; thêm biểu tượng nền xanh nhạt bên trái và đường phân cách mảnh trước tên mục. Biểu tượng lần lượt theo nội dung: cân công lý cho cộng tác viên pháp lý, nhóm người cho cộng tác viên khách hàng, cặp tài liệu cho luật sư, tài liệu có bút cho hướng dẫn gửi hồ sơ. Mũi tên tròn nằm bên phải; giữ thao tác mở nội dung và biểu mẫu.

Thứ tự nội dung đã thống nhất: yêu cầu chung/nguyên tắc hợp tác → ba nhóm Luật sư cộng tác, Cộng tác viên hỗ trợ, Cộng tác viên pháp lý → biểu mẫu hồ sơ → tin tuyển dụng riêng lẻ ở cuối. Danh sách vị trí và tin tuyển dụng hiện được đọc qua API; giữ tin riêng tách khỏi các nhóm vị trí và kiểm tra trạng thái khi chưa có dữ liệu.

Có phần yêu cầu chung, nguyên tắc phối hợp, các vị trí hợp tác và biểu mẫu hồ sơ. Thẻ vị trí có tên, mô tả và hành động đăng ký; chọn vị trí đưa người dùng đến biểu mẫu và điền vị trí tương ứng. Bố cục responsive, nội dung dài xuống dòng tự nhiên.

Giữ các quy định trách nhiệm chuyên môn và nội dung tuyển dụng khi chỉ chỉnh giao diện. Biểu mẫu gọi API gửi hồ sơ và hiển thị trạng thái đang gửi, thành công hoặc lỗi theo phản hồi.

### Án lệ Án hay `/an-le`

Trên mobile, ba tab chi tiết Án lệ nằm trong một thanh nền xanh nhạt, cùng chiều cao tối thiểu 48px; tab đang chọn có nền trắng và nét xanh. Nhãn “Nội dung”, “Thuộc tính”, “Văn bản liên quan” giữ rõ ràng; không thay đổi chức năng chuyển tab.

Theo mẫu phản hồi mới đã xác nhận: một cột, tiêu đề “Danh sách án lệ – án hay” ở đầu cùng số kết quả; không có banner, breadcrumb, icon trang, icon danh sách hoặc icon từng bài. Thanh tìm kiếm gồm từ khóa/số hiệu, lĩnh vực và nút Tìm kiếm; sắp xếp Mới nhất/Cũ nhất theo publicationOrder. Lọc và tìm kiếm trên dữ liệu API hiện đang tải, lưu q/category/sort trong URL và đặt lại trang khi thay bộ lọc. Không có bộ lọc thời gian ban hành. Cụm tìm kiếm trình bày nhẹ trên nền trắng, không dùng khung nền xanh bao ngoài. Desktop đặt tìm kiếm/lĩnh vực/nút và sắp xếp cùng một hàng, giới hạn phần tìm kiếm tối đa 960px; dưới 1100px sắp xếp chuyển xuống hàng riêng. Mobile ô từ khóa chiếm một hàng, lĩnh vực và nút chung hàng khi đủ chỗ; đường phân cách mảnh ngăn với danh sách.

Mỗi trang tối đa 10 tin, xếp bài mới đăng trước, bài cũ sau bằng trường `publicationOrder` giảm dần. Trường này độc lập với năm ban hành án lệ và ngày sửa nội dung. Không hiển thị ngày giờ đăng hoặc dòng Cập nhật. Năm trong số hiệu án lệ vẫn giữ nguyên. Ba tin đầu của trang có tiêu đề, trích yếu và “Đọc tiếp”. Các tin tiếp theo không lặp lại đoạn trích yếu. Mọi bài hiển thị thành một hàng có tiêu đề, nhãn lĩnh vực và Đọc tiếp; desktop căn thành cột, mobile xuống dòng để đủ chỗ. Quyền Sửa/Xóa giữ nguyên. Nút Đăng bài chỉ hiện cho giám đốc; desktop đặt cùng hàng với thanh tìm kiếm/sắp xếp, mobile cùng hàng với nút Bộ lọc; tiêu đề chữ hoa luôn đứng đầu.

Bấm tiêu đề hoặc “Đọc tiếp” mở trang chi tiết `/an-le/:id`; thao tác “Tóm tắt” dùng hộp thoại. Khi tổng số tin vượt 10, hiện nút “Trước”, thông tin trang hiện tại và nút “Sau”; vô hiệu hóa nút khi đến đầu hoặc cuối. Trang hiện tại được lưu trong query `?page=2`.

### Liên hệ `/lien-he`

Tiêu đề phiếu tiếp nhận viết hoa và dùng xanh thương hiệu: “PHIẾU TIẾP NHẬN THÔNG TIN & YÊU CẦU HỖ TRỢ”.

Kiểu chữ tiêu đề phiếu đồng bộ tiêu đề nội dung Giới thiệu: Liberation Sans Web đậm 700, cỡ `clamp(22px, 2.1vw, 28px)`, 32px khi màn hình ≥ 1600px; line-height 1.35, letter-spacing 0.02em, khoảng cách dưới 8px, không có đường kẻ riêng dưới tiêu đề.

Biểu mẫu tiếp nhận thông tin và yêu cầu hỗ trợ, kèm thông tin văn phòng. Font phải đồng bộ với các trang khác. Trường bắt buộc có đánh dấu rõ; radio chọn phương thức tư vấn và danh sách tệp đính kèm phải dễ thao tác trên mobile.

Trang Liên hệ và khối liên hệ trên trang chủ gửi biểu mẫu qua API. Chỉ hiển thị thông báo đã gửi khi API trả về thành công. Dùng môi trường thử nghiệm hoặc phản hồi giả lập khi kiểm tra thao tác gửi.

### Diễn đàn `/dien-dan`

Diễn đàn ở `/dien-dan` là không gian trao đổi của thành viên, không nằm trong thanh menu chính. Khi frontend không có phiên đăng nhập, trang chuyển về `/thanh-vien`. Với phiên thực, giao diện lấy hội thoại và tin nhắn qua API; dữ liệu mẫu dùng trong kiểm thử không đại diện cho dữ liệu nội bộ thực tế.

Khi chỉnh giao diện diễn đàn, giữ khả năng tìm kiếm trong hội thoại, thao tác bàn phím, trạng thái gửi và lỗi, xem hoặc bỏ tệp đã chọn. Trình soạn tin hiện kiểm tra tối đa 5 tệp mỗi tin, mỗi tệp tối đa 10 MB. Đối chiếu hành vi từng loại hội thoại với component và API trước khi đổi thông báo. Không dùng việc ẩn nút ở frontend để thay thế kiểm tra quyền ở backend.

### Thành viên `/thanh-vien`

Mặc định hiển thị ngay hai ô **Tên đăng nhập** và **Mật khẩu**, nút **Đăng nhập**, cùng hai hành động **Ứng tuyển thành viên** và **Quên mật khẩu?**. Frontend gọi API khi gửi thông tin đăng nhập, hiển thị lỗi khi thất bại và chuyển đến `/dien-dan` sau khi đăng nhập thành công.

Không hiển thị hai nút “Xem mẫu CTV”, “Xem mẫu giám đốc”. Không tự chuyển sang màn hình “Nguyễn Văn A” sau khi nhập dữ liệu bất kỳ.

“Ứng tuyển thành viên” dẫn đến trang Tuyển dụng. “Quên mật khẩu?” mở hộp thoại nhập email hoặc số điện thoại đã đăng ký. Hộp thoại khôi phục chưa gọi API và phải tiếp tục thông báo rõ yêu cầu chưa được gửi.

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
| Kiểu theo trang | `src/styles/home.css`, `home-layout.css`, `about.css`, `cases.css`, `case-detail.css`, `recruitment.css`, `contact.css`, `member.css` |
| Font chung và responsive | `src/styles/responsive.css` |
| Điều chỉnh cho React, đầu trang, chân trang và khung màn hình rộng | `src/styles/react.css`, `site-chrome.css`, `wide-screen.css` |
| Cấu hình URL API và lời gọi API công khai | `src/api/config.js`, `src/api/public.js` |
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
- **Thành viên:** “Thẻ đăng nhập trắng đặt giữa nền xanh xám rất nhạt, logo nhỏ, hai nhãn và ô nhập hiện sẵn, nút xanh toàn chiều rộng; dưới nút có liên kết ứng tuyển thành viên và nút quên mật khẩu. Không có thông tin cá nhân giả định.”

Chỉnh từng phạm vi cụ thể, giữ lại thứ bậc nội dung và quyết định đã duyệt. Nếu có xung đột, ưu tiên yêu cầu mới nhất của người dùng; cập nhật tài liệu này theo thay đổi đã thống nhất thay vì tự khôi phục bố cục cũ.

## 9. Checklist khi tiếp tục chỉnh sửa

- Tên pháp nhân đúng: **Công ty Luật TNHH MTV Từ Liêm**.
- Tiếng Việt đầy đủ dấu; font thống nhất giữa các trang và biểu mẫu.
- Không tràn ngang ở mobile; nội dung dài xuống dòng tự nhiên.
- Khối chữ và nút hero căn trái; 01, 02, 03 căn trái trên mobile.
- Án lệ theo mẫu danh sách đã duyệt: tìm kiếm, lọc lĩnh vực, sắp xếp; không banner, icon trang/bài hoặc lọc thời gian ban hành.
- Hai ô đăng nhập hiển thị ngay; không có nút xem mẫu hoặc danh tính giả.
- Kiểm tra bàn phím, focus, đóng hộp thoại bằng Escape và nhãn trường nhập.
- Thông báo đúng trạng thái thực tế, phân biệt giao diện với xử lý backend.
- Chạy lint/build và kiểm thử phù hợp khi sửa code; kiểm tra đường dẫn trực tiếp sau khi triển khai.

### Đối chiếu giao diện bằng Playwright

1. Ghi rõ trang, trạng thái và ảnh tham chiếu đã duyệt. Với góp ý trong [Google Sheets](https://docs.google.com/spreadsheets/d/1VFqiKUgDQHYkewBo-ATkIX8L8N_gmn6TgA2_rJ25cr4/edit?gid=0#gid=0), ghi số dòng hoặc ảnh tương ứng. Xác nhận phạm vi của khung ảnh đầu trang, nguồn nội dung cũ của Giới thiệu và mức độ bám theo mẫu mobile nếu yêu cầu chưa rõ.
2. Chụp trước và sau ở **1440 × 1000** và **390 × 844** theo cấu hình Playwright. Khi thay đổi bố cục responsive, kiểm tra thêm 375px và hai phía của breakpoint bị ảnh hưởng; kiểm tra 1920px nếu sửa khung dùng chung trên màn hình rộng. Dùng cùng dữ liệu và trạng thái, chờ font và ảnh tải xong, chọn cùng ảnh slider để so sánh.
3. Đối chiếu đúng vùng sửa: logo, menu và đầu trang khi cuộn; vị trí chữ, nút, ảnh và dải giá trị trong hero mobile; khoảng cách danh sách và độ đều của thẻ liên quan ở trang Án lệ; chiều cao và trục căn lề của chân trang. Kiểm tra không tràn ngang, chữ có dấu không bị cắt, nút dùng được bằng bàn phím và focus rõ ràng.
4. Chạy spec liên quan bằng `npm run test:e2e -- tests/<tên-spec>.spec.js` (chọn file thật trong `tests/`). Dùng dữ liệu thử hoặc giả lập API cho luồng có ghi dữ liệu; kiểm tra trạng thái tải, trống và lỗi nếu vùng sửa phụ thuộc API. Lưu ảnh tạm trong `test-results/` và ghi lại trang, kích thước, dữ liệu và giới hạn xác minh. Ảnh được đối chiếu thủ công, trừ khi spec đã có phép so sánh ảnh tự động.

### Nội dung tuyển dụng đã thống nhất

Trang `/tuyen-dung` hiển thị đúng một H1 nội dung “Tuyển luật sư và cộng tác viên” theo yêu cầu riêng; không thêm khối tiêu đề hoặc metadata lặp lại. Các mục 1–5 và “Cách gửi hồ sơ ứng tuyển” dùng H2. Ba đề mục trong mỗi vị trí dùng H3: “Đối tượng và tiêu chuẩn”, “Công việc”, “Nguyên tắc thu nhập”. Giữ nguyên nội dung do Công ty cung cấp, không tự thêm thu nhập, hạn tuyển hoặc địa chỉ làm việc.

Ba nút gửi hồ sơ chọn sẵn vị trí tương ứng trong biểu mẫu, không yêu cầu tài khoản. Biểu mẫu có họ tên, điện thoại, email, vị trí, phạm vi hoạt động, giới thiệu ngắn và CV PDF. Frontend kiểm tra CV trước khi gửi biểu mẫu qua API; giữ giới hạn CV hiện có 25 MB và chỉ báo đã gửi khi API trả về thành công.

Tiêu đề SEO: “Tuyển luật sư và cộng tác viên | Công ty Luật Từ Liêm”. Mô tả tìm kiếm: “Luật Từ Liêm tuyển luật sư cộng tác, cộng tác viên khách hàng và pháp lý trên toàn quốc. Hợp tác theo vụ việc, ưu tiên luật sư Hà Nội. Gửi CV trực tuyến.” Không hiển thị hướng dẫn SEO trong bài, không gắn JobPosting cho trang giới thiệu ba vị trí. Trang công khai không đặt noindex; hồ sơ và dữ liệu nội bộ không được công khai.

### Responsive cho màn hình rộng

Khung chung dùng `--site-content-width: clamp(1200px, calc(100vw - 160px), 1600px)` và rộng tối đa 90% viewport. Header, menu, footer và các trang nội dung dùng cùng trục ngang. Ở ≤ 900px, giữ lề 16px và bố cục một cột.

Banner desktop nằm trong cùng khung giới hạn thay vì kéo ảnh đến mép màn hình; cột chữ/ảnh giữ tỷ lệ 46%/54%. Khối chữ và nút căn trái. Ở ≥ 1600px, chữ nội dung 17–18px, tiêu đề hero tối đa 64px; dòng văn bản dài giới hạn khoảng 80ch. Không phóng toàn bộ website bằng zoom hoặc transform.

Thanh công cụ Án lệ trên mobile: chữ ô tìm kiếm/lĩnh vực 14px, nút 13px; nhãn sắp xếp 12px và giá trị 13px. Giảm khoảng cách nội bộ, giữ vùng bấm nút tối thiểu 44px.

Trên mobile ≤ 600px, cụm tìm kiếm/lĩnh vực/sắp xếp Án lệ mặc định thu gọn sau nút “Bộ lọc”. Nút có aria-expanded/aria-controls, bấm để mở/đóng, giữ các giá trị đã chọn; hiển thị “Đang áp dụng” khi có tìm kiếm/lĩnh vực/thứ tự cũ nhất. Desktop vẫn hiển thị trực tiếp các điều khiển.

Mobile Án lệ: nút Bộ lọc bên trái và Đăng bài (khi có quyền) bên phải trên cùng một hàng; khi mở, các ô lọc hiện ở hàng bên dưới cả hai nút. Desktop đưa nút Đăng bài lên cùng hàng với cụm tìm kiếm/sắp xếp, ở bên phải.

## Đồng bộ tiêu đề chính theo phản hồi mới nhất

Năm tiêu đề xanh trên Trang chủ, Giới thiệu, Án lệ, Tuyển dụng và Liên hệ dùng chung `page-headings.css`: Be Vietnam Pro, đậm 700, line-height 1.2, letter-spacing -0.015em, màu thương hiệu và chữ hoa. Cỡ chữ lấy theo tiêu đề “Đồng hành cùng quyền lợi của bạn”: desktop clamp(2rem, 3.4vw, 2.9rem); từ 1600px clamp(38px, 2.8vw, 46px); dưới 900px clamp(22px, 6.2vw, 28px); dưới 640px 24px. Tiêu đề dài được xuống dòng tự nhiên, bao gồm Tuyển dụng. Quy định này thay thế các cỡ chữ riêng và yêu cầu ép Tuyển dụng một dòng trước đây. Không áp dụng cho đề mục H2 bên trong bài Giới thiệu, tiêu đề từng bài hoặc nhãn nút.

Điều chỉnh PC mới nhất: chỉ ở ≥ 901px, tiêu đề chính Giới thiệu, Án lệ và Tuyển dụng giảm 4px so với cỡ đồng bộ. Tiêu đề Liên hệ co theo chiều rộng nội dung thẻ (3.3cqi, tối đa cỡ đồng bộ trừ 4px) để vừa một dòng. Trang chủ và toàn bộ cỡ chữ mobile giữ nguyên. Font, độ đậm và màu xanh vẫn đồng bộ.
