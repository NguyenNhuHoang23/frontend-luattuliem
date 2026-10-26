export const defaultHomePage = {
  hero: {
    title: "ĐỒNG HÀNH CÙNG\nQUYỀN LỢI CỦA BẠN.",
    subtitle:
      "Lắng nghe để hiểu đúng. Phân tích để làm rõ.\nCùng bạn lựa chọn hướng giải quyết phù hợp.",
    primaryButton: { label: "Gửi yêu cầu hỗ trợ ↗", href: "/lien-he" },
    secondaryButton: { label: "Tìm hiểu về chúng tôi", href: "/gioi-thieu" },
  },
  slides: [],
  principles: [
    {
      number: "01",
      title: "Tiếp nhận trực tiếp",
      text: "Mọi yêu cầu được gửi về công ty",
    },
    {
      number: "02",
      title: "Phạm vi công việc rõ ràng",
      text: "Trao đổi và thống nhất trước khi thực hiện",
    },
    {
      number: "03",
      title: "Đồng hành tại địa phương",
      text: "Kết nối nhân lực phù hợp với vụ việc",
    },
  ],
  intro: {
    eyebrow: "Về chúng tôi",
    title: "Gần hơn với khách hàng.\nRõ hơn trong từng việc.",
    body: "Công ty Luật TNHH MTV Từ Liêm hướng đến việc kết nối luật sư và cộng tác viên tại địa phương, giúp khách hàng thuận tiện hơn trong quá trình trao đổi và giải quyết công việc.",
    quote: "Tối ưu nguồn nhân lực địa phương,\nhướng đến lợi ích của khách hàng.",
  },
  fields: {
    eyebrow: "Lĩnh vực hoạt động",
    title: "Bắt đầu từ vấn đề của bạn",
    description:
      "Các nhóm lĩnh vực dưới đây là nội dung minh họa để duyệt bố cục, có thể điều chỉnh khi hoàn thiện website.",
    items: [
      {
        title: "Đất đai & nhà ở",
        description:
          "Trao đổi về quyền sử dụng đất, nhà ở và những vướng mắc liên quan.",
        buttonLabel: "Gửi yêu cầu →",
        buttonHref: "/lien-he",
      },
      {
        title: "Dân sự & gia đình",
        description:
          "Những vấn đề về hợp đồng, thừa kế, hôn nhân và quyền lợi cá nhân.",
        buttonLabel: "Gửi yêu cầu →",
        buttonHref: "/lien-he",
      },
      {
        title: "Tham gia tố tụng",
        description:
          "Tiếp nhận yêu cầu luật sư tham gia bảo vệ quyền và lợi ích hợp pháp.",
        buttonLabel: "Gửi yêu cầu →",
        buttonHref: "/lien-he",
      },
    ],
  },
  cooperate: {
    eyebrow: "Tuyển dụng – Hợp tác",
    title: "Cùng chuyên môn.\nChung trách nhiệm.",
    body: "Phát triển đội ngũ cộng tác viên tại địa phương, phối hợp theo từng vụ việc và phạm vi công việc được thống nhất.",
    notice:
      "CTV không phải luật sư không tự tư vấn pháp luật, thu tiền hoặc cam kết kết quả với khách hàng. Mọi việc được tiếp nhận và thống nhất qua công ty.",
    hint: "Chọn vị trí để mở mẫu gửi hồ sơ hợp tác.",
    roles: [
      {
        name: "Luật sư cộng tác",
        description: "Tham gia chuyên môn theo từng vụ việc.",
        buttonLabel: "Gửi hồ sơ luật sư",
      },
      {
        name: "Cộng tác viên hỗ trợ",
        description: "Kết nối khách hàng, hỗ trợ liên lạc với công ty.",
        buttonLabel: "Gửi hồ sơ cộng tác viên hỗ trợ",
      },
      {
        name: "Cộng tác viên pháp lý",
        description: "Hỗ trợ thực hiện công việc theo phân công.",
        buttonLabel: "Gửi hồ sơ cộng tác viên pháp lý",
      },
    ],
  },
  articles: {
    eyebrow: "Bài viết & hoạt động",
    title: "Thông tin từ công ty",
    items: [
      {
        summary: "Chuẩn bị thông tin khi gửi yêu cầu hỗ trợ",
        body: "Bạn có thể trình bày ngắn gọn sự việc, mong muốn cần giải quyết và cách thức liên hệ. Tài liệu liên quan có thể gửi kèm dưới dạng ảnh hoặc PDF.",
      },
      {
        summary: "Cách thức liên hệ và làm việc với công ty",
        body: "Gửi yêu cầu qua website hoặc liên hệ trực tiếp. Công ty tiếp nhận thông tin, trao đổi phạm vi công việc và thống nhất việc cung cấp dịch vụ.",
      },
      {
        summary: "Cơ hội hợp tác cùng công ty",
        body: "Công ty hướng đến mạng lưới cộng tác viên tại địa phương. Truy cập mục Tuyển dụng – Hợp tác để gửi thông tin theo vị trí phù hợp.",
      },
    ],
  },
  contact: {
    eyebrow: "Gửi yêu cầu – Liên hệ",
    title: "Hãy bắt đầu\nbằng một trao đổi.",
    body: "Để lại thông tin và nội dung cần hỗ trợ.",
    buttonLabel: "Gửi yêu cầu ↗",
    notice:
      "Yêu cầu được gửi về quản trị Liên hệ. Công ty sẽ liên hệ lại sau khi tiếp nhận.",
  },
};

export const services = defaultHomePage.fields.items;
export const homeRoles = defaultHomePage.cooperate.roles.map((role) => ({
  name: role.name,
  description: role.description,
  label: role.buttonLabel,
}));
