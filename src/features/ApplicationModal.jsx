import { useState } from "react";
import { submitPublicRecruitmentApplication } from "../api/public.js";
import { Modal } from "../components/Modal.jsx";
import { useToast } from "../components/toast-context.js";
import { validateRecruitmentCv } from "../utils/recruitmentCv.js";

export function ApplicationModal({ role, onClose }) {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const file = form.querySelector('input[name="cv"]')?.files?.[0];
    const cvError = await validateRecruitmentCv(file);
    if (cvError) {
      setError(cvError);
      return;
    }

    const payload = new FormData(form);
    payload.set("role", role || "");
    setSubmitting(true);
    setError("");
    try {
      await submitPublicRecruitmentApplication(payload);
      showToast("Đã gửi hồ sơ ứng tuyển.");
      form.reset();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      className="application-dialog"
      eyebrow="Gửi hồ sơ hợp tác"
      open={Boolean(role)}
      title={role || "Gửi hồ sơ hợp tác"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="role" value={role || ""} />
        <label>
          Họ và tên *<input name="fullName" required autoComplete="name" maxLength={120} />
        </label>
        <div className="formrow">
          <label>
            Điện thoại *
            <input name="phone" type="tel" required autoComplete="tel" maxLength={30} />
          </label>
          <label>
            Email *
            <input name="email" type="email" required autoComplete="email" maxLength={254} />
          </label>
        </div>
        <label>
          Phạm vi hoạt động *
          <input
            name="area"
            required
            maxLength={250}
            placeholder="Tỉnh/thành phố, địa bàn có thể tham gia"
          />
        </label>
        <label>
          Giới thiệu ngắn *
          <textarea name="experience" required maxLength={4000} />
        </label>
        <label>
          CV (PDF) *
          <input name="cv" type="file" required accept=".pdf,application/pdf" />
        </label>
        {error ? <p className="notice">{error}</p> : null}
        <button className="btn" disabled={submitting}>
          {submitting ? "Đang gửi hồ sơ…" : "Gửi hồ sơ ↗"}
        </button>
      </form>
    </Modal>
  );
}
