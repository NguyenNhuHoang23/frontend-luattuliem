import { useState } from "react";
import { changeMemberPassword } from "../api/member.js";

export default function MemberSettings({ session }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới.");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu mới tối thiểu 6 ký tự.");
      return;
    }
    if (password !== passwordConfirmation) {
      setError("Xác nhận mật khẩu mới không khớp.");
      return;
    }

    setSaving(true);
    try {
      const message = await changeMemberPassword({
        current_password: currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      });
      setSuccess(message || "Đã đổi mật khẩu thành công.");
      setCurrentPassword("");
      setPassword("");
      setPasswordConfirmation("");
    } catch (err) {
      setError(err.message || "Không đổi được mật khẩu.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="member-settings">
      <header className="member-settings-head">
        <h2>Cài đặt tài khoản</h2>
        <p>
          {session?.name ? (
            <>
              Đang đăng nhập: <strong>{session.name}</strong>
              {session.username ? ` · ${session.username}` : ""}
            </>
          ) : (
            "Quản lý thông tin đăng nhập của bạn."
          )}
        </p>
      </header>

      <section className="member-settings-card" aria-labelledby="member-password-title">
        <h3 id="member-password-title">Đổi mật khẩu</h3>
        <p className="member-settings-note">
          Nhập mật khẩu hiện tại và mật khẩu mới. Mật khẩu mới tối thiểu 6 ký tự.
        </p>
        <form className="member-settings-form" onSubmit={handleSubmit}>
          {error ? <p className="member-settings-error">{error}</p> : null}
          {success ? (
            <p className="member-settings-success" role="status">
              {success}
            </p>
          ) : null}
          <label>
            Mật khẩu hiện tại
            <input
              type="password"
              name="current_password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              required
            />
          </label>
          <label>
            Mật khẩu mới
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
            />
          </label>
          <label>
            Xác nhận mật khẩu mới
            <input
              type="password"
              name="password_confirmation"
              autoComplete="new-password"
              value={passwordConfirmation}
              onChange={(event) => setPasswordConfirmation(event.target.value)}
              minLength={6}
              required
            />
          </label>
          <button className="btn" type="submit" disabled={saving}>
            {saving ? "Đang lưu…" : "Lưu mật khẩu mới"}
          </button>
        </form>
      </section>
    </div>
  );
}
