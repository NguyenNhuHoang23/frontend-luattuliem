import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { listPublicCases } from "../api/public.js";
import { CaseSummaryModal } from "../features/CaseCard.jsx";
import { sortByPublicationOrder } from "../utils/publicationOrder.js";

const PAGE_SIZE = 10;

export function CasesNews({ entries }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCase, setSelectedCase] = useState(null);
  const pageCount = Math.max(1, Math.ceil(entries.length / PAGE_SIZE));
  const requestedPage = Number(searchParams.get("page") || 1);
  const page = Number.isSafeInteger(requestedPage)
    ? Math.min(pageCount, Math.max(1, requestedPage))
    : 1;
  const visibleEntries = sortByPublicationOrder(entries).slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );
  const summaries = visibleEntries.slice(0, 3);
  const remaining = visibleEntries.slice(3);

  function changePage(nextPage) {
    const params = new URLSearchParams(searchParams);
    if (nextPage === 1) params.delete("page");
    else params.set("page", String(nextPage));
    setSearchParams(params);
    document
      .querySelector(".page-cases .case-news")
      ?.scrollIntoView({ block: "start" });
  }

  return (
    <>
      <div className="case-news-summaries">
        {summaries.map((entry) => (
          <article className="case-news-summary" key={entry.id}>
            <h2>
              <Link
                className="case-news-title"
                to={`/an-le/${entry.id}`}
              >
                {entry.title}
              </Link>
            </h2>
            <p className="case-news-excerpt">{entry.description}</p>
            <Link
              className="case-news-more"
              to={`/an-le/${entry.id}`}
            >
              Đọc tiếp →
            </Link>
          </article>
        ))}
      </div>
      {remaining.length > 0 ? (
        <ul className="case-news-list" aria-label="Các tin tiếp theo">
          {remaining.map((entry) => (
            <li key={entry.id}>
              <Link
                className="case-news-title"
                to={`/an-le/${entry.id}`}
              >
                {entry.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      {entries.length === 0 ? <p>Chưa có án lệ / án hay.</p> : null}
      {pageCount > 1 ? (
        <nav className="case-pagination" aria-label="Phân trang án lệ">
          <button disabled={page === 1} onClick={() => changePage(page - 1)}>
            Trước
          </button>
          <span aria-live="polite">
            Trang {page} / {pageCount}
          </span>
          <button
            disabled={page === pageCount}
            onClick={() => changePage(page + 1)}
          >
            Sau
          </button>
        </nav>
      ) : null}
      <CaseSummaryModal
        entry={selectedCase}
        onClose={() => setSelectedCase(null)}
      />
    </>
  );
}

export default function CasesPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    listPublicCases()
      .then((items) => {
        if (!cancelled) setEntries(items);
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
    <div className="page-cases">
      <main className="main-container">
        <div className="wrap case-news">
          <h1 className="page-heading-sr-only">Án lệ Án hay</h1>
          {loading ? <p>Đang tải danh sách án lệ…</p> : null}
          {error ? <p>{error}</p> : null}
          {!loading && !error ? <CasesNews entries={entries} /> : null}
        </div>
      </main>
    </div>
  );
}
