export const internalChannels = [
  {
    id: "tin-nhanh",
    type: "broadcast",
    section: "Kênh thông tin chung",
    name: "Tin nhanh nội bộ",
    subtitle: "Chỉ đạo điều hành & nhắc việc văn phòng",
    statusText: "Đang hoạt động",
    participants: "Toàn thể Luật sư & Cộng tác viên",
    messages: [
      {
        id: "m-101",
        author: "Giám đốc",
        role: "Luật sư điều hành",
        avatar: "GĐ",
        time: "08:30, 13/10/2026",
        content:
          "Chào cả nhà, các nhóm phụ trách vụ việc lưu ý rà soát lại toàn bộ hồ sơ án sơ thẩm cần nộp trước ngày 30/10 nhé.",
        isOwn: false,
      },
      {
        id: "m-102",
        author: "Luật sư Minh",
        role: "Trưởng nhóm Đất đai",
        avatar: "LM",
        time: "09:05, 13/10/2026",
        content:
          "Vâng, nhóm đất đai đã hoàn thiện dự thảo đơn khởi kiện và trích lục bản đồ địa chính, chuẩn bị nộp Tòa án nhân dân quận trong sáng mai.",
        isOwn: false,
      },
      {
        id: "m-103",
        author: "CTV Nguyễn Văn A",
        role: "Cộng tác viên pháp lý",
        avatar: "VA",
        time: "09:20, 13/10/2026",
        content:
          "Em đã tổng hợp xong danh mục tài liệu chứng cứ kèm theo và đối chiếu sao y chứng thực đầy đủ rồi ạ.",
        isOwn: false,
      },
    ],
  },
  {
    id: "vu-ba-a",
    type: "case",
    section: "Hồ sơ trao đổi vụ việc",
    name: "Vụ bà A — Tranh chấp đất đai",
    subtitle: "Vụ án tranh chấp thừa kế & quyền sử dụng đất tại Từ Liêm",
    statusText: "Đang thụ lý",
    participants: "Giám đốc · Luật sư A · CTV Nguyễn Văn A",
    messages: [
      {
        id: "m-201",
        author: "Luật sư A",
        role: "Luật sư phụ trách",
        avatar: "LA",
        time: "08:00, 03/09/2026",
        content:
          "Em Nguyễn Văn A kiểm tra lại biên bản lấy lời khai người làm chứng và bản sao Giấy chứng nhận quyền sử dụng đất cũ trước khi nộp nhé.",
        isOwn: false,
      },
      {
        id: "m-202",
        author: "Nguyễn Văn A",
        role: "Cộng tác viên hỗ trợ",
        avatar: "NA",
        time: "09:00, 03/09/2026",
        content:
          "Vâng anh, em đã nộp trực tiếp tại bộ phận một cửa của Tòa án và đang chờ lịch hẹn lấy phiếu tiếp nhận đơn khởi kiện.",
        isOwn: false,
      },
      {
        id: "m-203",
        author: "Giám đốc",
        role: "Luật sư điều hành",
        avatar: "GĐ",
        time: "21:00, 06/09/2026",
        content:
          "Đã có phiếu tiếp nhận đơn khởi kiện và thông báo nộp tạm ứng án phí từ Thẩm phán thụ lý chưa em?",
        isOwn: false,
      },
      {
        id: "m-204",
        author: "Nguyễn Văn A",
        role: "Cộng tác viên hỗ trợ",
        avatar: "NA",
        time: "08:15, 07/09/2026",
        content:
          "Dạ sáng nay Tòa án đã giao thông báo nộp tạm ứng án phí, thân chủ đã hoàn thành nộp tiền tại Chi cục THADS và em đã nộp biên lai lại cho Tòa án rồi ạ.",
        isOwn: false,
      },
    ],
  },
  {
    id: "vu-ong-b",
    type: "case",
    section: "Hồ sơ trao đổi vụ việc",
    name: "Vụ ông B — Hợp đồng dịch vụ",
    subtitle: "Tranh chấp công nợ & phạt vi phạm hợp đồng vận chuyển",
    statusText: "Đang hòa giải",
    participants: "Giám đốc · Luật sư B · CTV Đỗ Thu Trang",
    messages: [
      {
        id: "m-301",
        author: "Luật sư B",
        role: "Luật sư phụ trách",
        avatar: "LB",
        time: "10:00, 10/10/2026",
        content:
          "Đã hoàn thành bản đối chiếu công nợ và văn bản đề xuất phương án hòa giải gửi cho phía bị đơn trước phiên họp công khai chứng cứ.",
        isOwn: false,
      },
      {
        id: "m-302",
        author: "Giám đốc",
        role: "Luật sư điều hành",
        avatar: "GĐ",
        time: "10:45, 10/10/2026",
        content:
          "Lưu ý đối chiếu mức phạt vi phạm hợp đồng theo Điều 301 Luật Thương mại (khống chế mức tối đa 8%) để lập luận bảo vệ quyền lợi cho thân chủ chuẩn xác nhé.",
        isOwn: false,
      },
    ],
  },
  {
    id: "vu-cty-hoang-long",
    type: "case",
    section: "Hồ sơ trao đổi vụ việc",
    name: "Công ty Hoàng Long — Pháp chế",
    subtitle: "Tư vấn rà soát hợp đồng thương mại & thỏa thuận NDA",
    statusText: "Đang tư vấn",
    participants: "Luật sư Thành · CTV Hoàng",
    messages: [
      {
        id: "m-401",
        author: "Luật sư Thành",
        role: "Luật sư tư vấn",
        avatar: "LT",
        time: "14:15, 14/10/2026",
        content:
          "Đã hoàn thiện bản ý kiến tư vấn pháp lý (Legal Opinion) về các rủi ro bảo mật thông tin và quyền sở hữu trí tuệ để gửi Tổng Giám đốc duyệt.",
        isOwn: false,
      },
    ],
  },
  {
    id: "tai-chinh",
    type: "finance",
    section: "Kênh thông tin chung",
    name: "Thông báo tài chính & Án phí",
    subtitle: "Tạm ứng chi phí tố tụng & quyết toán thù lao vụ việc",
    statusText: "Đang cập nhật",
    participants: "Ban Giám đốc · Kế toán · Đội ngũ Luật sư",
    messages: [
      {
        id: "m-501",
        author: "Giám đốc",
        role: "Luật sư điều hành",
        avatar: "GĐ",
        time: "10:00, 10/04/2026",
        content:
          "Đã phê duyệt thanh toán tạm ứng chi phí công tác xác minh thực địa và biên lai nộp tiền tạm ứng án phí vụ việc 10 triệu đồng.",
        isOwn: false,
      },
      {
        id: "m-502",
        author: "Kế toán văn phòng",
        role: "Bộ phận tài chính",
        avatar: "KT",
        time: "10:30, 10/04/2026",
        content:
          "Phiếu chi và chứng từ thanh toán đã được lưu trữ vào hồ sơ tài chính nội bộ văn phòng theo quy định.",
        isOwn: false,
      },
    ],
  },
];
