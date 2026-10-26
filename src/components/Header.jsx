import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { navigation, site } from "../data/site.js";
import { images } from "../data/images.js";
import { useCompanyInfo } from "../features/companyInfo.jsx";

export function Header() {
  const company = useCompanyInfo();
  const location = useLocation();
  const [menu, setMenu] = useState({ key: null, open: false });
  const toggleRef = useRef(null);
  const open = menu.key === location.key && menu.open;
  const closeMenu = () => setMenu({ key: location.key, open: false });

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
      <header
        className={`navigation-ready${open ? " menu-open" : ""}`}
        onKeyDown={handleKeyDown}
      >
        <div className="wrap brandrow">
          <Link className="brand" to="/" onClick={closeMenu}>
            <img
              src={images["assets/logo.jpg"]}
              alt="Logo Công ty Luật Từ Liêm"
            />
            <div>
              <small>{site.brandPrefix}</small>
              <strong>{site.brandName}</strong>
            </div>
          </Link>
          <a className="contacttop" href={company.phoneHref || site.phoneHref}>
            Liên hệ:<b>{company.phone || site.phone}</b>
          </a>
          <button
            ref={toggleRef}
            className="menu-toggle"
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
        <nav id="site-navigation" aria-label="Điều hướng chính">
          <div className="wrap">
            {navigation.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  data-label={item.label}
                  className={[
                    item.member ? "memberlink" : "",
                    active ? "active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-current={active ? "page" : undefined}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>
    </>
  );
}
