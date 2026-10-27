import { API_URL } from "./config.js";

const AUTH_KEY = "luattuliem-member-session";

function readToken() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || "null")?.token || "";
  } catch {
    return "";
  }
}

async function memberRequest(path, options = {}) {
  const token = readToken();
  const headers = { Accept: "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  let body = options.body;
  if (body && typeof body === "object" && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body,
  });
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

export async function listMemberApplications(status) {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  const payload = await memberRequest(`/thanh-vien/de-nghi${query}`);
  return {
    items: payload.data || [],
    pendingCount: payload.pendingCount ?? 0,
  };
}

export async function approveMemberApplication(id, body) {
  const payload = await memberRequest(`/thanh-vien/de-nghi/${id}/duyet`, {
    method: "POST",
    body,
  });
  return {
    application: payload.data ?? null,
    member: payload.member ?? null,
    message: payload.message || "",
  };
}

export async function rejectMemberApplication(id, note = "") {
  const payload = await memberRequest(`/thanh-vien/de-nghi/${id}/tu-choi`, {
    method: "POST",
    body: { note },
  });
  return payload.data ?? null;
}

export async function fetchMemberApplicationCv(id) {
  const token = readToken();
  const headers = { Accept: "application/pdf" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}/thanh-vien/de-nghi/${id}/cv`, {
    headers,
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Không tải được file CV.");
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

export async function createMemberCaseArticle(body) {
  const payload = await memberRequest("/thanh-vien/an-le", {
    method: "POST",
    body,
  });
  return payload.data ?? null;
}

export async function updateMemberCaseArticle(id, body) {
  const payload = await memberRequest(`/thanh-vien/an-le/${encodeURIComponent(id)}`, {
    method: "PUT",
    body,
  });
  return payload.data ?? null;
}

export async function deleteMemberCaseArticle(id) {
  const payload = await memberRequest(`/thanh-vien/an-le/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  return payload;
}
