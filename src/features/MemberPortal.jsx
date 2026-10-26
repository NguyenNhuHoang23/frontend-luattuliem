import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { images } from "../data/images.js";
import { Modal } from "../components/Modal.jsx";
import { useMemberAuth } from "./memberAuth.jsx";
import { memberGroups } from "../admin/nav.js";

function AccountRequest({ mode }) {
  const registration = mode === "register";
  const [notice, setNotice] = useState("");
  return (
    <form
      className="member-request"
      onSubmit={(event) => {
        event.preventDefault();
        setNotice(
          registration
            ? "Chưa gửi yêu cầu đăng ký. Bản local chưa kết nối hệ thống tiếp nhận; công ty sẽ xét duyệt và cấp tài khoản khi hệ thống hoạt động."
            : "Chưa gửi yêu cầu khôi phục mật khẩu. Bản local chưa kết nối hệ thống hỗ trợ tài khoản.",
        );
      }}
    >
      <p className="notice">
        {registration
          ? "Công ty xét duyệt từng đề nghị và cấp tài khoản sau khi chấp thuận. Đăng ký không tự động kích hoạt tài khoản."
          : "Nhập email hoặc số điện thoại đã đăng ký để đề nghị hỗ trợ khôi phục mật khẩu."}
      </p>
      {registration ? (
        <>
          <label>
            Họ và tên
            <input
              name="fullName"
              required
              pattern=".*\S.*"
              autoComplete="name"
              maxLength={120}
            />
          </label>
          <label>
            Số điện thoại
            <input
              name="phone"
              type="tel"
              required
              pattern="[+]?[0-9][0-9 ]{7,18}[0-9]"
              autoComplete="tel"
            />
          </label>
          <label>
            Email
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              maxLength={254}
            />
          </label>
          <label>
            Nội dung đề nghị tham gia
            <textarea name="request" required rows={4} maxLength={2000} />
          </label>
        </>
      ) : (
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
      )}
      <p className="notice" id="member-request-note">
        Biểu mẫu local chưa kết nối hệ thống tiếp nhận. Thông tin chưa được gửi
        hoặc lưu.
      </p>
      <button className="btn" aria-describedby="member-request-note">
        {registration ? "Gửi đề nghị đăng ký" : "Yêu cầu khôi phục mật khẩu"}
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
  const [requestMode, setRequestMode] = useState(null);
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
            <button
              type="button"
              className="inline-link"
              onClick={() => setRequestMode("register")}
            >
              Đăng ký thành viên
            </button>
            <button
              type="button"
              className="inline-link"
              onClick={() => setRequestMode("recover")}
            >
              Quên mật khẩu?
            </button>
          </div>
        </form>
        <Modal
          open={Boolean(requestMode)}
          onClose={() => setRequestMode(null)}
          title={
            requestMode === "register" ? "Đăng ký thành viên" : "Quên mật khẩu"
          }
          className="member-account-dialog"
        >
          {requestMode ? (
            <AccountRequest key={requestMode} mode={requestMode} />
          ) : null}
        </Modal>
      </div>
    </main>
  );
}
