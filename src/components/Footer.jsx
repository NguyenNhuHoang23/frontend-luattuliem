import { site } from "../data/site.js";
import { useCompanyInfo } from "../features/companyInfo.jsx";

export function Footer() {
  const company = useCompanyInfo();
  const name = company.name || site.name;
  const slogan = company.slogan || site.slogan;
  const website = company.website || site.website;
  const phone = company.phone || site.phone;

  return (
    <>
      <footer>
        <div className="wrap">
          <div>
            <strong>{name.toLocaleUpperCase("vi")}</strong>
            <br />
            {slogan}.
          </div>
          <div>
            {website} · {phone}
            <br />
            Mẫu thiết kế tham khảo · 2026
          </div>
        </div>
      </footer>
      <div className="demo">
        MẪU GIAO DIỆN • Nội dung và chức năng minh họa phục vụ duyệt thiết kế
      </div>
    </>
  );
}
