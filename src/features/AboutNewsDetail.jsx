import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPublicNews } from "../api/public.js";
import { AboutNewsDetailSkeleton } from "../components/Skeleton.jsx";

export default function AboutNewsDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    setArticle(null);
    getPublicNews(id)
      .then((item) => {
        if (!cancelled) setArticle(item);
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
    if (!article) return;
    document.title = `${article.title} | Công ty Luật Từ Liêm`;
  }, [article]);

  if (loading) {
    return <AboutNewsDetailSkeleton />;
  }

  if (error || !article) {
    return (
      <div className="article-body">
        <p>{error || "Không tìm thấy tin tức."}</p>
        <Link className="news-detail-back" to="/gioi-thieu">
          ← Quay lại giới thiệu
        </Link>
      </div>
    );
  }

  return (
    <article className="news-detail">
      <Link className="news-detail-back" to="/gioi-thieu">
        ← Quay lại giới thiệu
      </Link>
      {article.image ? (
        <div className="news-detail-cover">
          <img src={article.image} alt="" />
        </div>
      ) : null}
      {article.date ? <p className="news-detail-date">{article.date}</p> : null}
      <h1 className="article-content-heading">{article.title}</h1>
      {article.excerpt ? <p className="news-detail-excerpt">{article.excerpt}</p> : null}
      <div
        className="article-body news-detail-body"
        dangerouslySetInnerHTML={{ __html: article.content || "" }}
      />
    </article>
  );
}
