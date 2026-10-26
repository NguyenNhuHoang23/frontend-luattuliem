import { aboutArticles } from "../data/about.js";
import { cases } from "../data/cases.js";
import {
  recruitmentArticle,
  recruitmentPosts,
  recruitmentRoles,
} from "../data/recruitment.js";
import { people } from "../data/memberWorkspace.js";
import { internalChannels } from "../data/forumData.js";

export const newsSeed = [
  {
    id: "news-dat-dai-ha-noi",
    title:
      "Công ty Luật Từ Liêm tham gia bảo vệ thân chủ vụ việc đất đai Hà Nội",
    date: "13-10-2026",
    excerpt:
      "Luật sư và cộng tác viên phối hợp thu thập hồ sơ địa chính, bảo vệ quyền sử dụng đất hợp pháp của thân chủ.",
    image: "assets/cover.jpg",
    published: true,
  },
  {
    id: "news-chuan-bi-tai-lieu",
    title: "Hướng dẫn chuẩn bị tài liệu và chứng cứ khi gửi yêu cầu pháp lý",
    date: "10-10-2026",
    excerpt:
      "Những giấy tờ cần thiết giúp luật sư đánh giá nhanh vụ việc và đề xuất hướng xử lý phù hợp.",
    image: "assets/cover_3.jpg",
    published: true,
  },
  {
    id: "news-ngay-truyen-thong",
    title: "Chào mừng kỷ niệm Ngày Truyền thống Luật sư Việt Nam",
    date: "05-10-2026",
    excerpt:
      "Công ty Luật Từ Liêm gửi lời tri ân tới đội ngũ luật sư, cộng tác viên và khách hàng đã đồng hành.",
    image: "assets/cover_2.jpg",
    published: true,
  },
  {
    id: "news-luat-dat-dai",
    title: "Những điểm mới quan trọng trong Luật Đất đai và Luật Nhà ở hiện hành",
    date: "01-10-2026",
    excerpt:
      "Tóm tắt một số thay đổi người dân và doanh nghiệp cần lưu ý khi giao dịch nhà, đất.",
    image: "assets/about_team.jpg",
    published: true,
  },
];

export const contactSeed = [
  {
    id: "ct-1",
    fullName: "Nguyễn Văn An",
    phone: "0912 345 678",
    email: "nguyenvanan@gmail.com",
    address: "Phường Phú Diễn, Hà Nội",
    content:
      "Gia đình đang tranh chấp ranh giới thửa đất với hộ liền kề, mong luật sư tư vấn hồ sơ khởi kiện.",
    files: ["so-do-dat.jpg"],
    status: "moi",
    createdAt: "23-10-2026 09:15",
  },
  {
    id: "ct-2",
    fullName: "Trần Thị Hoa",
    phone: "0987 111 222",
    email: "hoa.tran@outlook.com",
    address: "TP. Hải Dương",
    content:
      "Muốn được tư vấn hợp đồng tặng cho nhà đất có điều kiện phụng dưỡng cha mẹ.",
    files: [],
    status: "da-lien-he",
    createdAt: "22-10-2026 16:40",
  },
  {
    id: "ct-3",
    fullName: "Phạm Quốc Bảo",
    phone: "0904 888 333",
    email: "",
    address: "Bắc Ninh",
    content:
      "Doanh nghiệp bị đối tác chậm thanh toán, cần hỗ trợ soạn thảo văn bản đòi nợ và phương án khởi kiện.",
    files: ["hop-dong-dich-vu.pdf"],
    status: "moi",
    createdAt: "21-10-2026 11:02",
  },
  {
    id: "ct-4",
    fullName: "Lê Minh Châu",
    phone: "0936 555 010",
    email: "chau.le@company.vn",
    address: "Cầu Giấy, Hà Nội",
    content: "Đặt lịch tư vấn tranh chấp lao động với người lao động nghỉ việc.",
    files: [],
    status: "da-xu-ly",
    createdAt: "18-10-2026 08:20",
  },
];

export const applicationSeed = [
  {
    id: "app-1",
    fullName: "Hoàng Minh Tuấn",
    phone: "0912 888 999",
    email: "tuan.hoang@luatsuhanoi.vn",
    role: "Luật sư cộng tác",
    area: "Hà Nội",
    experience:
      "8 năm kinh nghiệm tố tụng dân sự và thương mại, thuộc Đoàn Luật sư TP. Hà Nội.",
    cvFileName: "CV_HoangMinhTuan.pdf",
    status: "moi",
    createdAt: "23-10-2026 10:30",
  },
  {
    id: "app-2",
    fullName: "Nguyễn Thị Lan",
    phone: "0988 777 666",
    email: "lan.nguyen@outlook.com",
    role: "Cộng tác viên pháp lý",
    area: "Hà Nội",
    experience:
      "Cử nhân Luật, mong muốn hỗ trợ nghiên cứu hồ sơ và soạn thảo văn bản theo hướng dẫn luật sư.",
    cvFileName: "CV_NguyenThiLan.pdf",
    status: "dang-xem",
    createdAt: "22-10-2026 14:05",
  },
  {
    id: "app-3",
    fullName: "Đặng Văn Khoa",
    phone: "0973 222 111",
    email: "khoa.dang@gmail.com",
    role: "Cộng tác viên khách hàng",
    area: "Bắc Ninh, Hưng Yên",
    experience:
      "Am hiểu địa bàn, có mạng lưới khách hàng nhỏ lẻ cần hỗ trợ pháp lý đất đai.",
    cvFileName: "CV_DangVanKhoa.pdf",
    status: "phong-van",
    createdAt: "20-10-2026 09:48",
  },
  {
    id: "app-4",
    fullName: "Vũ Thanh Hà",
    phone: "0968 444 555",
    email: "ha.vu@luatsu.vn",
    role: "Luật sư cộng tác",
    area: "Hà Nội, Hòa Bình",
    experience: "Luật sư hành nghề 4 năm, thế mạnh đất đai và hành chính.",
    cvFileName: "CV_VuThanhHa.pdf",
    status: "tu-choi",
    createdAt: "12-10-2026 17:12",
  },
];

export function createDefaultCms() {
  return {
    version: 1,
    about: structuredClone(aboutArticles),
    news: structuredClone(newsSeed),
    cases: structuredClone(cases),
    recruitmentArticle: structuredClone(recruitmentArticle),
    recruitmentRoles: structuredClone(recruitmentRoles),
    recruitmentPosts: structuredClone(recruitmentPosts),
    members: structuredClone(people),
    threads: structuredClone(internalChannels),
    contacts: structuredClone(contactSeed),
    applications: structuredClone(applicationSeed),
  };
}
