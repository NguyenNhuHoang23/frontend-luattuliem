import { useEffect, useRef, useState } from "react";
import {
  createMemberCaseArticle,
  updateMemberCaseArticle,
  uploadMemberCaseImage,
} from "../api/member.js";
import NewsContentEditor from "../admin/NewsContentEditor.jsx";
import { Modal } from "../components/Modal.jsx";
import { caseCategories } from "../data/cases.js";
import {
  caseBodyToHtml,
  htmlToCaseBody,
  isEmptyRichContent,
  toEditorHtml,
} from "../utils/richContent.js";

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
    pdfTitle: "",
    imageCaption: "",
  };
}

function articleToForm(article) {
  return {
    title: article.title || "",
    caseNumber: article.caseNumber || "",
    code: article.code || "",
    category: article.category || "dat-dai",
    tag: article.tag || "",
    description: toEditorHtml(article.description || ""),
    overview: toEditorHtml(article.overview || ""),
    sourceCourt: article.sourceCourt || "",
    updatedAt: article.updatedAt || todayDate(),
    field: article.attributes?.field || article.field || "",
    status: article.attributes?.status || article.status || "Đang áp dụng",
    keywords: (article.keywords || []).join("\n"),
    legalProvisions: (article.legalProvisions || []).join("\n"),
    relatedDocs: docsToText(article.relatedDocs),
    body: caseBodyToHtml(article.caseBody),
    pdfTitle: article.pdfTitle || "",
    imageCaption: article.imageCaption || "",
  };
}

function toFormData(form, { pdfFile, removePdf, imageFile, removeImage }) {
  const payload = {
    title: form.title.trim(),
    caseNumber: form.caseNumber.trim(),
    code: form.code.trim() || form.caseNumber.trim(),
    category: form.category,
    tag: form.tag.trim(),
    sourceCourt: form.sourceCourt.trim(),
    updatedAt: form.updatedAt.trim(),
    field: form.field.trim(),
    status: form.status.trim(),
    description: form.description,
    overview: form.overview,
    keywords: lines(form.keywords),
    legalProvisions: lines(form.legalProvisions),
    relatedDocs: textToDocs(form.relatedDocs),
    caseBody: htmlToCaseBody(form.body),
  };
  const body = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      body.append(key, JSON.stringify(value));
    } else {
      body.append(key, value ?? "");
    }
  });
  if (form.pdfTitle.trim()) body.append("pdf_title", form.pdfTitle.trim());
  if (form.imageCaption.trim()) body.append("image_caption", form.imageCaption.trim());
  if (removePdf) body.append("remove_pdf", "1");
  if (removeImage) body.append("remove_image", "1");
  if (pdfFile) body.append("pdf", pdfFile);
  if (imageFile) body.append("image", imageFile);
  return body;
}

