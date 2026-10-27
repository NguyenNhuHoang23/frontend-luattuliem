import { useEffect, useRef, useState } from "react";
import { MemberMessagesSkeleton } from "../components/Skeleton.jsx";
import { people } from "../data/memberWorkspace.js";

function normalize(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLocaleLowerCase("vi");
}

function FileGlyph() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function FileLabel({ name }) {
  return (
    <span className="member-file-name">
      <span className="member-file-icon">
        <FileGlyph />
      </span>
      <span>{name}</span>
    </span>
  );
}

function chatInitials(name) {
  if (!name) return "?";
  const parts = String(name).trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function messageAuthorName(message) {
  return (
    message.authorName ||
    people.find((person) => person.id === message.authorId)?.name ||
    "Thành viên"
  );
}

function messageDateLabel(message) {
  const time = String(message.time || "");
  const comma = time.indexOf(",");
  return comma >= 0 ? time.slice(comma + 1).trim() : "";
}

export default function MemberConversation({
  thread,
  actorId,
  draft,
  sending = false,
  loading = false,
  loadingOlder = false,
  onDraft,
  onSend,
  onLoadOlder,
  onBack,
  onEditMembers,
  onNotice,
  onDownloadAttachment,
}) {
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const PAGE_SIZE = 10;
  const fileInput = useRef(null);
  const messagesRef = useRef(null);
  const searchInput = useRef(null);
  const searchButton = useRef(null);
  const restoreHeightRef = useRef(null);
  const stickToBottomRef = useRef(true);
  const loadLockRef = useRef(false);
  const [demoLimit, setDemoLimit] = useState(PAGE_SIZE);
  useEffect(() => {
    if (searchOpen) searchInput.current?.focus();
  }, [searchOpen]);
  useEffect(() => {
    setDemoLimit(PAGE_SIZE);
    stickToBottomRef.current = true;
  }, [thread.id]);
  const live = Boolean(thread.live);
  const pool =
    live || query ? thread.messages : thread.messages.slice(-demoLimit);
  const hasMore = live
    ? Boolean(thread.hasMore)
    : !query && thread.messages.length > demoLimit;
  const visible = pool.filter((message) =>
    normalize(
      [
        message.content,
        message.authorName,
        people.find((p) => p.id === message.authorId)?.name,
        ...(message.attachments || []).map((file) => file.name),
      ].join(" "),
    ).includes(normalize(query)),
  );
  const title =
    thread.type === "cases"
      ? thread.name
      : thread.live || actorId === "director"
        ? thread.name
        : thread.type === "income"
          ? "Thu nhập & thanh toán của tôi"
          : "Giám đốc";
  const send = (event) => {
    event.preventDefault();
    if (sending) return;
    if (!draft.text.trim() && !draft.files.length) return;
    onSend();
    setQuery("");
    requestAnimationFrame(() => {
      if (messagesRef.current)
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    });
  };
  const pickFiles = (event) => {
    const selected = Array.from(event.target.files || []);
    event.target.value = "";
    if (selected.length + draft.files.length > 5)
      return onNotice("Mỗi tin nhắn được đính kèm tối đa 5 file.");
    if (selected.some((file) => file.size > 10 * 1024 * 1024))
      return onNotice("Mỗi file được đính kèm tối đa 10 MB.");
    onDraft({
      files: [
        ...draft.files,
        ...selected.map((file) => ({ id: crypto.randomUUID(), file })),
      ],
    });
  };
  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    if (restoreHeightRef.current != null) {
      el.scrollTop = el.scrollHeight - restoreHeightRef.current;
      restoreHeightRef.current = null;
      return;
    }
    if (stickToBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [visible.length, thread.id, loadingOlder]);
  const handleMessagesScroll = () => {
    const el = messagesRef.current;
    if (!el) return;
    stickToBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < 56;
    if (el.scrollTop > 48 || !hasMore || loadingOlder || loadLockRef.current) {
      return;
    }
    restoreHeightRef.current = el.scrollHeight;
    if (live) {
      loadLockRef.current = true;
      Promise.resolve(onLoadOlder?.()).finally(() => {
        loadLockRef.current = false;
      });
      return;
    }
    setDemoLimit((value) => value + PAGE_SIZE);
  };
  const subtitle =
    thread.type === "cases"
      ? (thread.memberNames?.length
          ? thread.memberNames
          : thread.members.map(
              (id) => people.find((person) => person.id === id)?.name,
            )
        )
          .filter(Boolean)
          .join(" · ")
      : thread.type === "income"
        ? "Ghi nhận khoản tiền và trao đổi xác nhận"
        : "Trao đổi riêng";

  return (
    <section className="member-conversation" aria-label="Nội dung trao đổi">
      <div className="member-thread-header">
        <button type="button" className="member-back" onClick={onBack}>
          ← Danh sách
        </button>
        <span className="chat-header-avatar" aria-hidden="true">
          {chatInitials(title)}
        </span>
        <div className="member-thread-heading">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <div className="member-thread-actions">
          {onEditMembers && (
            <button type="button" onClick={onEditMembers}>
              Thành viên
            </button>
          )}
          <button
            type="button"
            ref={searchButton}
            aria-label={
              searchOpen ? "Đóng tìm kiếm tin nhắn" : "Tìm kiếm tin nhắn"
            }
            aria-expanded={searchOpen}
            onClick={() => {
              setSearchOpen((value) => !value);
              setQuery("");
            }}
          >
            Tìm
          </button>
        </div>
      </div>
      {searchOpen && (
        <div className="member-search">
          <label htmlFor="member-message-search">Tìm trong cuộc trao đổi</label>
          <input
            id="member-message-search"
            type="search"
            ref={searchInput}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nội dung, người gửi hoặc tên file…"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setSearchOpen(false);
                setQuery("");
                searchButton.current?.focus();
              }
            }}
          />
          <span role="status">{visible.length} tin nhắn phù hợp</span>
        </div>
      )}
      <div
        className="member-message-list"
        ref={messagesRef}
        tabIndex={0}
        aria-label="Lịch sử trao đổi"
        onScroll={handleMessagesScroll}
      >
        {hasMore && !loadingOlder ? (
          <p className="member-load-older" role="status">
            Cuộn lên để xem tin nhắn cũ
          </p>
        ) : null}
        {loadingOlder ? <MemberMessagesSkeleton count={2} /> : null}
        {loading ? (
          <MemberMessagesSkeleton />
        ) : (
          <>
            {visible.length === 0 && (
              <p className="member-empty">
                {query
                  ? "Không tìm thấy tin nhắn phù hợp."
                  : thread.type === "income"
                    ? "Chưa có khoản thanh toán được ghi nhận. Bạn có thể nhắn để đối chiếu với Giám đốc."
                    : "Chưa có trao đổi. Gửi tin nhắn đầu tiên bên dưới."}
              </p>
            )}
            {visible.map((message, index) => {
              const isOwn = String(message.authorId) === String(actorId);
              const authorName = messageAuthorName(message);
              const prev = visible[index - 1];
              const next = visible[index + 1];
              const followPrev =
                prev && String(prev.authorId) === String(message.authorId);
              const followNext =
                next && String(next.authorId) === String(message.authorId);
              const dateLabel = messageDateLabel(message);
              const showDate =
                dateLabel && dateLabel !== messageDateLabel(prev || {});
              return (
                <div key={message.id}>
                  {showDate ? (
                    <p className="chat-date-divider">{dateLabel}</p>
                  ) : null}
                  <article
                    className={`member-message ${isOwn ? "is-own" : ""} ${
                      followPrev ? "is-follow" : ""
                    } ${followNext ? "is-stack" : ""}`}
                  >
                    {!isOwn ? (
                      followNext ? (
                        <span className="chat-msg-avatar-spacer" aria-hidden="true" />
                      ) : (
                        <span className="chat-msg-avatar" aria-hidden="true">
                          {chatInitials(authorName)}
                        </span>
                      )
                    ) : null}
                    <div className="chat-msg-body">
                      {!isOwn && !followPrev ? (
                        <div className="member-message-meta">
                          <b>{authorName}</b>
                        </div>
                      ) : null}
                      <div className="member-message-bubble">
                        {message.content && <p>{message.content}</p>}
                        {message.attachments?.length > 0 && (
                          <ul
                            className="member-attachments"
                            aria-label="File đính kèm"
                          >
                            {message.attachments.map((file) => (
                              <li key={file.id}>
                                <FileLabel name={file.name} />
                                <a
                                  href={file.url || "#"}
                                  download={file.url ? file.name : undefined}
                                  onClick={(event) => {
                                    if (file.url) return;
                                    event.preventDefault();
                                    onDownloadAttachment?.(file);
                                  }}
                                >
                                  Tải xuống
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      {!followNext ? (
                        <time className="chat-msg-time">{message.time}</time>
                      ) : (
                        <span className="page-heading-sr-only">
                          {message.time}
                        </span>
                      )}
                    </div>
                  </article>
                </div>
              );
            })}
          </>
        )}
      </div>
      <form className="member-composer" onSubmit={send} aria-busy={sending}>
        {draft.files.length > 0 && (
          <ul className="member-pending-files" aria-label="File chờ gửi">
            {draft.files.map(({ id, file }) => (
              <li key={id}>
                <FileLabel name={file.name} />
                <button
                  type="button"
                  aria-label={`Bỏ file ${file.name}`}
                  disabled={sending}
                  onClick={() =>
                    onDraft({
                      files: draft.files.filter((item) => item.id !== id),
                    })
                  }
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="member-composer-row">
          <input
            type="file"
            multiple
            ref={fileInput}
            hidden
            disabled={sending}
            onChange={pickFiles}
            aria-label="Chọn file đính kèm"
          />
          <button
            type="button"
            className="member-attach"
            disabled={sending}
            onClick={() => fileInput.current?.click()}
            title="Đính kèm file"
          >
            Đính kèm
          </button>
          <label className="page-heading-sr-only" htmlFor="member-message-text">
            Nội dung trao đổi
          </label>
          <textarea
            id="member-message-text"
            value={draft.text}
            onChange={(event) => onDraft({ text: event.target.value })}
            placeholder={
              thread.type === "income"
                ? "Nhắn để xác nhận hoặc đối chiếu khoản tiền…"
                : "Nhập tin nhắn…"
            }
            rows={1}
            disabled={sending}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              )
                send(event);
            }}
          />
          <button
            className="member-primary"
            type="submit"
            disabled={sending || (!draft.text.trim() && !draft.files.length)}
          >
            {sending ? "Đang gửi…" : "Gửi"}
          </button>
        </div>
        <small className="chat-composer-hint">Tối đa 5 file, mỗi file 10 MB</small>
      </form>
    </section>
  );
}
