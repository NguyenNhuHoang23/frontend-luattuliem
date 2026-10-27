function range(count) {
  return Array.from({ length: count }, (_, index) => index);
}

export function Skeleton({ className = "", style, ...props }) {
  return (
    <span
      className={`sk ${className}`.trim()}
      style={style}
      aria-hidden="true"
      {...props}
    />
  );
}

export function SkeletonStatus({ children }) {
  return (
    <span className="page-heading-sr-only" role="status" aria-live="polite">
      {children}
    </span>
  );
}

export function AboutArticleSkeleton() {
  return (
    <article className="about-post sk-stack" aria-busy="true">
      <SkeletonStatus>Đang tải nội dung giới thiệu…</SkeletonStatus>
      <Skeleton className="sk-heading" style={{ width: "58%" }} />
      <div className="article-body sk-stack">
        <Skeleton className="sk-line" />
        <Skeleton className="sk-line" />
        <Skeleton className="sk-line" style={{ width: "94%" }} />
        <Skeleton className="sk-line" style={{ width: "76%" }} />
        <Skeleton className="sk-block sk-quote" />
        <Skeleton className="sk-line" />
        <Skeleton className="sk-line" style={{ width: "88%" }} />
        <Skeleton className="sk-line" style={{ width: "64%" }} />
      </div>
    </article>
  );
}

export function AboutNewsDetailSkeleton() {
  return (
    <article className="news-detail sk-stack" aria-busy="true">
      <SkeletonStatus>Đang tải tin tức…</SkeletonStatus>
      <Skeleton className="sk-line sk-line-sm" style={{ width: "160px" }} />
      <Skeleton className="sk-cover" />
      <Skeleton className="sk-line sk-line-sm" style={{ width: "110px" }} />
      <Skeleton className="sk-heading" style={{ width: "82%" }} />
      <div className="article-body sk-stack">
        <Skeleton className="sk-line" />
        <Skeleton className="sk-line" />
        <Skeleton className="sk-line" style={{ width: "91%" }} />
        <Skeleton className="sk-line" />
        <Skeleton className="sk-line" style={{ width: "73%" }} />
        <Skeleton className="sk-line" />
        <Skeleton className="sk-line" style={{ width: "68%" }} />
      </div>
    </article>
  );
}

