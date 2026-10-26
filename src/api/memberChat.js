import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { API_URL } from "./config.js";

const AUTH_KEY = "luattuliem-member-session";

function readToken() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || "null")?.token || "";
  } catch {
    return "";
  }
}

async function parsePayload(response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const details = payload.errors
      ? Object.values(payload.errors).flat().join(" ")
      : payload.message;
    throw new Error(details || "Không gọi được máy chủ.");
  }
  return payload;
}

function authHeaders(json = false) {
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${readToken()}`,
  };
  if (json) headers["Content-Type"] = "application/json";
  return headers;
}

export async function listConversations() {
  const response = await fetch(`${API_URL}/thanh-vien/tin-nhan`, {
    headers: authHeaders(),
  });
  const payload = await parsePayload(response);
  return payload.data || [];
}

export async function listCases() {
  const response = await fetch(`${API_URL}/thanh-vien/vu-viec`, {
    headers: authHeaders(),
  });
  const payload = await parsePayload(response);
  return payload.data || [];
}

export async function createCase({ name, memberIds }) {
  const response = await fetch(`${API_URL}/thanh-vien/vu-viec`, {
    method: "POST",
    headers: authHeaders(true),
    body: JSON.stringify({ name, memberIds }),
  });
  const payload = await parsePayload(response);
  return payload.data ?? null;
}

export async function updateCase(uuid, { name, memberIds }) {
  const response = await fetch(`${API_URL}/thanh-vien/vu-viec/${uuid}`, {
    method: "PATCH",
    headers: authHeaders(true),
    body: JSON.stringify({ name, memberIds }),
  });
  const payload = await parsePayload(response);
  return payload.data ?? null;
}

export async function openConversation(memberId) {
  const response = await fetch(`${API_URL}/thanh-vien/tin-nhan/voi/${memberId}`, {
    method: "POST",
    headers: authHeaders(),
  });
  const payload = await parsePayload(response);
  return payload.data ?? null;
}

export async function getConversation(uuid) {
  const response = await fetch(`${API_URL}/thanh-vien/tin-nhan/${uuid}`, {
    headers: authHeaders(),
  });
  const payload = await parsePayload(response);
  return payload.data ?? null;
}

export async function listChatMessages(uuid, { before, limit = 10 } = {}) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (before) params.set("before", String(before));
  const response = await fetch(
    `${API_URL}/thanh-vien/tin-nhan/${uuid}/tin?${params}`,
    {
      headers: authHeaders(),
    },
  );
  const payload = await parsePayload(response);
  return {
    data: payload.data || [],
    hasMore: Boolean(payload.hasMore),
  };
}

export async function markConversationRead(uuid) {
  const response = await fetch(`${API_URL}/thanh-vien/tin-nhan/${uuid}/da-doc`, {
    method: "POST",
    headers: authHeaders(),
  });
  await parsePayload(response);
}

export async function sendChatMessage(uuid, formData) {
  const response = await fetch(`${API_URL}/thanh-vien/tin-nhan/${uuid}`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });
  const payload = await parsePayload(response);
  return payload.data ?? null;
}

export async function downloadChatAttachment(id, name) {
  const response = await fetch(`${API_URL}/thanh-vien/tin-nhan/tep/${id}`, {
    headers: { Authorization: `Bearer ${readToken()}` },
  });
  if (!response.ok) {
    throw new Error("Không tải được tệp đính kèm.");
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name || "tep-dinh-kem";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

let echoClient = null;

function isLocalReverbHost(host) {
  return !host || host === "127.0.0.1" || host === "localhost";
}

function reverbClientOptions(key) {
  const configuredHost = import.meta.env.VITE_REVERB_HOST || "";
  const page = typeof window !== "undefined" ? window.location : null;
  const usePageHost = Boolean(page) && isLocalReverbHost(configuredHost);
  const isSecure = usePageHost
    ? page.protocol === "https:"
    : (import.meta.env.VITE_REVERB_SCHEME || "http") === "https";
  const wsHost = usePageHost ? page.hostname : configuredHost || "127.0.0.1";
  const wsPort = usePageHost
    ? Number(page.port || (isSecure ? 443 : 80))
    : Number(import.meta.env.VITE_REVERB_PORT || 8080);

  return {
    broadcaster: "reverb",
    key,
    Pusher,
    wsHost,
    wsPort,
    wssPort: wsPort,
    forceTLS: isSecure,
    enabledTransports: ["ws", "wss"],
  };
}

export function getMemberEcho() {
  const key = import.meta.env.VITE_REVERB_APP_KEY;
  if (!key) return null;
  if (echoClient) return echoClient;
  window.Pusher = Pusher;
  echoClient = new Echo(reverbClientOptions(key));
  return echoClient;
}

export function subscribeConversation(uuid, onMessage) {
  const client = getMemberEcho();
  if (!client || !uuid) return () => {};
  const channelName = `member-chat.${uuid}`;
  const channel = client.channel(channelName);
  channel.listen(".message.sent", (payload) => {
    if (payload?.data) onMessage(payload.data);
  });
  return () => {
    client.leave(channelName);
  };
}
