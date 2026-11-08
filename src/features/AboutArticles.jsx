import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { listPublicAboutArticles } from "../api/public.js";
import { IconArrowRight } from "../components/IconArrow.jsx";
import { AboutArticleSkeleton } from "../components/Skeleton.jsx";
import { aboutArticles as defaultAboutArticles } from "../data/about.js";
import { images } from "../data/images.js";
import { sortByPublicationOrder } from "../utils/publicationOrder.js";

const regularWeightPhrases = new Set([
  "Một người hiểu chuyện, một người hiểu luật, cùng phối hợp có thể giúp khách hàng bớt nhiều bước đường.",
  "luật sư chuyên nghiệp và cộng tác viên tại địa phương",
  "cộng tác viên hỗ trợ khách hàng hoặc cộng tác viên pháp lý",
]);

function isExcludedAboutBlock(block) {
  if (!block) return true;
  if (block.type === "gallery") return true;
  if (
    block.type === "heading" &&
    /hình ảnh hoạt động/i.test(block.text || "")
  ) {
    return true;
  }
  if (
    block.type === "paragraph" &&
    /tiếp nhận, nghiên cứu hồ sơ cho đến khi cử luật sư/i.test(block.text || "")
  ) {
    return true;
  }
  return false;
}

function GalleryImage({ item }) {
  const src = images[item.image] || item.image;
  const [broken, setBroken] = useState(!src);
  if (broken) {
    return (
      <div className="gallery-card is-placeholder" key={item.image}>
        <div className="gallery-card-desc">
          <b>{item.title}</b> {item.description}
        </div>
      </div>
    );
  }
  return (
    <div className="gallery-card" key={item.image}>
      <img src={src} alt={item.alt || ""} onError={() => setBroken(true)} />
      <div className="gallery-card-desc">
        <b>{item.title}</b> {item.description}
      </div>
    </div>
  );
}

function ArticleBlock({ block, headingId }) {
  switch (block.type) {
    case "heading":
      return (
        <h2
          className="article-section-title"
          id={headingId || undefined}
          tabIndex={headingId ? -1 : undefined}
        >
          {block.text}
        </h2>
      );
    case "quote":
      return <div className="quote-box">{block.text}</div>;
    case "gallery":
      return (
        <div className="article-gallery">
          {block.images.map((item) => (
            <GalleryImage item={item} key={item.image} />
          ))}
        </div>
      );
    case "cta": {
      const title =
        block.title || "Cơ hội hợp tác cùng Công ty Luật TNHH MTV Từ Liêm";
      const description =
        block.description ||
        "Tham gia mạng lưới cộng tác viên tại địa phương để cùng phát huy sở trường và phát triển bền vững.";
      return (
        <div className="article-cta-box">
          <h3>{title}</h3>
          <p>{description}</p>
          <Link to={block.link || "/tuyen-dung"} className="btn btn-with-arrow">
            <span>{block.text || "Tìm hiểu cơ hội hợp tác cùng Luật Từ Liêm"}</span>
            <IconArrowRight size={14} />
          </Link>
        </div>
      );
    }
    default:
      return (
        <p>
          {block.lead ? <strong>{block.lead}</strong> : null}
          {block.parts ? (
            block.parts.map((part, index) =>
              part.strong && !regularWeightPhrases.has(part.text.trim()) ? (
                <strong key={index}>{part.text}</strong>
              ) : (
                <span key={index}>{part.text}</span>
              ),
            )
          ) : block.strong && !regularWeightPhrases.has(block.text?.trim()) ? (
            <strong>{block.text}</strong>
          ) : (
            block.text
          )}
        </p>
      );
  }
}

function focusAboutSection(hash) {
  const id = String(hash || "").replace(/^#/, "");
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;
  document
    .querySelectorAll(".article-section-title.is-targeted")
    .forEach((node) => node.classList.remove("is-targeted"));
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  el.classList.add("is-targeted");
  if (typeof el.focus === "function") {
    el.focus({ preventScroll: true });
  }
}

export function AboutArticles({ entries }) {
  const location = useLocation();
  const [articles, setArticles] = useState(entries ?? null);
  const [loading, setLoading] = useState(!entries);
  const [error, setError] = useState("");

  useEffect(() => {
    if (entries) {
      setArticles(entries);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");
    listPublicAboutArticles()
      .then((items) => {
        if (!cancelled) setArticles(items);
      })
      .catch((err) => {
        if (!cancelled) {
          setArticles([]);
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [entries]);

  useEffect(() => {
    if (loading || !articles?.length || !location.hash) return undefined;
    const timer = window.setTimeout(() => focusAboutSection(location.hash), 80);
    return () => window.clearTimeout(timer);
  }, [loading, articles, location.hash, location.key]);

  if (loading) {
    return <AboutArticleSkeleton />;
  }

  if (error) {
    return <p className="article-body">{error}</p>;
  }

  const totalBlocks = (articles || []).reduce(
    (sum, a) => sum + (a.blocks?.length || 0),
    0,
  );
  const displayArticles =
    !articles?.length || totalBlocks <= 4 ? defaultAboutArticles : articles;

  let headingIndex = 0;

  return (
    <>
      {sortByPublicationOrder(displayArticles, "oldest").map((entry, index) => {
        const Heading = index === 0 ? "h1" : "h2";
        const visibleBlocks = (entry.blocks || []).filter(
          (b) => !isExcludedAboutBlock(b),
        );
        return (
          <article className="about-post" key={entry.id} id={entry.id}>
            <Heading
              className={
                entry.showTitle ? "article-content-heading" : "page-heading-sr-only"
              }
            >
              {entry.title}
            </Heading>

            <div className="article-body">
              {visibleBlocks.map((block, i) => {
                const headingId =
                  block.type === "heading" ? `muc-${++headingIndex}` : undefined;
                return <ArticleBlock key={i} block={block} headingId={headingId} />;
              })}
            </div>
          </article>
        );
      })}
    </>
  );
}
