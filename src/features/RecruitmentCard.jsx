export function RecruitmentCard({ role, onApply, children }) {
  return (
    <article className="role-card" id={role.id}>
      <h2 className="recruitment-role-title">
        {(role.title || role.name || "").replace(/^\d+\.\s*/, "")}
      </h2>
      {(role.sections || []).map((section) => (
        <div className="recruitment-role-section" key={section.title}>
          <h3>{section.title}</h3>
          {section.items ? (
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      ))}
      {children}
      <div className="role-footer">
        <button
          type="button"
          className="btn-apply"
          onClick={() => onApply(role.name)}
        >
          {role.applyLabel}
        </button>
      </div>
    </article>
  );
}
