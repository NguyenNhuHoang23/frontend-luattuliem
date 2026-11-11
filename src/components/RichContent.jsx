import { MarkdownText } from "./MarkdownText.jsx";
import { isHtmlContent } from "../utils/richContent.js";

/** Hiển thị nội dung rich text (HTML từ TipTap) hoặc markdown/plain cũ. */
export function RichContent({ text, className }) {
  const raw = String(text || "").trim();
  if (!raw) return null;

  if (isHtmlContent(raw)) {
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: raw }}
      />
    );
  }

  return <MarkdownText className={className} text={raw} />;
}
