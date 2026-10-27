import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { listPublicCases } from "../api/public.js";
import { deleteMemberCaseArticle } from "../api/member.js";
import { CasesListSkeleton } from "../components/Skeleton.jsx";
import { Modal } from "../components/Modal.jsx";
import { useToast } from "../components/toast-context.js";
import { CaseSummaryModal } from "../features/CaseCard.jsx";
import { CaseComposeModal } from "../features/CaseComposeModal.jsx";
import { useMemberAuth } from "../features/memberAuth.jsx";
import { caseCategories } from "../data/cases.js";
import { sortByPublicationOrder } from "../utils/publicationOrder.js";

const PAGE_SIZE = 10;

function categoryLabel(id) {
  return caseCategories.find((item) => item.id === id)?.label || "";
}

function CaseManageActions({ onEdit, onDelete }) {
  return (
    <div className="case-news-manage">
      <button type="button" className="case-news-more" onClick={onEdit}>
        Sửa
      </button>
      <button
        type="button"
        className="case-news-more case-news-remove"
        onClick={onDelete}
      >
        Xóa
      </button>
    </div>
  );
}

function CaseMeta({ entry }) {
  const field = categoryLabel(entry.category);
  return (
    <div className="case-news-meta">
      {entry.tag ? <span className="case-news-pill">{entry.tag}</span> : null}
      {entry.caseNumber ? (
        <span className="case-news-code">{entry.caseNumber}</span>
      ) : null}
      {field ? <span className="case-news-field">{field}</span> : null}
    </div>
  );
}

