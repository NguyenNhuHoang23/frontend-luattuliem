import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { images } from "../../data/images.js";
import { site } from "../../data/site.js";
import { ADMIN_EMAIL, ADMIN_PASSWORD, useAdminAuth } from "../auth.jsx";

export default function LoginPage() {
  const { session, login } = useAdminAuth();
  const location = useLocation();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const from = location.state?.from || "/admin/tong-quan";

  useEffect(() => {
    document.title = "Đăng nhập quản trị | Luật Từ Liêm";
  }, []);

  if (session) return <Navigate to={from} replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError("");
    setSaving(true);
    try {
      await login(form.get("email"), form.get("password"));
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-login">
      <aside className="admin-login-aside">
        <img src={images["assets/logo.jpg"]} alt="" />
        <p className="admin-eyebrow" style={{ color: "#d3a04a" }}>
          Khu vực quản trị
        </p>
        <h1>{site.name}</h1>
        <p>Đăng nhập để quản lý nội dung website, thành viên, tin nhắn và hồ sơ tiếp nhận.</p>
      </aside>
      <div className="admin-login-panel">
        <form className="admin-login-card" onSubmit={handleSubmit}>
          <h2>Đăng nhập</h2>
          <p className="admin-muted">Dành cho quản trị viên Công ty Luật Từ Liêm.</p>
          {error ? <p className="admin-login-error">{error}</p> : null}
          <div className="admin-field">
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="username"
              required
              defaultValue={ADMIN_EMAIL}
            />
          </div>
          <div className="admin-field">
            <label htmlFor="admin-password">Mật khẩu</label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          <button className="admin-btn" type="submit" disabled={saving}>
            {saving ? "Đang đăng nhập…" : "Đăng nhập"}
          </button>
          <div className="admin-demo-box">
            Tài khoản quản trị:
            <br />
            <b>{ADMIN_EMAIL}</b>
            <br />
            Mật khẩu: <b>{ADMIN_PASSWORD}</b>
          </div>
        </form>
      </div>
    </div>
  );
}
