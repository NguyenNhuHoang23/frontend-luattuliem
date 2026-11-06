import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listPublicCases } from "../api/public.js";
import { caseCategories } from "../data/cases.js";
import { images } from "../data/images.js";

const FALLBACK_IMAGE = images["assets/toa-an-nhan-dan-toi-cao.png"] || images["assets/law-office-hero.png"];
const MAX_COLUMNS = 4;

function caseImageSrc(image) {
  if (!image) return FALLBACK_IMAGE;
  if (image.startsWith("http") || image.startsWith("/")) return image;
  return images[image] || FALLBACK_IMAGE;
}

function categoryLabel(categoryId) {
  return (
    caseCategories.find((item) => item.id === categoryId)?.label ||
    categoryId ||
    "Án lệ khác"
  );
}

function buildColumns(entries, currentId) {
  const others = entries.filter(
    (item) => item.id !== currentId && item.key !== currentId,
  );
  if (!others.length) return [];

  const byCategory = new Map();
  for (const item of others) {
    const key = item.category || "khac";
    if (!byCategory.has(key)) byCategory.set(key, []);
    byCategory.get(key).push(item);
  }

  const orderedIds = [
    ...caseCategories.filter((c) => c.id !== "all").map((c) => c.id),
    ...[...byCategory.keys()].filter(
      (id) => !caseCategories.some((c) => c.id === id),
    ),
  ].filter((id) => byCategory.has(id));

  return orderedIds.slice(0, MAX_COLUMNS).map((categoryId) => {
    const items = byCategory.get(categoryId) || [];
    const featured = items[0];
    return {
      id: categoryId,
      label: categoryLabel(categoryId),
      tags: [...new Set(items.map((item) => item.tag).filter(Boolean))].slice(
        0,
        3,
      ),
      featured,
    };
  });
}

export function CaseRelatedSuggestions({ currentId, currentCategory }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    let cancelled = false;
    listPublicCases()
      .then((items) => {
        if (!cancelled) setEntries(Array.isArray(items) ? items : []);
      })
      .catch(() => {
        if (!cancelled) setEntries([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const columns = useMemo(() => {
    const built = buildColumns(entries, currentId);
    if (!currentCategory || !built.length) return built;
    const preferred = built.find((col) => col.id === currentCategory);
    if (!preferred) return built;
    return [preferred, ...built.filter((col) => col.id !== currentCategory)];
  }, [entries, currentId, currentCategory]);

  if (!columns.length) return null;

  return (
    <section className="case-related-suggestions" aria-label="Bài viết liên quan">
      <div className="case-related-suggestions-head">
        <h2>Gợi ý án lệ – án hay liên quan</h2>
        <Link className="case-related-all btn-with-arrow" to="/an-le">
          <span>Xem tất cả</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>

      <div className="case-related-grid">
        {columns.map((column) => (
          <div className="case-related-column" key={column.id}>
            <div className="case-related-column-head">
              <h3>
                <Link to="/an-le">{column.label}</Link>
              </h3>
              {column.tags.length ? (
                <div className="case-related-tags">
                  {column.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              ) : null}
            </div>

            {column.featured ? (
              <Link
                className="case-related-featured"
                to={`/an-le/${column.featured.id}`}
              >
                <img
                  src={caseImageSrc(column.featured.image)}
                  alt=""
                  loading="lazy"
                />
                <strong>{column.featured.title}</strong>
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
