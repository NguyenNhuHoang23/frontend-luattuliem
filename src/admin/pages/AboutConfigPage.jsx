import { useEffect, useState } from "react";
import {
  createAboutArticle,
  deleteAboutArticle,
  listAboutArticles,
  updateAboutArticle,
  updateAboutArticleStatus,
} from "../api.js";
import {
  ConfirmDialog,
  Drawer,
  Field,
  Icon,
  PageHeader,
  RowActions,
  StatusBadge,
  changeHandler,
} from "../components.jsx";
import NewsContentEditor from "../NewsContentEditor.jsx";
import {
  htmlToAboutBlocks,
  isEmptyRichContent,
  isHtmlContent,
  toEditorHtml,
} from "../../utils/richContent.js";

function blocksToHtml(blocks = []) {
  return blocks
    .map((block) => {
      if (block.type === "heading") {
        return `<h2>${block.text || ""}</h2>`;
      }
      if (block.type === "cta") {
        const label = block.text || "Tìm hiểu cơ hội hợp tác";
        const link = block.link || "/tuyen-dung";
        return `<p><a href="${link}">${label}</a></p>`;
      }
      if (block.type === "quote") {
        return `<blockquote>${block.text || ""}</blockquote>`;
      }
      if (block.parts) {
        const inner = block.parts
          .map((part) =>
            part.strong ? `<strong>${part.text || ""}</strong>` : part.text || "",
          )
          .join("");
        return `<p>${inner}</p>`;
      }
      if (block.strong) return `<p><strong>${block.text || ""}</strong></p>`;
      return `<p>${block.text || ""}</p>`;
    })
    .join("");
}

function articleContentToHtml(article) {
  if (isHtmlContent(article?.content)) return toEditorHtml(article.content);
  if (article?.blocks?.length) return blocksToHtml(article.blocks);
  return toEditorHtml(article?.content || "");
}

const emptyForm = {
  title: "",
  showTitle: true,
  status: false,
  content: "",
};

export default function AboutConfigPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [removing, setRemoving] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState("");

  async function loadArticles() {
    setListError("");
    try {
      setArticles(await listAboutArticles());
    } catch (err) {
      setListError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadArticles();
  }, []);

  function openCreate() {
    setEditing("new");
    setForm(emptyForm);
    setError("");
  }

  function openEdit(article) {
    setEditing(article.id);
    setForm({
      title: article.title,
      showTitle: article.showTitle !== false,
      status: Boolean(article.status),
      content: articleContentToHtml(article),
    });
    setError("");
  }

  async function save(event) {
    event.preventDefault();
    setError("");
    if (!form.title.trim()) {
      setError("Vui lòng nhập tiêu đề.");
      return;
    }
    if (isEmptyRichContent(form.content)) {
      setError("Vui lòng nhập nội dung bài giới thiệu.");
      return;
    }
    const body = {
      title: form.title.trim(),
      show_title: form.showTitle,
      status: Boolean(form.status),
      content: form.content,
      blocks: htmlToAboutBlocks(form.content),
    };
    setSaving(true);
    try {
      if (editing === "new") {
        await createAboutArticle(body);
      } else {
        await updateAboutArticle(editing, body);
      }
      await loadArticles();
      setEditing(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(article) {
    if (toggling) return;
    setListError("");
    setToggling(article.id);
    try {
      await updateAboutArticleStatus(article.id, !article.status);
      await loadArticles();
    } catch (err) {
      setListError(err.message);
    } finally {
      setToggling("");
    }
  }

  async function confirmRemove() {
    if (!removing) return;
    setError("");
    try {
      await deleteAboutArticle(removing.id);
      setArticles((current) => current.filter((item) => item.id !== removing.id));
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
        title="Cấu hình trang giới thiệu"
        description="Chỉnh bài viết hiển thị tại mục Giới thiệu. Chỉ một bài được bật tại một thời điểm."
        actions={
          <button type="button" className="admin-btn" onClick={openCreate}>
            <Icon name="plus" /> Thêm bài viết
          </button>
        }
      />
      <div className="admin-config-note">
        Soạn nội dung bằng thanh công cụ kiểu Word: tiêu đề H2/H3, đậm, nghiêng, danh sách, liên kết.
      </div>
      {listError ? <p className="admin-login-error">{listError}</p> : null}
      {loading ? <p className="admin-muted">Đang tải danh sách bài giới thiệu…</p> : null}
      {!loading && articles.length === 0 && !listError ? (
        <p className="admin-muted">Chưa có bài giới thiệu. Hãy thêm bài viết mới.</p>
      ) : null}
      <div className="admin-article-list">
        {articles.map((article) => (
          <article className="admin-card admin-article-item" key={article.id}>
            <div>
              <h2 style={{ margin: "0 0 6px", fontSize: 18 }}>{article.title}</h2>
              <p className="admin-muted">
                {article.blocks?.length || 0} khối nội dung
                {article.showTitle ? " · hiện tiêu đề" : " · ẩn tiêu đề"}
              </p>
            </div>
            <div className="admin-article-actions">
              <button
                type="button"
                className={`admin-status-toggle${article.status ? " is-on" : ""}`}
                onClick={() => toggleStatus(article)}
                disabled={Boolean(toggling)}
                aria-pressed={Boolean(article.status)}
              >
                <span className="admin-status-toggle-knob" />
                {article.status ? "Đang bật" : "Tắt"}
              </button>
              <StatusBadge tone={article.status ? "success" : "muted"}>
                {article.status ? "Hiển thị" : "Ẩn"}
              </StatusBadge>
              <RowActions onEdit={() => openEdit(article)} onDelete={() => setRemoving(article)} />
            </div>
          </article>
        ))}
      </div>
      <Drawer
        open={Boolean(editing)}
        title={editing === "new" ? "Thêm bài giới thiệu" : "Sửa bài giới thiệu"}
        onClose={() => setEditing(null)}
        footer={
          <>
            <button type="button" className="admin-btn ghost" onClick={() => setEditing(null)}>
              Hủy
            </button>
            <button type="submit" className="admin-btn" form="about-form" disabled={saving}>
              {saving ? "Đang lưu…" : "Lưu"}
            </button>
          </>
        }
      >
        <form id="about-form" onSubmit={save}>
          {error ? <p className="admin-login-error">{error}</p> : null}
          <Field label="Tiêu đề" name="title" value={form.title} onChange={changeHandler(setForm)} required />
          <Field
            label="Hiện tiêu đề trên trang"
            name="showTitle"
            type="checkbox"
            checked={form.showTitle}
            onChange={changeHandler(setForm)}
          />
          <Field
            label="Bật bài này (các bài khác sẽ tự tắt)"
            name="status"
            type="checkbox"
            checked={form.status}
            onChange={changeHandler(setForm)}
          />
          <div className="admin-field">
            <label htmlFor="admin-field-about-content">
              Nội dung
              <em> *</em>
            </label>
            <NewsContentEditor
              value={form.content}
              onChange={(content) => setForm((current) => ({ ...current, content }))}
              placeholder="Nhập nội dung bài giới thiệu…"
            />
            <small>Dùng H2 cho tiêu đề mục; liên kết bằng nút Link trên thanh công cụ.</small>
          </div>
        </form>
      </Drawer>
      <ConfirmDialog
        open={Boolean(removing)}
        title="Xóa bài giới thiệu?"
        message={removing ? `Xóa “${removing.title}”?` : ""}
        onClose={() => setRemoving(null)}
        onConfirm={confirmRemove}
      />
    </>
  );
}
