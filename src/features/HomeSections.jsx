import { Link } from "react-router-dom";
import {
  IconArrowRight,
  stripArrowLabel,
} from "../components/IconArrow.jsx";

export function ServiceCards({ items = [] }) {
  return (
    <div className="three-grid">
      {items.map((service) => (
        <article className="case-preview-card" key={service.title}>
          <h3>{service.title}</h3>
          <p>{service.description}</p>
          {service.buttonLabel ? (
            <div className="case-preview-footer">
              <Link
                className="link-gold btn-with-arrow"
                to={service.buttonHref || "/lien-he"}
              >
                <span>{stripArrowLabel(service.buttonLabel)}</span>
                <IconArrowRight size={13} />
              </Link>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}

export function HomeRecruitmentRoles({ roles = [], onApply }) {
  return (
    <div className="three-grid">
      {roles.map((role) => (
        <div className="collab-card" key={role.name}>
          <div className="collab-card-main">
            <div className="collab-icon-box" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M12 3l7 3v5c0 5-3.2 8.8-7 10-3.8-1.2-7-5-7-10V6l7-3z" />
              </svg>
            </div>
            <div className="collab-card-body">
              <h3>{role.name}</h3>
              <p>{role.description}</p>
            </div>
          </div>
          <button
            type="button"
            className="link-gold btn-with-arrow"
            onClick={() => onApply(role.name)}
          >
            <span>{stripArrowLabel(role.buttonLabel || "Gửi hồ sơ")}</span>
            <IconArrowRight size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}

export function HomeArticles({ items = [] }) {
  return (
    <div className="three-grid">
      {items.map((item) => (
        <article className="case-preview-card" key={item.summary}>
          <h3>{item.summary}</h3>
          <p>{item.body}</p>
        </article>
      ))}
    </div>
  );
}

const PRINCIPLE_ICONS = [
  // scales
  <svg key="scale" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v18" />
    <path d="M5 7h14" />
    <path d="M5 7l-3 7a3.5 3.5 0 1 0 6 0L5 7z" />
    <path d="M19 7l-3 7a3.5 3.5 0 1 0 6 0L19 7z" />
  </svg>,
  // shield
  <svg key="shield" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l7 3v5c0 5-3.2 8.8-7 10-3.8-1.2-7-5-7-10V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>,
  // award / badge
  <svg key="award" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="9" r="5" />
    <path d="M8.5 13.5L7 21l5-2.5L17 21l-1.5-7.5" />
  </svg>,
];

export function HomePrinciples({ items = [] }) {
  return (
    <div className="three-grid principles-grid">
      {items.map((item, index) => {
        const sectionId = item.sectionId || `muc-${index + 1}`;
        return (
          <Link
            className="trust-card card-soft"
            key={item.number || item.title}
            to={`/gioi-thieu#${sectionId}`}
          >
            <div className="icon-glyph-box" aria-hidden="true">
              {PRINCIPLE_ICONS[index % PRINCIPLE_ICONS.length]}
            </div>
            <div className="trust-card-body">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