export function CaseComposeModal({ open, article, onClose, onSaved }) {
  const bodyEditorRef = useRef(null);
  const insertImageRef = useRef(null);
  const [form, setForm] = useState(emptyForm);
  const [pdfFile, setPdfFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [removePdf, setRemovePdf] = useState(false);
  const [removeImage, setRemoveImage] = useState(false);
  const [insertingImage, setInsertingImage] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const editing = Boolean(article);
  const existingPdfUrl = article?.pdfUrl && !removePdf ? article.pdfUrl : "";
  const existingImageUrl = article?.image && !removeImage ? article.image : "";

  useEffect(() => {
    if (!open) return;
    setForm(article ? articleToForm(article) : emptyForm());
    setPdfFile(null);
    setImageFile(null);
    setRemovePdf(false);
    setRemoveImage(false);
    setError("");
  }, [open, article]);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview("");
      return undefined;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  function change(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function changePdf(event) {
    const file = event.target.files?.[0] || null;
    setPdfFile(file);
    if (!file) return;
    setRemovePdf(false);
    setForm((current) =>
      current.pdfTitle.trim()
        ? current
        : { ...current, pdfTitle: file.name.replace(/\.pdf$/i, "") },
    );
  }

  function changeImage(event) {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
    if (file) setRemoveImage(false);
  }

  async function insertBodyImage(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError("");
    setInsertingImage(true);
    try {
      const uploaded = await uploadMemberCaseImage(file);
      const alt = file.name.replace(/\.[^.]+$/, "") || "Ảnh";
      const editor = bodyEditorRef.current;
      if (editor) {
        editor.chain().focus().setImage({ src: uploaded.url, alt }).run();
      } else {
        setForm((current) => ({
          ...current,
          body: `${current.body}<p><img src="${uploaded.url}" alt="${alt}"></p>`,
        }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setInsertingImage(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (isEmptyRichContent(form.description)) {
      setError("Vui lòng nhập mô tả ngắn.");
      return;
    }
    setSaving(true);
    try {
      const payload = toFormData(form, { pdfFile, removePdf, imageFile, removeImage });
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
          <NewsContentEditor
            compact
            value={form.description}
            onChange={(description) =>
              setForm((current) => ({ ...current, description }))
            }
            placeholder="Nhập mô tả ngắn…"
          />
        </label>
        <label>
          Nội dung khái quát
          <NewsContentEditor
            compact
            value={form.overview}
            onChange={(overview) => setForm((current) => ({ ...current, overview }))}
            placeholder="Nhập nội dung khái quát…"
          />
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
          <NewsContentEditor
            enableImage
            editorRef={bodyEditorRef}
            value={form.body}
            onChange={(body) => setForm((current) => ({ ...current, body }))}
            placeholder="Dùng H2 cho từng mục (NỘI DUNG VỤ ÁN, NHẬN ĐỊNH…)."
          />
          <span className="field-hint">
            Dùng H2/H3 để tách mục. Định dạng bằng thanh công cụ; chèn ảnh bằng nút
            bên dưới.
          </span>
        </label>
        <div className="compose-inline-actions">
          <input
            ref={insertImageRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
            style={{ display: "none" }}
            onChange={insertBodyImage}
          />
          <button
            className="btn white"
            type="button"
            disabled={saving || insertingImage}
            onClick={() => insertImageRef.current?.click()}
          >
            {insertingImage ? "Đang tải ảnh…" : "Chèn ảnh vào nội dung"}
          </button>
        </div>
        <label>
          Ảnh minh họa
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
            onChange={changeImage}
          />
          <span className="field-hint">
            Tối đa 4MB. Ảnh lớn hiện trên trang chi tiết, phía trên file PDF.
          </span>
        </label>
        {imagePreview || existingImageUrl ? (
          <p className="compose-media-preview">
            <img
              src={imagePreview || existingImageUrl}
              alt={form.imageCaption || "Ảnh minh họa"}
            />
          </p>
        ) : null}
        {existingImageUrl ? (
          <label className="pdf-remove">
            <input
              type="checkbox"
              checked={removeImage}
              onChange={(event) => {
                setRemoveImage(event.target.checked);
                if (event.target.checked) setImageFile(null);
              }}
            />
            Gỡ ảnh minh họa khỏi bài
          </label>
        ) : null}
        <label>
          Chú thích ảnh
          <input
            name="imageCaption"
            value={form.imageCaption}
            onChange={change}
            maxLength={255}
            placeholder="Nguồn ảnh / mô tả ngắn"
          />
        </label>
        <label>
          Tiêu đề file PDF
          <input
            name="pdfTitle"
            value={form.pdfTitle}
            onChange={change}
            maxLength={255}
            placeholder="Toàn văn án lệ / bản án"
          />
        </label>
        <label>
          File PDF toàn văn
          <input
            type="file"
            accept="application/pdf,.pdf"
            onChange={changePdf}
          />
          <span className="field-hint">
            Tối đa 20MB. File sẽ hiện khung xem PDF trên trang chi tiết.
          </span>
        </label>
        {pdfFile ? (
          <p className="pdf-current">Đã chọn: {pdfFile.name}</p>
        ) : existingPdfUrl ? (
          <p className="pdf-current">
            Đang có file:{" "}
            <a href={existingPdfUrl} target="_blank" rel="noopener noreferrer">
              {form.pdfTitle || "Xem PDF hiện tại"}
            </a>
          </p>
        ) : null}
        {existingPdfUrl ? (
          <label className="pdf-remove">
            <input
              type="checkbox"
              checked={removePdf}
              onChange={(event) => {
                setRemovePdf(event.target.checked);
                if (event.target.checked) setPdfFile(null);
              }}
            />
            Gỡ file PDF khỏi bài
          </label>
        ) : null}
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
