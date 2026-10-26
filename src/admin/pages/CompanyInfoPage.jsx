import { useEffect, useState } from "react";
import { getCompanyInfo, updateCompanyInfo } from "../api.js";
import { Field, PageHeader, changeHandler } from "../components.jsx";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
  workingHours: "",
  website: "",
  slogan: "",
};

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
      setForm({
        name: data?.name || "",
        phone: data?.phone || "",
        email: data?.email || "",
        address: data?.address || "",
        workingHours: data?.workingHours || "",
        website: data?.website || "",
        slogan: data?.slogan || "",
      });
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
      });
      setForm({
        name: data.name || "",
        phone: data.phone || "",
        email: data.email || "",
        address: data.address || "",
        workingHours: data.workingHours || "",
        website: data.website || "",
        slogan: data.slogan || "",
      });
      setNotice("Đã lưu thông tin công ty. Nội dung sẽ hiện trên website.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Cấu hình website"
        title="Thông tin công ty"
        description="Số điện thoại, email, địa chỉ trụ sở và thời gian làm việc hiển thị trên trang chủ, chân trang và trang Liên hệ."
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
        <button className="admin-btn" type="submit" disabled={saving || loading}>
          {saving ? "Đang lưu…" : "Lưu thông tin"}
        </button>
      </form>
    </>
  );
}
