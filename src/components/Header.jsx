import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { navigation, site } from "../data/site.js";
import { images } from "../data/images.js";
import { useCompanyInfo } from "../features/companyInfo.jsx";

function shortHours(workingHours) {
  const first = String(workingHours || "")
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);
  return first || "Thứ 2 – Thứ 7: 08:00 – 17:30";
}

function HeaderContactIcon({ type }) {
  if (type === "zalo" || type === "phone") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.68 2.34a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.74-1.25a2 2 0 0 1 2.11-.45c.74.32 1.53.55 2.34.68A2 2 0 0 1 22 16.92z" />
      </svg>
    );
  }

  if (type === "link") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    );
  }

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function resolveHeaderContact(company) {
  const type = company.headerContactType || "email";
  const email = company.email || "contact@luattuliem.vn";
  const phone = company.phone || site.phone;
  const value =
    company.headerContactValue ||
    (type === "zalo" || type === "phone" ? phone : type === "link" ? company.website || email : email);
  const href =
    company.headerContactHref ||
    (type === "zalo"
      ? `https://zalo.me/${String(value).replace(/[^\d]/g, "")}`
      : type === "phone"
        ? company.phoneHref || `tel:${String(value).replace(/[^\d+]/g, "")}`
        : type === "link"
          ? value
          : `mailto:${value}`);

  return {
    type,
    label:
      company.headerContactLabel ||
      (type === "zalo"
        ? "Zalo tiếp nhận"
        : type === "phone"
          ? "Hotline tiếp nhận"
          : type === "link"
            ? "Liên hệ nhanh"
            : "Email tiếp nhận"),
    value,
    href,
    hint:
      company.headerContactHint ||
      (type === "zalo"
        ? "Nhắn Zalo để được tư vấn pháp lý"
        : type === "phone"
          ? "Gọi điện để được tư vấn pháp lý"
          : type === "link"
            ? "Bấm để liên hệ tư vấn pháp lý"
            : "Gửi email để được tư vấn pháp lý"),
  };
}

export function Header() {
  const company = useCompanyInfo();
  const location = useLocation();
  const [menu, setMenu] = useState({ key: null, open: false });
  const toggleRef = useRef(null);
  const open = menu.key === location.key && menu.open;
  const closeMenu = () => setMenu({ key: location.key, open: false });
  const hours = shortHours(company.workingHours);
  const slogan = company.slogan || site.slogan;
  const contact = resolveHeaderContact(company);
  const isExternal =
    /^https?:/i.test(contact.href) ||
    contact.href.startsWith("mailto:") ||
    contact.href.startsWith("tel:");

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const close = () => setMenu({ key: null, open: false });
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Escape" && open) {
      closeMenu();
      toggleRef.current?.focus();
    }
  };

  return (
    <>
      <aside className="top-bar" aria-label="Thông tin nhanh">
        <div className="wrap top-bar-content">
          <div className="top-bar-left">
            <span className="top-bar-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {hours}
            </span>
          </div>
          <div className="top-bar-right">
            <span className="top-badge-slogan">✦ {slogan}</span>
          </div>
        </div>
      </aside>

      <header
        className={`site-header navigation-ready${open ? " menu-open" : ""}`}
        id="siteHeader"
        onKeyDown={handleKeyDown}
      >
        <div className="wrap masthead">
          <Link className="brand" to="/" aria-label={`${site.name} - Về trang chủ`} onClick={closeMenu}>
            <img
              className="brand-logo-img"
              src={images["assets/logo.jpg"]}
              alt={site.name}
            />
            <div className="brand-text">
              <small>{company.brandPrefix || site.brandPrefix}</small>
              <strong>{company.brandName || site.brandName}</strong>
            </div>
          </Link>

          <div className="header-actions">
            <div className="header-contact-box">
              <div className="header-contact-icon" aria-hidden="true">
                <HeaderContactIcon type={contact.type} />
              </div>
              <div className="header-contact-text">
                <span className="header-contact-kicker">{contact.label}</span>
                {isExternal ? (
                  <a
                    className="header-contact-phone"
                    href={contact.href}
                    target={/^https?:/i.test(contact.href) ? "_blank" : undefined}
                    rel={/^https?:/i.test(contact.href) ? "noopener noreferrer" : undefined}
                  >
                    {contact.value}
                  </a>
                ) : (
                  <Link className="header-contact-phone" to={contact.href || "/lien-he"} onClick={closeMenu}>
                    {contact.value}
                  </Link>
                )}
                <span className="header-contact-sub">{contact.hint}</span>
              </div>
            </div>
            <button
              ref={toggleRef}
              className="menu-toggle masthead-menu-btn"
              type="button"
              aria-controls="site-navigation"
              aria-expanded={open}
              aria-label={open ? "Đóng menu" : "Mở menu"}
              onClick={() => setMenu({ key: location.key, open: !open })}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>Menu</span>
            </button>
          </div>
        </div>

        <div className={`nav-line${open ? " menu-open" : ""}`}>
          <div className="wrap nav-wrap">
            <nav
              id="site-navigation"
              className={`primary-nav${open ? " open" : ""}`}
              aria-label="Điều hướng chính"
            >
              {navigation.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    data-label={item.label}
                    className={[item.member ? "memberlink" : "", active ? "active" : ""]
                      .filter(Boolean)
                      .join(" ")}
                    aria-current={active ? "page" : undefined}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="nav-aside">
              <span className="nav-pulse-dot" aria-hidden="true" />
              <span>Kết nối vì quyền lợi của bạn</span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