export function AboutNewsSidebarSkeleton({ count = 5 }) {
  return (
    <div className="news-widget-list" aria-busy="true">
      <SkeletonStatus>Đang tải tin tức…</SkeletonStatus>
      {range(count).map((index) => (
        <div className="news-widget-item has-thumb" key={index}>
          <div className="news-widget-thumb">
            <Skeleton className="sk-fill" />
          </div>
          <div className="news-widget-content sk-stack">
            <Skeleton className="sk-line sk-line-sm" />
            <Skeleton className="sk-line sk-line-sm" style={{ width: "78%" }} />
            <Skeleton className="sk-line sk-line-xs" style={{ width: "42%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CasesListSkeleton() {
  return (
    <div className="sk-stack" aria-busy="true">
      <SkeletonStatus>Đang tải danh sách án lệ…</SkeletonStatus>
      {range(3).map((index) => (
        <article className="case-news-summary sk-stack" key={index}>
          <Skeleton className="sk-line sk-line-sm" style={{ width: "180px" }} />
          <Skeleton className="sk-heading" style={{ width: index ? "72%" : "86%" }} />
          <Skeleton className="sk-line" />
          <Skeleton className="sk-line" style={{ width: "88%" }} />
          <Skeleton className="sk-line sk-line-sm" style={{ width: "92px" }} />
        </article>
      ))}
      <ul className="case-news-list">
        {range(4).map((index) => (
          <li key={index}>
            <Skeleton className="sk-line sk-line-sm" style={{ width: "92px" }} />
            <Skeleton className="sk-line" style={{ width: `${78 - index * 6}%` }} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CaseDetailSkeleton() {
  return (
    <div className="page-case-detail" aria-busy="true">
      <main className="main-container">
        <div className="wrap">
          <SkeletonStatus>Đang tải án lệ…</SkeletonStatus>
          <div className="case-tabs-bar">
            <div className="case-tabs-nav sk-tabs">
              <Skeleton className="sk-tab" />
              <Skeleton className="sk-tab" />
              <Skeleton className="sk-tab" />
            </div>
            <Skeleton className="sk-tab" style={{ width: "140px" }} />
          </div>
          <div className="court-doc-card sk-stack">
            <Skeleton className="sk-heading" style={{ width: "46%" }} />
            <Skeleton className="sk-line" style={{ width: "90%" }} />
            <Skeleton className="sk-line" style={{ width: "70%" }} />
            <Skeleton className="sk-heading sk-heading-sm" style={{ width: "38%" }} />
            <Skeleton className="sk-block sk-quote" />
            <Skeleton className="sk-heading sk-heading-sm" style={{ width: "44%" }} />
            <Skeleton className="sk-line" />
            <Skeleton className="sk-line" style={{ width: "86%" }} />
            <Skeleton className="sk-line" style={{ width: "74%" }} />
            <Skeleton className="sk-cover" />
            <Skeleton className="sk-line" />
            <Skeleton className="sk-line" style={{ width: "93%" }} />
            <Skeleton className="sk-line" style={{ width: "61%" }} />
          </div>
        </div>
      </main>
    </div>
  );
}

export function RecruitmentSkeleton() {
  return (
    <div className="sk-stack" aria-busy="true">
      <SkeletonStatus>Đang tải nội dung tuyển dụng…</SkeletonStatus>
      <Skeleton className="sk-line" />
      <Skeleton className="sk-line" style={{ width: "88%" }} />
      <Skeleton className="sk-line" style={{ width: "64%" }} />
      <div className="recruitment-topic-menu sk-recruitment-menu">
        {range(4).map((index) => (
          <Skeleton className="sk-accordion" key={index} />
        ))}
      </div>
    </div>
  );
}

export function MemberDirectorySkeleton({ count = 6 }) {
  return (
    <div className="member-thread-list directory-list" aria-busy="true">
      <SkeletonStatus>Đang tải danh sách thành viên…</SkeletonStatus>
      {range(count).map((index) => (
        <div className="member-thread-choice directory-item" key={index}>
          <Skeleton className="sk-avatar" />
          <div className="directory-item-info sk-stack">
            <Skeleton className="sk-line sk-line-sm" style={{ width: "68%" }} />
            <Skeleton className="sk-line sk-line-xs" style={{ width: "42%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MemberDossierBodySkeleton() {
  return (
    <div className="dossier-view-container" aria-busy="true">
      <SkeletonStatus>Đang tải hồ sơ chi tiết…</SkeletonStatus>
      <div className="dossier-meta-card sk-stack">
        <Skeleton className="sk-line sk-line-sm" style={{ width: "210px" }} />
        <div className="dossier-meta-grid sk-meta-grid">
          {range(4).map((index) => (
            <div className="meta-tile sk-stack" key={index}>
              <Skeleton className="sk-line sk-line-xs" style={{ width: "48%" }} />
              <Skeleton className="sk-line sk-line-sm" style={{ width: "72%" }} />
            </div>
          ))}
        </div>
      </div>
      <div className="dossier-cases-card sk-stack">
        <Skeleton className="sk-line sk-line-sm" style={{ width: "240px" }} />
        {range(2).map((index) => (
          <Skeleton className="sk-block sk-case-row" key={index} />
        ))}
      </div>
    </div>
  );
}

export function MemberDossierSkeleton() {
  return (
    <section className="member-dossier-panel" aria-busy="true">
      <div className="dossier-hero-header">
        <div className="dossier-hero-left">
          <Skeleton className="sk-avatar sk-avatar-lg" />
          <div className="sk-stack">
            <Skeleton className="sk-heading sk-heading-sm" style={{ width: "220px" }} />
            <Skeleton className="sk-line sk-line-sm" style={{ width: "160px" }} />
          </div>
        </div>
      </div>
      <div className="dossier-content-body">
        <MemberDossierBodySkeleton />
      </div>
    </section>
  );
}

export function MemberThreadListSkeleton({ count = 6 }) {
  return (
    <>
      <SkeletonStatus>Đang tải danh sách trao đổi…</SkeletonStatus>
      {range(count).map((index) => (
        <div className="member-thread-choice sk-stack" key={index}>
          <Skeleton className="sk-line sk-line-sm" style={{ width: "62%" }} />
          <Skeleton className="sk-line sk-line-xs" style={{ width: "84%" }} />
        </div>
      ))}
    </>
  );
}

export function MemberMessagesSkeleton({ count = 4 }) {
  return (
    <div className="sk-message-list" aria-busy="true">
      <SkeletonStatus>Đang tải tin nhắn…</SkeletonStatus>
      {range(count).map((index) => (
        <div
          className={`member-message ${index % 2 ? "is-own" : ""}`}
          key={index}
        >
          <div className="member-message-meta">
            <Skeleton className="sk-line sk-line-xs" style={{ width: "96px" }} />
          </div>
          <Skeleton
            className="sk-block sk-bubble"
            style={{ width: index % 2 ? "58%" : "66%" }}
          />
        </div>
      ))}
    </div>
  );
}
