import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { images } from "../data/images.js";
import { Modal } from "../components/Modal.jsx";
import { useMemberAuth } from "./memberAuth.jsx";
import { memberGroups } from "../admin/nav.js";

function AccountRecover() {
  const [notice, setNotice] = useState("");
  return (
    <form
      className="member-request"
      onSubmit={(event) => {
        event.preventDefault();
        setNotice(
          "Chưa gửi yêu cầu khôi phục mật khẩu. Bản local chưa kết nối hệ thống hỗ trợ tài khoản.",
        );
      }}
    >
      <p className="notice">
        Nhập email hoặc số điện thoại đã đăng ký để đề nghị hỗ trợ khôi phục mật khẩu.
      </p>
      <label>
        Email hoặc số điện thoại đã đăng ký
        <input
          name="account"
          required
          autoComplete="username"
          maxLength={254}
          onInput={(event) => event.currentTarget.setCustomValidity("")}
          onChange={(event) => {
            const input = event.currentTarget;
            const value = input.value.trim();
            input.setCustomValidity(
              !value ||
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
                /^\+?[\d() .-]{9,20}$/.test(value)
                ? ""
                : "Vui lòng nhập email hoặc số điện thoại hợp lệ.",
            );
          }}
        />
      </label>
      <p className="notice" id="member-request-note">
        Biểu mẫu khôi phục mật khẩu chưa kết nối hệ thống hỗ trợ tài khoản.
      </p>
      <button className="btn" aria-describedby="member-request-note">
        Yêu cầu khôi phục mật khẩu
      </button>
      {notice ? (
        <p className="member-feedback" role="status">
          {notice}
        </p>
      ) : null}
    </form>
  );
}

export default function MemberPortal() {
  const [recoverOpen, setRecoverOpen] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { session, login } = useMemberAuth();
  const navigate = useNavigate();

  if (session) return <Navigate to="/dien-dan" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = new FormData(form);
    setError("");
    setSaving(true);
    try {
      const next = await login(
        String(payload.get("username") || "").trim(),
        String(payload.get("password") || ""),
      );
      navigate("/dien-dan", {
        replace: true,
        state: { role: next.role, name: next.name },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="portal" id="portal">
      <div className="wrap">
        <h1 className="page-heading-sr-only" id="portalTitle">
          Đăng nhập thành viên
        </h1>
        <form className="loginbox" onSubmit={handleSubmit}>
          <img src={images["assets/logo.jpg"]} alt="Luật Từ Liêm" width="70" />
          <h3>Chào mừng trở lại</h3>
          <label>
            Tên đăng nhập
            <input
              name="username"
              required
              pattern=".*\S.*"
              autoComplete="username"
              maxLength={50}
            />
          </label>
          <label>
            Mật khẩu
            <input
              name="password"
              required
              type="password"
              autoComplete="current-password"
            />
          </label>
          <p className="notice" id="member-login-note">
            Dùng tên đăng nhập và mật khẩu do công ty cấp. Vai trò:{" "}
            {Object.values(memberGroups).join(", ")}.
          </p>
          {error ? (
            <p className="member-feedback" role="alert">
              {error}
            </p>
          ) : null}
          <button className="btn" aria-describedby="member-login-note" disabled={saving}>
            {saving ? "Đang đăng nhập…" : "Đăng nhập"}
          </button>
          <div className="member-account-links">
            <Link className="inline-link" to="/tuyen-dung">
              Ứng tuyển thành viên
            </Link>
            <button
              type="button"
              className="inline-link"
              onClick={() => setRecoverOpen(true)}
            >
              Quên mật khẩu?
            </button>
          </div>
        </form>
        <Modal
          open={recoverOpen}
          onClose={() => setRecoverOpen(false)}
          title="Quên mật khẩu"
          className="member-account-dialog"
        >
          {recoverOpen ? <AccountRecover /> : null}
        </Modal>
      </div>
    </main>
  );
}
