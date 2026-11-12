import { recruitmentArticle } from "../data/recruitment.js";

const stripBullet = (text) => text.trim().replace(/^[•*-]\s+/u, "");

export function RecruitmentCard({ role, common, onApply }) {
  const [audience = {}, work = {}, income = {}, ...otherSections] = role.sections || [];
  const commonLines = new Set([
    ...common.items,
    ...common.paragraphs,
    ...recruitmentArticle.requirements,
    recruitmentArticle.policy,
  ].map(stripBullet));
  const clean = (lines = [], repeatedHeading = "") => lines.map(stripBullet)
    .filter((line) => line && !commonLines.has(line) && line !== repeatedHeading);
  const sections = [
    { title: "Yêu cầu chung", ...common, id: "recruitment-requirements" },
    { title: "Yêu cầu riêng", items: clean(role.audience ?? audience.items, work.title) },
    { title: "Mô tả công việc", items: clean(role.work ?? work.items, work.title) },
    { title: "Thu nhập", paragraphs: clean(role.income ?? income.paragraphs ?? income.items) },
    {
      title: "Ghi chú",
      paragraphs: [...new Set([
        ...clean(role.audienceNote ?? audience.paragraphs),
        ...clean(role.workNote ?? work.paragraphs),
      ])],
    },
    ...otherSections,
  ];
  return (
    <article className="role-card" id={role.id}>
      <h2 className="recruitment-role-title">
        {(role.title || role.name || "").replace(/^\d+\.\s*/, "")}
      </h2>
      {sections.map((section) => (
        <section className="recruitment-role-section" id={section.id} key={section.title}>
          <h3>{section.title}</h3>
          {section.items?.length ? (
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {!section.items?.length && !section.paragraphs?.length ? (
            <p>Chưa có thông tin.</p>
          ) : null}
        </section>
      ))}
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
