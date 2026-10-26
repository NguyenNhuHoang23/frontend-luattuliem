import { useEffect, useMemo, useState } from "react";
import {
  createRecruitmentPost,
  createRecruitmentRole,
  deleteRecruitmentPost,
  deleteRecruitmentRole,
  getRecruitmentPage,
  listRecruitmentPosts,
  listRecruitmentRoles,
  updateRecruitmentPage,
  updateRecruitmentPost,
  updateRecruitmentRole,
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
  changeHandler,
  pageSlice,
} from "../components.jsx";

function joinItems(items = []) {
  return items.join("\n");
}

function splitItems(text) {
  return String(text)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function roleToForm(role) {
  const audience = role.sections?.[0] || {};
  const work = role.sections?.[1] || {};
  const income = role.sections?.[2] || {};
  return {
    name: role.name || "",
    title: role.title || "",
    applyLabel: role.applyLabel || "Gửi hồ sơ ứng tuyển",
    audience: joinItems(role.audience ?? audience.items),
    audienceNote: joinItems(role.audienceNote ?? audience.paragraphs),
    work: joinItems(role.work ?? work.items),
    workNote: joinItems(role.workNote ?? work.paragraphs),
    income: joinItems(role.income ?? income.paragraphs ?? income.items),
  };
}

function rolePayload(form) {
  return {
    name: form.name.trim(),
    title: form.title.trim() || form.name.trim(),
    applyLabel: form.applyLabel.trim() || `Gửi hồ sơ ${form.name.trim()}`,
    audience: splitItems(form.audience),
    audienceNote: splitItems(form.audienceNote),
    work: splitItems(form.work),
    workNote: splitItems(form.workNote),
    income: splitItems(form.income),
  };
}

const emptyRole = {
  name: "",
  title: "",
  applyLabel: "Gửi hồ sơ ứng tuyển",
  audience: "",
  audienceNote: "",
  work: "",
  workNote: "",
  income: "",
};

const emptyPost = {
  title: "",
  description: "",
  paragraphs: "",
  role: "",
};

const emptyArticle = {
  title: "",
  intro: "",
};

export default function RecruitmentAdminPage() {
  const [tab, setTab] = useState("roles");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [roles, setRoles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [editingRole, setEditingRole] = useState(null);
  const [roleForm, setRoleForm] = useState(emptyRole);
  const [editingPost, setEditingPost] = useState(null);
  const [postForm, setPostForm] = useState(emptyPost);
  const [removing, setRemoving] = useState(null);
  const [article, setArticle] = useState(emptyArticle);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const filteredPosts = useMemo(() => {
    const term = query.trim().toLowerCase();
    return posts.filter(
      (item) =>
        !term ||
        item.title.toLowerCase().includes(term) ||
        String(item.description || "").toLowerCase().includes(term),
    );
  }, [posts, query]);
  const paged = pageSlice(filteredPosts, page);

  async function loadAll() {
    setListError("");
    try {
      const [pageData, roleItems, postItems] = await Promise.all([
        getRecruitmentPage(),
        listRecruitmentRoles(),
        listRecruitmentPosts(),
      ]);
      setArticle({
        title: pageData?.title || "",
        intro: pageData?.intro || "",
      });
      setRoles(roleItems);
      setPosts(postItems);
    } catch (err) {
      setListError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function saveArticle(event) {
    event.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      const saved = await updateRecruitmentPage({
        title: article.title.trim(),
        intro: article.intro.trim(),
      });
      setArticle({
        title: saved.title || "",
        intro: saved.intro || "",
      });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function saveRole(event) {
    event.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      const payload = rolePayload(roleForm);
      if (editingRole === "new") {
        await createRecruitmentRole(payload);
      } else {
        await updateRecruitmentRole(editingRole, payload);
      }
      setRoles(await listRecruitmentRoles());
      setEditingRole(null);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function savePost(event) {
    event.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      const payload = {
        title: postForm.title.trim(),
        description: postForm.description.trim(),
        paragraphs: splitItems(postForm.paragraphs),
        role: postForm.role,
      };
      if (editingPost === "new") {
        await createRecruitmentPost(payload);
      } else {
        await updateRecruitmentPost(editingPost, payload);
      }
      setPosts(await listRecruitmentPosts());
      setEditingPost(null);
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
      if (removing.type === "role") {
        await deleteRecruitmentRole(removing.item.id);
        setRoles((current) => current.filter((item) => item.id !== removing.item.id));
      } else {
        await deleteRecruitmentPost(removing.item.id);
        setPosts((current) => current.filter((item) => item.id !== removing.item.id));
      }
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
        title="Tuyển dụng"
        description="Cấu hình nội dung trang tuyển dụng, vị trí hợp tác và tin tuyển riêng."
        actions={
          tab === "roles" ? (
            <button
              type="button"
              className="admin-btn"
              onClick={() => {
                setEditingRole("new");
                setRoleForm(emptyRole);
                setFormError("");
              }}
            >
              <Icon name="plus" /> Thêm vị trí
            </button>
          ) : tab === "posts" ? (
            <button
              type="button"
              className="admin-btn"
              onClick={() => {
                setEditingPost("new");
                setPostForm(emptyPost);
                setFormError("");
              }}
            >
              <Icon name="plus" /> Thêm tin tuyển
            </button>
          ) : null
        }
      />
      <div className="admin-tabs">
        <button type="button" className={`admin-tab${tab === "roles" ? " active" : ""}`} onClick={() => setTab("roles")}>
          Vị trí tuyển dụng
        </button>
        <button type="button" className={`admin-tab${tab === "posts" ? " active" : ""}`} onClick={() => setTab("posts")}>
          Tin tuyển dụng
        </button>
        <button type="button" className={`admin-tab${tab === "intro" ? " active" : ""}`} onClick={() => setTab("intro")}>
          Mở đầu trang
        </button>
      </div>
      {listError ? <p className="admin-login-error">{listError}</p> : null}
      {loading ? <p className="admin-muted">Đang tải nội dung tuyển dụng…</p> : null}

      {tab === "intro" ? (
        <form className="admin-card" onSubmit={saveArticle}>
          {formError ? <p className="admin-login-error">{formError}</p> : null}
          <Field label="Tiêu đề trang" name="title" value={article.title} onChange={changeHandler(setArticle)} required />
          <Field
            label="Đoạn giới thiệu"
            name="intro"
            type="textarea"
            rows={5}
            value={article.intro}
            onChange={changeHandler(setArticle)}
            required
          />
          <button className="admin-btn" type="submit" disabled={saving}>
            {saving ? "Đang lưu…" : "Lưu mở đầu"}
          </button>
        </form>
      ) : null}

      {tab === "roles" ? (
        <DataTable
          rows={roles}
          empty={loading ? "Đang tải…" : "Chưa có vị trí tuyển dụng."}
          columns={[
            {
              key: "name",
              label: "Vị trí",
              render: (row) => (
                <div className="admin-title-cell">
                  <b>{row.name}</b>
                  <small>{row.title}</small>
                </div>
              ),
            },
            { key: "applyLabel", label: "Nút ứng tuyển" },
            {
              key: "actions",
              label: "",
              className: "col-actions",
              render: (row) => (
                <RowActions
                  onEdit={() => {
                    setEditingRole(row.id);
                    setRoleForm(roleToForm(row));
                    setFormError("");
                  }}
                  onDelete={() => setRemoving({ type: "role", item: row })}
                />
              ),
            },
          ]}
        />
      ) : null}

      {tab === "posts" ? (
        <>
          <div className="admin-toolbar">
            <SearchInput value={query} onChange={(value) => { setQuery(value); setPage(1); }} placeholder="Tìm tin tuyển" />
          </div>
          <DataTable
            rows={paged.rows}
            empty={loading ? "Đang tải…" : "Chưa có tin tuyển dụng riêng. Hãy thêm tin để hiện trên trang Tuyển dụng."}
            columns={[
              {
                key: "title",
                label: "Tin tuyển",
                render: (row) => (
                  <div className="admin-title-cell">
                    <b>{row.title}</b>
                    <small>{row.description}</small>
                  </div>
                ),
              },
              {
                key: "role",
                label: "Vị trí",
                render: (row) => row.role || "—",
              },
              {
                key: "actions",
                label: "",
                className: "col-actions",
                render: (row) => (
                  <RowActions
                    onEdit={() => {
                      setEditingPost(row.id);
                      setPostForm({
                        title: row.title,
                        description: row.description || "",
                        paragraphs: joinItems(row.paragraphs),
                        role: row.role || "",
                      });
                      setFormError("");
                    }}
                    onDelete={() => setRemoving({ type: "post", item: row })}
                  />
                ),
              },
            ]}
          />
          <Pagination {...paged} onPage={setPage} />
        </>
      ) : null}

      <Drawer
        open={Boolean(editingRole)}
        title={editingRole === "new" ? "Thêm vị trí" : "Sửa vị trí"}
        onClose={() => setEditingRole(null)}
        footer={
          <>
            <button type="button" className="admin-btn ghost" onClick={() => setEditingRole(null)}>
              Hủy
            </button>
            <button type="submit" className="admin-btn" form="role-form" disabled={saving}>
              {saving ? "Đang lưu…" : "Lưu"}
            </button>
          </>
        }
      >
        <form id="role-form" onSubmit={saveRole}>
          {formError ? <p className="admin-login-error">{formError}</p> : null}
          <Field label="Tên vị trí" name="name" value={roleForm.name} onChange={changeHandler(setRoleForm)} required />
          <Field label="Tiêu đề mục" name="title" value={roleForm.title} onChange={changeHandler(setRoleForm)} />
          <Field label="Nhãn nút gửi hồ sơ" name="applyLabel" value={roleForm.applyLabel} onChange={changeHandler(setRoleForm)} />
          <Field label="Đối tượng và tiêu chuẩn (mỗi dòng một ý)" name="audience" type="textarea" rows={5} value={roleForm.audience} onChange={changeHandler(setRoleForm)} />
          <Field label="Ghi chú đối tượng" name="audienceNote" type="textarea" rows={3} value={roleForm.audienceNote} onChange={changeHandler(setRoleForm)} />
          <Field label="Công việc (mỗi dòng một ý)" name="work" type="textarea" rows={5} value={roleForm.work} onChange={changeHandler(setRoleForm)} />
          <Field label="Ghi chú công việc" name="workNote" type="textarea" rows={3} value={roleForm.workNote} onChange={changeHandler(setRoleForm)} />
          <Field label="Nguyên tắc thu nhập" name="income" type="textarea" rows={4} value={roleForm.income} onChange={changeHandler(setRoleForm)} />
        </form>
      </Drawer>

      <Drawer
        open={Boolean(editingPost)}
        title={editingPost === "new" ? "Thêm tin tuyển" : "Sửa tin tuyển"}
        onClose={() => setEditingPost(null)}
        footer={
          <>
            <button type="button" className="admin-btn ghost" onClick={() => setEditingPost(null)}>
              Hủy
            </button>
            <button type="submit" className="admin-btn" form="post-form" disabled={saving}>
              {saving ? "Đang lưu…" : "Lưu"}
            </button>
          </>
        }
      >
        <form id="post-form" onSubmit={savePost}>
          {formError ? <p className="admin-login-error">{formError}</p> : null}
          <Field label="Tiêu đề" name="title" value={postForm.title} onChange={changeHandler(setPostForm)} required />
          <Field
            label="Vị trí gắn với tin"
            name="role"
            type="select"
            value={postForm.role}
            onChange={changeHandler(setPostForm)}
            options={[
              { value: "", label: "Không gắn vị trí" },
              ...roles.map((role) => ({ value: role.name, label: role.name })),
            ]}
          />
          <Field label="Mô tả ngắn" name="description" type="textarea" rows={3} value={postForm.description} onChange={changeHandler(setPostForm)} required />
          <Field label="Nội dung thêm (mỗi đoạn một dòng)" name="paragraphs" type="textarea" rows={5} value={postForm.paragraphs} onChange={changeHandler(setPostForm)} />
        </form>
      </Drawer>

      <ConfirmDialog
        open={Boolean(removing)}
        title="Xóa mục tuyển dụng?"
        message={removing ? `Xóa “${removing.item.name || removing.item.title}”?` : ""}
        onClose={() => setRemoving(null)}
        onConfirm={confirmRemove}
      />
    </>
  );
}
