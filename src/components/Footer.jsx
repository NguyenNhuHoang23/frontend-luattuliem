import { Link } from "react-router-dom";
import { images } from "../data/images.js";
import { resolvePublicEmail, site } from "../data/site.js";
import { useCompanyInfo } from "../features/companyInfo.jsx";

const FOOTER_TAGLINE =
  "Đồng hành cùng quyền lợi của bạn — bắt đầu từ sự kết nối, bền vững bằng trách nhiệm.";

const navLinks = [
  { to: "/gioi-thieu", label: "Giới thiệu" },
  { to: "/an-le", label: "Án lệ – Án hay" },
  { to: "/tuyen-dung", label: "Tuyển dụng – Hợp tác" },
  { to: "/", label: "Trang chủ" },
];

const supportLinks = [
  { to: "/thanh-vien", label: "Khu vực thành viên" },
  { to: "/lien-he", label: "Gửi yêu cầu tư vấn" },
];

function shortAddress(address) {
  const text = String(address || "").replace(/\s+/g, " ").trim();
  if (!text) return "Khu vực Phú Diễn, Bắc Từ Liêm, Hà Nội";
  if (/phú diễn/i.test(text) && /bắc từ liêm/i.test(text)) {
    return "Khu vực Phú Diễn, Bắc Từ Liêm, Hà Nội";
  }
  return text;
}

function scrollToTop(event) {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function Footer() {
  const company = useCompanyInfo();
  const name = company.name || site.name;
  const slogan = company.slogan?.includes("bắt đầu từ")
    ? company.slogan
    : FOOTER_TAGLINE;
  const phone = company.phone || site.phone;
  const phoneHref = company.phoneHref || site.phoneHref;
  const email = resolvePublicEmail(company.email);
  const address = shortAddress(company.address);
  const year = new Date().getFullYear();
  const logoSrc =
    images["assets/logo-wordmark.png"] || images["assets/logo.jpg"];

  return (
    <footer className="site-footer">
      <div className="wrap site-footer-main">
        <div className="site-footer-brand">
          <img
            className="site-footer-logo"
            src={logoSrc}
            alt={name}
          />
          <p className="site-footer-slogan">{slogan}</p>
        </div>

        <nav className="site-footer-col" aria-label="Điều hướng">
          <h2 className="site-footer-heading">Điều hướng</h2>
          <ul className="site-footer-list">
            {navLinks.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="site-footer-col" aria-label="Hỗ trợ">
          <h2 className="site-footer-heading">Hỗ trợ</h2>
          <ul className="site-footer-list">
            {supportLinks.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
            <li>
              <a href={phoneHref}>Hotline: {phone}</a>
            </li>
          </ul>
        </nav>

        <div className="site-footer-col">
          <h2 className="site-footer-heading">Thông tin liên hệ</h2>
          <ul className="site-footer-list">
            <li>{address}</li>
            <li>
              <a href={email.href}>{email.address}</a>
            </li>
            <li>
              <a href={phoneHref}>{phone}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="site-footer-bottom">
        <div className="wrap site-footer-bottom-inner">
          <p className="site-footer-copy">
            © {year} {name}. Mọi quyền được bảo lưu.
          </p>
          <a className="site-footer-top btn-with-arrow" href="#top" onClick={scrollToTop}>
            <span>Lên đầu trang</span>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              aria-hidden="true"
            >
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
