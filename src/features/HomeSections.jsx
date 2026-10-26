import { Link } from "react-router-dom";

export function ServiceCards({ items = [] }) {
  return (
    <div className="grid3">
      {items.map((service) => (
        <article className="service" key={service.title}>
          <h3>{service.title}</h3>
          <p>{service.description}</p>
          {service.buttonLabel ? (
            <Link to={service.buttonHref || "/lien-he"}>
              {service.buttonLabel}
            </Link>
          ) : null}
        </article>
      ))}
    </div>
  );
}

export function HomeRecruitmentRoles({ roles = [], onApply }) {
  return (
    <div>
      {roles.map((role) => (
        <div className="role" key={role.name}>
          <div>
            <h3>{role.name}</h3>
            <p>{role.description}</p>
          </div>
          <button
            type="button"
            aria-label={role.buttonLabel || role.name}
            onClick={() => onApply(role.name)}
          >
            ↗
          </button>
        </div>
      ))}
    </div>
  );
}
