import { useEffect, useRef, useState } from "react";
import { getPublicHomePage, submitPublicContactMessage } from "../api/public.js";
import { defaultHomePage } from "../data/home.js";
import { useToast } from "../components/toast-context.js";
import { HeroSlider } from "../features/HeroSlider.jsx";
import {
  ServiceCards,
  HomeRecruitmentRoles,
} from "../features/HomeSections.jsx";
import { ApplicationModal } from "../features/ApplicationModal.jsx";
import { LineBreaks, useCompanyInfo } from "../features/companyInfo.jsx";

export default function HomePage() {
  const company = useCompanyInfo();
  const { showToast } = useToast();
  const formRef = useRef(null);
  const [page, setPage] = useState(defaultHomePage);
  const [applicationRole, setApplicationRole] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getPublicHomePage()
      .then((data) => {
        if (!cancelled && data) {
          setPage({ ...defaultHomePage, ...data });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = formRef.current || event.currentTarget;
    const payload = new FormData(form);
    setSubmitting(true);
    try {
      await submitPublicContactMessage(payload);
      showToast("Đã gửi yêu cầu liên hệ. Công ty sẽ liên hệ lại sớm.");
      form.reset();
    } catch (err) {
      showToast(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const hero = page.hero || defaultHomePage.hero;
  const intro = page.intro || defaultHomePage.intro;
  const fields = page.fields || defaultHomePage.fields;
  const cooperate = page.cooperate || defaultHomePage.cooperate;
  const articles = page.articles || defaultHomePage.articles;
  const contact = page.contact || defaultHomePage.contact;

  return (
    <div className="page-home">
      <main id="public">
        <HeroSlider hero={hero} slides={page.slides || []} />
        <div className="principles">
          <div className="wrap">
            {(page.principles || []).map((item) => (
              <article key={item.number || item.title}>
                <span className="number">{item.number}</span>
                <div>
                  <b>{item.title}</b> <small>{item.text}</small>
                </div>
              </article>
            ))}
          </div>
        </div>
        <section id="gioi-thieu">
          <div className="wrap intro">
            <div>
              <div className="eyebrow">{intro.eyebrow}</div>
              <h2>
                <LineBreaks text={intro.title} />
              </h2>
            </div>
            <div>
              <p>{intro.body}</p>
              {intro.quote ? (
                <div className="quote">
                  <LineBreaks text={intro.quote} />
                </div>
              ) : null}
            </div>
          </div>
        </section>
        <section className="fields">
          <div className="wrap">
            <div className="sectionhead">
              <div>
                <div className="eyebrow">{fields.eyebrow}</div>
                <h2>{fields.title}</h2>
              </div>
              <p>{fields.description}</p>
            </div>
            <ServiceCards items={fields.items || []} />
          </div>
        </section>
        <section id="hop-tac">
          <div className="wrap cooperate">
            <div>
              <div className="eyebrow">{cooperate.eyebrow}</div>
              <h2>
                <LineBreaks text={cooperate.title} />
              </h2>
              <p>{cooperate.body}</p>
              {cooperate.notice ? (
                <p className="notice">{cooperate.notice}</p>
              ) : null}
            </div>
            <div>
              <HomeRecruitmentRoles
                roles={cooperate.roles || []}
                onApply={setApplicationRole}
              />
              {cooperate.hint ? (
                <p className="notice">{cooperate.hint}</p>
              ) : null}
            </div>
          </div>
        </section>
        <section className="news" id="an-le">
          <div className="wrap">
            <div className="eyebrow">{articles.eyebrow}</div>
            <h2>{articles.title}</h2>
            {(articles.items || []).map((item) => (
              <details key={item.summary}>
                <summary>{item.summary}</summary>
                <p>{item.body}</p>
              </details>
            ))}
          </div>
        </section>
        <section id="lien-he">
          <div className="wrap contact">
            <div>
              <div className="eyebrow">{contact.eyebrow}</div>
              <h2>
                <LineBreaks text={contact.title} />
              </h2>
              <p>{contact.body}</p>
              <h3>
                <a href={company.phoneHref}>{company.phone}</a>
              </h3>
              <p>
                {company.name}
                <br />
                <LineBreaks text={company.address} />
              </p>
            </div>
            <form ref={formRef} onSubmit={handleSubmit}>
              <div className="formrow">
                <label>
                  Họ và tên *
                  <input name="fullName" required autoComplete="name" />
                </label>
                <label>
                  Số điện thoại *
                  <input name="phone" required type="tel" autoComplete="tel" />
                </label>
              </div>
              <label>
                Email
                <input name="email" type="email" autoComplete="email" />
              </label>
              <label>
                Nội dung yêu cầu *
                <textarea
                  name="content"
                  required
                  placeholder="Bạn cần công ty hỗ trợ vấn đề gì?"
                ></textarea>
              </label>
              <label>
                Tài liệu đính kèm (ảnh hoặc PDF)
                <input
                  name="files[]"
                  type="file"
                  accept="image/*,application/pdf"
                  multiple
                />
              </label>
              <button className="btn" disabled={submitting}>
                {submitting ? "Đang gửi…" : contact.buttonLabel || "Gửi yêu cầu ↗"}
              </button>
              {contact.notice ? (
                <p className="notice">{contact.notice}</p>
              ) : null}
            </form>
          </div>
        </section>
      </main>
      <ApplicationModal
        role={applicationRole}
        onClose={() => setApplicationRole(null)}
      />
    </div>
  );
}
