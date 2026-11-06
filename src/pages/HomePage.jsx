import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicHomePage, submitPublicContactMessage } from "../api/public.js";
import { defaultHomePage } from "../data/home.js";
import { images } from "../data/images.js";
import {
  IconArrowExternal,
  IconArrowRight,
  stripArrowLabel,
} from "../components/IconArrow.jsx";
import { useToast } from "../components/toast-context.js";
import { HeroSlider } from "../features/HeroSlider.jsx";
import {
  ServiceCards,
  HomeRecruitmentRoles,
  HomeArticles,
  HomePrinciples,
} from "../features/HomeSections.jsx";
import { ApplicationModal } from "../features/ApplicationModal.jsx";
import { LineBreaks, useCompanyInfo } from "../features/companyInfo.jsx";

function SectionHeading({ overline, title, description }) {
  return (
    <div className="section-heading">
      {overline ? <div className="overline">{overline}</div> : null}
      <h2>{title}</h2>
      <div className="gold-rule" aria-hidden="true" />
      {description ? <p>{description}</p> : null}
    </div>
  );
}

export default function HomePage() {
  const company = useCompanyInfo();
  const { showToast } = useToast();
  const formRef = useRef(null);
  const [page, setPage] = useState(defaultHomePage);
  const [applicationRole, setApplicationRole] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [fileNames, setFileNames] = useState([]);

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
      setFileNames([]);
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

        <section className="home-section home-principles">
          <div className="wrap">
            <SectionHeading
              overline="Về chúng tôi"
              title="Ba nguyên tắc làm việc"
              description="Cách công ty tiếp nhận, thống nhất và đồng hành với từng vụ việc."
            />
            <HomePrinciples items={page.principles || []} />
          </div>
        </section>

        <section className="home-section warm" id="gioi-thieu">
          <div className="wrap intro-row">
            <div className="photo-panel-wrapper">
              <div
                className="photo-panel"
                style={{
                  backgroundImage: `url(${
                    intro.image ||
                    images["assets/law-office-hero.png"] ||
                    images["assets/about_team.jpg"]
                  })`,
                }}
                aria-label={intro.imageCaption || "Hình ảnh minh họa văn phòng luật"}
              />
              {intro.imageCaption ? (
                <div className="photo-panel-badge">
                  <span>{intro.imageCaption}</span>
                </div>
              ) : null}
            </div>
            <div className="intro-content">
              {intro.eyebrow ? (
                <div className="intro-kicker">
                  <span className="intro-kicker-line" aria-hidden="true" />
                  <span>{intro.eyebrow}</span>
                </div>
              ) : null}
              <h2>
                <LineBreaks text={intro.title} />
              </h2>
              {intro.body ? <p>{intro.body}</p> : null}
              {intro.quote ? <p>{intro.quote}</p> : null}
              <Link
                className="btn intro-story-btn btn-with-arrow"
                to={intro.buttonHref || "/gioi-thieu"}
              >
                <span>
                  {stripArrowLabel(
                    intro.buttonLabel || "Đọc giới thiệu công ty",
                  )}
                </span>
                <IconArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        <section className="home-section fields">
          <div className="wrap">
            <SectionHeading
              overline={fields.eyebrow}
              title={fields.title}
              description={fields.description}
            />
            <ServiceCards items={fields.items || []} />
          </div>
        </section>

        <section className="home-section articles" id="an-le">
          <div className="wrap">
            <SectionHeading
              overline={articles.eyebrow}
              title={articles.title}
              description="Các nội dung đang có trên trang chủ."
            />
            <HomeArticles items={articles.items || []} />
          </div>
        </section>

        <section className="home-section pale home-cooperate" id="hop-tac">
          <div className="wrap">
            <SectionHeading
              overline={cooperate.eyebrow}
              title={<LineBreaks text={cooperate.title} />}
              description={cooperate.body}
            />
            {cooperate.notice ? (
              <p className="notice home-section-notice">{cooperate.notice}</p>
            ) : null}
            <HomeRecruitmentRoles
              roles={cooperate.roles || []}
              onApply={setApplicationRole}
            />
            {cooperate.hint ? (
              <p className="notice home-section-notice">{cooperate.hint}</p>
            ) : null}
          </div>
        </section>

        <section className="home-section" id="lien-he">
          <div className="wrap">
            <div className="cta-band contact-cta">
              <div className="cta-band-content">
                <div className="overline">{contact.eyebrow}</div>
                <h2>
                  <LineBreaks text={contact.title} />
                </h2>
                <p className="contact-lead">{contact.body}</p>
                <div className="contact-meta">
                  <h3 className="contact-phone">
                    <a href={company.phoneHref}>{company.phone}</a>
                  </h3>
                  <p className="contact-office">
                    <b>{company.name}</b>
                    <LineBreaks text={company.address} />
                  </p>
                </div>
              </div>
              <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
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
                <label className="contact-upload">
                  Tài liệu đính kèm (ảnh hoặc PDF)
                  <span className="contact-upload-box">
                    <span className="contact-upload-title">
                      Chọn tệp ảnh hoặc PDF
                    </span>
                    <span className="contact-upload-hint">
                      Có thể chọn nhiều file
                    </span>
                    <input
                      className="contact-file-input"
                      name="files[]"
                      type="file"
                      accept="image/*,application/pdf"
                      multiple
                      onChange={(event) =>
                        setFileNames(
                          Array.from(event.target.files, (file) => file.name),
                        )
                      }
                    />
                    {fileNames.length > 0 ? (
                      <span className="contact-upload-files">
                        Đã chọn: {fileNames.join(", ")}
                      </span>
                    ) : null}
                  </span>
                </label>
                <button className="btn btn-gold btn-with-arrow" disabled={submitting}>
                  {submitting ? (
                    "Đang gửi…"
                  ) : (
                    <>
                      <span>
                        {stripArrowLabel(contact.buttonLabel || "Gửi yêu cầu")}
                      </span>
                      <IconArrowExternal size={14} />
                    </>
                  )}
                </button>
                {contact.notice ? (
                  <p className="notice">{contact.notice}</p>
                ) : null}
              </form>
            </div>
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
