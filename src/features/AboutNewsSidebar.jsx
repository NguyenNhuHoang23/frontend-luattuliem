import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { listPublicNews } from "../api/public.js";
import { AboutNewsSidebarSkeleton } from "../components/Skeleton.jsx";

export function AboutNewsSidebar() {
  const { id: activeId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    listPublicNews()
      .then((rows) => {
        if (!cancelled) setItems(rows);
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
  }, []);

  return (
    <aside className="sidebar news-sidebar">
      <h3 className="sidebar-title">TIN TỨC</h3>
      {loading ? <AboutNewsSidebarSkeleton /> : null}
      {error ? <p className="news-widget-empty">{error}</p> : null}
      {!loading && !error && items.length === 0 ? (
        <p className="news-widget-empty">Chưa có tin tức.</p>
      ) : null}
      {!loading ? (
        <div className="news-widget-list">
          {items.map((item) => (
            <Link
              className={`news-widget-item${item.id === activeId ? " is-active" : ""}${item.image ? " has-thumb" : ""}`}
              to={`/gioi-thieu/tin/${item.id}`}
              key={item.id}
            >
              {item.image ? (
                <div className="news-widget-thumb">
                  <img src={item.image} alt="" />
                </div>
              ) : null}
              <div className="news-widget-content">
                <h4 className="news-widget-title">{item.title}</h4>
                {item.excerpt ? (
                  <p className="news-widget-excerpt">{item.excerpt}</p>
                ) : null}
                {item.date ? (
                  <span className="news-widget-date">{item.date}</span>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </aside>
  );
}
