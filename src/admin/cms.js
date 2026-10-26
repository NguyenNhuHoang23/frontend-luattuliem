import { createDefaultCms } from "./seed.js";


const STORAGE_KEY = "luattuliem-admin-cms-v1";
export const CMS_EVENT = "luattuliem-cms-updated";

export function loadCms() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultCms();
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== 1) return createDefaultCms();
    return { ...createDefaultCms(), ...parsed };
  } catch {
    return createDefaultCms();
  }
}

export function persistCms(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(CMS_EVENT));
}

export function appendToCollection(name, item) {
  const data = loadCms();
  data[name] = [item, ...(data[name] || [])];
  persistCms(data);
  return data;
}

export function todayStamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

export function todayDate() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}`;
}

export function slugify(text) {
  const slug = String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || `item-${Date.now()}`;
}

export function uniqueId(base, existing) {
  const ids = new Set(existing.map((item) => item.id));
  if (!ids.has(base)) return base;
  return `${base}-${Date.now()}`;
}

export function nextPublicationOrder(items) {
  return Math.max(0, ...items.map((item) => item.publicationOrder || 0)) + 1;
}
