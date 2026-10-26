import { API_URL, rewriteMediaTree } from "./config.js";

async function getJson(path, fallbackMessage) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { Accept: "application/json" },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || fallbackMessage);
  }
  return rewriteMediaTree(payload);
}

export async function listPublicAboutArticles() {
  const payload = await getJson("/gioi-thieu", "Không tải được danh sách giới thiệu.");
  return payload.data || [];
}

export async function getPublicAboutArticle(id) {
  const payload = await getJson(
    `/gioi-thieu/${encodeURIComponent(id)}`,
    "Không tải được bài giới thiệu.",
  );
  return payload.data ?? null;
}

export async function listPublicNews() {
  const payload = await getJson("/tin-tuc", "Không tải được danh sách tin tức.");
  return payload.data || [];
}

export async function getPublicNews(id) {
  const payload = await getJson(
    `/tin-tuc/${encodeURIComponent(id)}`,
    "Không tải được tin tức.",
  );
  return payload.data ?? null;
}

export async function listPublicCases() {
  const payload = await getJson("/an-le", "Không tải được danh sách án lệ.");
  return payload.data || [];
}

export async function getPublicHomePage() {
  const payload = await getJson("/trang-chu", "Không tải được trang chủ.");
  return payload.data ?? null;
}

export async function getPublicCompanyInfo() {
  const payload = await getJson(
    "/thong-tin",
    "Không tải được thông tin công ty.",
  );
  return payload.data ?? null;
}

export async function getPublicCase(id) {
  const payload = await getJson(
    `/an-le/${encodeURIComponent(id)}`,
    "Không tải được án lệ / án hay.",
  );
  return payload.data ?? null;
}

export async function getPublicRecruitmentPage() {
  const payload = await getJson("/tuyen-dung", "Không tải được trang tuyển dụng.");
  return payload.data ?? null;
}

export async function listPublicRecruitmentRoles() {
  const payload = await getJson(
    "/tuyen-dung/vi-tri",
    "Không tải được danh sách vị trí tuyển dụng.",
  );
  return payload.data || [];
}

export async function getPublicRecruitmentRole(id) {
  const payload = await getJson(
    `/tuyen-dung/vi-tri/${encodeURIComponent(id)}`,
    "Không tải được vị trí tuyển dụng.",
  );
  return payload.data ?? null;
}

export async function listPublicRecruitmentPosts() {
  const payload = await getJson(
    "/tuyen-dung/tin",
    "Không tải được danh sách tin tuyển dụng.",
  );
  return payload.data || [];
}

export async function getPublicRecruitmentPost(id) {
  const payload = await getJson(
    `/tuyen-dung/tin/${encodeURIComponent(id)}`,
    "Không tải được tin tuyển dụng.",
  );
  return payload.data ?? null;
}

export async function submitPublicContactMessage(formData) {
  const response = await fetch(`${API_URL}/lien-he`, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: formData,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const details = payload.errors
      ? Object.values(payload.errors).flat().join(" ")
      : payload.message;
    throw new Error(details || "Không gửi được yêu cầu liên hệ.");
  }
  return payload.data ?? null;
}

export async function submitPublicRecruitmentApplication(formData) {
  const response = await fetch(`${API_URL}/tuyen-dung/ho-so`, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: formData,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const details = payload.errors
      ? Object.values(payload.errors).flat().join(" ")
      : payload.message;
    throw new Error(details || "Không gửi được hồ sơ ứng tuyển.");
  }
  return payload.data ?? null;
}
