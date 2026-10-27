import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { memberGroups } from "../admin/nav.js";
import { useToast } from "../components/toast-context.js";
import { Modal } from "../components/Modal.jsx";
import { MemberThreadListSkeleton } from "../components/Skeleton.jsx";
import MemberConversation from "../features/MemberConversation.jsx";
import MemberManagement from "../features/MemberManagement.jsx";
import { useMemberAuth } from "../features/memberAuth.jsx";
import {
  createCase,
  downloadChatAttachment,
  getConversation,
  listCases,
  listChatMessages,
  listConversations,
  markConversationRead,
  openConversation,
  sendChatMessage,
  subscribeConversation,
  updateCase,
} from "../api/memberChat.js";
import { listTeamMembers } from "../api/member.js";
import { initialWorkspace, people } from "../data/memberWorkspace.js";
import "../styles/member-workspace.css";

const EMPTY_DRAFT = { text: "", files: [] };

function isApiMemberId(id) {
  return id != null && String(Number(id)) === String(id);
}

function mapChatMessage(message) {
  return {
    id: message.id,
    authorId: message.authorId,
    authorName: message.authorName,
    content: message.content || "",
    time: message.time,
    attachments: (message.attachments || []).map((file) => ({
      id: file.id,
      name: file.name,
      size: file.size,
      mime: file.mime,
    })),
  };
}

function conversationToThread(convo, currentId) {
  const isCase = convo.type === "case";
  const members = Array.isArray(convo.members) ? convo.members : [];
  const memberIds = members.map((person) => person.id);
  return {
    id: convo.uuid,
    conversationId: convo.id,
    uuid: convo.uuid,
    type: isCase ? "cases" : "messages",
    live: true,
    name: isCase ? convo.name || "Vụ việc" : convo.peer?.name || "Thành viên",
    ownerId: isCase ? null : convo.peer?.id,
    members: memberIds.length
      ? memberIds
      : [currentId, convo.peer?.id].filter((id) => id != null),
    memberNames: members.map((person) => person.name).filter(Boolean),
    messages: (convo.messages || []).map(mapChatMessage),
    lastPreview: convo.lastMessage?.content || (convo.lastMessage ? "Đã gửi tệp đính kèm" : ""),
    unread: Boolean(convo.unread),
    hasMore: Boolean(convo.hasMore),
  };
}
const tabs = [
  { id: "messages", name: "Tin nhắn" },
  { id: "cases", name: "Vụ việc" },
  { id: "income", name: "Thu nhập" },
];
const groups = [
  { id: "ctv", name: "CTV" },
  { id: "lawyer", name: "Luật sư" },
  { id: "support", name: "CTV hỗ trợ" },
  { id: "legal", name: "CTV pháp lý" },
];

function personGroup(person) {
  return person?.group || person?.role || "ctv";
}

function samePersonId(left, right) {
  return left != null && right != null && String(left) === String(right);
}

