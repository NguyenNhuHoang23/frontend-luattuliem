import { useEffect, useMemo, useState } from "react";
import { fetchMemberApplicationCv } from "../api/member.js";
import {
  MemberDirectorySkeleton,
  MemberDossierSkeleton,
} from "../components/Skeleton.jsx";

const STATUS_LABEL = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Đã từ chối",
};

function sameId(left, right) {
  return left != null && right != null && String(left) === String(right);
}

function getInitials(name) {
  if (!name) return "UV";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function suggestUsername(name) {
  return String(name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 20);
}

export function randomMemberPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join(
    "",
  );
}

export function MemberApplicationList({
  applications,
  loading,
  error,
  selectedId,
  statusFilter,
  searchTerm,
  onSearch,
  onStatusFilter,
  onSelect,
}) {
  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return applications.filter((item) => {
      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      const matchSearch =
        !term ||
        String(item.name || item.fullName || "").toLowerCase().includes(term) ||
        (item.phone && item.phone.includes(term)) ||
        (item.email && item.email.toLowerCase().includes(term));
      return matchStatus && matchSearch;
    });
  }, [applications, searchTerm, statusFilter]);

  return (
    <>
      <div className="directory-search-box">
        <div className="directory-search-input-wrap">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="search-icon"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="search"
            placeholder="Tìm theo tên, điện thoại, email..."
            value={searchTerm}
            onChange={(event) => onSearch(event.target.value)}
            aria-label="Tìm hồ sơ ứng tuyển"
          />
        </div>
      </div>
      <div className="directory-filter-chips" role="tablist" aria-label="Lọc hồ sơ ứng tuyển">
        {[
          { id: "pending", label: "Chờ duyệt" },
          { id: "rejected", label: "Từ chối" },
          { id: "approved", label: "Đã duyệt" },
        ].map((chip) => (
          <button
            key={chip.id}
            type="button"
            className={`directory-chip ${statusFilter === chip.id ? "active" : ""}`}
            onClick={() => onStatusFilter(chip.id)}
          >
            {chip.label}
          </button>
        ))}
      </div>
      {error ? (
        <p className="member-empty" role="alert">
          {error}
        </p>
      ) : null}
      {loading ? (
        <MemberDirectorySkeleton />
      ) : (
        <div className="member-thread-list directory-list">
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const selected = sameId(selectedId, item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`member-thread-choice directory-item pending-card-item ${
                    selected ? "selected" : ""
                  }`}
                  aria-pressed={selected}
                  onClick={() => onSelect(item.id)}
                >
                  <div className="directory-item-avatar pending-avatar">
                    {getInitials(item.name)}
                  </div>
                  <div className="directory-item-info">
                    <div className="directory-item-row-top">
                      <strong>{item.name}</strong>
                      <span className="pending-badge-pill">
                        {STATUS_LABEL[item.status] || item.status}
                      </span>
                    </div>
                    <div className="directory-item-row-meta">
                      <span className="pending-applied-time">{item.createdAt || "—"}</span>
                    </div>
                    {item.role ? (
                      <p className="pending-note-preview">{item.role}</p>
                    ) : null}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="pending-empty-box">
              <p className="member-empty">
                {statusFilter === "pending"
                  ? "Chưa có hồ sơ ứng tuyển chờ duyệt."
                  : statusFilter === "rejected"
                    ? "Không có hồ sơ bị từ chối."
                    : "Chưa có hồ sơ đã duyệt."}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export function MemberApplicationDetail({
  application,
  loading,
  saving,
  error,
  onApprove,
  onReject,
  onBack,
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [area, setArea] = useState("");
  const [rejectNote, setRejectNote] = useState("");
  const [cvError, setCvError] = useState("");
  const [cvLoading, setCvLoading] = useState(false);

  useEffect(() => {
    if (!application) return;
    setUsername(suggestUsername(application.name));
    setPassword(randomMemberPassword());
    setArea(application.area || "Hà Nội");
    setRejectNote("");
    setCvError("");
  }, [application?.id]);

  async function openCv() {
    if (!application?.hasCv) return;
    setCvError("");
    setCvLoading(true);
    try {
      const url = await fetchMemberApplicationCv(application.id);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setCvError(err.message);
    } finally {
      setCvLoading(false);
    }
  }

  if (loading && !application) {
    return <MemberDossierSkeleton />;
  }

  if (!application) {
    return (
      <div className="member-no-selection pending-empty-detail">
        <h3>Chưa chọn hồ sơ</h3>
        <p>Chọn một hồ sơ ứng tuyển bên trái để xem thông tin và duyệt cấp tài khoản CTV.</p>
      </div>
    );
  }

  const pending = application.status === "pending";

  return (
    <section
      className="member-dossier-panel"
      aria-label={`Hồ sơ ứng tuyển của ${application.name}`}
    >
      <button type="button" className="member-back" onClick={onBack}>
        ← Danh sách hồ sơ
      </button>
      <div className="dossier-hero-header">
        <div className="dossier-hero-left">
          <div className="dossier-main-avatar pending-hero-avatar">
            {getInitials(application.name)}
          </div>
          <div>
            <div className="dossier-title-row">
              <h2>{application.name}</h2>
              <span
                className={`status-pill ${
                  application.status === "approved"
                    ? "status-active"
                    : application.status === "rejected"
                      ? "status-inactive"
                      : "status-pending-pill"
                }`}
              >
                <span className="status-dot"></span>
                {STATUS_LABEL[application.status] || application.status}
              </span>
            </div>
            <p className="pending-subtitle">
              Gửi lúc {application.createdAt || "—"}
              {application.reviewedAt ? ` · Xử lý ${application.reviewedAt}` : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="dossier-content-body">
        <div className="dossier-view-container">
          <div className="dossier-meta-card">
            <h3 className="section-dossier-title">Thông tin ứng viên</h3>
            <div className="dossier-meta-grid">
              <div className="meta-tile">
                <span className="meta-tile-label">Số điện thoại</span>
                <strong className="meta-tile-value">
                  <a href={`tel:${application.phone}`}>{application.phone || "—"}</a>
                </strong>
              </div>
              <div className="meta-tile">
                <span className="meta-tile-label">Email</span>
                <strong className="meta-tile-value">
                  {application.email ? (
                    <a href={`mailto:${application.email}`}>{application.email}</a>
                  ) : (
                    "—"
                  )}
                </strong>
              </div>
              <div className="meta-tile">
                <span className="meta-tile-label">Vị trí ứng tuyển</span>
                <strong className="meta-tile-value">{application.role || "—"}</strong>
              </div>
              <div className="meta-tile">
                <span className="meta-tile-label">Địa bàn</span>
                <strong className="meta-tile-value">{application.area || "—"}</strong>
              </div>
              {application.username ? (
                <div className="meta-tile">
                  <span className="meta-tile-label">Tài khoản đã cấp</span>
                  <strong className="meta-tile-value">{application.username}</strong>
                </div>
              ) : null}
            </div>
          </div>

          <div className="dossier-note-card">
            <h3 className="section-dossier-title">Giới thiệu / kinh nghiệm</h3>
            <blockquote className="pending-note-quote">
              {application.experience || application.request || "Không có nội dung."}
            </blockquote>
            {application.hasCv ? (
              <p>
                <button
                  type="button"
                  className="btn-dossier-action"
                  onClick={openCv}
                  disabled={cvLoading}
                >
                  {cvLoading ? "Đang mở CV…" : `Xem CV${application.cvFileName ? `: ${application.cvFileName}` : ""}`}
                </button>
              </p>
            ) : (
              <p className="pending-subtitle">Ứng viên chưa đính kèm CV.</p>
            )}
            {cvError ? (
              <p role="alert" className="member-dialog-error">
                {cvError}
              </p>
            ) : null}
          </div>

          {application.status === "rejected" && application.reviewNote ? (
            <div className="dossier-note-card">
              <h3 className="section-dossier-title">Lý do từ chối</h3>
              <p className="pending-note-quote">{application.reviewNote}</p>
            </div>
          ) : null}

          {pending ? (
            <>
              <div className="dossier-info-guide-card">
                <div className="guide-text">
                  <strong>Cấp tài khoản CTV sau khi duyệt</strong>
                  <p>
                    Hồ sơ đến từ form tuyển dụng. Giám đốc đặt tên đăng nhập và mật khẩu, rồi gửi
                    lại cho thành viên khi chấp thuận.
                  </p>
                </div>
              </div>
              <form
                className="dossier-inline-edit-box"
                onSubmit={(event) => {
                  event.preventDefault();
                  onApprove({
                    username: username.trim(),
                    password,
                    area: area.trim(),
                  });
                }}
              >
                <h3 className="section-dossier-title">Cấp tài khoản</h3>
                <div className="form-grid-2">
                  <div className="form-group-item">
                    <label htmlFor="approveUsername">Tên đăng nhập *</label>
                    <input
                      id="approveUsername"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      required
                      autoComplete="off"
                    />
                  </div>
                  <div className="form-group-item">
                    <label htmlFor="approvePassword">Mật khẩu *</label>
                    <div className="password-with-action">
                      <input
                        id="approvePassword"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        minLength={6}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="btn-dossier-action"
                        onClick={() => setPassword(randomMemberPassword())}
                      >
                        Tạo lại
                      </button>
                    </div>
                  </div>
                </div>
                <div className="form-group-item">
                  <label htmlFor="approveArea">Địa bàn công tác</label>
                  <input
                    id="approveArea"
                    value={area}
                    onChange={(event) => setArea(event.target.value)}
                  />
                </div>
                <div className="form-group-item">
                  <label htmlFor="rejectNote">Ghi chú từ chối (nếu không duyệt)</label>
                  <textarea
                    id="rejectNote"
                    rows={3}
                    value={rejectNote}
                    onChange={(event) => setRejectNote(event.target.value)}
                    maxLength={2000}
                  />
                </div>
                {error ? (
                  <p role="alert" className="member-dialog-error">
                    {error}
                  </p>
                ) : null}
                <div className="inline-edit-actions">
                  <button
                    type="button"
                    className="btn-dossier-action btn-hero-reject"
                    disabled={saving}
                    onClick={() => onReject(rejectNote)}
                  >
                    Từ chối
                  </button>
                  <button
                    type="submit"
                    className="btn-dossier-action btn-hero-approve"
                    disabled={saving}
                  >
                    {saving ? "Đang xử lý…" : "Duyệt và cấp tài khoản"}
                  </button>
                </div>
              </form>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
