import { Link } from "react-router-dom";
import {
  IconArrowExternal,
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

function RecruitmentRoleIcon({ index }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {index % 3 === 0 ? (
        <>
          <path d="M12 3v18M6 21h12M4 7h16M5 7l-4 9h8L5 7Zm14 0-4 9h8l-4-9Z" />
          <path d="M1 16a4 4 0 0 0 8 0m6 0a4 4 0 0 0 8 0" />
        </>
      ) : index % 3 === 1 ? (
        <>
          <circle cx="12" cy="7" r="3" />
          <path d="M6 21v-2a6 6 0 0 1 12 0v2M4 5a3 3 0 0 0 0 6m16-6a3 3 0 0 1 0 6M2 20v-2a4 4 0 0 1 3-4m17 6v-2a4 4 0 0 0-3-4" />
        </>
      ) : (
        <>
          <rect x="2" y="7" width="20" height="15" rx="2" />
          <path d="M8 7V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3M2 13a24 24 0 0 0 20 0M12 12v4" />
        </>
      )}
    </svg>
  );
}

export function HomeRecruitmentRoles({ roles = [], onApply }) {
  return (
    <div className="cooperate-roles-list">
      {roles.map((role, index) => (
        <button
          type="button"
          className="cooperate-role-item"
          key={role.name}
          onClick={() => onApply(role.name)}
          aria-label={`Ứng tuyển vị trí ${role.name}`}
        >
          <span className="role-item-icon" aria-hidden="true">
            <RecruitmentRoleIcon index={index} />
          </span>
          <div className="role-item-main">
            <h3 className="role-item-name">{role.name}</h3>
            <p className="role-item-desc">{role.description}</p>
          </div>
          <span className="role-item-arrow" aria-hidden="true">
            <IconArrowExternal size={18} />
          </span>
        </button>
      ))}
    </div>
  );
}

export function HomeArticles({ items = [] }) {
  return (
    <>
      <div className="articles-desktop-grid three-grid">
        {items.map((item) => (
          <article className="case-preview-card" key={item.summary}>
            <h3>{item.summary}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
      <div className="articles-mobile-accordion">
        {items.map((item) => (
          <details key={item.summary}>
            <summary>{item.summary}</summary>
            <p>{item.body}</p>
          </details>
        ))}
      </div>
    </>
  );
}

function PrincipleIcon({ index }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {index % 3 === 0 ? (
        <>
          <path d="M4 13v-2a8 8 0 0 1 16 0v2M20 17v1a3 3 0 0 1-3 3h-3" />
          <rect x="2" y="11" width="4" height="7" rx="2" />
          <rect x="18" y="11" width="4" height="7" rx="2" />
          <path d="M11 21h3" />
        </>
      ) : index % 3 === 1 ? (
        <>
          <path d="M9 21H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5M7 6h8M7 10h5M7 14h2" />
          <circle cx="16" cy="17" r="5" />
          <path d="m13.5 17 1.5 1.5 3-3" />
        </>
      ) : (
        <>
          <path d="M19 9c0 5-7 11-7 11S5 14 5 9a7 7 0 0 1 14 0Z" />
          <circle cx="12" cy="9" r="2.5" />
          <path d="M6 18c-2 0.4-3 1-3 2 0 1.1 4 2 9 2s9-.9 9-2c0-1-1-1.6-3-2" />
        </>
      )}
    </svg>
  );
}

export function HomePrinciples({ items = [] }) {
  return (
    <div className="three-grid principles-grid">
      {items.map((item, index) => {
        const sectionId = item.sectionId || `muc-${index + 1}`;
        return (
          <Link
            className="trust-card"
            key={item.number || item.title}
            to={`/gioi-thieu#${sectionId}`}
          >
            <span className="trust-card-icon" aria-hidden="true">
              <PrincipleIcon index={index} />
            </span>
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
