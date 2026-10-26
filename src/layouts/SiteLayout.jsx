import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "../components/Header.jsx";
import { Footer } from "../components/Footer.jsx";
import { CompanyInfoProvider } from "../features/companyInfo.jsx";
import { pageMetadata } from "../data/site.js";

export function SiteLayout() {
  const location = useLocation();
  useEffect(() => {
    const metadata = location.pathname.startsWith("/an-le/")
      ? pageMetadata["/an-le"]
      : location.pathname.startsWith("/gioi-thieu/tin/")
        ? pageMetadata["/gioi-thieu/tin"]
        : pageMetadata[location.pathname];
    document.title =
      metadata?.title || "Không tìm thấy trang | Công ty Luật Từ Liêm";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        metadata?.description || "Công ty Luật Từ Liêm",
      );
    const frame = requestAnimationFrame(() => {
      const target = location.hash
        ? document.getElementById(decodeURIComponent(location.hash.slice(1)))
        : null;
      if (target) target.scrollIntoView();
      else window.scrollTo({ top: 0, behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);
  return (
    <CompanyInfoProvider>
      <Header />
      <Outlet />
      <Footer />
    </CompanyInfoProvider>
  );
}
