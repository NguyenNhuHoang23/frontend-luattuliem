export function RecruitmentTopicIcon({ name = "", document = false }) {
  const label = name.toLocaleLowerCase("vi");
  return (
    <span className="recruitment-topic-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {document ? (
          <>
            <path d="M13 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5M7 7h6M7 11h3m2 6 1-4 7-7 3 3-7 7-4 1Z" />
          </>
        ) : /khách|hỗ trợ/.test(label) ? (
          <>
            <circle cx="12" cy="7" r="3" />
            <path d="M6 21v-2a6 6 0 0 1 12 0v2M4 5a3 3 0 0 0 0 6m16-6a3 3 0 0 1 0 6M2 20v-2a4 4 0 0 1 3-4m17 6v-2a4 4 0 0 0-3-4" />
          </>
        ) : label.includes("luật sư") ? (
          <>
            <rect x="2" y="7" width="20" height="15" rx="2" />
            <path d="M8 7V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3M2 13a24 24 0 0 0 20 0M12 12v4" />
          </>
        ) : (
          <>
            <path d="M12 3v18M6 21h12M4 7h16M5 7l-4 9h8L5 7Zm14 0-4 9h8l-4-9Z" />
            <path d="M1 16a4 4 0 0 0 8 0m6 0a4 4 0 0 0 8 0" />
          </>
        )}
      </svg>
    </span>
  );
}
