import { API_URL, rewriteMediaTree } from "../api/config.js";

const AUTH_KEY = "luattuliem-admin-session";

function readToken() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || "null")?.token || "";
  } catch {
    return "";
  }
}

function clearSession() {
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event("admin-auth-changed"));
}

async function request(path, options = {}) {
  const token = readToken();
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
  const payload = await response.json().catch(() => ({}));

  if (response.status === 401 && path !== "/admin/dang-nhap") {
    clearSession();
  }

  if (!response.ok) {
    const details = payload.errors
      ? Object.values(payload.errors).flat().join(" ")
      : payload.message;
    throw new Error(details || "Không gọi được máy chủ.");
  }
  return rewriteMediaTree(payload);
}

export async function loginAdmin(email, password) {
  return request("/admin/dang-nhap", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logoutAdmin() {
  return request("/admin/dang-xuat", { method: "POST" });
}

export async function listAboutArticles() {
  const payload = await request("/admin/gioi-thieu");
  return payload.data || [];
}

export async function createAboutArticle(body) {
  const payload = await request("/admin/gioi-thieu", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return payload.data;
}

export async function updateAboutArticle(id, body) {
  const payload = await request(`/admin/gioi-thieu/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return payload.data;
}

export async function deleteAboutArticle(id) {
  return request(`/admin/gioi-thieu/${id}`, {
    method: "DELETE",
  });
}

export async function updateAboutArticleStatus(id, status) {
  const payload = await request(`/admin/gioi-thieu/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return payload.data;
}

async function requestForm(path, formData) {
  const token = readToken();
  const headers = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers,
    body: formData,
  });
  const payload = await response.json().catch(() => ({}));

  if (response.status === 401) {
    clearSession();
  }

  if (!response.ok) {
    const details = payload.errors
      ? Object.values(payload.errors).flat().join(" ")
      : payload.message;
    throw new Error(details || "Không gọi được máy chủ.");
  }
  return rewriteMediaTree(payload);
}

export async function listNewsArticles() {
  const payload = await request("/admin/tin-tuc");
  return payload.data || [];
}

export async function createNewsArticle(formData) {
  const payload = await requestForm("/admin/tin-tuc", formData);
  return payload.data;
}

export async function updateNewsArticle(id, formData) {
  const payload = await requestForm(`/admin/tin-tuc/${id}`, formData);
  return payload.data;
}

export async function deleteNewsArticle(id) {
  return request(`/admin/tin-tuc/${id}`, {
    method: "DELETE",
  });
}

export async function listCaseArticles() {
  const payload = await request("/admin/an-le");
  return payload.data || [];
}

export async function createCaseArticle(body) {
  const payload = await request("/admin/an-le", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return payload.data;
}

export async function updateCaseArticle(id, body) {
  const payload = await request(`/admin/an-le/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return payload.data;
}

export async function deleteCaseArticle(id) {
  return request(`/admin/an-le/${id}`, {
    method: "DELETE",
  });
}

export async function getHomePage() {
  const payload = await request("/admin/trang-chu");
  return payload.data;
}

export async function updateHomePage(formData) {
  const payload = await requestForm("/admin/trang-chu", formData);
  return payload.data;
}

export async function getCompanyInfo() {
  const payload = await request("/admin/thong-tin");
  return payload.data;
}

export async function updateCompanyInfo(body) {
  const payload = await request("/admin/thong-tin", {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return payload.data;
}

export async function getRecruitmentPage() {
  const payload = await request("/admin/tuyen-dung");
  return payload.data;
}

export async function updateRecruitmentPage(body) {
  const payload = await request("/admin/tuyen-dung", {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return payload.data;
}

export async function listRecruitmentRoles() {
  const payload = await request("/admin/tuyen-dung/vi-tri");
  return payload.data || [];
}

export async function createRecruitmentRole(body) {
  const payload = await request("/admin/tuyen-dung/vi-tri", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return payload.data;
}

export async function updateRecruitmentRole(id, body) {
  const payload = await request(`/admin/tuyen-dung/vi-tri/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return payload.data;
}

export async function deleteRecruitmentRole(id) {
  return request(`/admin/tuyen-dung/vi-tri/${id}`, {
    method: "DELETE",
  });
}

export async function listRecruitmentPosts() {
  const payload = await request("/admin/tuyen-dung/tin");
  return payload.data || [];
}

export async function createRecruitmentPost(body) {
  const payload = await request("/admin/tuyen-dung/tin", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return payload.data;
}

export async function updateRecruitmentPost(id, body) {
  const payload = await request(`/admin/tuyen-dung/tin/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return payload.data;
}

export async function deleteRecruitmentPost(id) {
  return request(`/admin/tuyen-dung/tin/${id}`, {
    method: "DELETE",
  });
}

export async function listMembers() {
  const payload = await request("/admin/thanh-vien");
  return payload.data || [];
}

export async function createMember(body) {
  const payload = await request("/admin/thanh-vien", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return payload.data;
}

export async function updateMember(id, body) {
  const payload = await request(`/admin/thanh-vien/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return payload.data;
}

export async function deleteMember(id) {
  return request(`/admin/thanh-vien/${id}`, {
    method: "DELETE",
  });
}

export async function listRecruitmentApplications() {
  const payload = await request("/admin/ho-so-ung-tuyen");
  return payload.data || [];
}

export async function getRecruitmentApplication(id) {
  const payload = await request(`/admin/ho-so-ung-tuyen/${id}`);
  return payload.data ?? null;
}

export async function updateRecruitmentApplicationStatus(id, status) {
  const payload = await request(`/admin/ho-so-ung-tuyen/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return payload.data;
}

export async function deleteRecruitmentApplication(id) {
  return request(`/admin/ho-so-ung-tuyen/${id}`, {
    method: "DELETE",
  });
}

export async function listContactMessages() {
  const payload = await request("/admin/lien-he");
  return payload.data || [];
}

export async function getContactMessage(id) {
  const payload = await request(`/admin/lien-he/${id}`);
  return payload.data ?? null;
}

export async function updateContactMessageStatus(id, status) {
  const payload = await request(`/admin/lien-he/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return payload.data;
}

export async function deleteContactMessage(id) {
  return request(`/admin/lien-he/${id}`, {
    method: "DELETE",
  });
}

export async function fetchContactMessageFile(id, index) {
  const token = readToken();
  const headers = { Accept: "*/*" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(
    `${API_URL}/admin/lien-he/${id}/files/${index}`,
    { headers },
  );

  if (response.status === 401) {
    clearSession();
  }

  if (!response.ok) {
    throw new Error("Không tải được tệp đính kèm.");
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

export async function fetchRecruitmentApplicationCv(id) {
  const token = readToken();
  const headers = { Accept: "application/pdf" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}/admin/ho-so-ung-tuyen/${id}/cv`, {
    headers,
  });

  if (response.status === 401) {
    clearSession();
  }

  if (!response.ok) {
    throw new Error("Không tải được file CV.");
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
