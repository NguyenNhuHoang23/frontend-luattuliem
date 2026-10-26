import { useEffect } from "react";

const ICONS = {
  overview:
    "M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z",
  about: "M12 3 4 7v10l8 4 8-4V7zm0 4v13M8 9.5l8 4",
  news: "M5 4h10a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V4zm12 4h3v10a2 2 0 0 1-2 2h-1M8 8h6M8 12h6M8 16h4",
  cases:
    "M8 4h8l2 3h3v13H3V7h3zm4 6v6m-3-3h6",
  jobs: "M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-12 0h16v12H4zm4 5h8",
  members:
    "M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1m12-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0m6 11v-1a3.5 3.5 0 0 0-2.5-3.35M16.5 8.5a2.5 2.5 0 0 1 0 5",
  messages:
    "M5 6h14v10H8l-3 3z",
  contacts:
    "M7 8a5 5 0 1 1 10 0c0 3.5-5 8-5 8s-5-4.5-5-8m5 0h.01",
  cv: "M8 3h8l4 4v14H8a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4m4 8v6m-3-3h6",
  search: "M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16m10 2-5-5",
  plus: "M12 5v14M5 12h14",
  close: "M6 6l12 12M18 6 6 18",
  logout: "M10 6H6v12h4M14 16l4-4-4-4M10 12h8",
  menu: "M4 7h16M4 12h16M4 17h16",
  edit: "M4 20h4L19 9l-4-4L4 16zm11-15 4 4",
  trash: "M5 7h14m-9 4v6m4-6v6M9 7V5h6v2m-9 0 1 13h10l1-13",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12m10 3a3 3 0 1 1 0-6 3 3 0 0 1 0 6",
  check: "M5 12.5 9.5 17 19 7",
  mail: "M4 6h16v12H4zm0 0 8 7 8-7",
  user: "M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4m-7 8a7 7 0 0 1 14 0",
  file: "M7 3h7l5 5v13H7zM14 3v5h5",
  home: "M4 11 12 4l8 7v9H4z",
  company: "M4 21V8l8-4 8 4v13M9 21v-7h6v7M9 10h.01M15 10h.01M12 13h.01",
  reset: "M4 12a8 8 0 1 0 2.3-5.7M4 5v5h5",
  send: "M4 12 20 4l-6 16-2.5-6.5z",
};

export function Icon({ name, size = 18 }) {
  return (
    <svg
      className="admin-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={ICONS[name] || ICONS.file} />
    </svg>
  );
}

export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="admin-page-header">
      <div>
        {eyebrow ? <p className="admin-eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {description ? <p className="admin-page-desc">{description}</p> : null}
      </div>
      {actions ? <div className="admin-page-actions">{actions}</div> : null}
    </div>
  );
}

export function StatusBadge({ tone = "muted", children }) {
  return <span className={`admin-badge admin-badge-${tone}`}>{children}</span>;
}

export function SearchInput({ value, onChange, placeholder }) {
  return (
    <label className="admin-search">
      <Icon name="search" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder || "Tìm kiếm"}
      />
    </label>
  );
}

export function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  options,
  rows = 4,
  required,
  hint,
  checked,
}) {
  const id = `admin-field-${name}`;
  return (
    <div className={`admin-field${type === "checkbox" ? " admin-field-check" : ""}`}>
      {type === "checkbox" ? (
        <label htmlFor={id}>
          <input
            id={id}
            name={name}
            type="checkbox"
            checked={Boolean(checked ?? value)}
            onChange={onChange}
          />
          <span>
            {label}
            {required ? <em> *</em> : null}
          </span>
        </label>
      ) : (
        <>
          <label htmlFor={id}>
            {label}
            {required ? <em> *</em> : null}
          </label>
          {type === "select" ? (
            <select
              id={id}
              name={name}
              value={value}
              onChange={onChange}
              required={required}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : type === "textarea" ? (
            <textarea
              id={id}
              name={name}
              value={value}
              onChange={onChange}
              rows={rows}
              required={required}
            />
          ) : (
            <input
              id={id}
              name={name}
              type={type}
              value={value}
              onChange={onChange}
              required={required}
            />
          )}
        </>
      )}
      {hint ? <small>{hint}</small> : null}
    </div>
  );
}

export function DataTable({ columns, rows, empty, rowKey = "id" }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.className}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="admin-empty">
                {empty || "Chưa có dữ liệu."}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row[rowKey]}>
                {columns.map((column) => (
                  <td key={column.key} className={column.className}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Pagination({ page, pages, total, onPage }) {
  if (pages <= 1) return null;
  return (
    <div className="admin-pagination">
      <span>
        {total} mục · Trang {page}/{pages}
      </span>
      <div>
        <button type="button" disabled={page === 1} onClick={() => onPage(page - 1)}>
          Trước
        </button>
        <button
          type="button"
          disabled={page === pages}
          onClick={() => onPage(page + 1)}
        >
          Sau
        </button>
      </div>
    </div>
  );
}

export function Drawer({ open, title, onClose, children, footer, wide = false }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="admin-drawer-backdrop" onClick={onClose}>
      <aside
        className={`admin-drawer${wide ? " is-wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-drawer-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="admin-drawer-head">
          <h2 id="admin-drawer-title">{title}</h2>
          <button type="button" className="admin-icon-btn" onClick={onClose} aria-label="Đóng">
            <Icon name="close" />
          </button>
        </div>
        <div className="admin-drawer-body">{children}</div>
        {footer ? <div className="admin-drawer-foot">{footer}</div> : null}
      </aside>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onClose,
  confirmLabel = "Xóa",
}) {
  if (!open) return null;
  return (
    <div className="admin-drawer-backdrop" onClick={onClose}>
      <div
        className="admin-confirm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-confirm-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="admin-confirm-title">{title}</h2>
        <p>{message}</p>
        <div className="admin-confirm-actions">
          <button type="button" className="admin-btn ghost" onClick={onClose}>
            Hủy
          </button>
          <button type="button" className="admin-btn danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function RowActions({ onView, onEdit, onDelete }) {
  return (
    <div className="admin-row-actions">
      {onView ? (
        <button type="button" className="admin-text-btn" onClick={onView}>
          <Icon name="eye" size={15} /> Xem
        </button>
      ) : null}
      {onEdit ? (
        <button type="button" className="admin-text-btn" onClick={onEdit}>
          <Icon name="edit" size={15} /> Sửa
        </button>
      ) : null}
      {onDelete ? (
        <button type="button" className="admin-text-btn danger" onClick={onDelete}>
          <Icon name="trash" size={15} /> Xóa
        </button>
      ) : null}
    </div>
  );
}

export function usePaged(items, pageSize = 8) {
  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  return { pages, pageSize };
}

export function pageSlice(items, page, pageSize = 8) {
  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(Math.max(1, page), pages);
  return {
    rows: items.slice((current - 1) * pageSize, current * pageSize),
    page: current,
    pages,
    total: items.length,
  };
}

export function changeHandler(setForm) {
  return (event) => {
    const { name, type, value, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };
}
