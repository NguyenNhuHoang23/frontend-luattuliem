import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { listPublicCases } from "../api/public.js";
import { deleteMemberCaseArticle } from "../api/member.js";
import { CasesListSkeleton } from "../components/Skeleton.jsx";
import { IconArrowRight } from "../components/IconArrow.jsx";
import { Modal } from "../components/Modal.jsx";
import { useToast } from "../components/toast-context.js";
import { CaseComposeModal } from "../features/CaseComposeModal.jsx";
import { useMemberAuth } from "../features/memberAuth.jsx";
import { sortByPublicationOrder } from "../utils/publicationOrder.js";

const PAGE_SIZE = 10;
const categoryLabels = {
  "dat-dai": "Đất đai & Nhà ở",
  "hop-dong": "Hợp đồng & Dân sự",
  "thua-ke": "Thừa kế & Gia đình",
  "to-tung": "Tham gia tố tụng",
  "lao-dong": "Lao động & Việc làm",
};

function searchableText(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLocaleLowerCase("vi");
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

export function CasesNews({ entries, canManage, onCreate, onEdit, onDelete }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") === "oldest" ? "oldest" : "newest";
  const categories = [...new Set(entries.map((entry) => entry.category).filter(Boolean))];
  const filteredEntries = entries.filter((entry) =>
    (!category || entry.category === category) &&
    searchableText(`${entry.title} ${entry.description || ""} ${entry.caseNumber || ""} ${entry.code || ""}`).includes(searchableText(query.trim())),
  );
  const pageCount = Math.max(1, Math.ceil(filteredEntries.length / PAGE_SIZE));
  const requestedPage = Number(searchParams.get("page") || 1);
  const page = Number.isSafeInteger(requestedPage)
    ? Math.min(pageCount, Math.max(1, requestedPage))
    : 1;
  const visibleEntries = sortByPublicationOrder(filteredEntries, sort).slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  function search(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams(searchParams);
    for (const key of ["q", "category"]) {
      const value = String(form.get(key) || "").trim();
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");
    setSearchParams(params);
  }

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
      <header className="case-directory-heading">
        <h1>Danh sách án lệ – án hay</h1>
        <span aria-live="polite">{filteredEntries.length} kết quả</span>
      </header>
      <div className="case-directory-tools">
      <button
        className="case-directory-filter-toggle"
        type="button"
        aria-expanded={filtersOpen}
        aria-controls="case-directory-filters"
        onClick={() => setFiltersOpen((open) => !open)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <path d="M4 7h16M4 17h16M8 4v6M16 14v6" />
        </svg>
        <span>Bộ lọc{query || category || sort === "oldest" ? " • Đang áp dụng" : ""}</span>
        <svg className="case-directory-filter-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div id="case-directory-filters" className={`case-directory-controls${filtersOpen ? " is-open" : ""}`}>
      <form className="case-directory-search" onSubmit={search} role="search" aria-label="Tìm kiếm án lệ">
        <label className="case-directory-query">
          <span className="page-heading-sr-only">Số hiệu hoặc từ khóa</span>
          <input key={query} name="q" type="search" defaultValue={query} placeholder="Nhập số hiệu hoặc từ khóa…" />
        </label>
        <label>
          <span className="page-heading-sr-only">Lĩnh vực</span>
          <select key={category} name="category" defaultValue={category}>
            <option value="">Tất cả lĩnh vực</option>
            {categories.map((id) => <option value={id} key={id}>{categoryLabels[id] || id}</option>)}
          </select>
        </label>
        <button className="btn" type="submit">Tìm kiếm</button>
      </form>
      <div className="case-directory-sort">
        <label>Sắp xếp:
          <select value={sort} onChange={(event) => {
            const params = new URLSearchParams(searchParams);
            if (event.target.value === "oldest") params.set("sort", "oldest");
            else params.delete("sort");
            params.delete("page");
            setSearchParams(params);
          }}>
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
          </select>
        </label>
      </div>
      </div>
      {canManage ? (
        <div className="case-news-toolbar">
          <button className="btn" type="button" onClick={onCreate}>Đăng bài</button>
        </div>
      ) : null}
      </div>
      <div className="case-directory-list">
        {visibleEntries.map((entry, index) => (
          <article className="case-directory-row" key={entry.id}>
            <div className="case-directory-content">
              <h2><Link className="case-directory-title" to={`/an-le/${entry.id}`}>{entry.title}</Link></h2>
              {index < 3 && entry.description ? <p>{entry.description}</p> : null}
            </div>
            {entry.category ? <span className="case-directory-category">{categoryLabels[entry.category] || entry.category}</span> : <span />}
            <Link className="case-directory-read" to={`/an-le/${entry.id}`} aria-label={`Đọc tiếp: ${entry.title}`}>
              Đọc tiếp <IconArrowRight size={14} />
            </Link>
            {canManage ? <CaseManageActions onEdit={() => onEdit(entry)} onDelete={() => onDelete(entry)} /> : null}
          </article>
        ))}
      </div>
      {filteredEntries.length === 0 ? (
        <div className="case-news-empty" role="status">
          <p>{entries.length ? "Không tìm thấy bài viết phù hợp. Hãy thử từ khóa hoặc lĩnh vực khác." : "Chưa có án lệ / án hay."}</p>
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
          {loading || error ? <h1 className="case-directory-loading-title">Danh sách án lệ – án hay</h1> : null}
          {loading ? <CasesListSkeleton /> : null}
          {error ? <p className="case-news-empty">{error}</p> : null}
          {!loading && !error ? (
            <CasesNews
              entries={entries}
              canManage={isDirector}
              onCreate={() => {
                setEditing(null);
                setComposeOpen(true);
              }}
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
