import { Link } from "react-router-dom";
import { useCms } from "../CmsProvider.jsx";
import { Icon, PageHeader, StatusBadge } from "../components.jsx";
import { applicationStatuses, contactStatuses } from "../nav.js";

function toneFor(status) {
  if (status === "moi") return "warn";
  if (status === "da-xu-ly" || status === "nhan") return "success";
  if (status === "tu-choi") return "danger";
  return "info";
}

export default function OverviewPage() {
  const { data, reset } = useCms();
  const stats = [
    { label: "Tin tức", value: data.news.length, to: "/admin/tin-tuc", hint: "bài viết" },
    { label: "Án lệ – Án hay", value: data.cases.length, to: "/admin/an-le", hint: "hồ sơ" },
    { label: "Thành viên", value: data.members.length, to: "/admin/thanh-vien", hint: "người" },
    {
      label: "Liên hệ mới",
      value: data.contacts.filter((item) => item.status === "moi").length,
      to: "/admin/lien-he",
      hint: "chưa xử lý",
    },
    {
      label: "Hồ sơ mới",
      value: data.applications.filter((item) => item.status === "moi").length,
      to: "/admin/ho-so-ung-tuyen",
      hint: "ứng tuyển",
    },
    {
      label: "Vị trí tuyển dụng",
      value: data.recruitmentRoles.length,
      to: "/admin/tuyen-dung",
      hint: "vị trí",
    },
    { label: "Kênh tin nhắn", value: data.threads.length, to: "/admin/tin-nhan", hint: "hội thoại" },
    {
      label: "Bài giới thiệu",
      value: data.about.length,
      to: "/admin/gioi-thieu",
      hint: "nội dung",
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Bảng điều khiển"
        title="Tổng quan"
        description="Theo dõi nhanh nội dung website, liên hệ và hồ sơ ứng tuyển."
        actions={
          <button
            type="button"
            className="admin-btn ghost"
            onClick={() => {
              if (window.confirm("Khôi phục dữ liệu minh họa ban đầu?")) reset();
            }}
          >
            <Icon name="reset" /> Khôi phục dữ liệu mẫu
          </button>
        }
      />
      <div className="admin-stats">
        {stats.map((stat) => (
          <Link className="admin-stat" key={stat.label} to={stat.to}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            <small>{stat.hint}</small>
          </Link>
        ))}
      </div>
      <div className="admin-grid-2">
        <section className="admin-card">
          <h2>Liên hệ gần đây</h2>
          {data.contacts.slice(0, 4).map((item) => (
            <p key={item.id} style={{ margin: "0 0 12px" }}>
              <b>{item.fullName}</b>{" "}
              <StatusBadge tone={toneFor(item.status)}>
                {contactStatuses[item.status]}
              </StatusBadge>
              <br />
              <span className="admin-muted">
                {item.createdAt} · {item.content}
              </span>
            </p>
          ))}
          <Link to="/admin/lien-he" className="admin-text-btn">
            Xem tất cả liên hệ
          </Link>
        </section>
        <section className="admin-card">
          <h2>Hồ sơ ứng tuyển gần đây</h2>
          {data.applications.slice(0, 4).map((item) => (
            <p key={item.id} style={{ margin: "0 0 12px" }}>
              <b>{item.fullName}</b>{" "}
              <StatusBadge tone={toneFor(item.status)}>
                {applicationStatuses[item.status]}
              </StatusBadge>
              <br />
              <span className="admin-muted">
                {item.role} · {item.createdAt}
              </span>
            </p>
          ))}
          <Link to="/admin/ho-so-ung-tuyen" className="admin-text-btn">
            Xem tất cả hồ sơ
          </Link>
        </section>
      </div>
    </>
  );
}
