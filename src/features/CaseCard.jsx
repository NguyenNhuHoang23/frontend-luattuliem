import { Link } from "react-router-dom";
import { Modal } from "../components/Modal.jsx";
export function CaseCard({ entry, onOpen }) {
  if (entry.featured)
    return (
      <article className="featured-case" data-category={entry.category}>
        <span className="featured-badge">{entry.tag}</span>
        <h2>{entry.title}</h2>
        <p>{entry.description}</p>
        <div className="case-summary-box">
          <b>Phán quyết &amp; Định hướng áp dụng của Tòa án:</b>
          {entry.summary
            .replace("Phán quyết & Định hướng áp dụng của Tòa án:", "")
            .trim()}
        </div>
        <div className="featured-actions">
          <Link className="btn" to={`/an-le/${entry.id}`}>
            Xem chi tiết án lệ ↗
          </Link>
          <Link className="read-more" to="/lien-he">
            Yêu cầu tư vấn vụ việc tương tự →
          </Link>
        </div>
      </article>
    );
  return (
    <article className="case-card" data-category={entry.category}>
      <div>
        <div className="case-header">
          <span className="case-tag">{entry.tag}</span>
          <span className="case-code">{entry.code}</span>
        </div>
        <h3>
          <Link to={`/an-le/${entry.id}`}>
            {entry.title}
          </Link>
        </h3>
        <p>{entry.description}</p>
      </div>
      <div className="case-footer">
        <Link className="read-more" to={`/an-le/${entry.id}`}>
          Xem chi tiết án lệ →
        </Link>
      </div>
    </article>
  );
}
export function CaseSummaryModal({ entry, onClose }) {
  return (
    <Modal
      eyebrow="Chi tiết vụ án / án lệ"
      open={Boolean(entry)}
      title={entry?.modal.title || "Chi tiết vụ án / án lệ"}
      onClose={onClose}
    >
      <div className="dialog-content">
        <p>
          <b>Lĩnh vực &amp; Vấn đề:</b> {entry?.modal.topic}
        </p>
        <p>
          <b>Cơ quan xét xử / Nguồn áp dụng:</b> {entry?.modal.court}
        </p>
        <div className="modal-result">
          <b>Tóm tắt kết quả &amp; Giải pháp:</b>
          <p>{entry?.modal.result}</p>
        </div>
        {entry?.source ? (
          <p className="case-source">
            Nguồn: {entry.source.name} · Tác giả: {entry.source.author}.{" "}
            <a
              href={entry.source.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Đọc toàn văn trên {entry.source.name} ↗
            </a>
          </p>
        ) : null}
        <div className="modal-actions">
          <Link className="btn" to="/lien-he">
            Tư vấn vụ việc tương tự ↗
          </Link>
          <button className="btn white" onClick={onClose}>
            Đóng lại
          </button>
        </div>
      </div>
    </Modal>
  );
}
