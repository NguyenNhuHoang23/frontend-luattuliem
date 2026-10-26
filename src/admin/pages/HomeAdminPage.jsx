import { useEffect, useState } from "react";
import { getHomePage, updateHomePage } from "../api.js";
import { defaultHomePage } from "../../data/home.js";
import { slides as fallbackSlides } from "../../data/slides.js";
import { Field, Icon, PageHeader } from "../components.jsx";

function emptySlide() {
  return { caption: "", path: null, image: "", file: null, preview: "" };
}

function slidePreviewSrc(slide, index) {
  return slide.preview || slide.image || fallbackSlides[index]?.image || "";
}

function slidePreviewHint(slide, index) {
  if (slide.preview) {
    return slide.file?.name
      ? `Ảnh mới chọn: ${slide.file.name}`
      : "Ảnh mới chọn, chưa lưu.";
  }
  if (slide.image) return "Ảnh đã lưu, đang hiện trên trang chủ.";
  if (fallbackSlides[index]?.image) {
    return "Ảnh mặc định đang hiện trên trang chủ.";
  }
  return "Chưa có ảnh.";
}

function clonePage(data) {
  const page = {
    ...defaultHomePage,
    ...(data || {}),
    hero: { ...defaultHomePage.hero, ...(data?.hero || {}) },
    intro: { ...defaultHomePage.intro, ...(data?.intro || {}) },
    fields: { ...defaultHomePage.fields, ...(data?.fields || {}) },
    cooperate: { ...defaultHomePage.cooperate, ...(data?.cooperate || {}) },
    articles: { ...defaultHomePage.articles, ...(data?.articles || {}) },
    contact: { ...defaultHomePage.contact, ...(data?.contact || {}) },
  };
  page.hero.primaryButton = {
    ...defaultHomePage.hero.primaryButton,
    ...(data?.hero?.primaryButton || {}),
  };
  page.hero.secondaryButton = {
    ...defaultHomePage.hero.secondaryButton,
    ...(data?.hero?.secondaryButton || {}),
  };
  page.slides = (data?.slides || []).map((slide) => ({
    caption: slide.caption || "",
    path: slide.path || null,
    image: slide.image || "",
    file: null,
    preview: "",
  }));
  if (!page.slides.length) page.slides = [emptySlide()];
  page.principles = (data?.principles || defaultHomePage.principles).map((item) => ({
    ...item,
  }));
  page.fields.items = (data?.fields?.items || defaultHomePage.fields.items).map(
    (item) => ({ ...item }),
  );
  page.cooperate.roles = (
    data?.cooperate?.roles || defaultHomePage.cooperate.roles
  ).map((item) => ({ ...item }));
  page.articles.items = (
    data?.articles?.items || defaultHomePage.articles.items
  ).map((item) => ({ ...item }));
  return page;
}

