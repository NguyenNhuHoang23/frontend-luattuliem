import { useState, useEffect, useRef } from "react";

export function CasePdfViewer({ url, title }) {
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      // Fallback mở tab mới nếu browser chặn fullscreen
      window.open(url, "_blank");
    }
  };

  if (!url) return null;

  return (
    <section
      ref={containerRef}
      className={`case-pdf-viewer ${isFullscreen ? "is-fullscreen" : ""}`}
      aria-label="Trình xem tài liệu PDF"
    >
      <div className="pdf-viewer-header">
        <div className="pdf-viewer-title">
          <span className="pdf-badge">PDF</span>
          <strong>{title || "Văn bản đính kèm toàn văn"}</strong>
        </div>
        <div className="pdf-viewer-actions">
          <button
            type="button"
            className="pdf-action-btn primary"
            onClick={handleToggleFullscreen}
            title={isFullscreen ? "Thu nhỏ màn hình" : "Xem toàn màn hình"}
          >
            {isFullscreen ? "Thu nhỏ ⛶" : "Xem full màn hình ⛶"}
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="pdf-action-btn secondary"
            title="Mở trong tab mới"
          >
            Mở tab mới ↗
          </a>
          <a
            href={url}
            download
            className="pdf-action-btn secondary"
            title="Tải văn bản PDF về máy"
          >
            Tải về ↓
          </a>
        </div>
      </div>

      <div className="pdf-frame-wrapper">
        <iframe
          src={`${url}#toolbar=1&navpanes=0&view=FitH`}
          className="pdf-iframe"
          title={title || "Tài liệu PDF"}
        />
      </div>

      <p className="pdf-fallback-text">
        Nếu trình duyệt không tự động hiển thị tài liệu, bạn có thể{" "}
        <a href={url} target="_blank" rel="noopener noreferrer">
          nhấn vào đây để xem toàn văn file PDF ↗
        </a>
      </p>
    </section>
  );
}