export function CasesNews({ entries, canManage, onEdit, onDelete }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCase, setSelectedCase] = useState(null);
  const [category, setCategory] = useState("all");
  const filtered = useMemo(
    () =>
      category === "all"
        ? entries
        : entries.filter((entry) => entry.category === category),
    [entries, category],
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const requestedPage = Number(searchParams.get("page") || 1);
  const page = Number.isSafeInteger(requestedPage)
    ? Math.min(pageCount, Math.max(1, requestedPage))
    : 1;
  const visibleEntries = sortByPublicationOrder(filtered).slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );
  const summaries = visibleEntries.slice(0, 3);
  const remaining = visibleEntries.slice(3);
  const usedCategories = caseCategories.filter(
    (item) =>
      item.id === "all" || entries.some((entry) => entry.category === item.id),
  );

  function changePage(nextPage) {
    const params = new URLSearchParams(searchParams);
    if (nextPage === 1) params.delete("page");
    else params.set("page", String(nextPage));
    setSearchParams(params);
    document
      .querySelector(".page-cases .case-news")
      ?.scrollIntoView({ block: "start" });
  }

  function changeCategory(next) {
    setCategory(next);
    if (searchParams.get("page")) {
      const params = new URLSearchParams(searchParams);
      params.delete("page");
      setSearchParams(params);
    }
  }

  return (
    <>
      {usedCategories.length > 2 ? (
        <div className="filter-tabs" role="tablist" aria-label="Lọc theo nhóm án lệ">
          {usedCategories.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              className={`filter-btn ${category === item.id ? "active" : ""}`}
              aria-selected={category === item.id}
              onClick={() => changeCategory(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
      <div className="case-news-summaries">
        {summaries.map((entry, index) => (
          <article
            className={`case-news-summary${index === 0 ? " is-lead" : ""}`}
            key={entry.id}
          >
            <CaseMeta entry={entry} />
            <h2>
              <Link className="case-news-title" to={`/an-le/${entry.id}`}>
                {entry.title}
              </Link>
            </h2>
            {entry.description ? (
              <p className="case-news-excerpt">{entry.description}</p>
            ) : null}
            <Link className="case-news-more" to={`/an-le/${entry.id}`}>
              Đọc tiếp →
            </Link>
            {canManage ? (
              <CaseManageActions
                onEdit={() => onEdit(entry)}
                onDelete={() => onDelete(entry)}
              />
            ) : null}
          </article>
        ))}
      </div>
      {remaining.length > 0 ? (
        <ul className="case-news-list" aria-label="Các tin tiếp theo">
          {remaining.map((entry) => (
            <li key={entry.id}>
              <span className="case-news-code">
                {entry.caseNumber || entry.code || "Án hay"}
              </span>
              <div className="case-news-list-main">
                <Link className="case-news-title" to={`/an-le/${entry.id}`}>
                  {entry.title}
                </Link>
                {entry.tag ? (
                  <span className="case-news-pill">{entry.tag}</span>
                ) : null}
              </div>
              {canManage ? (
                <CaseManageActions
                  onEdit={() => onEdit(entry)}
                  onDelete={() => onDelete(entry)}
                />
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
      {entries.length === 0 ? (
        <div className="case-news-empty">
          <p>Chưa có án lệ / án hay.</p>
        </div>
      ) : null}
      {entries.length > 0 && filtered.length === 0 ? (
        <div className="case-news-empty">
          <p>Nhóm này chưa có án lệ.</p>
        </div>
      ) : null}
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
  const { session } = useMemberAuth();
  const { showToast } = useToast();
  const [, setSearchParams] = useSearchParams();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [removing, setRemoving] = useState(null);
  const [removingBusy, setRemovingBusy] = useState(false);
  const isDirector = session?.role === "director";

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

  function handleSaved(article) {
    const isEdit = Boolean(editing);
    setEntries((current) => {
      const exists = current.some(
        (item) => item.key === article.key || item.id === article.id,
      );
      if (!exists) return [article, ...current];
      return current.map((item) =>
        item.key === article.key || item.id === article.id ? article : item,
      );
    });
    if (!isEdit) setSearchParams({});
    setComposeOpen(false);
    setEditing(null);
    showToast(isEdit ? "Đã cập nhật án lệ / án hay." : "Đã đăng án lệ / án hay.");
  }

  async function confirmRemove() {
    if (!removing) return;
    setRemovingBusy(true);
    try {
      await deleteMemberCaseArticle(removing.id);
      setEntries((current) =>
        current.filter(
          (item) => item.id !== removing.id && item.key !== removing.key,
        ),
      );
      setRemoving(null);
      showToast("Đã xóa án lệ / án hay.");
    } catch (err) {
      showToast(err.message);
    } finally {
      setRemovingBusy(false);
    }
  }

  return (
    <div className="page-cases">
      <main className="main-container">
        <div className="wrap case-news">
          <h1 className="page-heading-sr-only">Án lệ Án hay</h1>
          <div className="case-news-intro">
            <div>
              <p className="case-news-kicker">Thư viện án lệ</p>
              <p className="case-news-lead">
                Những bản án, án lệ và vụ việc điển hình để tham khảo khi tư vấn
                và giải quyết hồ sơ.
              </p>
            </div>
            {isDirector ? (
              <div className="case-news-toolbar">
                <button
                  className="btn"
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setComposeOpen(true);
                  }}
                >
                  Đăng bài
                </button>
              </div>
            ) : null}
          </div>
          {loading ? <CasesListSkeleton /> : null}
          {error ? <p className="case-news-empty">{error}</p> : null}
          {!loading && !error ? (
            <CasesNews
              entries={entries}
              canManage={isDirector}
              onEdit={(entry) => {
                setEditing(entry);
                setComposeOpen(true);
              }}
              onDelete={setRemoving}
            />
          ) : null}
        </div>
      </main>
      {isDirector ? (
        <>
          <CaseComposeModal
            open={composeOpen}
            article={editing}
            onClose={() => {
              setComposeOpen(false);
              setEditing(null);
            }}
            onSaved={handleSaved}
          />
          <Modal
            className="application-dialog"
            open={Boolean(removing)}
            title="Xóa án lệ / án hay?"
            onClose={() => !removingBusy && setRemoving(null)}
          >
            <p>
              Xóa “{removing?.title}”? Bài sẽ không còn hiện trên trang Án lệ.
            </p>
            <div className="modal-actions">
              <button
                className="btn"
                type="button"
                disabled={removingBusy}
                onClick={confirmRemove}
              >
                {removingBusy ? "Đang xóa…" : "Xóa"}
              </button>
              <button
                className="btn white"
                type="button"
                disabled={removingBusy}
                onClick={() => setRemoving(null)}
              >
                Hủy
              </button>
            </div>
          </Modal>
        </>
      ) : null}
    </div>
  );
}