export default function HomeAdminPage() {
  const [form, setForm] = useState(() => clonePage());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    setError("");
    try {
      setForm(clonePage(await getHomePage()));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function patch(section, key, value) {
    setForm((current) => ({
      ...current,
      [section]: { ...current[section], [key]: value },
    }));
  }

  function patchButton(which, key, value) {
    setForm((current) => ({
      ...current,
      hero: {
        ...current.hero,
        [which]: { ...current.hero[which], [key]: value },
      },
    }));
  }

  function patchList(section, listKey, index, key, value) {
    setForm((current) => {
      const list = [...(current[section][listKey] || [])];
      list[index] = { ...list[index], [key]: value };
      return {
        ...current,
        [section]: { ...current[section], [listKey]: list },
      };
    });
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    const payload = {
      hero: form.hero,
      principles: form.principles,
      intro: form.intro,
      fields: form.fields,
      cooperate: form.cooperate,
      articles: form.articles,
      contact: form.contact,
      slides: form.slides.map((slide) => ({
        caption: slide.caption,
        path: slide.path || null,
      })),
    };
    const body = new FormData();
    body.append("content", JSON.stringify(payload));
    form.slides.forEach((slide, index) => {
      if (slide.file) body.append(`slides[${index}][image]`, slide.file);
    });
    try {
      setForm(clonePage(await updateHomePage(body)));
      setNotice("Đã lưu trang chủ. Tải lại website để xem thay đổi.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Nội dung website"
        title="Trang chủ"
        description="Lưu toàn bộ chữ, nút và ảnh slider của trang chủ để hiển thị trên website."
      />
      {loading ? <p className="admin-muted">Đang tải nội dung trang chủ…</p> : null}
      <form className="admin-home-form" onSubmit={save}>
        {error ? <p className="admin-login-error">{error}</p> : null}
        {notice ? <p className="admin-muted">{notice}</p> : null}

        <section className="admin-home-section">
        <h2>Banner &amp; nút</h2>
        <Field
          label="Tiêu đề lớn"
          name="heroTitle"
          type="textarea"
          rows={3}
          value={form.hero.title}
          onChange={(event) => patch("hero", "title", event.target.value)}
          required
        />
        <Field
          label="Mô tả banner"
          name="heroSubtitle"
          type="textarea"
          rows={3}
          value={form.hero.subtitle}
          onChange={(event) => patch("hero", "subtitle", event.target.value)}
        />
        <div className="admin-form-grid">
        <Field
          label="Nút chính — nhãn"
          name="heroPrimaryLabel"
          value={form.hero.primaryButton.label}
          onChange={(event) => patchButton("primaryButton", "label", event.target.value)}
          required
        />
        <Field
          label="Nút chính — liên kết"
          name="heroPrimaryHref"
          value={form.hero.primaryButton.href}
          onChange={(event) => patchButton("primaryButton", "href", event.target.value)}
          required
        />
        </div>
        <div className="admin-form-grid">
        <Field
          label="Nút phụ — nhãn"
          name="heroSecondaryLabel"
          value={form.hero.secondaryButton.label}
          onChange={(event) =>
            patchButton("secondaryButton", "label", event.target.value)
          }
        />
        <Field
          label="Nút phụ — liên kết"
          name="heroSecondaryHref"
          value={form.hero.secondaryButton.href}
          onChange={(event) =>
            patchButton("secondaryButton", "href", event.target.value)
          }
        />
        </div>
        </section>

        <section className="admin-home-section">
        <h2>Ảnh slider</h2>
        {form.slides.map((slide, index) => {
          const previewSrc = slidePreviewSrc(slide, index);
          const caption =
            slide.caption || fallbackSlides[index]?.caption || `Ảnh ${index + 1}`;
          return (
            <div className="admin-slide-card" key={`slide-${index}`}>
              <div className="admin-slide-preview-wrap">
                {previewSrc ? (
                  <img
                    className="admin-slide-preview"
                    src={previewSrc}
                    alt={caption}
                  />
                ) : (
                  <div className="admin-slide-preview is-empty">Chưa có ảnh</div>
                )}
                <p className="admin-slide-caption">{caption}</p>
                <p className="admin-slide-hint">{slidePreviewHint(slide, index)}</p>
              </div>
              <div className="admin-slide-fields">
                <Field
                  label={`Chú thích ảnh ${index + 1}`}
                  name={`slideCaption${index}`}
                  value={slide.caption}
                  onChange={(event) =>
                    setForm((current) => {
                      const slides = [...current.slides];
                      slides[index] = {
                        ...slides[index],
                        caption: event.target.value,
                      };
                      return { ...current, slides };
                    })
                  }
                />
                <label className="admin-field">
                  <span>Đổi ảnh {index + 1}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      setForm((current) => {
                        const slides = [...current.slides];
                        if (slides[index].preview?.startsWith("blob:")) {
                          URL.revokeObjectURL(slides[index].preview);
                        }
                        slides[index] = {
                          ...slides[index],
                          file,
                          preview: URL.createObjectURL(file),
                        };
                        return { ...current, slides };
                      });
                    }}
                  />
                </label>
                <button
                  type="button"
                  className="admin-btn ghost"
                  onClick={() =>
                    setForm((current) => {
                      const removed = current.slides[index];
                      if (removed?.preview?.startsWith("blob:")) {
                        URL.revokeObjectURL(removed.preview);
                      }
                      return {
                        ...current,
                        slides: current.slides.filter(
                          (_, itemIndex) => itemIndex !== index,
                        ),
                      };
                    })
                  }
                >
                  Xóa ảnh này
                </button>
              </div>
            </div>
          );
        })}
        <button
          type="button"
          className="admin-btn"
          onClick={() =>
            setForm((current) => ({
              ...current,
              slides: [...current.slides, emptySlide()],
            }))
          }
        >
          <Icon name="plus" /> Thêm ảnh slider
        </button>
        </section>

        <section className="admin-home-section">
        <h2>Ba nguyên tắc</h2>
        {(form.principles || []).map((item, index) => (
          <div className="admin-home-group" key={`principle-${index}`}>
            <div className="admin-form-grid">
            <Field
              label={`Nguyên tắc ${item.number || index + 1} — tiêu đề`}
              name={`principleTitle${index}`}
              value={item.title}
              onChange={(event) =>
                setForm((current) => {
                  const principles = [...current.principles];
                  principles[index] = {
                    ...principles[index],
                    title: event.target.value,
                  };
                  return { ...current, principles };
                })
              }
            />
            <Field
              label={`Nguyên tắc ${item.number || index + 1} — mô tả`}
              name={`principleText${index}`}
              value={item.text}
              onChange={(event) =>
                setForm((current) => {
                  const principles = [...current.principles];
                  principles[index] = {
                    ...principles[index],
                    text: event.target.value,
                  };
                  return { ...current, principles };
                })
              }
            />
            </div>
          </div>
        ))}
        </section>

        <section className="admin-home-section">
        <h2>Giới thiệu</h2>
        <Field
          label="Nhãn nhỏ"
          name="introEyebrow"
          value={form.intro.eyebrow}
          onChange={(event) => patch("intro", "eyebrow", event.target.value)}
        />
        <Field
          label="Tiêu đề"
          name="introTitle"
          type="textarea"
          rows={2}
          value={form.intro.title}
          onChange={(event) => patch("intro", "title", event.target.value)}
          required
        />
        <Field
          label="Nội dung"
          name="introBody"
          type="textarea"
          rows={4}
          value={form.intro.body}
          onChange={(event) => patch("intro", "body", event.target.value)}
        />
        <Field
          label="Câu trích"
          name="introQuote"
          type="textarea"
          rows={2}
          value={form.intro.quote}
          onChange={(event) => patch("intro", "quote", event.target.value)}
        />
        </section>

        <section className="admin-home-section">
        <h2>Lĩnh vực &amp; nút</h2>
        <Field
          label="Nhãn nhỏ"
          name="fieldsEyebrow"
          value={form.fields.eyebrow}
          onChange={(event) => patch("fields", "eyebrow", event.target.value)}
        />
        <Field
          label="Tiêu đề lĩnh vực"
          name="fieldsTitle"
          value={form.fields.title}
          onChange={(event) => patch("fields", "title", event.target.value)}
          required
        />
        <Field
          label="Mô tả lĩnh vực"
          name="fieldsDescription"
          type="textarea"
          rows={2}
          value={form.fields.description}
          onChange={(event) => patch("fields", "description", event.target.value)}
        />
        {(form.fields.items || []).map((item, index) => (
          <div className="admin-home-group" key={`field-${index}`}>
            <Field
              label={`Lĩnh vực ${index + 1} — tên`}
              name={`fieldTitle${index}`}
              value={item.title}
              onChange={(event) =>
                patchList("fields", "items", index, "title", event.target.value)
              }
            />
            <Field
              label={`Lĩnh vực ${index + 1} — mô tả`}
              name={`fieldDesc${index}`}
              type="textarea"
              rows={2}
              value={item.description}
              onChange={(event) =>
                patchList("fields", "items", index, "description", event.target.value)
              }
            />
            <div className="admin-form-grid">
            <Field
              label={`Lĩnh vực ${index + 1} — nhãn nút`}
              name={`fieldBtn${index}`}
              value={item.buttonLabel}
              onChange={(event) =>
                patchList("fields", "items", index, "buttonLabel", event.target.value)
              }
            />
            <Field
              label={`Lĩnh vực ${index + 1} — liên kết nút`}
              name={`fieldHref${index}`}
              value={item.buttonHref}
              onChange={(event) =>
                patchList("fields", "items", index, "buttonHref", event.target.value)
              }
            />
            </div>
          </div>
        ))}
        </section>

        <section className="admin-home-section">
        <h2>Tuyển dụng trên trang chủ</h2>
        <Field
          label="Nhãn nhỏ"
          name="cooperateEyebrow"
          value={form.cooperate.eyebrow}
          onChange={(event) => patch("cooperate", "eyebrow", event.target.value)}
        />
        <Field
          label="Tiêu đề"
          name="cooperateTitle"
          type="textarea"
          rows={2}
          value={form.cooperate.title}
          onChange={(event) => patch("cooperate", "title", event.target.value)}
          required
        />
        <Field
          label="Nội dung"
          name="cooperateBody"
          type="textarea"
          rows={3}
          value={form.cooperate.body}
          onChange={(event) => patch("cooperate", "body", event.target.value)}
        />
        <Field
          label="Lưu ý"
          name="cooperateNotice"
          type="textarea"
          rows={2}
          value={form.cooperate.notice}
          onChange={(event) => patch("cooperate", "notice", event.target.value)}
        />
        <Field
          label="Gợi ý dưới danh sách vị trí"
          name="cooperateHint"
          value={form.cooperate.hint}
          onChange={(event) => patch("cooperate", "hint", event.target.value)}
        />
        {(form.cooperate.roles || []).map((role, index) => (
          <div className="admin-home-group" key={`role-${index}`}>
            <div className="admin-form-grid">
            <Field
              label={`Vị trí ${index + 1} — tên`}
              name={`roleName${index}`}
              value={role.name}
              onChange={(event) =>
                patchList("cooperate", "roles", index, "name", event.target.value)
              }
            />
            <Field
              label={`Vị trí ${index + 1} — nhãn nút`}
              name={`roleBtn${index}`}
              value={role.buttonLabel}
              onChange={(event) =>
                patchList("cooperate", "roles", index, "buttonLabel", event.target.value)
              }
            />
            </div>
            <Field
              label={`Vị trí ${index + 1} — mô tả`}
              name={`roleDesc${index}`}
              value={role.description}
              onChange={(event) =>
                patchList("cooperate", "roles", index, "description", event.target.value)
              }
            />
          </div>
        ))}
        </section>

        <section className="admin-home-section">
        <h2>Bài viết &amp; hoạt động</h2>
        <Field
          label="Nhãn nhỏ"
          name="articlesEyebrow"
          value={form.articles.eyebrow}
          onChange={(event) => patch("articles", "eyebrow", event.target.value)}
        />
        <Field
          label="Tiêu đề khối bài viết"
          name="articlesTitle"
          value={form.articles.title}
          onChange={(event) => patch("articles", "title", event.target.value)}
          required
        />
        {(form.articles.items || []).map((item, index) => (
          <div className="admin-home-group" key={`article-${index}`}>
            <Field
              label={`Mục ${index + 1} — tiêu đề`}
              name={`articleSummary${index}`}
              value={item.summary}
              onChange={(event) =>
                patchList("articles", "items", index, "summary", event.target.value)
              }
            />
            <Field
              label={`Mục ${index + 1} — nội dung`}
              name={`articleBody${index}`}
              type="textarea"
              rows={3}
              value={item.body}
              onChange={(event) =>
                patchList("articles", "items", index, "body", event.target.value)
              }
            />
          </div>
        ))}
        </section>

        <section className="admin-home-section">
        <h2>Phần liên hệ trên trang chủ</h2>
        <Field
          label="Nhãn nhỏ"
          name="contactEyebrow"
          value={form.contact.eyebrow}
          onChange={(event) => patch("contact", "eyebrow", event.target.value)}
        />
        <Field
          label="Tiêu đề"
          name="contactTitle"
          type="textarea"
          rows={2}
          value={form.contact.title}
          onChange={(event) => patch("contact", "title", event.target.value)}
          required
        />
        <Field
          label="Mô tả"
          name="contactBody"
          type="textarea"
          rows={2}
          value={form.contact.body}
          onChange={(event) => patch("contact", "body", event.target.value)}
        />
        <Field
          label="Nhãn nút gửi"
          name="contactButton"
          value={form.contact.buttonLabel}
          onChange={(event) => patch("contact", "buttonLabel", event.target.value)}
        />
        <Field
          label="Ghi chú dưới nút"
          name="contactNotice"
          value={form.contact.notice}
          onChange={(event) => patch("contact", "notice", event.target.value)}
        />
        </section>

        <div className="admin-home-actions">
        <button className="admin-btn" type="submit" disabled={saving || loading}>
          {saving ? "Đang lưu…" : "Lưu trang chủ"}
        </button>
        </div>
      </form>
    </>
  );
}
