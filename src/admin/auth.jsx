import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginAdmin, logoutAdmin } from "./api.js";

const AUTH_KEY = "luattuliem-admin-session";
export const ADMIN_EMAIL = "admin@luattuliem.vn";
export const ADMIN_PASSWORD = "Tuliem@2026";

const AuthContext = createContext(null);

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
  } catch {
    return null;
  }
}

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  useEffect(() => {
    const sync = () => setSession(readSession());
    window.addEventListener("admin-auth-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("admin-auth-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const api = useMemo(
    () => ({
      session,
      async login(email, password) {
        const payload = await loginAdmin(email, password);
        const next = {
          token: payload.token,
          email: payload.user.email,
          name: payload.user.name,
          loggedInAt: Date.now(),
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(next));
        setSession(next);
        return next;
      },
      async logout() {
        try {
          await logoutAdmin();
        } catch {
          // Token hết hạn vẫn xóa phiên local.
        }
        localStorage.removeItem(AUTH_KEY);
        setSession(null);
      },
    }),
    [session],
  );

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export function useAdminAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAdminAuth phải dùng trong AdminAuthProvider");
  return value;
}
