import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getPublicRecruitmentPage,
  getPublicRecruitmentRole,
  listPublicRecruitmentPosts,
  listPublicRecruitmentRoles,
} from "../api/public.js";
import {
  recruitmentArticle,
  recruitmentDocuments,
} from "../data/recruitment.js";
import { site } from "../data/site.js";
import { RecruitmentCard } from "../features/RecruitmentCard.jsx";
import { RecruitmentApplicationForm } from "../features/RecruitmentApplicationForm.jsx";
import { sortByPublicationOrder } from "../utils/publicationOrder.js";

export default function RecruitmentPage() {
  const [selectedRole, setSelectedRole] = useState("");
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [page, setPage] = useState(null);
  const [roles, setRoles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [roleDetail, setRoleDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generalSlot, setGeneralSlot] = useState(null);
  const [modalSlot, setModalSlot] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const detailHeadingRef = useRef(null);
  const topicId = location.hash.slice(1);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getPublicRecruitmentPage(),
      listPublicRecruitmentRoles(),
      listPublicRecruitmentPosts(),
    ])
      .then(([pageData, roleItems, postItems]) => {
        if (cancelled) return;
        setPage(pageData);
        setRoles(roleItems);
        setPosts(postItems);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (page?.title) {
      document.title = `${page.title} | Công ty Luật Từ Liêm`;
    }
  }, [page]);

  useEffect(() => {
    if (!topicId || topicId === "applySection") {
      setRoleDetail(null);
      return;
    }
    let cancelled = false;
    const fromList = roles.find((role) => role.id === topicId) || null;
    setRoleDetail(fromList);
    getPublicRecruitmentRole(topicId)
      .then((item) => {
        if (!cancelled) setRoleDetail(item);
      })
      .catch(() => {
        if (!cancelled && !fromList) setRoleDetail(null);
      });
    return () => {
      cancelled = true;
    };
  }, [topicId, roles]);

  const activeRole = topicId && topicId !== "applySection" ? roleDetail : null;
  const activeTopic = activeRole
    ? activeRole.id
    : topicId === "applySection"
      ? "applySection"
      : "";
  const chooseTopic = (id) =>
    navigate(
      { pathname: "/tuyen-dung", hash: id ? `#${id}` : "" },
      { replace: true },
    );
  const toggleTopic = (id) => {
    setIsApplyModalOpen(false);
    if (activeTopic === id) {
      chooseTopic("");
    } else {
      chooseTopic(id);
    }
  };
  const selectRole = (role) => {
    setSelectedRole(role);
    setIsApplyModalOpen(true);
  };
  const closeModal = () => {
    setIsApplyModalOpen(false);
  };

  useEffect(() => {
    if (!isApplyModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsApplyModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isApplyModalOpen]);

  useEffect(() => {
    if (!isApplyModalOpen) return;
    detailHeadingRef.current?.focus({ preventScroll: true });
  }, [isApplyModalOpen]);

  useEffect(() => {
    if (!activeTopic) return;
    const timer = setTimeout(() => {
      const target = document.getElementById(activeTopic);
      if (target) {
        target.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
          block: "start",
        });
      }
      if (activeTopic === "applySection") {
        detailHeadingRef.current?.focus({ preventScroll: true });
      }
    }, 40);
    return () => clearTimeout(timer);
  }, [activeTopic]);

  const applyPanel = (
    <section
      id="applySection"
      hidden={!isApplyModalOpen && activeTopic !== "applySection"}
      className="application-box recruitment-topic"
    >
      <h2 className="form-title" ref={detailHeadingRef} tabIndex={-1}>
        Cách gửi hồ sơ ứng tuyển
      </h2>
      {recruitmentArticle.application.map((text) => (
        <p key={text}>{text}</p>
      ))}

      <div className="recruitment-documents-card">
        <h3 className="recruitment-docs-title">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          Tài liệu &amp; Biểu mẫu dành cho ứng viên
        </h3>
        <p className="recruitment-docs-intro">
          Ứng viên gửi hồ sơ qua bưu điện vui lòng tải và điền Đơn đề nghị hợp
          tác theo mẫu. Bạn cũng có thể xem trước mẫu văn bản chấp thuận hợp tác
          của Công ty:
        </p>
        <div className="recruitment-doc-list">
          {recruitmentDocuments.map((doc) => (
            <div className="recruitment-doc-item" key={doc.id}>
              <div>
                <div className="recruitment-doc-header">
                  <span className={`recruitment-doc-badge ${doc.badgeClass}`}>
                    {doc.fileType}
                  </span>
                  <strong className="recruitment-doc-name">{doc.title}</strong>
                </div>
                <p className="recruitment-doc-desc">{doc.description}</p>
              </div>
              <div className="recruitment-doc-actions">
                {doc.previewUrl && (
                  <a
                    href={doc.previewUrl}
                    className="recruitment-doc-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Xem trước ↗
                  </a>
                )}
                <a
                  href={doc.fileUrl}
                  className="recruitment-doc-btn"
                  {...(doc.isDownload
                    ? { download: doc.fileName }
                    : {
                        target: "_blank",
                        rel: "noopener noreferrer",
                      })}
                >
                  {doc.actionLabel}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <RecruitmentApplicationForm
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        roles={roles}
      />
    </section>
  );

  const applyTarget = isApplyModalOpen ? modalSlot : generalSlot;

  return (
    <div className="page-recruitment">
      <main className="main-container">
        <div className="wrap recruitment-selection-layout">
          <article className="content-column recruitment-article">
            <h1 className="recruitment-content-heading">
              {page?.title || recruitmentArticle.title}
            </h1>
            {loading ? (
              <p className="recruitment-intro">Đang tải nội dung tuyển dụng…</p>
            ) : null}
            {error ? <p className="recruitment-intro">{error}</p> : null}
            {!loading && !error ? (
              <p className="recruitment-intro">
                {page?.intro || recruitmentArticle.intro}
              </p>
            ) : null}
            <nav
              className="recruitment-topic-menu"
              aria-label="Mục tuyển dụng"
              ref={menuRef}
              tabIndex={-1}
            >
              {roles.map((role) => (
                <div className="recruitment-accordion-item" key={role.id}>
                  <button
                    type="button"
                    className="recruitment-topic-btn"
                    aria-pressed={activeTopic === role.id}
                    aria-controls={role.id}
                    onClick={() => toggleTopic(role.id)}
                  >
                    <span>{role.name}</span>
                    <span className="recruitment-topic-arrow" aria-hidden="true">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                  </button>
                  {activeTopic === role.id && activeRole && (
                    <div className="recruitment-topic-content">
                      <div className="recruitment-topic">
                        <RecruitmentCard role={activeRole} onApply={selectRole}>
                          <section
                            className="recruitment-role-section recruitment-common-requirements"
                            id="recruitment-requirements"
                          >
                            <h3>Điều kiện chung &amp; nguyên tắc hợp tác</h3>
                            <ul>
                              {recruitmentArticle.requirements.map((text) => (
                                <li key={text}>{text}</li>
                              ))}
                            </ul>
                            <p>{recruitmentArticle.policy}</p>
                          </section>
                        </RecruitmentCard>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="recruitment-accordion-item" key="applySection">
                <button
                  type="button"
                  className="recruitment-topic-btn"
                  aria-pressed={activeTopic === "applySection"}
                  aria-controls="applySection"
                  onClick={() => toggleTopic("applySection")}
                >
                  <span>Cách gửi hồ sơ &amp; biểu mẫu</span>
                  <span className="recruitment-topic-arrow" aria-hidden="true">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </button>
                <div
                  className="recruitment-topic-apply-wrapper"
                  hidden={activeTopic !== "applySection"}
                >
                  <div
                    id="apply-slot-general"
                    className="recruitment-general-apply-slot"
                    ref={setGeneralSlot}
                  />
                  {activeTopic === "applySection" && posts.length > 0 && (
                    <div
                      className="recruitment-news"
                      aria-labelledby="recruitment-news-title"
                    >
                      <h2 id="recruitment-news-title">Tin tuyển dụng</h2>
                      {sortByPublicationOrder(posts).map((post) => (
                        <article className="recruitment-post" key={post.id}>
                          <h3>{post.title}</h3>
                          <p>{post.description}</p>
                          {post.paragraphs?.map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                          ))}
                          <button
                            type="button"
                            className="btn"
                            onClick={() => selectRole(post.role || "")}
                          >
                            Gửi hồ sơ ứng tuyển
                          </button>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </nav>
            <p className="recruitment-contact-line">
              Liên hệ: <a href={site.phoneHref}>{site.phone}</a>
            </p>
          </article>
        </div>
      </main>

      {isApplyModalOpen && (
        <div
          className="recruitment-modal-backdrop"
          onClick={closeModal}
          aria-hidden="true"
        />
      )}

      <dialog
        id="recruitmentApplyModal"
        className="recruitment-apply-modal"
        open={isApplyModalOpen}
        aria-labelledby="recruitment-modal-title"
      >
        <div className="recruitment-modal-header">
          <div className="recruitment-modal-title-wrap">
            <span className="recruitment-modal-eyebrow">Hồ sơ ứng tuyển</span>
            <h3 id="recruitment-modal-title" className="recruitment-modal-title">
              {selectedRole
                ? `Vị trí: ${selectedRole}`
                : "Gửi thông tin ứng tuyển"}
            </h3>
          </div>
          <button
            type="button"
            className="dialog-close"
            onClick={closeModal}
            aria-label="Đóng"
          >
            &times;
          </button>
        </div>
        <div
          id="modal-apply-slot"
          className="recruitment-modal-body"
          ref={setModalSlot}
        />
      </dialog>
      {applyTarget ? createPortal(applyPanel, applyTarget) : null}
    </div>
  );
}
