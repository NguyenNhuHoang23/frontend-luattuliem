export const site = {
  name: "Công ty Luật TNHH MTV Từ Liêm",
  brandPrefix: "Công ty Luật TNHH MTV",
  brandName: "Từ Liêm",
  phone: "091 602 99 66",
  phoneHref: "tel:0916029966",
  website: "luattuliem.vn",
  slogan: "Đồng hành cùng quyền lợi của bạn",
};

export const navigation = [
  { to: "/", label: "Trang chủ" },
  { to: "/gioi-thieu", label: "Giới thiệu" },
  { to: "/an-le", label: "Án lệ – Án hay" },
  { to: "/tuyen-dung", label: "Tuyển dụng – Hợp tác" },
  { to: "/thanh-vien", label: "Thành viên", member: true },
  { to: "/lien-he", label: "Liên hệ" },
];

export const pageMetadata = {
  "/": {
    title: "Công ty Luật Từ Liêm | Đồng hành cùng quyền lợi của bạn",
    description: "Mẫu giao diện website Công ty Luật TNHH MTV Từ Liêm.",
  },
  "/gioi-thieu": {
    title: "Giới thiệu Luật Từ Liêm | Kết nối luật sư và cộng tác viên",
    description:
      "Tìm hiểu mô hình Luật Từ Liêm: kết nối luật sư và cộng tác viên địa phương, phát huy kinh nghiệm, mở cơ hội hợp tác và đồng hành cùng khách hàng.",
  },
  "/gioi-thieu/tin": {
    title: "Tin tức | Công ty Luật Từ Liêm",
    description: "Tin tức Công ty Luật TNHH MTV Từ Liêm.",
  },
  "/an-le": {
    title: "Án lệ Án hay | Công ty Luật Từ Liêm",
    description:
      "Tuyển tập án lệ Tòa án nhân dân tối cao và các bản án thực tiễn tiêu biểu.",
  },
  "/tuyen-dung": {
    title: "Tuyển luật sư và cộng tác viên | Công ty Luật Từ Liêm",
    description:
      "Luật Từ Liêm tuyển luật sư cộng tác, cộng tác viên khách hàng và pháp lý trên toàn quốc. Hợp tác theo vụ việc, ưu tiên luật sư Hà Nội. Gửi CV trực tuyến.",
  },
  "/lien-he": {
    title: "Liên hệ & đặt lịch tư vấn pháp lý | Công ty Luật Từ Liêm",
    description:
      "Liên hệ Công ty Luật TNHH MTV Từ Liêm. Hotline: 091 602 99 66.",
  },
  "/thanh-vien": {
    title: "Thành viên | Công ty Luật Từ Liêm",
    description: "Không gian làm việc minh họa của Công ty Luật Từ Liêm.",
  },
  "/dien-dan": {
    title: "Không gian thành viên | Công ty Luật TNHH MTV Từ Liêm",
    description:
      "Tin nhắn, vụ việc và thu nhập trong không gian thành viên minh họa.",
  },
};

// Giữ liên kết cũ và chuyển sang đường dẫn gọn.
export const legacyRoutes = {
  "/index.html": "/",
  "/gioi-thieu.html": "/gioi-thieu",
  "/tuyen-dung.html": "/tuyen-dung",
  "/an-le.html": "/an-le",
  "/lien-he.html": "/lien-he",
  "/thanh-vien.html": "/thanh-vien",
};
