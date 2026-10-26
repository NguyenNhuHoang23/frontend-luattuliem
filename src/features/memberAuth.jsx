import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { API_URL } from "../api/config.js";

const AUTH_KEY = "luattuliem-member-session";

const AuthContext = createContext(null);

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
  } catch {
    return null;
  }
}

function writeSession(next) {
  if (next) localStorage.setItem(AUTH_KEY, JSON.stringify(next));
  else localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event("member-auth-changed"));
}

async function parseError(response, payload, fallback) {
  const details = payload.errors
    ? Object.values(payload.errors).flat().join(" ")
    : payload.message;
  return details || fallback;
}

export function MemberAuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  useEffect(() => {
    const sync = () => setSession(readSession());
    window.addEventListener("member-auth-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("member-auth-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const api = useMemo(
    () => ({
      session,
      async login(username, password) {
        const response = await fetch(`${API_URL}/thanh-vien/dang-nhap`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(await parseError(response, payload, "Không đăng nhập được."));
        }
        const member = payload.data || {};
        const next = {
          token: payload.token,
          id: member.id,
          name: member.name,
          username: member.username,
          role: member.role,
          loggedInAt: Date.now(),
        };
        writeSession(next);
        setSession(next);
        return next;
      },
      async logout() {
        const token = readSession()?.token;
        try {
          if (token) {
            await fetch(`${API_URL}/thanh-vien/dang-xuat`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
          }
        } catch {
          // Token hết hạn vẫn xóa phiên local.
        }
        writeSession(null);
        setSession(null);
      },
    }),
    [session],
  );

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export function useMemberAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useMemberAuth phải dùng trong MemberAuthProvider");
  return value;
}
