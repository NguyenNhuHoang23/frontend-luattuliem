function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const MEDIA_URL = "(https?:\\/\\/[^)\\s]+|\\/[^)\\s]*)";

function inlineMarkdown(escaped) {
  return escaped
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>")
    .replace(
      new RegExp(`!\\[([^\\]]*)\\]\\(${MEDIA_URL}\\)`, "g"),
      '<img src="$2" alt="$1" />',
    )
    .replace(
      new RegExp(`\\[([^\\]]+)\\]\\(${MEDIA_URL}\\)`, "g"),
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    );
}

function renderBlock(block) {
  const trimmed = block.trim();
  const imageOnly = trimmed.match(new RegExp(`^!\\[([^\\]]*)\\]\\(${MEDIA_URL}\\)$`));
  if (imageOnly) {
    const alt = escapeHtml(imageOnly[1]);
    const src = escapeHtml(imageOnly[2]);
    return `<figure class="md-image"><img src="${src}" alt="${alt}" />${
      alt ? `<figcaption>${alt}</figcaption>` : ""
    }</figure>`;
  }
  const lines = block.split("\n");
  if (lines.length && lines.every((line) => /^[-*]\s+/.test(line))) {
    const items = lines
      .map((line) => `<li>${inlineMarkdown(escapeHtml(line.replace(/^[-*]\s+/, "")))}</li>`)
      .join("");
    return `<ul>${items}</ul>`;
  }
  if (lines.length && lines.every((line) => /^\d+\.\s+/.test(line))) {
    const items = lines
      .map((line) => `<li>${inlineMarkdown(escapeHtml(line.replace(/^\d+\.\s+/, "")))}</li>`)
      .join("");
    return `<ol>${items}</ol>`;
  }
  return `<p>${inlineMarkdown(escapeHtml(block)).replace(/\n/g, "<br />")}</p>`;
}

export function markdownToHtml(text) {
  const raw = String(text || "")
    .replace(/\r\n/g, "\n")
    .trim();
  if (!raw) return "";
  return raw.split(/\n{2,}/).map(renderBlock).join("");
}
