import { Outlet } from "react-router-dom";
import { AboutNewsSidebar } from "../features/AboutNewsSidebar.jsx";

export default function AboutPage() {
  return (
    <div className="page-about">
      <main className="main-container">
        <div className="wrap editorial-grid">
          <div className="article-content">
            <Outlet />
          </div>
          <AboutNewsSidebar />
        </div>
      </main>
    </div>
  );
}
