import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { listPublicNews } from "../api/public.js";

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
    <aside className="sidebar">
      <h3 className="sidebar-title">TIN TỨC</h3>
      {loading ? <p className="news-widget-empty">Đang tải tin tức…</p> : null}
      {error ? <p className="news-widget-empty">{error}</p> : null}
      {!loading && !error && items.length === 0 ? (
        <p className="news-widget-empty">Chưa có tin tức.</p>
      ) : null}
      <div className="news-widget-list">
        {items.map((item) => (
          <Link
            className={`news-widget-item${item.id === activeId ? " is-active" : ""}`}
            to={`/gioi-thieu/tin/${item.id}`}
            key={item.id}
          >
            <div className="news-widget-thumb">
              {item.image ? <img src={item.image} alt="" /> : null}
            </div>
            <div className="news-widget-content">
              <h4 className="news-widget-title">{item.title}</h4>
              <span className="news-widget-date">{item.date}</span>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
