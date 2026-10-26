import { useRef, useState } from "react";
import { submitPublicRecruitmentApplication } from "../api/public.js";
import { validateRecruitmentCv } from "../utils/recruitmentCv.js";

export function RecruitmentApplicationForm({
  selectedRole,
  onRoleChange,
  roles = [],
  onSubmitted,
}) {
  const formRef = useRef(null);
  const inputRef = useRef(null);
  const selectionVersion = useRef(0);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  async function selectCv(event) {
    const input = event.currentTarget;
    const version = ++selectionVersion.current;
    const file = input.files?.[0];
    setFileName(file?.name || "");
    setFileError("");
    setStatus("");
    setChecking(true);
    input.setCustomValidity("Đang kiểm tra CV, vui lòng chờ.");
    const error = await validateRecruitmentCv(file);
    if (version !== selectionVersion.current) return;
    input.setCustomValidity(error);
    setFileError(error);
    setChecking(false);
  }

  async function submit(event) {
    event.preventDefault();
    const form = formRef.current || event.currentTarget;
    const version = selectionVersion.current;
    const error = await validateRecruitmentCv(inputRef.current?.files?.[0]);
    if (version !== selectionVersion.current) return;
    inputRef.current?.setCustomValidity(error);
    setFileError(error);
    if (error) {
      inputRef.current?.reportValidity();
      return;
    }
    const payload = new FormData(form);
    if (!payload.get("role") && selectedRole) {
      payload.set("role", selectedRole);
    }
    setSubmitting(true);
    try {
      await submitPublicRecruitmentApplication(payload);
      setStatus("Đã gửi hồ sơ ứng tuyển. Công ty sẽ liên hệ khi hồ sơ phù hợp.");
      form.reset();
      setFileName("");
      onRoleChange("");
      onSubmitted?.();
    } catch (err) {
      setStatus(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      id="recruitmentForm"
      ref={formRef}
      onSubmit={submit}
      onChange={() => setStatus("")}
      aria-describedby="recruitment-form-note"
    >
      <div className="form-group">
        <label className="form-label" htmlFor="selectedRole">
          Vị trí ứng tuyển <span className="req">*</span>
        </label>
        <select
          className="form-select"
          id="selectedRole"
          name="role"
          required
          value={selectedRole}
          onChange={(event) => onRoleChange(event.target.value)}
        >
          <option value="">-- Chọn vị trí ứng tuyển --</option>
          {roles.map((role) => (
            <option key={role.id} value={role.name}>
              {role.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="applicantName">
            Họ và tên <span className="req">*</span>
          </label>
          <input
            className="form-input"
            id="applicantName"
            name="fullName"
            required
            pattern=".*\S.*"
            maxLength={120}
            autoComplete="name"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="applicantPhone">
            Số điện thoại <span className="req">*</span>
          </label>
          <input
            className="form-input"
            id="applicantPhone"
            name="phone"
            type="tel"
            required
            maxLength={30}
            autoComplete="tel"
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="applicantEmail">
            Email <span className="req">*</span>
          </label>
          <input
            className="form-input"
            id="applicantEmail"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="workArea">
            Phạm vi hoạt động <span className="req">*</span>
          </label>
          <input
            className="form-input"
            id="workArea"
            name="area"
            required
            pattern=".*\S.*"
            maxLength={250}
            placeholder="Địa bàn bạn có thể nhận công việc"
          />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="bioText">
          Giới thiệu ngắn <span className="req">*</span>
        </label>
        <textarea
          className="form-textarea"
          id="bioText"
          name="experience"
          required
          maxLength={4000}
          rows={4}
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="cvAttachment">
          CV định dạng PDF <span className="req">*</span>
        </label>
        <div className="upload-wrapper">
          <input
            ref={inputRef}
            className="recruitment-cv-input"
            type="file"
            id="cvAttachment"
            name="cv"
            required
            accept=".pdf,application/pdf"
            onChange={selectCv}
            aria-describedby="cv-hint cv-error"
            aria-invalid={Boolean(fileError)}
          />
          <label className="recruitment-cv-picker" htmlFor="cvAttachment">
            <span className="upload-title">Chọn CV PDF</span>
            <span className="upload-hint" id="cv-hint">
              Một file PDF, tối đa 25 MB.
            </span>
            <span className="file-list-preview" id="cvFileList">
              {fileName ? `Đã chọn: ${fileName}` : "Chưa chọn file"}
            </span>
          </label>
        </div>
        <p
          className="recruitment-file-error"
          id="cv-error"
          role={fileError ? "alert" : undefined}
        >
          {fileError}
        </p>
        {checking ? (
          <p className="notice" role="status">
            Đang kiểm tra CV…
          </p>
        ) : null}
      </div>
      <p className="notice" id="recruitment-form-note">
        Hồ sơ gửi trực tuyến được chuyển về quản trị Hồ sơ ứng tuyển. Việc gửi
        hồ sơ chưa đồng nghĩa với việc được nhận hợp tác.
      </p>
      <button type="submit" className="btn-submit-app" disabled={checking || submitting}>
        {submitting ? "Đang gửi hồ sơ…" : "Gửi hồ sơ ứng tuyển"}
      </button>
      {status ? (
        <div className="recruitment-submit-feedback">
          <p className="recruitment-submit-status" role="status">
            {status}
          </p>
          <div className="recruitment-paper-action-box">
            <h4 className="recruitment-paper-title">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              Hoàn thiện hồ sơ giấy
            </h4>
            <p className="recruitment-paper-desc">
              Sau khi đăng ký online, ứng viên vui lòng tải{" "}
              <strong>Đơn đề nghị hợp tác CTV</strong> theo mẫu dưới đây để điền
              tay và gửi chuyển phát nhanh về văn phòng Công ty:
            </p>
            <div className="recruitment-paper-buttons">
              <a
                href="/documents/01_Don_de_nghi_hop_tac_CTV.docx"
                download="01_Don_de_nghi_hop_tac_CTV.docx"
                className="btn-download-paper"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Tải Đơn đề nghị hợp tác (.docx)
              </a>
              <a
                href="/documents/02_Mau_van_ban_chap_thuan_hop_tac_CTV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-preview-paper"
              >
                Xem trước mẫu chấp thuận (.pdf) ↗
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </form>
  );
}
