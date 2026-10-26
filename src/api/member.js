import { API_URL } from "./config.js";

const AUTH_KEY = "luattuliem-member-session";

function readToken() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || "null")?.token || "";
  } catch {
    return "";
  }
}

async function memberRequest(path) {
  const token = readToken();
  const headers = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, { headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const details = payload.errors
      ? Object.values(payload.errors).flat().join(" ")
      : payload.message;
    throw new Error(details || "Không gọi được máy chủ.");
  }
  return payload;
}

export async function listTeamMembers() {
  const payload = await memberRequest("/thanh-vien/doi-ngu");
  return payload.data || [];
}

export async function getTeamMember(id) {
  const payload = await memberRequest(`/thanh-vien/doi-ngu/${id}`);
  return payload.data ?? null;
}
