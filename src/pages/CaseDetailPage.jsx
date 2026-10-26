import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getPublicCase } from "../api/public.js";
import { images } from "../data/images.js";
import { CasePdfViewer } from "../features/CasePdfViewer.jsx";

function caseImageSrc(image) {
  if (!image) return "";
  if (image.startsWith("http") || image.startsWith("/")) return image;
  return images[image] || "";
}

export default function CaseDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("content");
  const [caseItem, setCaseItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    setCaseItem(null);
    setActiveTab("content");
    getPublicCase(id)
      .then((item) => {
        if (!cancelled) setCaseItem(item);
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
  }, [id]);

  useEffect(() => {
    if (caseItem) {
      document.title = `${caseItem.caseNumber || caseItem.title} | Công ty Luật Từ Liêm`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          "content",
          caseItem.overview || caseItem.description || "Chi tiết án lệ",
        );
      }
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [caseItem]);

  if (loading) {
    return (
      <div className="page-case-detail">
        <main className="main-container">
          <div className="wrap">
            <p>Đang tải án lệ…</p>
          </div>
        </main>
      </div>
    );
  }

  if (!caseItem) {
    return (
      <div className="page-case-detail">
        <main className="main-container">
          <div className="wrap not-found-box">
            <h2>Không tìm thấy bản án / án lệ yêu cầu</h2>
            <p>
              {error ||
                "Bản án bạn tìm kiếm không tồn tại hoặc đã được cập nhật đường dẫn mới."}
            </p>
            <Link to="/an-le" className="btn">
              ← Quay lại danh mục Án lệ
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="page-case-detail">
      <main className="main-container">
        <div className="wrap">
          {/* Thanh Tab chuyển đổi chức năng */}
          <div className="case-tabs-bar">
            <div className="case-tabs-nav" role="tablist">
              <button
                role="tab"
                aria-selected={activeTab === "content"}
                className={`case-tab-btn ${activeTab === "content" ? "active" : ""}`}
                onClick={() => setActiveTab("content")}
              >
                NỘI DUNG
              </button>
              <button
                role="tab"
                aria-selected={activeTab === "attributes"}
                className={`case-tab-btn ${activeTab === "attributes" ? "active" : ""}`}
                onClick={() => setActiveTab("attributes")}
              >
                Thuộc tính
              </button>
              <button
                role="tab"
                aria-selected={activeTab === "related"}
                className={`case-tab-btn ${activeTab === "related" ? "active" : ""}`}
                onClick={() => setActiveTab("related")}
              >
                Văn bản liên quan
              </button>
            </div>
            <div className="case-tabs-actions">
              <button
                className="case-action-btn"
                onClick={handlePrint}
                title="In nội dung án lệ"
              >
                Tải về / In án ↗
              </button>
            </div>
          </div>

          {/* Tab 1: NỘI DUNG ÁN LỆ (Bố cục chuẩn TAND tối cao) */}
          {activeTab === "content" && (
            <div className="court-doc-card">
              {/* Số hiệu án lệ màu đỏ đặc trưng */}
              {caseItem.caseNumber && (
                <div className="court-doc-header">
                  <h1 className="court-case-number">{caseItem.caseNumber}</h1>
                </div>
              )}

              {/* Thông tin quyết định & phê chuẩn */}
              {caseItem.decisionInfo && (
                <p className="court-intro-text">
                  <strong>{caseItem.decisionInfo}</strong>
                </p>
              )}
              {caseItem.approvalInfo && (
                <p className="court-approval-text">{caseItem.approvalInfo}</p>
              )}

              {/* Nguồn án lệ */}
              {caseItem.sourceDetail && (
                <section className="court-section">
                  <h2 className="court-section-heading">Nguồn án lệ:</h2>
                  <p>{caseItem.sourceDetail}</p>
                </section>
              )}

              {/* Khái quát nội dung án lệ */}
              {caseItem.overview && (
                <section className="court-section">
                  <h2 className="court-section-heading">
                    Khái quát nội dung của án lệ:
                  </h2>
                  <div className="court-highlight-box">
                    <p>{caseItem.overview}</p>
                  </div>
                </section>
              )}

              {/* Quy định của pháp luật liên quan */}
              {caseItem.legalProvisions &&
                caseItem.legalProvisions.length > 0 && (
                  <section className="court-section">
                    <h2 className="court-section-heading">
                      Quy định của pháp luật liên quan đến án lệ:
                    </h2>
                    <ul className="court-legal-list">
                      {caseItem.legalProvisions.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </section>
                )}

              {/* Từ khoá của án lệ */}
              {caseItem.keywords && caseItem.keywords.length > 0 && (
                <section className="court-section">
                  <h2 className="court-section-heading">Từ khoá của án lệ:</h2>
                  <div className="court-keywords-container">
                    {caseItem.keywords.map((kw, idx) => (
                      <span key={idx} className="court-keyword-pill">
                        “{kw}”
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Hình ảnh minh họa vụ việc / án lệ */}
              {caseImageSrc(caseItem.image) && (
                <figure className="court-doc-image">
                  <img
                    src={caseImageSrc(caseItem.image)}
                    alt={caseItem.imageCaption || caseItem.title}
                    loading="lazy"
                  />
                  {caseItem.imageCaption && (
                    <figcaption className="court-image-caption">
                      {caseItem.imageCaption}
                    </figcaption>
                  )}
                </figure>
              )}

              {/* Nhúng toàn văn file PDF nếu có */}
              {caseItem.pdfUrl && (
                <CasePdfViewer
                  url={caseItem.pdfUrl}
                  title={caseItem.pdfTitle || caseItem.title}
                />
              )}

              {/* Toàn văn nội dung vụ án & nhận định tòa án */}
              {caseItem.caseBody && caseItem.caseBody.length > 0 ? (
                <div className="court-body-wrapper">
                  {caseItem.caseBody.map((block, idx) => (
                    <article className="court-body-section" key={idx}>
                      <h3 className="court-body-title">{block.heading}</h3>
                      <div className="court-body-text">
                        {String(block.content || "").split("\n\n").map((para, pIdx) => (
                          <p key={pIdx}>{para}</p>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="court-body-wrapper">
                  <h3 className="court-body-title">
                    TÓM TẮT DIỄN BIẾN &amp; PHÁN QUYẾT
                  </h3>
                  <p>{caseItem.description}</p>
                  {caseItem.summary && <p>{caseItem.summary}</p>}
                </div>
              )}
            </div>
          )}

          {caseItem.source && (
            <p className="case-source">
              Nguồn: {caseItem.source.name} · Tác giả: {caseItem.source.author}.{" "}
              <a
                href={caseItem.source.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Đọc toàn văn trên {caseItem.source.name} ↗
              </a>
            </p>
          )}

          {/* Tab 2: THUỘC TÍNH */}
          {activeTab === "attributes" && (
            <div className="court-doc-card court-attributes-panel">
              <h2 className="panel-title">Thuộc tính văn bản án lệ</h2>
              <table className="attributes-table">
                <tbody>
                  <tr>
                    <th>Số hiệu / Ký hiệu:</th>
                    <td>
                      <strong>{caseItem.caseNumber || caseItem.code}</strong>
                    </td>
                  </tr>
                  <tr>
                    <th>Tiêu đề vụ việc:</th>
                    <td>{caseItem.title}</td>
                  </tr>
                  <tr>
                    <th>Cơ quan ban hành:</th>
                    <td>
                      {caseItem.attributes?.agency ||
                        caseItem.sourceCourt ||
                        "Tòa án nhân dân tối cao"}
                    </td>
                  </tr>
                  <tr>
                    <th>Ngày thông qua / Ban hành:</th>
                    <td>
                      {caseItem.attributes?.adoptionDate ||
                        caseItem.updatedAt ||
                        "Đang cập nhật"}
                    </td>
                  </tr>
                  <tr>
                    <th>Văn bản công bố:</th>
                    <td>
                      {caseItem.attributes?.promulgationDoc ||
                        "Quyết định của Chánh án TANDTC"}
                    </td>
                  </tr>
                  <tr>
                    <th>Lĩnh vực pháp luật:</th>
                    <td>{caseItem.attributes?.field || caseItem.tag}</td>
                  </tr>
                  <tr>
                    <th>Tình trạng áp dụng:</th>
                    <td>
                      <span className="status-badge-active">
                        {caseItem.attributes?.status || "Có hiệu lực thi hành"}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 3: VĂN BẢN LIÊN QUAN */}
          {activeTab === "related" && (
            <div className="court-doc-card court-related-panel">
              <h2 className="panel-title">
                Văn bản pháp luật &amp; Án lệ liên quan
              </h2>
              {caseItem.relatedDocs && caseItem.relatedDocs.length > 0 ? (
                <ul className="related-docs-list">
                  {caseItem.relatedDocs.map((doc, idx) => (
                    <li key={idx} className="related-doc-item">
                      <div className="related-doc-info">
                        <strong>{doc.title}</strong>
                        <div className="related-doc-meta">
                          {doc.type && (
                            <span className="doc-type-tag">{doc.type}</span>
                          )}
                          {doc.issuingAgency && (
                            <span>Ban hành: {doc.issuingAgency}</span>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Chưa có thông tin văn bản dẫn chiếu bổ sung.</p>
              )}
            </div>
          )}

          {/* Khối CTA & Hỗ trợ pháp lý cuối trang */}
          <div className="case-detail-cta">
            <div className="case-cta-content">
              <h3>Bạn có vướng mắc pháp lý tương tự vụ việc này?</h3>
              <p>
                Đội ngũ luật sư và cộng tác viên Công ty Luật TNHH MTV Từ Liêm
                sẵn sàng tư vấn, phân tích chứng cứ và đồng hành giải quyết
                quyền lợi cho bạn.
              </p>
            </div>
            <div className="case-cta-actions">
              <Link to="/lien-he" className="btn">
                Yêu cầu tư vấn vụ việc tương tự ↗
              </Link>
              <Link to="/an-le" className="btn ghost">
                ← Danh mục Án lệ
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
