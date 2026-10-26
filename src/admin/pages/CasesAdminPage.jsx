import { useEffect, useMemo, useState } from "react";
import { caseCategories } from "../../data/cases.js";
import { todayDate } from "../cms.js";
import {
  createCaseArticle,
  deleteCaseArticle,
  listCaseArticles,
  updateCaseArticle,
} from "../api.js";
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

const categoryOptions = caseCategories
  .filter((item) => item.id !== "all")
  .map((item) => ({ value: item.id, label: item.label }));

function lines(value) {
  return String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function bodyToText(caseBody = []) {
  return caseBody
    .map((block) => `## ${block.heading}\n${block.content}`)
    .join("\n\n");
}

function docsToText(docs = []) {
  return docs
    .map((doc) =>
      [doc.title, doc.type, doc.issuingAgency].map((part) => part || "").join(" | "),
    )
    .join("\n");
}

function textToDocs(text) {
  return lines(text).map((line) => {
    const [title = "", type = "", agency = ""] = line.split("|").map((part) => part.trim());
    return { title, type, issuingAgency: agency };
  });
}

function textToBody(text) {
  const chunks = String(text)
    .split(/\n(?=## )/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
  if (!chunks.length) return [];
  return chunks.map((chunk) => {
    const [first, ...rest] = chunk.split("\n");
    return {
      heading: first.replace(/^##\s*/, "").trim() || "NỘI DUNG",
      content: rest.join("\n").trim(),
    };
  });
}

function emptyForm() {
  return {
    title: "",
    caseNumber: "",
    category: "dat-dai",
    tag: "Án lệ Tòa án tối cao",
    code: "",
    description: "",
    overview: "",
    sourceCourt: "Tòa án nhân dân tối cao",
    updatedAt: todayDate(),
    featured: false,
    status: "Đang áp dụng",
    field: "",
    keywords: "",
    legalProvisions: "",
    relatedDocs: "",
    body: "",
  };
}

function toForm(item) {
  return {
    title: item.title || "",
    caseNumber: item.caseNumber || "",
    category: item.category || "dat-dai",
    tag: item.tag || "",
    code: item.code || "",
    description: item.description || "",
    overview: item.overview || "",
    sourceCourt: item.sourceCourt || "",
    updatedAt: item.updatedAt || "",
    featured: Boolean(item.featured),
    status: item.attributes?.status || "Đang áp dụng",
    field: item.attributes?.field || "",
    keywords: (item.keywords || []).join("\n"),
    legalProvisions: (item.legalProvisions || []).join("\n"),
    relatedDocs: docsToText(item.relatedDocs),
    body: bodyToText(item.caseBody),
  };
}

function toPayload(form) {
  return {
    title: form.title.trim(),
    caseNumber: form.caseNumber.trim(),
    code: form.code.trim() || form.caseNumber.trim(),
    category: form.category,
    tag: form.tag.trim(),
    sourceCourt: form.sourceCourt.trim(),
    updatedAt: form.updatedAt.trim(),
    field: form.field.trim(),
    status: form.status.trim(),
    description: form.description.trim(),
    overview: form.overview.trim(),
    keywords: lines(form.keywords),
    legalProvisions: lines(form.legalProvisions),
    relatedDocs: textToDocs(form.relatedDocs),
    caseBody: textToBody(form.body),
    featured: Boolean(form.featured),
  };
}

export default function CasesAdminPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [removing, setRemoving] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchCategory = category === "all" || item.category === category;
      const matchTerm =
        !term ||
        item.title.toLowerCase().includes(term) ||
        String(item.caseNumber || "").toLowerCase().includes(term);
      return matchCategory && matchTerm;
    });
  }, [items, query, category]);

  const paged = pageSlice(filtered, page, 8);

  async function loadCases() {
    setListError("");
    try {
      setItems(await listCaseArticles());
    } catch (err) {
      setListError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCases();
  }, []);

  function openCreate() {
    setEditing("new");
    setForm(emptyForm());
    setError("");
  }

  function openEdit(item) {
    setEditing(item.id);
    setForm(toForm(item));
    setError("");
  }

  async function save(event) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (editing === "new") {
        await createCaseArticle(toPayload(form));
      } else {
        await updateCaseArticle(editing, toPayload(form));
      }
      await loadCases();
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
      await deleteCaseArticle(removing.id);
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
        title="Án lệ – Án hay"
        description="Quản lý án lệ và bản án đăng trên trang Án lệ – Án hay."
        actions={
          <button type="button" className="admin-btn" onClick={openCreate}>
            <Icon name="plus" /> Thêm án lệ / án hay
          </button>
        }
      />
      <div className="admin-toolbar">
        <SearchInput
          value={query}
          onChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
          placeholder="Tìm theo tiêu đề hoặc số án"
        />
        <select
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setPage(1);
          }}
        >
          {caseCategories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      {listError ? <p className="admin-login-error">{listError}</p> : null}
      {loading ? <p className="admin-muted">Đang tải danh sách án lệ…</p> : null}
      <DataTable
        rows={paged.rows}
        empty={loading ? "Đang tải…" : "Chưa có án lệ / án hay."}
        columns={[
          {
            key: "title",
            label: "Hồ sơ",
            render: (row) => (
              <div className="admin-title-cell">
                <b>{row.title}</b>
                <small>
                  {row.code || row.caseNumber} · {row.tag}
                </small>
              </div>
            ),
          },
          { key: "updatedAt", label: "Cập nhật" },
          {
            key: "featured",
            label: "Nổi bật",
            render: (row) =>
              row.featured ? <StatusBadge tone="warn">Nổi bật</StatusBadge> : "—",
          },
          {
            key: "status",
            label: "Trạng thái",
            render: (row) => (
              <StatusBadge tone="info">{row.attributes?.status || "—"}</StatusBadge>
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
        open={Boolean(editing)}
        title={editing === "new" ? "Thêm án lệ / án hay" : "Sửa án lệ / án hay"}
        onClose={() => setEditing(null)}
        footer={
          <>
            <button type="button" className="admin-btn ghost" onClick={() => setEditing(null)}>
              Hủy
            </button>
            <button type="submit" className="admin-btn" form="case-form" disabled={saving}>
              {saving ? "Đang lưu…" : "Lưu"}
            </button>
          </>
        }
      >
        <form id="case-form" onSubmit={save}>
          {error ? <p className="admin-login-error">{error}</p> : null}
          <Field label="Tiêu đề" name="title" value={form.title} onChange={changeHandler(setForm)} required />
          <div className="admin-form-grid">
            <Field label="Số án / mã" name="caseNumber" value={form.caseNumber} onChange={changeHandler(setForm)} required />
            <Field label="Ký hiệu hiển thị" name="code" value={form.code} onChange={changeHandler(setForm)} />
            <Field
              label="Nhóm"
              name="category"
              type="select"
              value={form.category}
              onChange={changeHandler(setForm)}
              options={categoryOptions}
            />
            <Field label="Nhãn" name="tag" value={form.tag} onChange={changeHandler(setForm)} />
            <Field label="Tòa / cơ quan" name="sourceCourt" value={form.sourceCourt} onChange={changeHandler(setForm)} />
            <Field label="Ngày cập nhật" name="updatedAt" value={form.updatedAt} onChange={changeHandler(setForm)} />
            <Field label="Lĩnh vực" name="field" value={form.field} onChange={changeHandler(setForm)} />
            <Field label="Hiệu lực" name="status" value={form.status} onChange={changeHandler(setForm)} />
          </div>
          <Field
            label="Mô tả ngắn"
            name="description"
            type="textarea"
            rows={3}
            value={form.description}
            onChange={changeHandler(setForm)}
            required
          />
          <Field
            label="Nội dung khái quát"
            name="overview"
            type="textarea"
            rows={4}
            value={form.overview}
            onChange={changeHandler(setForm)}
          />
          <Field
            label="Từ khóa (mỗi dòng một từ khóa)"
            name="keywords"
            type="textarea"
            rows={3}
            value={form.keywords}
            onChange={changeHandler(setForm)}
          />
          <Field
            label="Quy định pháp luật (mỗi dòng một điều)"
            name="legalProvisions"
            type="textarea"
            rows={3}
            value={form.legalProvisions}
            onChange={changeHandler(setForm)}
          />
          <Field
            label="Văn bản liên quan"
            name="relatedDocs"
            type="textarea"
            rows={4}
            value={form.relatedDocs}
            onChange={changeHandler(setForm)}
            hint="Mỗi dòng một văn bản: Tiêu đề | Loại | Cơ quan ban hành"
          />
          <Field
            label="Nội dung vụ việc"
            name="body"
            type="textarea"
            rows={10}
            value={form.body}
            onChange={changeHandler(setForm)}
            hint="Mỗi mục bắt đầu bằng ## TIÊU ĐỀ rồi đến nội dung bên dưới."
          />
          <Field
            label="Đánh dấu nổi bật"
            name="featured"
            type="checkbox"
            checked={form.featured}
            onChange={changeHandler(setForm)}
          />
        </form>
      </Drawer>
      <ConfirmDialog
        open={Boolean(removing)}
        title="Xóa án lệ / án hay?"
        message={removing ? `Xóa “${removing.title}”?` : ""}
        onClose={() => setRemoving(null)}
        onConfirm={confirmRemove}
      />
    </>
  );
}
