import { useEffect, useMemo, useState } from "react";
import {
  deleteContactMessage,
  fetchContactMessageFile,
  getContactMessage,
  listContactMessages,
  updateContactMessageStatus,
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
import { contactStatuses } from "../nav.js";

function tone(status) {
  if (status === "moi") return "warn";
  if (status === "da-xu-ly") return "success";
  return "info";
}

function isPdf(name) {
  return /\.pdf$/i.test(name || "");
}

function isImage(name) {
  return /\.(jpe?g|png)$/i.test(name || "");
}

function ellipsis(text, max = 40) {
  const value = String(text || "");
  return value.length > max ? `${value.slice(0, max)}…` : value;
}

export default function ContactsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState(null);
  const [removing, setRemoving] = useState(null);
  const [detailError, setDetailError] = useState("");
  const [fileUrls, setFileUrls] = useState([]);
  const [fileError, setFileError] = useState("");
  const [fileLoading, setFileLoading] = useState(false);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchStatus = status === "all" || item.status === status;
      const matchTerm =
        !term ||
        String(item.fullName || "").toLowerCase().includes(term) ||
        String(item.phone || "").includes(term) ||
        String(item.email || "").toLowerCase().includes(term) ||
        String(item.content || "").toLowerCase().includes(term);
      return matchStatus && matchTerm;
    });
  }, [items, query, status]);
  const paged = pageSlice(filtered, page);

  function revokeFiles(urls) {
    urls.forEach((file) => URL.revokeObjectURL(file.url));
  }

  async function loadContacts() {
    setListError("");
    try {
      setItems(await listContactMessages());
    } catch (err) {
      setListError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    return () => revokeFiles(fileUrls);
  }, [fileUrls]);

  async function openDetail(row) {
    setDetailError("");
    setFileError("");
    setFileLoading(Boolean(row.files?.length));
    revokeFiles(fileUrls);
    setFileUrls([]);
    setViewing(row);
    try {
      const detail = await getContactMessage(row.id);
      setViewing(detail);
      const files = detail?.files || [];
      if (files.length) {
        try {
          const urls = await Promise.all(
            files.map(async (file) => ({
              index: file.index,
              name: file.name,
              url: await fetchContactMessageFile(detail.id, file.index),
            })),
          );
          setFileUrls(urls);
        } catch (err) {
          setFileError(err.message);
        }
      }
    } catch (err) {
      setDetailError(err.message);
    } finally {
      setFileLoading(false);
    }
  }

  function closeDetail() {
    setViewing(null);
    setFileError("");
    setFileLoading(false);
    revokeFiles(fileUrls);
    setFileUrls([]);
  }

  async function changeStatus(event) {
    if (!viewing) return;
    const next = event.target.value;
    setDetailError("");
    try {
      const updated = await updateContactMessageStatus(viewing.id, next);
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
      await deleteContactMessage(removing.id);
      setItems((current) => current.filter((item) => item.id !== removing.id));
      if (viewing?.id === removing.id) closeDetail();
      setRemoving(null);
    } catch (err) {
      setRemoving(null);
      setListError(err.message);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Tiếp nhận"
        title="Danh sách liên hệ"
        description="Các yêu cầu tư vấn gửi từ trang Liên hệ."
      />
      <div className="admin-toolbar">
        <SearchInput
          value={query}
          onChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
          placeholder="Tìm theo tên, điện thoại, nội dung"
        />
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
        >
          <option value="all">Tất cả trạng thái</option>
          {Object.entries(contactStatuses).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      {listError ? <p className="admin-login-error">{listError}</p> : null}
      {loading ? <p className="admin-muted">Đang tải danh sách liên hệ…</p> : null}
      <DataTable
        rows={paged.rows}
        empty={loading ? "Đang tải…" : "Chưa có liên hệ."}
        columns={[
          {
            key: "fullName",
            label: "Người gửi",
            render: (row) => (
              <div className="admin-title-cell">
                <b>{row.fullName}</b>
                <small>
                  {row.phone}
                  {row.email ? ` · ${row.email}` : ""}
                </small>
              </div>
            ),
          },
          {
            key: "content",
            label: "Nội dung",
            render: (row) => (
              <span className="admin-muted">
                {String(row.content || "").length > 90
                  ? `${row.content.slice(0, 90)}…`
                  : row.content}
              </span>
            ),
          },
          { key: "createdAt", label: "Thời gian" },
          {
            key: "status",
            label: "Trạng thái",
            render: (row) => (
              <StatusBadge tone={tone(row.status)}>{contactStatuses[row.status]}</StatusBadge>
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
        title="Chi tiết liên hệ"
        onClose={closeDetail}
        footer={
          <button type="button" className="admin-btn ghost" onClick={closeDetail}>
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
              <dt>Điện thoại</dt>
              <dd>{viewing.phone}</dd>
              <dt>Email</dt>
              <dd>{viewing.email || "—"}</dd>
              <dt>Địa chỉ</dt>
              <dd>{viewing.address || "—"}</dd>
              <dt>Thời gian</dt>
              <dd>{viewing.createdAt}</dd>
              <dt>Tài liệu</dt>
              <dd
                className="admin-detail-ellipsis"
                title={
                  viewing.files?.length
                    ? viewing.files.map((file) => file.name).join(", ")
                    : undefined
                }
              >
                {viewing.files?.length
                  ? ellipsis(viewing.files.map((file) => file.name).join(", "), 72)
                  : "Không có"}
              </dd>
            </dl>
            <dt>Nội dung yêu cầu</dt>
            <p>{viewing.content}</p>
            <dt>Tệp đính kèm</dt>
            {fileLoading ? <p>Đang tải tệp đính kèm…</p> : null}
            {fileError && !fileUrls.length ? (
              <p className="admin-login-error">{fileError}</p>
            ) : null}
            {fileUrls.map((file) => (
              <div key={file.index} className="admin-cv-actions">
                <a
                  className="admin-btn ghost"
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  title={file.name}
                >
                  Mở {ellipsis(file.name)}
                </a>
                <a
                  className="admin-btn ghost"
                  href={file.url}
                  download={file.name}
                  title={file.name}
                >
                  Tải {ellipsis(file.name)}
                </a>
                {isPdf(file.name) ? (
                  <iframe className="admin-cv-frame" title={file.name} src={file.url} />
                ) : null}
                {isImage(file.name) ? (
                  <img className="admin-cv-frame" alt={file.name} src={file.url} />
                ) : null}
              </div>
            ))}
            {!fileLoading && !fileUrls.length && !fileError ? (
              <p>Người gửi chưa đính kèm tài liệu.</p>
            ) : null}
            <Field
              label="Cập nhật trạng thái"
              name="status"
              type="select"
              value={viewing.status}
              onChange={changeStatus}
              options={Object.entries(contactStatuses).map(([value, label]) => ({
                value,
                label,
              }))}
            />
          </div>
        ) : null}
      </Drawer>
      <ConfirmDialog
        open={Boolean(removing)}
        title="Xóa liên hệ?"
        message={removing ? `Xóa yêu cầu của ${removing.fullName}?` : ""}
        onClose={() => setRemoving(null)}
        onConfirm={confirmRemove}
      />
    </>
  );
}
