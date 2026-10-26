export const people = [
  {
    id: "director",
    name: "Giám đốc",
    group: "director",
    phone: "091 602 99 66",
    email: "giamdoc@luattuliem.vn",
    area: "Hà Nội",
    status: "active",
    joinDate: "01/2024",
  },
  {
    id: "lawyer-a",
    name: "Luật sư A",
    group: "lawyer",
    phone: "091 234 56 01",
    email: "luatsua@luattuliem.vn",
    area: "Hà Nội",
    status: "active",
    joinDate: "03/2024",
  },
  {
    id: "lawyer-b",
    name: "Luật sư B",
    group: "lawyer",
    phone: "091 234 56 02",
    email: "luatsub@luattuliem.vn",
    area: "Hà Nội",
    status: "active",
    joinDate: "05/2024",
  },
  {
    id: "member-a",
    name: "Nguyễn Văn A",
    group: "support",
    phone: "098 765 43 01",
    email: "nguyenvana@luattuliem.vn",
    area: "Bắc Ninh",
    status: "active",
    joinDate: "08/2024",
  },
  {
    id: "member-b",
    name: "Đỗ Thu Trang",
    group: "support",
    phone: "098 765 43 02",
    email: "thutrang@luattuliem.vn",
    area: "Hải Dương",
    status: "active",
    joinDate: "10/2024",
  },
  {
    id: "legal-c",
    name: "CTV pháp lý C",
    group: "legal",
    phone: "097 111 22 03",
    email: "ctvphaplyc@luattuliem.vn",
    area: "Hà Nội",
    status: "active",
    joinDate: "12/2024",
  },
  {
    id: "legal-d",
    name: "CTV pháp lý D",
    group: "legal",
    phone: "097 111 22 04",
    email: "ctvphaplyd@luattuliem.vn",
    area: "TP. Hồ Chí Minh",
    status: "active",
    joinDate: "02/2025",
  },
];

const message = (id, authorId, content, time) => ({
  id,
  authorId,
  content,
  time,
  attachments: [],
});

export function initialWorkspace() {
  const privateThreads = people
    .filter((person) => person.id !== "director")
    .flatMap((person) => [
      {
        id: `direct-${person.id}`,
        type: "messages",
        ownerId: person.id,
        name: person.name,
        members: ["director", person.id],
        messages:
          person.id === "member-a"
            ? [
                message(
                  "quick-1",
                  "director",
                  "Em lưu ý nộp hồ sơ trước ngày 30/10 nhé.",
                  "08:30 · 13/10/2026",
                ),
                message(
                  "quick-2",
                  "member-a",
                  "Vâng anh, em đang hoàn thiện hồ sơ.",
                  "09:00 · 13/10/2026",
                ),
              ]
            : [
                message(
                  `quick-${person.id}`,
                  "director",
                  "Em cập nhật tiến độ công việc giúp anh nhé.",
                  "09:15 · 13/10/2026",
                ),
              ],
      },
      {
        id: `finance-${person.id}`,
        type: "income",
        ownerId: person.id,
        name: person.name,
        members: ["director", person.id],
        messages:
          person.id === "member-a"
            ? [
                message(
                  "pay-1",
                  "director",
                  "Đã thanh toán 10.000.000đ.",
                  "10:00 · 10/04/2026",
                ),
                message(
                  "pay-2",
                  "director",
                  "Đã gửi 5.000.000đ cho công việc vụ bà A.",
                  "11:00 · 23/06/2026",
                ),
              ]
            : [],
      },
    ]);
  return [
    ...privateThreads,
    {
      id: "vu-ba-a",
      type: "cases",
      name: "Vụ bà A",
      subtitle: "Hồ sơ khởi kiện",
      members: ["director", "lawyer-a", "member-a", "legal-c"],
      messages: [
        message(
          "case-1",
          "lawyer-a",
          "A nộp cho anh đơn khởi kiện nhé.",
          "08:00 · 03/09/2026",
        ),
        message("case-2", "member-a", "Vâng anh.", "09:00 · 03/09/2026"),
        message(
          "case-3",
          "director",
          "Sao không thấy phiếu tiếp nhận?",
          "21:00 · 06/09/2026",
        ),
        message(
          "case-4",
          "member-a",
          "Em gửi bổ sung phiếu tiếp nhận trong trao đổi này nhé.",
          "06:00 · 08/09/2026",
        ),
      ],
    },
    {
      id: "vu-ong-b",
      type: "cases",
      name: "Vụ ông B",
      subtitle: "Hồ sơ hợp đồng",
      members: ["director", "lawyer-b", "member-b", "legal-d"],
      messages: [
        message(
          "case-5",
          "lawyer-b",
          "Em đã đối chiếu hồ sơ và đang chuẩn bị bản tổng hợp.",
          "10:00 · 10/10/2026",
        ),
      ],
    },
  ];
}

export const initialPendingRequests = [
  {
    id: "req-1",
    name: "Luật sư Hoàng Minh Tuấn",
    group: "lawyer",
    phone: "0912 888 999",
    email: "tuan.hoang@luatsuhanoi.vn",
    area: "Hà Nội",
    appliedDate: "10:30 Hôm nay",
    note: "Có 8 năm kinh nghiệm tham gia tố tụng các vụ án dân sự và thương mại, mong muốn hợp tác cùng công ty.",
  },
  {
    id: "req-2",
    name: "Nguyễn Thị Lan",
    group: "legal",
    phone: "0988 777 666",
    email: "lan.nguyen@outlook.com",
    area: "Hà Nội",
    appliedDate: "Hôm qua",
    note: "Cử nhân Luật Hà Nội, mong muốn ứng tuyển vị trí Cộng tác viên nghiên cứu hồ sơ và tài liệu pháp lý.",
  },
];
