import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { ToastProvider } from "./components/ToastProvider.jsx";
import { legacyRoutes } from "./data/site.js";
import { SiteLayout } from "./layouts/SiteLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import { AboutArticles } from "./features/AboutArticles.jsx";
import AboutNewsDetail from "./features/AboutNewsDetail.jsx";
import CasesPage from "./pages/CasesPage.jsx";
import CaseDetailPage from "./pages/CaseDetailPage.jsx";
import RecruitmentPage from "./pages/RecruitmentPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import MemberPortal from "./features/MemberPortal.jsx";
import { MemberAuthProvider } from "./features/memberAuth.jsx";
import ForumPage from "./pages/ForumPage.jsx";
import { AdminAuthProvider } from "./admin/auth.jsx";
import { CmsProvider } from "./admin/CmsProvider.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
import LoginPage from "./admin/pages/LoginPage.jsx";
import OverviewPage from "./admin/pages/OverviewPage.jsx";
import CompanyInfoPage from "./admin/pages/CompanyInfoPage.jsx";
import HomeAdminPage from "./admin/pages/HomeAdminPage.jsx";
import AboutConfigPage from "./admin/pages/AboutConfigPage.jsx";
import NewsPage from "./admin/pages/NewsPage.jsx";
import RecruitmentAdminPage from "./admin/pages/RecruitmentAdminPage.jsx";
import MembersPage from "./admin/pages/MembersPage.jsx";
import MessagesPage from "./admin/pages/MessagesPage.jsx";
import ContactsPage from "./admin/pages/ContactsPage.jsx";

function HomeRoute() {
  const { hash, search } = useLocation();
  return hash === "#thanh-vien" ? (
    <Navigate to={{ pathname: "/thanh-vien", search }} replace />
  ) : (
    <HomePage />
  );
}

function LegacyRedirect({ pathname }) {
  const { search, hash } = useLocation();
  return <Navigate to={{ pathname, search, hash }} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AdminAuthProvider>
          <MemberAuthProvider>
            <CmsProvider>
            <Routes>
              <Route path="/admin/dang-nhap" element={<LoginPage />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="tong-quan" replace />} />
                <Route path="tong-quan" element={<OverviewPage />} />
                <Route path="thong-tin" element={<CompanyInfoPage />} />
                <Route path="trang-chu" element={<HomeAdminPage />} />
                <Route path="gioi-thieu" element={<AboutConfigPage />} />
                <Route path="tin-tuc" element={<NewsPage />} />
                <Route path="tuyen-dung" element={<RecruitmentAdminPage />} />
                <Route path="thanh-vien" element={<MembersPage />} />
                <Route path="tin-nhan" element={<MessagesPage />} />
                <Route path="lien-he" element={<ContactsPage />} />
                <Route path="*" element={<Navigate to="tong-quan" replace />} />
              </Route>
              <Route element={<SiteLayout />}>
                <Route index element={<HomeRoute />} />
                <Route path="gioi-thieu" element={<AboutPage />}>
                  <Route index element={<AboutArticles />} />
                  <Route path="tin/:id" element={<AboutNewsDetail />} />
                </Route>
                <Route path="an-le" element={<CasesPage />} />
                <Route path="an-le/:id" element={<CaseDetailPage />} />
                <Route path="tuyen-dung" element={<RecruitmentPage />} />
                <Route path="lien-he" element={<ContactPage />} />
                <Route path="thanh-vien" element={<MemberPortal />} />
                <Route path="dien-dan" element={<ForumPage />} />
                {Object.entries(legacyRoutes).map(([path, pathname]) => (
                  <Route
                    key={path}
                    path={path}
                    element={<LegacyRedirect pathname={pathname} />}
                  />
                ))}
                <Route
                  path="*"
                  element={
                    <main className="wrap not-found">
                      <h1>Không tìm thấy trang</h1>
                      <Link to="/">Về trang chủ</Link>
                    </main>
                  }
                />
              </Route>
            </Routes>
            </CmsProvider>
          </MemberAuthProvider>
        </AdminAuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
