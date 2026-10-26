import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getPublicCompanyInfo } from "../api/public.js";
import { site } from "../data/site.js";

export const defaultCompanyInfo = {
  name: site.name,
  phone: site.phone,
  phoneHref: site.phoneHref,
  email: "contact@luattuliem.vn",
  address:
    "Tầng 5, số 73 đường Phú Diễn, phường Phú Diễn, quận Bắc Từ Liêm, Hà Nội.",
  workingHours:
    "Thứ 2 – Thứ 6: 08:00 – 17:30\nThứ 7: 08:00 – 12:00\n(Các vụ việc khẩn cấp tiếp nhận 24/7)",
  website: site.website,
  slogan: site.slogan,
};

const CompanyInfoContext = createContext(defaultCompanyInfo);

export function CompanyInfoProvider({ children }) {
  const [info, setInfo] = useState(defaultCompanyInfo);

  useEffect(() => {
    let cancelled = false;
    getPublicCompanyInfo()
      .then((data) => {
        if (!cancelled && data) {
          setInfo({ ...defaultCompanyInfo, ...data });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => info, [info]);

  return (
    <CompanyInfoContext.Provider value={value}>
      {children}
    </CompanyInfoContext.Provider>
  );
}

export function useCompanyInfo() {
  return useContext(CompanyInfoContext);
}

export function LineBreaks({ text }) {
  return String(text || "")
    .split("\n")
    .map((line, index) => (
      <span key={index}>
        {index > 0 ? <br /> : null}
        {line}
      </span>
    ));
}
