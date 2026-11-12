import { useEffect, useState } from "react";
import { getCompanyInfo, updateCompanyInfo } from "../api.js";
import { Field, PageHeader, changeHandler } from "../components.jsx";

const HEADER_CONTACT_OPTIONS = [
  { value: "email", label: "Email" },
  { value: "zalo", label: "Zalo" },
  { value: "phone", label: "Điện thoại" },
  { value: "link", label: "Liên kết khác" },
];

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
  workingHours: "",
  website: "",
  slogan: "",
  headerContactType: "email",
  headerContactLabel: "",
  headerContactValue: "",
  headerContactHref: "",
  headerContactHint: "",
};

function mapForm(data = {}) {
  return {
    name: data.name || "",
    phone: data.phone || "",
    email: data.email || "",
    address: data.address || "",
    workingHours: data.workingHours || "",
    website: data.website || "",
    slogan: data.slogan || "",
    headerContactType: data.headerContactType || "email",
    headerContactLabel: data.headerContactLabel || "",
    headerContactValue: data.headerContactValue || "",
    headerContactHref: data.headerContactHref || "",
    headerContactHint: data.headerContactHint || "",
  };
}

export default function CompanyInfoPage() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    setError("");
    try {
      const data = await getCompanyInfo();
      setForm(mapForm(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const data = await updateCompanyInfo({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        workingHours: form.workingHours.trim(),
        website: form.website.trim(),
        slogan: form.slogan.trim(),
        headerContactType: form.headerContactType,
        headerContactLabel: form.headerContactLabel.trim(),
        headerContactValue: form.headerContactValue.trim(),
        headerContactHref: form.headerContactHref.trim(),
        headerContactHint: form.headerContactHint.trim(),
      });
      setForm(mapForm(data));
      setNotice("Đã lưu thông tin công ty. Nội dung sẽ hiện trên website.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const valueHint =
    form.headerContactType === "zalo"
      ? "Số Zalo hoặc để trống để dùng số điện thoại công ty."
      : form.headerContactType === "phone"
        ? "Số hiển thị hoặc để trống để dùng số điện thoại công ty."
        : form.headerContactType === "link"
          ? "Nội dung hiển thị trên header (ví dụ: Fanpage Facebook)."
          : "Email hiển thị hoặc để trống để dùng email công ty.";

  const hrefHint =
    form.headerContactType === "zalo"
      ? "Để trống sẽ tạo link https://zalo.me/... từ số điện thoại."
      : form.headerContactType === "email"
        ? "Để trống sẽ dùng mailto: theo email hiển thị."
        : form.headerContactType === "phone"
          ? "Để trống sẽ dùng tel: theo số hiển thị."
          : "URL đầy đủ, ví dụ https://zalo.me/... hoặc https://facebook.com/...";

  return (
    <>
      <PageHeader
        eyebrow="Cấu hình website"
        title="Thông tin công ty"
        description="Số điện thoại, email, địa chỉ trụ sở, thời gian làm việc và khối liên hệ trên header."
      />
      {loading ? <p className="admin-muted">Đang tải thông tin công ty…</p> : null}
      <form className="admin-card" onSubmit={save}>
        {error ? <p className="admin-login-error">{error}</p> : null}
        {notice ? <p className="admin-muted">{notice}</p> : null}
        <Field
          label="Tên công ty"
          name="name"
          value={form.name}
          onChange={changeHandler(setForm)}
          required
        />
        <Field
          label="Số điện thoại"
          name="phone"
          value={form.phone}
          onChange={changeHandler(setForm)}
          required
        />
        <Field
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={changeHandler(setForm)}
          required
        />
        <Field
          label="Địa chỉ trụ sở"
          name="address"
          type="textarea"
          rows={3}
          value={form.address}
          onChange={changeHandler(setForm)}
          required
        />
        <Field
          label="Thời gian làm việc"
          name="workingHours"
          type="textarea"
          rows={4}
          value={form.workingHours}
          onChange={changeHandler(setForm)}
          required
          hint="Mỗi dòng một khung giờ."
        />
        <Field
          label="Website"
          name="website"
          value={form.website}
          onChange={changeHandler(setForm)}
        />
        <Field
          label="Khẩu hiệu"
          name="slogan"
          value={form.slogan}
          onChange={changeHandler(setForm)}
        />

        <h3 className="admin-section-title">Liên hệ trên header</h3>
        <p className="admin-muted">
          Khối liên hệ ở góc phải header trên màn hình máy tính. Có thể đổi sang Zalo, điện thoại hoặc link khác.
        </p>
        <Field
          label="Loại liên hệ"
          name="headerContactType"
          type="select"
          options={HEADER_CONTACT_OPTIONS}
          value={form.headerContactType}
          onChange={changeHandler(setForm)}
        />
        <Field
          label="Nhãn nhỏ"
          name="headerContactLabel"
          value={form.headerContactLabel}
          onChange={changeHandler(setForm)}
          hint='Ví dụ: "Email tiếp nhận", "Zalo tiếp nhận".'
        />
        <Field
          label="Nội dung hiển thị"
          name="headerContactValue"
          value={form.headerContactValue}
          onChange={changeHandler(setForm)}
          hint={valueHint}
        />
        <Field
          label="Đường dẫn khi bấm"
          name="headerContactHref"
          value={form.headerContactHref}
          onChange={changeHandler(setForm)}
          hint={hrefHint}
        />
        <Field
          label="Dòng mô tả"
          name="headerContactHint"
          value={form.headerContactHint}
          onChange={changeHandler(setForm)}
          hint='Ví dụ: "Nhắn Zalo để được tư vấn pháp lý".'
        />

        <button className="admin-btn" type="submit" disabled={saving || loading}>
          {saving ? "Đang lưu…" : "Lưu thông tin"}
        </button>
      </form>
    </>
  );
}
