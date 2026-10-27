export const adminNav = [
  { to: "/admin/tong-quan", label: "Tổng quan", icon: "overview" },
  { to: "/admin/trang-chu", label: "Trang chủ", icon: "home" },
  { to: "/admin/thong-tin", label: "Thông tin công ty", icon: "company" },
  { to: "/admin/gioi-thieu", label: "Trang giới thiệu", icon: "about" },
  { to: "/admin/tin-tuc", label: "Tin tức", icon: "news" },
  { to: "/admin/tuyen-dung", label: "Tuyển dụng", icon: "jobs" },
  { to: "/admin/thanh-vien", label: "Thành viên", icon: "members" },
  { to: "/admin/tin-nhan", label: "Tin nhắn", icon: "messages" },
  { to: "/admin/lien-he", label: "Liên hệ", icon: "contacts", badge: "contacts" },
];

export const memberGroups = {
  director: "Giám đốc",
  ctv: "CTV",
};

export const contactStatuses = {
  moi: "Mới",
  "da-lien-he": "Đã liên hệ",
  "da-xu-ly": "Đã xử lý",
};

export const applicationStatuses = {
  moi: "Mới",
  "dang-xem": "Đang xem",
  "phong-van": "Phỏng vấn",
  nhan: "Nhận hợp tác",
  "tu-choi": "Từ chối",
};

export const memberStatuses = {
  active: "Đang hoạt động",
  inactive: "Tạm khóa",
};

export const newsStatuses = {
  true: "Đã đăng",
  false: "Nháp",
};