function chatInitials(name) {
  if (!name) return "?";
  const parts = String(name).trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function threadDisplayName(thread, admin) {
  if (thread.type === "cases") return thread.name;
  if (thread.live || admin) return thread.name;
  if (thread.type === "income") return "Các khoản thanh toán";
  return "Giám đốc";
}

function threadPreview(thread) {
  return (
    thread.lastPreview ||
    thread.messages.at(-1)?.content ||
    (thread.type === "income"
      ? "Chưa ghi nhận khoản thanh toán"
      : "Chưa có trao đổi")
  );
}

function threadTime(thread) {
  const value = thread.messages.at(-1)?.time || "";
  return String(value).split(",")[0].trim();
}

function sortInboxThreads(threads) {
  return [...threads].sort((left, right) => {
    const unreadDelta = Number(Boolean(right.unread)) - Number(Boolean(left.unread));
    if (unreadDelta) return unreadDelta;
    return 0;
  });
}

function PersonPicker({ staffList, selected, onChange }) {
  return (
    <div className="member-person-picker">
      {groups.map((group) => {
        const peopleInGroup = staffList.filter(
          (person) => personGroup(person) === group.id,
        );
        if (!peopleInGroup.length) return null;
        return (
          <fieldset key={group.id}>
            <legend>{group.name}</legend>
            {peopleInGroup.map((person) => (
              <label key={person.id}>
                <input
                  type="checkbox"
                  checked={selected.some((id) => samePersonId(id, person.id))}
                  onChange={(event) =>
                    onChange(
                      event.target.checked
                        ? [...selected, person.id]
                        : selected.filter((id) => !samePersonId(id, person.id)),
                    )
                  }
                />
                {person.name}
              </label>
            ))}
          </fieldset>
        );
      })}
    </div>
  );
}

export default function ForumPage() {
  const { session, logout } = useMemberAuth();
  const navigate = useNavigate();
  const liveChat = Boolean(session?.token && session.token !== "playwright-member");
  const [threads, setThreads] = useState(initialWorkspace);
  const [chatThreads, setChatThreads] = useState([]);
  const [membersList, setMembersList] = useState(people);
  const actorId =
    session?.role === "director"
      ? "director"
      : liveChat
        ? session.id
        : "member-a";
  const [tab, setTab] = useState("messages");
  const [selections, setSelections] = useState({});
  const [conversationOpen, setConversationOpen] = useState(false);
  const [drafts, setDrafts] = useState({});
  const [dialog, setDialog] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [quickText, setQuickText] = useState("");
  const [dialogError, setDialogError] = useState("");
  const [caseName, setCaseName] = useState("");
  const [sending, setSending] = useState(false);
  const sendingRef = useRef(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [openingId, setOpeningId] = useState(null);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const loadingOlderRef = useRef(false);
  const objectUrls = useRef([]);
  const listHeading = useRef(null);
  const { showToast } = useToast();
  const admin = actorId === "director";
  const staff = membersList.filter(
    (person) =>
      person.id !== "director" &&
      personGroup(person) !== "director" &&
      !samePersonId(person.id, session?.id) &&
      person.status !== "inactive",
  );
  const selectionKey = `${actorId}-${tab}`;
  const available = sortInboxThreads(
    liveChat && (tab === "messages" || tab === "cases")
      ? chatThreads.filter((thread) =>
          tab === "cases" ? thread.type === "cases" : thread.type !== "cases",
        )
      : threads.filter(
          (thread) =>
            thread.type === tab && (admin || thread.members.includes(actorId)),
        ),
  );
  const active = available.find(
    (thread) => thread.id === selections[selectionKey],
  );
  const draftKey = `${actorId}-${active?.id}`;
  const draft = drafts[draftKey] || EMPTY_DRAFT;
  useEffect(() => {
    document.title = "Không gian thành viên — Công ty Luật TNHH MTV Từ Liêm";
  }, []);
  useEffect(() => {
    const urls = objectUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);
  useEffect(() => {
    if (!liveChat) {
      setListLoading(false);
      return undefined;
    }
    let cancelled = false;
    setListLoading(true);
    Promise.all([
      listConversations().catch(() => []),
      listCases().catch(() => []),
    ])
      .then(([direct, cases]) => {
        if (!cancelled) {
          setChatThreads([
            ...direct.map((item) => conversationToThread(item, session.id)),
            ...cases.map((item) => conversationToThread(item, session.id)),
          ]);
        }
      })
      .finally(() => {
        if (!cancelled) setListLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [liveChat, session?.id]);
  useEffect(() => {
    if (!liveChat || session?.role !== "director") return undefined;
    let cancelled = false;
    listTeamMembers()
      .then((list) => {
        if (!cancelled) {
          setMembersList(
            list.map((person) => ({
              ...person,
              group: person.group || person.role || "ctv",
            })),
          );
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [liveChat, session?.role]);
  useEffect(() => {
    if (!liveChat) return undefined;
    const uuids = [...new Set(chatThreads.map((thread) => thread.uuid).filter(Boolean))];
    if (!uuids.length) return undefined;
    const viewingUuid = conversationOpen && active?.live ? active.uuid : null;
    const unsubs = uuids.map((uuid) =>
      subscribeConversation(uuid, (message) => {
        const mapped = mapChatMessage(message);
        const convoUuid = message.conversationUuid || uuid;
        const fromSelf = String(mapped.authorId) === String(session.id);
        const viewing = viewingUuid === convoUuid;
        setChatThreads((previous) =>
          previous.map((thread) => {
            if (thread.uuid !== convoUuid) return thread;
            if (thread.messages.some((item) => String(item.id) === String(mapped.id))) {
              return viewing ? { ...thread, unread: false } : thread;
            }
            return {
              ...thread,
              messages: [...thread.messages, mapped],
              lastPreview:
                mapped.content ||
                (mapped.attachments?.length ? "Đã gửi tệp đính kèm" : ""),
              unread: !(fromSelf || viewing),
            };
          }),
        );
        if (viewing && !fromSelf) {
          markConversationRead(convoUuid).catch(() => {});
        }
      }),
    );
    return () => unsubs.forEach((leave) => leave());
  }, [liveChat, chatThreads.map((thread) => thread.uuid).join("|"), conversationOpen, active?.uuid, session?.id]);
  const updateDraft = (patch) =>
    setDrafts((previous) => ({
      ...previous,
      [draftKey]: { ...(previous[draftKey] || EMPTY_DRAFT), ...patch },
    }));
  const notify = () =>
    showToast(
      "Đã cập nhật trong phiên xem thử. Nội dung chưa được lưu trên máy chủ.",
    );
  const newMessage = (content, files = []) => ({
    id: crypto.randomUUID(),
    authorId: actorId,
    content,
    time: new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      timeZone: "Asia/Bangkok",
    }).format(new Date()),
    attachments: files.map(({ id, file }) => {
      const url = URL.createObjectURL(file);
      objectUrls.current.push(url);
      return { id, name: file.name, size: file.size, url };
    }),
  });
  const send = async () => {
    if (sendingRef.current) return;
    if (!draft.text.trim() && !draft.files.length) return;
    sendingRef.current = true;
    setSending(true);
    try {
      if (active?.live) {
        const form = new FormData();
        if (draft.text.trim()) form.append("content", draft.text.trim());
        draft.files.forEach(({ file }) => form.append("files[]", file));
        const saved = await sendChatMessage(active.uuid, form);
        const mapped = mapChatMessage(saved);
        setChatThreads((previous) =>
          previous.map((thread) => {
            if (thread.uuid !== active.uuid) return thread;
            if (thread.messages.some((item) => String(item.id) === String(mapped.id))) {
              return thread;
            }
            return {
              ...thread,
              unread: false,
              messages: [...thread.messages, mapped],
              lastPreview:
                mapped.content ||
                (mapped.attachments?.length ? "Đã gửi tệp đính kèm" : ""),
            };
          }),
        );
        updateDraft(EMPTY_DRAFT);
        return;
      }
      const message = newMessage(draft.text.trim(), draft.files);
      setThreads((previous) =>
        previous.map((thread) =>
          thread.id === active.id
            ? { ...thread, messages: [...thread.messages, message] }
            : thread,
        ),
      );
      updateDraft(EMPTY_DRAFT);
      notify();
    } catch (err) {
      showToast(err.message);
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  };
  const loadOlderMessages = async () => {
    if (!active?.live || !active.hasMore || loadingOlderRef.current) return;
    const oldestId = active.messages[0]?.id;
    if (!oldestId) return;
    loadingOlderRef.current = true;
    setLoadingOlder(true);
    try {
      const { data, hasMore } = await listChatMessages(active.uuid, {
        before: oldestId,
      });
      const mapped = data.map(mapChatMessage);
      setChatThreads((previous) =>
        previous.map((thread) => {
          if (thread.uuid !== active.uuid) return thread;
          const seen = new Set(thread.messages.map((item) => String(item.id)));
          const older = mapped.filter((item) => !seen.has(String(item.id)));
          return {
            ...thread,
            messages: [...older, ...thread.messages],
            hasMore,
          };
        }),
      );
    } catch (err) {
      showToast(err.message);
    } finally {
      loadingOlderRef.current = false;
      setLoadingOlder(false);
    }
  };
  const openDialog = (type) => {
    setDialog(type);
    setDialogError("");
    setRecipients(
      type === "edit"
        ? (active?.members || []).filter(
            (id) => id !== "director" && !samePersonId(id, session?.id),
          )
        : [],
    );
    setCaseName(type === "edit" ? active.name : "");
    setQuickText("");
  };
  const submitDialog = async (event) => {
    event.preventDefault();
    if (!admin) return;
    if (!recipients.length)
      return setDialogError("Vui lòng chọn ít nhất một người.");
    if (dialog === "quick") {
      if (!quickText.trim()) return;
      const message = newMessage(quickText.trim());
      setThreads((previous) =>
        previous.map((thread) =>
          thread.type === "messages" && recipients.includes(thread.ownerId)
            ? {
                ...thread,
                messages: [
                  ...thread.messages,
                  { ...message, id: crypto.randomUUID() },
                ],
              }
            : thread,
        ),
      );
      setDialog(null);
      notify();
      return;
    }
    if (!caseName.trim()) return;
    if (liveChat) {
      try {
        const payload = {
          name: caseName.trim(),
          memberIds: recipients.filter((id) => isApiMemberId(id)),
        };
        if (!payload.memberIds.length) {
          setDialogError("Vui lòng chọn ít nhất một thành viên.");
          return;
        }
        if (dialog === "edit") {
          const updated = await updateCase(active.uuid, payload);
          const thread = conversationToThread(updated, session.id);
          setChatThreads((previous) =>
            previous.map((item) =>
              item.uuid === thread.uuid
                ? { ...thread, messages: item.messages }
                : item,
            ),
          );
          showToast("Đã cập nhật thành viên vụ việc.");
        } else {
          const created = await createCase(payload);
          const thread = conversationToThread(created, session.id);
          setChatThreads((previous) => [
            thread,
            ...previous.filter((item) => item.uuid !== thread.uuid),
          ]);
          setSelections((previous) => ({
            ...previous,
            [selectionKey]: thread.id,
          }));
          setConversationOpen(true);
          showToast("Đã tạo vụ việc.");
        }
        setDialog(null);
      } catch (err) {
        setDialogError(err.message);
      }
      return;
    }
    if (
      !recipients.some(
        (id) =>
          membersList.find((person) => samePersonId(person.id, id))?.group ===
          "lawyer",
      )
    )
      return setDialogError("Vui lòng chọn ít nhất một luật sư phụ trách.");
    if (dialog === "edit") {
      setThreads((previous) =>
        previous.map((thread) =>
          thread.id === active.id
            ? {
                ...thread,
                name: caseName.trim(),
                members: ["director", ...recipients],
              }
            : thread,
        ),
      );
    } else {
      const thread = {
        id: `case-${crypto.randomUUID()}`,
        type: "cases",
        name: caseName.trim(),
        members: ["director", ...recipients],
        messages: [],
      };
      setThreads((previous) => [...previous, thread]);
      setSelections((previous) => ({
        ...previous,
        [selectionKey]: thread.id,
      }));
      setConversationOpen(true);
    }
    setDialog(null);
    notify();
  };
  const switchTab = (id) => {
    setTab(id);
    setConversationOpen(false);
  };

  const handleUpdateMember = (updatedPerson) => {
    setMembersList((previous) =>
      previous.map((person) =>
        person.id === updatedPerson.id ? { ...person, ...updatedPerson } : person,
      ),
    );
    setThreads((previous) =>
      previous.map((thread) =>
        thread.ownerId === updatedPerson.id
          ? { ...thread, name: updatedPerson.name }
          : thread,
      ),
    );
    showToast(`Đã cập nhật thông tin: ${updatedPerson.name}`);
  };

  const handleToggleStatus = (personId) => {
    setMembersList((previous) =>
      previous.map((person) => {
        if (person.id === personId) {
          const nextStatus =
            person.status === "inactive" ? "active" : "inactive";
          showToast(
            `Đã ${nextStatus === "active" ? "kích hoạt" : "tạm dừng"} thành viên ${person.name}`,
          );
          return { ...person, status: nextStatus };
        }
        return person;
      }),
    );
  };

  const handleOpenDirectMessage = async (personId) => {
    if (liveChat && isApiMemberId(personId)) {
      try {
        const convo = await openConversation(personId);
        const thread = conversationToThread(convo, session.id);
        setChatThreads((previous) => [
          thread,
          ...previous.filter((item) => item.uuid !== thread.uuid),
        ]);
        setTab("messages");
        setSelections((previous) => ({
          ...previous,
          [`${actorId}-messages`]: thread.id,
        }));
        setConversationOpen(true);
      } catch (err) {
        showToast(err.message);
      }
      return;
    }
    setTab("messages");
    setSelections((previous) => ({
      ...previous,
      [`${actorId}-messages`]: `direct-${personId}`,
    }));
    setConversationOpen(true);
  };

  const handleOpenCaseThread = (caseId) => {
    setTab("cases");
    setSelections((previous) => ({
      ...previous,
      [`${actorId}-cases`]: caseId,
    }));
    setConversationOpen(true);
  };

  const availableTabs = [
    ...tabs,
    ...(admin
      ? [
          {
            id: "members",
            name: "Quản lý thành viên",
            badge: pendingApprovals,
          },
        ]
      : []),
  ];

  const title =
    tab === "messages"
      ? admin
        ? "Người trao đổi"
        : "Tin nhắn của tôi"
      : tab === "cases"
        ? admin
          ? "Các vụ việc"
          : "Vụ việc tôi tham gia"
        : tab === "income"
          ? admin
            ? "Thu nhập theo thành viên"
            : "Thu nhập của tôi"
          : "Quản lý thành viên";

  if (!session) {
    return <Navigate to="/thanh-vien" replace />;
  }

  return (
    <main className="member-page">
      <div className="wrap">
        <h1 className="page-heading-sr-only">Không gian thành viên</h1>
        <div className="member-welcome">
          <div>
            <span>Xin chào,</span>
            <h2>{session.name}</h2>
            <small>{memberGroups[session.role] || session.role}</small>
          </div>
          <div className="member-welcome-controls">
            <button
              type="button"
              className="btn-register-member"
              onClick={async () => {
                await logout();
                navigate("/thanh-vien");
              }}
            >
              Đăng xuất
            </button>
          </div>
        </div>
        <nav className="member-tabs" aria-label="Công việc cá nhân">
          {availableTabs.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={tab === item.id}
              className={tab === item.id ? "active" : ""}
              onClick={() => switchTab(item.id)}
            >
              {item.name}
              {item.badge != null && item.badge > 0 && (
                <span className="tab-pending-badge" aria-hidden="true">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
        {admin && tab === "members" ? (
          <MemberManagement
            members={membersList}
            threads={threads}
            onUpdateMember={handleUpdateMember}
            onToggleStatus={handleToggleStatus}
            onOpenDirectMessage={handleOpenDirectMessage}
            onOpenCaseThread={handleOpenCaseThread}
            onPendingCount={setPendingApprovals}
          />
        ) : (
          <div
            className={`member-workspace chat-workspace ${conversationOpen ? "conversation-open" : ""}`}
          >
            <aside className="member-list" aria-label={title}>
              <div className="member-list-heading">
                <h2 ref={listHeading} tabIndex={-1}>
                  {title}
                </h2>
                {admin && tab !== "income" && !(liveChat && tab === "messages") && (
                  <button
                    type="button"
                    className="member-text-action"
                    onClick={() =>
                      openDialog(tab === "cases" ? "create" : "quick")
                    }
                  >
                    {tab === "cases" ? "+ Tạo vụ việc" : "+ Gửi nhanh"}
                  </button>
                )}
              </div>
              <div className="member-thread-list">
                {listLoading ? <MemberThreadListSkeleton /> : null}
                {!listLoading && available.map((thread) => {
                  const name = threadDisplayName(thread, admin);
                  return (
                  <button
                    key={thread.id}
                    type="button"
                    className={`member-thread-choice chat-thread-item ${active?.id === thread.id ? "selected" : ""} ${thread.unread ? "has-unread" : ""}`}
                    aria-pressed={active?.id === thread.id}
                    onClick={async () => {
                      setSelections((previous) => ({
                        ...previous,
                        [selectionKey]: thread.id,
                      }));
                      setConversationOpen(true);
                      if (thread.live) {
                        setOpeningId(thread.id);
                        setChatThreads((previous) =>
                          previous.map((item) =>
                            item.uuid === thread.uuid
                              ? { ...item, unread: false }
                              : item,
                          ),
                        );
                        try {
                          const full = await getConversation(thread.uuid);
                          setChatThreads((previous) =>
                            previous.map((item) =>
                              item.uuid === thread.uuid
                                ? {
                                    ...conversationToThread(full, session.id),
                                    unread: false,
                                  }
                                : item,
                            ),
                          );
                        } catch (err) {
                          showToast(err.message);
                        } finally {
                          setOpeningId(null);
                        }
                      }
                    }}
                  >
                    <span className="chat-avatar" aria-hidden="true">
                      {chatInitials(name)}
                    </span>
                    <span className="chat-thread-main">
                      <span className="chat-thread-top">
                        <strong>{name}</strong>
                        {threadTime(thread) ? (
                          <time>{threadTime(thread)}</time>
                        ) : null}
                      </span>
                      <span className="chat-thread-preview">
                        {threadPreview(thread)}
                      </span>
                      {thread.type === "cases" && (
                        <small>{thread.members.length} người tham gia</small>
                      )}
                    </span>
                    {thread.unread ? (
                      <i className="member-unread-dot" aria-label="Chưa đọc" />
                    ) : null}
                  </button>
                  );
                })}
              </div>
              {!listLoading && available.length === 0 && (
                <p className="member-empty">
                  {tab === "messages"
                    ? "Chưa có cuộc trao đổi. Giám đốc mở Nhắn tin riêng từ tab Quản lý thành viên."
                    : "Chưa có vụ việc được phân công."}
                </p>
              )}
            </aside>
            {active ? (
              <MemberConversation
                key={`${actorId}-${active.id}`}
                thread={active}
                actorId={active.live ? session.id : actorId}
                draft={draft}
                sending={sending}
                loading={openingId === active.id}
                loadingOlder={loadingOlder}
                onDraft={updateDraft}
                onSend={send}
                onLoadOlder={active.live ? loadOlderMessages : undefined}
                onNotice={showToast}
                onDownloadAttachment={
                  active.live
                    ? (file) =>
                        downloadChatAttachment(file.id, file.name).catch((err) =>
                          showToast(err.message),
                        )
                    : undefined
                }
                onBack={() => {
                  setConversationOpen(false);
                  setSelections((previous) => {
                    const next = { ...previous };
                    delete next[selectionKey];
                    return next;
                  });
                  requestAnimationFrame(() => listHeading.current?.focus());
                }}
                onEditMembers={
                  admin && tab === "cases" ? () => openDialog("edit") : null
                }
              />
            ) : (
              <div className="member-no-selection chat-empty-pane">
                <p>
                  {tab === "messages"
                    ? "Chọn một cuộc trao đổi bên trái để xem tin nhắn."
                    : tab === "income"
                      ? "Chọn một mục bên trái để xem chi tiết."
                      : admin
                        ? "Tạo vụ việc và chọn người phụ trách để bắt đầu."
                        : "Chọn một vụ việc bên trái để xem trao đổi."}
                </p>
              </div>
            )}
          </div>
        )}
        <p className="member-demo-note" role="note">
          {liveChat
            ? "Tin nhắn riêng và vụ việc (nhóm) được lưu trên máy chủ và gửi realtime qua socket. Có thể đính kèm file và tải lại từ lịch sử."
            : "Bản xem thử với dữ liệu mẫu. Tin nhắn, tài liệu và phân công chỉ tồn tại trong phiên này, chưa được lưu trên máy chủ."}
        </p>
        <Modal
          open={Boolean(dialog)}
          onClose={() => setDialog(null)}
          title={
            dialog === "quick"
              ? "Gửi tin nhắn nhanh"
              : dialog === "edit"
                ? "Thành viên vụ việc"
                : "Tạo vụ việc"
          }
          className="member-workspace-dialog"
        >
          {dialog && (
            <form onSubmit={submitDialog}>
              {dialog !== "quick" && (
                <label>
                  Tên vụ việc
                  <input
                    name="caseName"
                    value={caseName}
                    onChange={(event) => setCaseName(event.target.value)}
                    required
                    maxLength={160}
                  />
                </label>
              )}
              <p className="member-picker-label">
                {dialog === "quick"
                  ? "Gửi riêng cho những người được chọn"
                  : "Chọn hoặc thay đổi người phụ trách"}
              </p>
              <PersonPicker staffList={staff} selected={recipients} onChange={setRecipients} />
              {dialog === "quick" && (
                <>
                  <details className="member-broadcast">
                    <summary>Gửi cho toàn thể</summary>
                    <label>
                      <input
                        type="checkbox"
                        checked={recipients.length === staff.length}
                        onChange={(event) =>
                          setRecipients(
                            event.target.checked
                              ? staff.map((person) => person.id)
                              : [],
                          )
                        }
                      />
                      Chọn toàn bộ luật sư và cộng tác viên
                    </label>
                    <p>Tin được gửi vào cuộc trao đổi riêng của từng người.</p>
                  </details>
                  <label>
                    Nội dung tin nhắn
                    <textarea
                      name="quickMessage"
                      required
                      rows={3}
                      value={quickText}
                      onChange={(event) => setQuickText(event.target.value)}
                    />
                  </label>
                </>
              )}
              {dialogError && (
                <p role="alert" className="member-dialog-error">
                  {dialogError}
                </p>
              )}
              <div className="member-dialog-actions">
                <button type="button" onClick={() => setDialog(null)}>
                  Hủy
                </button>
                <button className="member-primary" type="submit">
                  {dialog === "quick"
                    ? "Gửi tin nhắn"
                    : dialog === "edit"
                      ? "Lưu thành viên"
                      : "Tạo vụ việc"}
                </button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </main>
  );
}
