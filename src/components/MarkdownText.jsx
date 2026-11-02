import { markdownToHtml } from "../utils/markdown.js";

export function MarkdownText({ text, className }) {
  const html = markdownToHtml(text);
  if (!html) return null;
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
