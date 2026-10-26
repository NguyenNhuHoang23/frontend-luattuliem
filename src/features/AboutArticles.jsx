import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listPublicAboutArticles } from "../api/public.js";
import { images } from "../data/images.js";
import { sortByPublicationOrder } from "../utils/publicationOrder.js";

function ArticleBlock({ block }) {
  switch (block.type) {
    case "heading":
      return <h2 className="article-section-title">{block.text}</h2>;
    case "quote":
      return <div className="quote-box">{block.text}</div>;
    case "gallery":
      return (
        <div className="article-gallery">
          {block.images.map((item) => (
            <div className="gallery-card" key={item.image}>
              <img src={images[item.image]} alt={item.alt} />
              <div className="gallery-card-desc">
                <b>{item.title}</b> {item.description}
              </div>
            </div>
          ))}
        </div>
      );
    case "cta":
      return (
        <div className="article-cta-box">
          {block.title ? <h3>{block.title}</h3> : null}
          {block.description ? <p>{block.description}</p> : null}
          <Link to={block.link || "/tuyen-dung"} className="btn">
            {block.text} →
          </Link>
        </div>
      );
    default:
      return (
        <p>
          {block.lead ? <strong>{block.lead}</strong> : null}
          {block.parts ? (
            block.parts.map((part, index) =>
              part.strong ? (
                <strong key={index}>{part.text}</strong>
              ) : (
                <span key={index}>{part.text}</span>
              ),
            )
          ) : block.strong ? (
            <strong>{block.text}</strong>
          ) : (
            block.text
          )}
        </p>
      );
  }
}

export function AboutArticles({ entries }) {
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

  if (loading) {
    return <p className="article-body">Đang tải nội dung giới thiệu…</p>;
  }

  if (error) {
    return <p className="article-body">{error}</p>;
  }

  if (!articles?.length) {
    return <p className="article-body">Nội dung giới thiệu đang được cập nhật.</p>;
  }

  return sortByPublicationOrder(articles, "oldest").map((entry, index) => {
    const Heading = index === 0 ? "h1" : "h2";
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
          {(entry.blocks || []).map((block, i) => (
            <ArticleBlock key={i} block={block} />
          ))}
        </div>
      </article>
    );
  });
}
