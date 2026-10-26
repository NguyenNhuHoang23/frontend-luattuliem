import { useMemo, useState } from "react";
import { todayStamp } from "../cms.js";
import { useCms } from "../CmsProvider.jsx";
import { Icon, PageHeader, StatusBadge } from "../components.jsx";

export default function MessagesPage() {
  const { data, replaceItem, removeItem } = useCms();
  const [activeId, setActiveId] = useState(data.threads[0]?.id || "");
  const [draft, setDraft] = useState("");
  const thread = useMemo(
    () => data.threads.find((item) => item.id === activeId) || data.threads[0],
    [data.threads, activeId],
  );

  function send(event) {
    event.preventDefault();
    const content = draft.trim();
    if (!content || !thread) return;
    replaceItem("threads", thread.id, {
      ...thread,
      messages: [
        ...thread.messages,
        {
          id: `m-${Date.now()}`,
          author: "Giám đốc",
          role: "Quản trị viên",
          avatar: "GĐ",
          time: todayStamp(),
          content,
          isOwn: true,
        },
      ],
    });
    setDraft("");
  }

  function removeMessage(messageId) {
    if (!thread) return;
    replaceItem("threads", thread.id, {
      ...thread,
      messages: thread.messages.filter((item) => item.id !== messageId),
    });
  }

  return (
    <>
      <PageHeader
        eyebrow="Trao đổi nội bộ"
        title="Quản lý tin nhắn"
        description="Xem hội thoại, trả lời với tư cách quản trị và xóa tin không còn cần thiết."
      />
      <div className="admin-messages">
        <div className="admin-thread-list">
          {data.threads.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`admin-thread-item${item.id === thread?.id ? " active" : ""}`}
              onClick={() => setActiveId(item.id)}
            >
              <b>{item.name}</b>
              <small>
                {item.subtitle || item.section} · {item.messages?.length || 0} tin
              </small>
            </button>
          ))}
        </div>
        {thread ? (
          <div className="admin-thread-view">
            <div className="admin-thread-head">
              <h2>{thread.name}</h2>
              <p className="admin-muted" style={{ margin: "4px 0 0" }}>
                {thread.participants} · <StatusBadge tone="info">{thread.statusText}</StatusBadge>
              </p>
              <button
                type="button"
                className="admin-text-btn danger"
                style={{ marginTop: 8 }}
                onClick={() => {
                  if (window.confirm(`Xóa kênh “${thread.name}”?`)) {
                    const nextId =
                      data.threads.find((item) => item.id !== thread.id)?.id || "";
                    removeItem("threads", thread.id);
                    setActiveId(nextId);
                  }
                }}
              >
                <Icon name="trash" size={15} /> Xóa kênh
              </button>
            </div>
            <div className="admin-chat">
              {thread.messages.map((message) => (
                <article className="admin-bubble" key={message.id}>
                  <header>
                    <span>
                      <b>{message.author}</b> · {message.role}
                    </span>
                    <span>{message.time}</span>
                  </header>
                  <p style={{ margin: 0 }}>{message.content}</p>
                  <button
                    type="button"
                    className="admin-text-btn danger"
                    style={{ marginTop: 8 }}
                    onClick={() => removeMessage(message.id)}
                  >
                    Xóa tin
                  </button>
                </article>
              ))}
            </div>
            <form className="admin-composer" onSubmit={send}>
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Nhập tin nhắn với tư cách quản trị viên"
                required
              />
              <button className="admin-btn" type="submit">
                <Icon name="send" /> Gửi
              </button>
            </form>
          </div>
        ) : (
          <div className="admin-card">Chưa có kênh tin nhắn.</div>
        )}
      </div>
    </>
  );
}
