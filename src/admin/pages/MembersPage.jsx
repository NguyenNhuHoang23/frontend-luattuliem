import { useEffect, useMemo, useState } from "react";
import { todayDate } from "../cms.js";
import {
  createMember,
  deleteMember,
  listMembers,
  updateMember,
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
import { memberGroups, memberStatuses } from "../nav.js";

const emptyForm = {
  name: "",
  username: "",
  password: "",
  role: "ctv",
  phone: "",
  email: "",
  area: "Hà Nội",
  status: "active",
  joinDate: "",
};

const roleOptions = Object.entries(memberGroups).map(([value, label]) => ({ value, label }));
const statusOptions = Object.entries(memberStatuses).map(([value, label]) => ({ value, label }));

function memberRole(item) {
  return item.role || item.group;
}

export default function MembersPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [removing, setRemoving] = useState(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((item) => {
      const role = memberRole(item);
      const matchGroup = group === "all" || role === group;
      const matchTerm =
        !term ||
        String(item.name || "").toLowerCase().includes(term) ||
        String(item.username || "").toLowerCase().includes(term) ||
        String(item.email || "").toLowerCase().includes(term) ||
        String(item.phone || "").includes(term);
      return matchGroup && matchTerm;
    });
  }, [items, query, group]);
  const paged = pageSlice(filtered, page);

  async function loadMembers() {
    setListError("");
    try {
      setItems(await listMembers());
    } catch (err) {
      setListError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMembers();
  }, []);

  function openCreate() {
    setFormError("");
    setEditing("new");
    setForm({ ...emptyForm, joinDate: todayDate() });
  }

  function openEdit(row) {
    setFormError("");
    setEditing(row.id);
    setForm({
      name: row.name || "",
      username: row.username || "",
      password: "",
      role: memberRole(row) || "ctv",
      phone: row.phone || "",
      email: row.email || "",
      area: row.area || "",
      status: row.status || "active",
      joinDate: row.joinDate || "",
    });
  }

  async function save(event) {
    event.preventDefault();
    const payload = {
      name: form.name.trim(),
      username: form.username.trim(),
      role: form.role,
      phone: form.phone.trim(),
      email: form.email.trim(),
      area: form.area.trim(),
      status: form.status,
      joinDate: form.joinDate.trim() || todayDate(),
    };
    if (form.password.trim()) {
      payload.password = form.password.trim();
    }
    setFormError("");
    setSaving(true);
    try {
      if (editing === "new") {
        const created = await createMember(payload);
        setItems((current) => [created, ...current]);
      } else {
        const updated = await updateMember(editing, payload);
        setItems((current) =>
          current.map((item) => (item.id === updated.id ? updated : item)),
        );
      }
      setEditing(null);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function confirmRemove() {
    if (!removing) return;
    setListError("");
    try {
      await deleteMember(removing.id);
      setItems((current) => current.filter((item) => item.id !== removing.id));
      if (editing === removing.id) setEditing(null);
      setRemoving(null);
    } catch (err) {
      setRemoving(null);
      setListError(err.message);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Nhân sự"
        title="Thành viên"
        description="Tài khoản thành viên đăng nhập trang client, gồm vai trò Giám đốc và CTV."
        actions={
          <button type="button" className="admin-btn" onClick={openCreate}>
            <Icon name="plus" /> Thêm thành viên
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
          placeholder="Tìm theo tên, tên đăng nhập, email, điện thoại"
        />
        <select
          value={group}
          onChange={(event) => {
            setGroup(event.target.value);
            setPage(1);
          }}
        >
          <option value="all">Tất cả vai trò</option>
          {roleOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      {listError ? <p className="admin-login-error">{listError}</p> : null}
      {loading ? <p className="admin-muted">Đang tải danh sách thành viên…</p> : null}
      <DataTable
        rows={paged.rows}
        empty={loading ? "Đang tải…" : "Chưa có thành viên."}
        columns={[
          {
            key: "name",
            label: "Thành viên",
            render: (row) => (
              <div className="admin-title-cell">
                <b>{row.name}</b>
                <small>{row.username}</small>
              </div>
            ),
          },
          {
            key: "role",
            label: "Vai trò",
            render: (row) => memberGroups[memberRole(row)] || memberRole(row),
          },
          { key: "phone", label: "Điện thoại" },
          { key: "area", label: "Địa bàn" },
          {
            key: "status",
            label: "Trạng thái",
            render: (row) => (
              <StatusBadge tone={row.status === "active" ? "success" : "muted"}>
                {memberStatuses[row.status] || row.status}
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
        open={Boolean(editing)}
        title={editing === "new" ? "Thêm thành viên" : "Sửa thành viên"}
        onClose={() => setEditing(null)}
        footer={
          <>
            <button type="button" className="admin-btn ghost" onClick={() => setEditing(null)}>
              Hủy
            </button>
            <button type="submit" className="admin-btn" form="member-form" disabled={saving}>
              {saving ? "Đang lưu…" : "Lưu"}
            </button>
          </>
        }
      >
        <form id="member-form" onSubmit={save}>
          {formError ? <p className="admin-login-error">{formError}</p> : null}
          <Field label="Họ và tên" name="name" value={form.name} onChange={changeHandler(setForm)} required />
          <div className="admin-form-grid">
            <Field
              label="Tên đăng nhập"
              name="username"
              value={form.username}
              onChange={changeHandler(setForm)}
              required
              hint="Dùng để đăng nhập trang Thành viên trên website."
            />
            <Field
              label="Mật khẩu"
              name="password"
              type="password"
              value={form.password}
              onChange={changeHandler(setForm)}
              required={editing === "new"}
              hint={
                editing === "new"
                  ? "Tối thiểu 6 ký tự."
                  : "Để trống nếu không đổi mật khẩu."
              }
            />
            <Field
              label="Vai trò"
              name="role"
              type="select"
              value={form.role}
              onChange={changeHandler(setForm)}
              options={roleOptions}
            />
            <Field
              label="Trạng thái"
              name="status"
              type="select"
              value={form.status}
              onChange={changeHandler(setForm)}
              options={statusOptions}
            />
            <Field label="Điện thoại" name="phone" value={form.phone} onChange={changeHandler(setForm)} required />
            <Field label="Email" name="email" type="email" value={form.email} onChange={changeHandler(setForm)} />
            <Field label="Địa bàn" name="area" value={form.area} onChange={changeHandler(setForm)} />
            <Field label="Ngày tham gia" name="joinDate" value={form.joinDate} onChange={changeHandler(setForm)} />
          </div>
        </form>
      </Drawer>
      <ConfirmDialog
        open={Boolean(removing)}
        title="Xóa thành viên?"
        message={removing ? `Xóa “${removing.name}” khỏi danh sách?` : ""}
        onClose={() => setRemoving(null)}
        onConfirm={confirmRemove}
      />
    </>
  );
}
