import { markdownToHtml } from "./markdown.js";

export function isHtmlContent(text) {
  return /<\/?[a-z][\s\S]*>/i.test(String(text || ""));
}

export function isEmptyRichContent(html) {
  return !String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .trim();
}

/** Chuẩn hóa plain text / markdown cũ sang HTML cho TipTap. */
export function toEditorHtml(text) {
  const raw = String(text || "").trim();
  if (!raw) return "";
  if (isHtmlContent(raw)) return raw;
  return markdownToHtml(raw);
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Ghép caseBody (heading + content) thành một HTML cho TipTap. */
export function caseBodyToHtml(caseBody = []) {
  if (!Array.isArray(caseBody) || !caseBody.length) return "";
  return caseBody
    .map((block) => {
      const heading = String(block?.heading || "NỘI DUNG").trim() || "NỘI DUNG";
      const content = toEditorHtml(block?.content || "");
      return `<h2>${escapeHtml(heading)}</h2>${content || "<p></p>"}`;
    })
    .join("");
}

/** Tách HTML TipTap thành caseBody [{ heading, content }]. */
export function htmlToCaseBody(html) {
  const raw = String(html || "").trim();
  if (!raw) return [];

  if (typeof DOMParser === "undefined") {
    return [{ heading: "NỘI DUNG", content: toEditorHtml(raw) }];
  }

  const doc = new DOMParser().parseFromString(`<div id="root">${raw}</div>`, "text/html");
  const root = doc.getElementById("root");
  if (!root) return [{ heading: "NỘI DUNG", content: raw }];

  const blocks = [];
  let current = null;

  const pushCurrent = () => {
    if (!current) return;
    if (!isEmptyRichContent(current.content) || current.heading) {
      blocks.push({
        heading: current.heading || "NỘI DUNG",
        content: current.content || "",
      });
    }
    current = null;
  };

  Array.from(root.childNodes).forEach((node) => {
    if (node.nodeType === 1 && /^H[23]$/i.test(node.tagName)) {
      pushCurrent();
      current = {
        heading: (node.textContent || "").trim() || "NỘI DUNG",
        content: "",
      };
      return;
    }
    const chunk =
      node.nodeType === 1
        ? node.outerHTML
        : node.nodeType === 3 && node.textContent?.trim()
          ? `<p>${escapeHtml(node.textContent)}</p>`
          : "";
    if (!chunk) return;
    if (!current) current = { heading: "NỘI DUNG", content: "" };
    current.content += chunk;
  });
  pushCurrent();

  return blocks.length
    ? blocks
    : [{ heading: "NỘI DUNG", content: toEditorHtml(raw) }];
}

/** Chuyển HTML TipTap sang blocks giới thiệu (tương thích backend). */
export function htmlToAboutBlocks(html) {
  const raw = String(html || "").trim();
  if (!raw) return [];

  if (typeof DOMParser === "undefined") {
    return [{ type: "paragraph", text: raw.replace(/<[^>]*>/g, " ").trim() }];
  }

  const doc = new DOMParser().parseFromString(`<div id="root">${raw}</div>`, "text/html");
  const root = doc.getElementById("root");
  if (!root) return [];

  return Array.from(root.children)
    .map((node) => {
      const text = (node.textContent || "").trim();
      if (!text) return null;
      if (/^H[1-3]$/i.test(node.tagName)) {
        return { type: "heading", text };
      }
      if (node.tagName === "BLOCKQUOTE") {
        return { type: "quote", text };
      }
      return { type: "paragraph", text };
    })
    .filter(Boolean);
}
