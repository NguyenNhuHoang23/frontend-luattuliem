import { useEffect, useMemo, useState } from "react";
import {
  createNewsArticle,
  deleteNewsArticle,
  listNewsArticles,
  updateNewsArticle,
} from "../api.js";
import { todayDate } from "../cms.js";
import NewsContentEditor from "../NewsContentEditor.jsx";
import {
  ConfirmDialog,
  DataTable,
  Drawer,
  Field,
  Icon,
  PageHeader,
  Pagination,
  RowActions,
  SearchInput,
  StatusBadge,
  changeHandler,
  pageSlice,
} from "../components.jsx";

function isEmptyContent(html) {
  return !String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .trim();
}

const emptyForm = {
  title: "",
  date: todayDate(),
  content: "",
  published: true,
  imageFile: null,
  imagePreview: "",
};

export default function NewsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [removing, setRemoving] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter(
      (item) =>
        !term ||
        item.title.toLowerCase().includes(term) ||
        (item.excerpt || "").toLowerCase().includes(term) ||
        (item.content || "").toLowerCase().includes(term),
    );
  }, [items, query]);

  const paged = pageSlice(filtered, page);

  async function loadNews() {
    setListError("");
    try {
      setItems(await listNewsArticles());
    } catch (err) {
      setListError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNews();
  }, []);

  useEffect(() => {
    return () => {
      if (form.imagePreview?.startsWith("blob:")) URL.revokeObjectURL(form.imagePreview);
    };
  }, [form.imagePreview]);

  function openCreate() {
    setEditing("new");
    setForm({ ...emptyForm, date: todayDate() });
    setError("");
  }

  function openEdit(item) {
    setEditing(item.id);
    setForm({
      title: item.title,
      date: item.date,
      content: item.content || "",
      published: Boolean(item.published),
      imageFile: null,
      imagePreview: item.image || "",
    });
    setError("");
  }

  function onPickImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setForm((current) => {
      if (current.imagePreview?.startsWith("blob:")) URL.revokeObjectURL(current.imagePreview);
      return {
        ...current,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      };
    });
  }

  async function save(event) {
    event.preventDefault();
    setError("");
    if (!form.title.trim()) {
      setError("Vui lòng nhập tiêu đề tin tức.");
      return;
    }
    if (isEmptyContent(form.content)) {
      setError("Vui lòng nhập nội dung tin tức.");
      return;
    }
    if (editing === "new" && !form.imageFile) {
      setError("Vui lòng tải ảnh đại diện cho tin tức.");
      return;
    }

    const body = new FormData();
    body.append("title", form.title.trim());
    body.append("date", form.date.trim());
    body.append("content", form.content);
    body.append("published", form.published ? "1" : "0");
    if (form.imageFile) body.append("image", form.imageFile);

    setSaving(true);
    try {
      if (editing === "new") {
        await createNewsArticle(body);
      } else {
        await updateNewsArticle(editing, body);
      }
      await loadNews();
      setEditing(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function confirmRemove() {
    if (!removing) return;
    setListError("");
    try {
      await deleteNewsArticle(removing.id);
      setItems((current) => current.filter((item) => item.id !== removing.id));
      setRemoving(null);
    } catch (err) {
      setRemoving(null);
      setListError(err.message);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Nội dung website"
        title="Tin tức"
        description="Thêm, sửa, ẩn hoặc xóa tin hiển thị trên website. Ảnh đại diện tải lên máy chủ, nội dung soạn bằng Tiptap."
        actions={
          <button type="button" className="admin-btn" onClick={openCreate}>
            <Icon name="plus" /> Thêm tin tức
          </button>
        }
      />
      <div className="admin-toolbar">
        <SearchInput value={query} onChange={(value) => { setQuery(value); setPage(1); }} placeholder="Tìm theo tiêu đề" />
      </div>
      {listError ? <p className="admin-login-error">{listError}</p> : null}
      {loading ? <p className="admin-muted">Đang tải danh sách tin tức…</p> : null}
      <DataTable
        rows={paged.rows}
        empty={loading ? "Đang tải…" : "Chưa có tin tức."}
        columns={[
          {
            key: "title",
            label: "Tin tức",
            render: (row) => (
              <div className="admin-news-cell">
                {row.image ? (
                  <img className="admin-news-thumb" src={row.image} alt="" />
                ) : (
                  <span className="admin-news-thumb is-empty" />
                )}
                <div className="admin-title-cell">
                  <b>{row.title}</b>
                  <small>{row.excerpt}</small>
                </div>
              </div>
            ),
          },
          { key: "date", label: "Ngày" },
          {
            key: "published",
            label: "Trạng thái",
            render: (row) => (
              <StatusBadge tone={row.published ? "success" : "muted"}>
                {row.published ? "Đã đăng" : "Nháp"}
              </StatusBadge>
            ),
          },
          {
            key: "actions",
            label: "",
            className: "col-actions",
            render: (row) => (
              <RowActions onEdit={() => openEdit(row)} onDelete={() => setRemoving(row)} />
            ),
          },
        ]}
      />
      <Pagination {...paged} onPage={setPage} />
      <Drawer
        wide
        open={Boolean(editing)}
        title={editing === "new" ? "Thêm tin tức" : "Sửa tin tức"}
        onClose={() => setEditing(null)}
        footer={
          <>
            <button type="button" className="admin-btn ghost" onClick={() => setEditing(null)}>
              Hủy
            </button>
            <button type="submit" className="admin-btn" form="news-form" disabled={saving}>
              {saving ? "Đang lưu…" : "Lưu"}
            </button>
          </>
        }
      >
        <form id="news-form" onSubmit={save}>
          {error ? <p className="admin-login-error">{error}</p> : null}
          <Field label="Tiêu đề" name="title" value={form.title} onChange={changeHandler(setForm)} required />
          <div className="admin-form-grid">
            <Field label="Ngày đăng" name="date" value={form.date} onChange={changeHandler(setForm)} required />
            <div className="admin-field">
              <label htmlFor="admin-field-news-avatar">
                Ảnh đại diện{editing === "new" ? <em> *</em> : null}
              </label>
              <div className="admin-avatar-upload">
                {form.imagePreview ? (
                  <img src={form.imagePreview} alt="Ảnh đại diện tin tức" />
                ) : (
                  <span className="admin-avatar-placeholder">Chưa có ảnh</span>
                )}
                <input
                  id="admin-field-news-avatar"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={onPickImage}
                />
              </div>
              <small>Tải ảnh jpg, png, webp hoặc gif, tối đa 4MB.</small>
            </div>
          </div>
          <div className="admin-field">
            <label>
              Nội dung<em> *</em>
            </label>
            {editing ? (
              <NewsContentEditor
                key={String(editing)}
                value={form.content}
                onChange={(content) => setForm((current) => ({ ...current, content }))}
              />
            ) : null}
            <small>Dùng thanh công cụ để in đậm, tiêu đề, danh sách và liên kết.</small>
          </div>
          <Field
            label="Đăng công khai"
            name="published"
            type="checkbox"
            checked={form.published}
            onChange={changeHandler(setForm)}
          />
        </form>
      </Drawer>
      <ConfirmDialog
        open={Boolean(removing)}
        title="Xóa tin tức?"
        message={removing ? `Xóa “${removing.title}”?` : ""}
        onClose={() => setRemoving(null)}
        onConfirm={confirmRemove}
      />
    </>
  );
}
