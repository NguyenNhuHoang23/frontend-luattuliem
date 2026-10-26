import { useEffect, useMemo, useState } from "react";
import {
  deleteRecruitmentApplication,
  fetchRecruitmentApplicationCv,
  getRecruitmentApplication,
  listRecruitmentApplications,
  updateRecruitmentApplicationStatus,
} from "../api.js";
import {
  ConfirmDialog,
  DataTable,
  Drawer,
  Field,
  PageHeader,
  Pagination,
  RowActions,
  SearchInput,
  StatusBadge,
  pageSlice,
} from "../components.jsx";
import { applicationStatuses } from "../nav.js";

function tone(status) {
  if (status === "moi") return "warn";
  if (status === "nhan") return "success";
  if (status === "tu-choi") return "danger";
  return "info";
}

export default function ApplicationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState(null);
  const [removing, setRemoving] = useState(null);
  const [detailError, setDetailError] = useState("");
  const [cvUrl, setCvUrl] = useState("");
  const [cvError, setCvError] = useState("");
  const [cvLoading, setCvLoading] = useState(false);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchStatus = status === "all" || item.status === status;
      const matchTerm =
        !term ||
        String(item.fullName || "").toLowerCase().includes(term) ||
        String(item.role || "").toLowerCase().includes(term) ||
        String(item.email || "").toLowerCase().includes(term);
      return matchStatus && matchTerm;
    });
  }, [items, query, status]);
  const paged = pageSlice(filtered, page);

  async function loadApplications() {
    setListError("");
    try {
      setItems(await listRecruitmentApplications());
    } catch (err) {
      setListError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    return () => {
      if (cvUrl) URL.revokeObjectURL(cvUrl);
    };
  }, [cvUrl]);

  async function openDetail(row) {
    setDetailError("");
    setCvError("");
    setCvLoading(Boolean(row.hasCv));
    if (cvUrl) URL.revokeObjectURL(cvUrl);
    setCvUrl("");
    setViewing(row);
    try {
      const detail = await getRecruitmentApplication(row.id);
      setViewing(detail);
      if (detail?.hasCv) {
        try {
          setCvUrl(await fetchRecruitmentApplicationCv(detail.id));
        } catch (err) {
          setCvError(err.message);
        }
      }
    } catch (err) {
      setDetailError(err.message);
    } finally {
      setCvLoading(false);
    }
  }

  async function changeStatus(event) {
    if (!viewing) return;
    const next = event.target.value;
    setDetailError("");
    try {
      const updated = await updateRecruitmentApplicationStatus(viewing.id, next);
      setViewing(updated);
      setItems((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (err) {
      setDetailError(err.message);
    }
  }

  async function confirmRemove() {
    if (!removing) return;
    setListError("");
    try {
      await deleteRecruitmentApplication(removing.id);
      setItems((current) => current.filter((item) => item.id !== removing.id));
      if (viewing?.id === removing.id) setViewing(null);
      setRemoving(null);
    } catch (err) {
      setRemoving(null);
      setListError(err.message);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Tuyển dụng"
        title="Hồ sơ ứng tuyển"
        description="Danh sách CV và đề nghị hợp tác gửi từ trang Tuyển dụng."
      />
      <div className="admin-toolbar">
        <SearchInput
          value={query}
          onChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
          placeholder="Tìm theo tên, vị trí, email"
        />
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
        >
          <option value="all">Tất cả trạng thái</option>
          {Object.entries(applicationStatuses).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      {listError ? <p className="admin-login-error">{listError}</p> : null}
      {loading ? <p className="admin-muted">Đang tải hồ sơ ứng tuyển…</p> : null}
      <DataTable
        rows={paged.rows}
        empty={loading ? "Đang tải…" : "Chưa có hồ sơ ứng tuyển."}
        columns={[
          {
            key: "fullName",
            label: "Ứng viên",
            render: (row) => (
              <div className="admin-title-cell">
                <b>{row.fullName}</b>
                <small>
                  {row.email} · {row.phone}
                </small>
              </div>
            ),
          },
          { key: "role", label: "Vị trí" },
          { key: "area", label: "Địa bàn" },
          { key: "createdAt", label: "Ngày gửi" },
          {
            key: "status",
            label: "Trạng thái",
            render: (row) => (
              <StatusBadge tone={tone(row.status)}>
                {applicationStatuses[row.status]}
              </StatusBadge>
            ),
          },
          {
            key: "actions",
            label: "",
            className: "col-actions",
            render: (row) => (
              <RowActions onView={() => openDetail(row)} onDelete={() => setRemoving(row)} />
            ),
          },
        ]}
      />
      <Pagination {...paged} onPage={setPage} />
      <Drawer
        open={Boolean(viewing)}
        title="Chi tiết hồ sơ"
        onClose={() => {
          setViewing(null);
          setCvError("");
          setCvLoading(false);
          if (cvUrl) URL.revokeObjectURL(cvUrl);
          setCvUrl("");
        }}
        footer={
          <button type="button" className="admin-btn ghost" onClick={() => setViewing(null)}>
            Đóng
          </button>
        }
      >
        {viewing ? (
          <div className="admin-detail">
            {detailError ? <p className="admin-login-error">{detailError}</p> : null}
            <dl>
              <dt>Họ tên</dt>
              <dd>{viewing.fullName}</dd>
              <dt>Vị trí</dt>
              <dd>{viewing.role}</dd>
              <dt>Điện thoại</dt>
              <dd>{viewing.phone}</dd>
              <dt>Email</dt>
              <dd>{viewing.email}</dd>
              <dt>Phạm vi hoạt động</dt>
              <dd>{viewing.area}</dd>
              <dt>CV</dt>
              <dd>{viewing.cvFileName || "—"}</dd>
              <dt>Ngày gửi</dt>
              <dd>{viewing.createdAt}</dd>
            </dl>
            <dt>File CV ứng viên</dt>
            {cvLoading ? <p>Đang tải CV…</p> : null}
            {cvError && !cvUrl ? <p className="admin-login-error">{cvError}</p> : null}
            {cvUrl ? (
              <>
                <div className="admin-cv-actions">
                  <a className="admin-btn ghost" href={cvUrl} target="_blank" rel="noreferrer">
                    Mở CV tab mới
                  </a>
                  <a
                    className="admin-btn ghost"
                    href={cvUrl}
                    download={viewing.cvFileName || "cv.pdf"}
                  >
                    Tải CV
                  </a>
                </div>
                <iframe
                  className="admin-cv-frame"
                  title={`CV ${viewing.fullName}`}
                  src={cvUrl}
                />
              </>
            ) : null}
            {!cvLoading && !cvUrl && !cvError ? <p>Ứng viên chưa gửi file CV.</p> : null}
            <dt>Giới thiệu</dt>
            <p>{viewing.experience}</p>
            <Field
              label="Cập nhật trạng thái"
              name="status"
              type="select"
              value={viewing.status}
              onChange={changeStatus}
              options={Object.entries(applicationStatuses).map(([value, label]) => ({
                value,
                label,
              }))}
            />
          </div>
        ) : null}
      </Drawer>
      <ConfirmDialog
        open={Boolean(removing)}
        title="Xóa hồ sơ?"
        message={removing ? `Xóa hồ sơ của ${removing.fullName}?` : ""}
        onClose={() => setRemoving(null)}
        onConfirm={confirmRemove}
      />
    </>
  );
}
