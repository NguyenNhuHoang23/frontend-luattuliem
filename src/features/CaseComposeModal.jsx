import { useEffect, useState } from "react";
import {
  createMemberCaseArticle,
  updateMemberCaseArticle,
} from "../api/member.js";
import { Modal } from "../components/Modal.jsx";
import { caseCategories } from "../data/cases.js";

const categoryOptions = caseCategories.filter((item) => item.id !== "all");

function todayDate() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}`;
}

function lines(value) {
  return String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function bodyToText(caseBody = []) {
  return caseBody
    .map((block) => `## ${block.heading}\n${block.content || ""}`)
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
    const [title = "", type = "", agency = ""] = line
      .split("|")
      .map((part) => part.trim());
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
    code: "",
    category: "dat-dai",
    tag: "Án lệ Tòa án tối cao",
    description: "",
    overview: "",
    sourceCourt: "Tòa án nhân dân tối cao",
    updatedAt: todayDate(),
    field: "",
    status: "Đang áp dụng",
    keywords: "",
    legalProvisions: "",
    relatedDocs: "",
    body: "",
  };
}

function articleToForm(article) {
  return {
    title: article.title || "",
    caseNumber: article.caseNumber || "",
    code: article.code || "",
    category: article.category || "dat-dai",
    tag: article.tag || "",
    description: article.description || "",
    overview: article.overview || "",
    sourceCourt: article.sourceCourt || "",
    updatedAt: article.updatedAt || todayDate(),
    field: article.attributes?.field || article.field || "",
    status: article.attributes?.status || article.status || "Đang áp dụng",
    keywords: (article.keywords || []).join("\n"),
    legalProvisions: (article.legalProvisions || []).join("\n"),
    relatedDocs: docsToText(article.relatedDocs),
    body: bodyToText(article.caseBody),
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
  };
}

export function CaseComposeModal({ open, article, onClose, onSaved }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const editing = Boolean(article);

  useEffect(() => {
    if (!open) return;
    setForm(article ? articleToForm(article) : emptyForm());
    setError("");
  }, [open, article]);

  function change(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = toPayload(form);
      const saved = editing
        ? await updateMemberCaseArticle(article.id, payload)
        : await createMemberCaseArticle(payload);
      onSaved(saved);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    if (saving) return;
    setError("");
    onClose();
  }

  return (
    <Modal
      className="application-dialog case-compose-dialog"
      eyebrow="Giám đốc"
      open={open}
      title={editing ? "Sửa án lệ / án hay" : "Đăng án lệ / án hay"}
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit}>
        <label>
          Tiêu đề *
          <input
            name="title"
            value={form.title}
            onChange={change}
            required
            maxLength={255}
          />
        </label>
        <div className="formrow">
          <label>
            Số án / mã *
            <input
              name="caseNumber"
              value={form.caseNumber}
              onChange={change}
              required
              maxLength={120}
            />
          </label>
          <label>
            Ký hiệu hiển thị
            <input name="code" value={form.code} onChange={change} maxLength={120} />
          </label>
        </div>
        <div className="formrow">
          <label>
            Nhóm *
            <select name="category" value={form.category} onChange={change} required>
              {categoryOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Nhãn
            <input name="tag" value={form.tag} onChange={change} maxLength={120} />
          </label>
        </div>
        <div className="formrow">
          <label>
            Tòa / cơ quan
            <input
              name="sourceCourt"
              value={form.sourceCourt}
              onChange={change}
              maxLength={255}
            />
          </label>
          <label>
            Ngày cập nhật
            <input name="updatedAt" value={form.updatedAt} onChange={change} />
          </label>
        </div>
        <div className="formrow">
          <label>
            Lĩnh vực
            <input name="field" value={form.field} onChange={change} maxLength={255} />
          </label>
          <label>
            Hiệu lực
            <input name="status" value={form.status} onChange={change} maxLength={120} />
          </label>
        </div>
        <label>
          Mô tả ngắn *
          <textarea
            name="description"
            value={form.description}
            onChange={change}
            required
            rows={3}
          />
        </label>
        <label>
          Nội dung khái quát
          <textarea name="overview" value={form.overview} onChange={change} rows={4} />
        </label>
        <label>
          Từ khóa (mỗi dòng một từ khóa)
          <textarea name="keywords" value={form.keywords} onChange={change} rows={3} />
        </label>
        <label>
          Quy định pháp luật (mỗi dòng một điều)
          <textarea
            name="legalProvisions"
            value={form.legalProvisions}
            onChange={change}
            rows={3}
          />
        </label>
        <label>
          Văn bản liên quan
          <textarea
            name="relatedDocs"
            value={form.relatedDocs}
            onChange={change}
            rows={3}
            placeholder="Mỗi dòng: Tiêu đề | Loại | Cơ quan ban hành"
          />
        </label>
        <label>
          Nội dung vụ việc
          <textarea
            name="body"
            value={form.body}
            onChange={change}
            rows={8}
            placeholder="Mỗi mục bắt đầu bằng ## TIÊU ĐỀ rồi đến nội dung bên dưới."
          />
        </label>
        {error ? <p className="notice">{error}</p> : null}
        <div className="modal-actions">
          <button className="btn" disabled={saving}>
            {saving ? "Đang lưu…" : editing ? "Lưu thay đổi" : "Đăng bài"}
          </button>
          <button
            className="btn white"
            type="button"
            onClick={handleClose}
            disabled={saving}
          >
            Hủy
          </button>
        </div>
      </form>
    </Modal>
  );
}
