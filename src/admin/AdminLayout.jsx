import { useEffect, useState } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { images } from "../data/images.js";
import { site } from "../data/site.js";
import { useAdminAuth } from "./auth.jsx";
import { useCms } from "./CmsProvider.jsx";
import { Icon } from "./components.jsx";
import { adminNav } from "./nav.js";

const titles = {
  "/admin/tong-quan": "Tổng quan",
  "/admin/trang-chu": "Trang chủ",
  "/admin/thong-tin": "Thông tin công ty",
  "/admin/gioi-thieu": "Cấu hình trang giới thiệu",
  "/admin/tin-tuc": "Tin tức",
  "/admin/tuyen-dung": "Tuyển dụng",
  "/admin/thanh-vien": "Thành viên",
  "/admin/tin-nhan": "Tin nhắn",
  "/admin/lien-he": "Liên hệ",
};

export default function AdminLayout() {
  const { session, logout } = useAdminAuth();
  const { data } = useCms();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const label = titles[location.pathname] || "Quản trị";
    document.title = `${label} | Quản trị Luật Từ Liêm`;
    setOpen(false);
  }, [location.pathname]);

  if (!session) {
    return (
      <Navigate
        to="/admin/dang-nhap"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  const newContacts = data.contacts.filter((item) => item.status === "moi").length;
  const badges = { contacts: newContacts };

  return (
    <div className={`admin-shell${open ? " sidebar-open" : ""}`}>
      {open ? (
        <button
          type="button"
          className="admin-sidebar-backdrop"
          aria-label="Đóng menu"
          onClick={() => setOpen(false)}
        />
      ) : null}
      <aside className="admin-sidebar">
        <Link className="admin-brand" to="/admin/tong-quan">
          <img src={images["assets/logo.jpg"]} alt="" />
          <span>
            <small>Quản trị</small>
            <strong>{site.brandName}</strong>
          </span>
        </Link>
        <nav className="admin-sidenav" aria-label="Menu quản trị">
          {adminNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `admin-nav-link${isActive ? " active" : ""}`
              }
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.badge && badges[item.badge] > 0 ? (
                <em>{badges[item.badge]}</em>
              ) : null}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <Link className="admin-nav-link" to="/">
            <Icon name="home" />
            <span>Xem website</span>
          </Link>
          <button
            type="button"
            className="admin-nav-link"
            onClick={async () => {
              await logout();
              navigate("/admin/dang-nhap");
            }}
          >
            <Icon name="logout" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>
      <div className="admin-main">
        <div className="admin-topbar">
          <button
            type="button"
            className="admin-icon-btn admin-menu-btn"
            aria-label="Mở menu"
            onClick={() => setOpen(true)}
          >
            <Icon name="menu" />
          </button>
          <div className="admin-topbar-title">
            {titles[location.pathname] || "Quản trị"}
          </div>
          <div className="admin-userchip">
            <span className="admin-avatar">QT</span>
            <span>
              <b>{session.name}</b>
              <small>{session.email}</small>
            </span>
          </div>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
