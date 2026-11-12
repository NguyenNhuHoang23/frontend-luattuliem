import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { memberGroups } from "../admin/nav.js";
import { useToast } from "../components/toast-context.js";
import { Modal } from "../components/Modal.jsx";
import { MemberThreadListSkeleton } from "../components/Skeleton.jsx";
import MemberConversation from "../features/MemberConversation.jsx";
import MemberManagement from "../features/MemberManagement.jsx";
import MemberSettings from "../features/MemberSettings.jsx";
import { useMemberAuth } from "../features/memberAuth.jsx";
import {
  createCase,
  downloadChatAttachment,
  getConversation,
  listCases,
  listChatMessages,
  listConversations,
  getGlobalGroup,
  listIncomeNotices,
  markConversationRead,
  openConversation,
  sendChatMessage,
  sendIncomeNotice,
  subscribeConversation,
  updateCase,
} from "../api/memberChat.js";
import { listTeamMembers } from "../api/member.js";
import { initialWorkspace, people } from "../data/memberWorkspace.js";
import { registeredProvinces, workProvinces } from "../data/workProvinces.js";
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
  const isIncome = convo.type === "income";
  const isGlobal = convo.type === "global";
  const members = Array.isArray(convo.members) ? convo.members : [];
  const memberIds = members.map((person) => person.id);
  const memberDetails = members
    .map((person) => ({
      id: person.id,
      name: person.name || "",
      username: person.username || "",
      role: person.role || person.group || "ctv",
    }))
    .sort((left, right) => {
      if (left.role === "director" && right.role !== "director") return -1;
      if (right.role === "director" && left.role !== "director") return 1;
      return String(left.name).localeCompare(String(right.name), "vi", {
        sensitivity: "base",
      });
    });
  return {
    id: convo.uuid,
    conversationId: convo.id,
    uuid: convo.uuid,
    type: isCase ? "cases" : isIncome ? "income" : isGlobal ? "global" : "messages",
    live: true,
    name: isGlobal
      ? convo.name || "Nhóm công ty"
      : isCase
        ? convo.name || "Vụ việc"
        : convo.peer?.name || (isIncome ? "Thông báo lương" : "Thành viên"),
    ownerId: isCase || isGlobal ? null : convo.peer?.id,
    members: memberIds.length
      ? memberIds
      : [currentId, convo.peer?.id].filter((id) => id != null),
    memberNames: members.map((person) => person.name).filter(Boolean),
    memberDetails,
    messages: (convo.messages || []).map(mapChatMessage),
    description: convo.description || "",
    address: convo.address || "",
    subtitle: convo.description || "",
    lastPreview: convo.lastMessage?.content || (convo.lastMessage ? "Đã gửi tệp đính kèm" : ""),
    unread: Boolean(convo.unread),
    hasMore: Boolean(convo.hasMore),
  };
}
const tabs = [
  { id: "messages", name: "Tin nhắn" },
  { id: "global", name: "Nhóm công ty", shortName: "Công ty" },
  { id: "cases", name: "Vụ việc" },
  { id: "income", name: "Tài chính" },
];
const groups = [
  { id: "ctv", name: "CTV" },
  { id: "lawyer", name: "Luật sư" },
  { id: "support", name: "CTV hỗ trợ" },
  { id: "legal", name: "CTV pháp lý" },
];

const caseRoleGroups = [
  { id: "lawyer", name: "Luật sư" },
  { id: "support", name: "Cộng tác viên hỗ trợ" },
  { id: "legal", name: "Cộng tác viên pháp lý" },
];

function personGroup(person) {
  return person?.group || person?.role || "ctv";
}

function personRoles(person) {
  if (Array.isArray(person?.roles) && person.roles.length) {
    return person.roles;
  }
  return [personGroup(person)];
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
  if (thread.type === "global") return thread.name || "Nhóm công ty";
  if (thread.type === "cases") return thread.name;
  if (thread.type === "income") return admin ? thread.name : "Thông báo tài chính";
  if (thread.live || admin) return thread.name;
  return "Giám đốc";
}

function threadPreview(thread) {
  return (
    thread.lastPreview ||
    thread.messages.at(-1)?.content ||
    (thread.type === "income"
      ? "Chưa có thông báo lương"
      : thread.type === "global"
        ? "Chưa có tin nhắn trong nhóm công ty"
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

function CasePersonPicker({ staffList, selected, selectedName, onChange }) {
  const [province, setProvince] = useState("");
  const available = province ? staffList.filter((person) =>
    registeredProvinces(person.area).has(province) &&
    !selected.some((id) => samePersonId(id, person.id)),
  ) : [];

  return (
    <div className="case-person-picker">
      <label>
        Tỉnh/thành phố xảy ra vụ việc
        <select aria-label="Tỉnh/thành phố xảy ra vụ việc" value={province} onChange={(event) => setProvince(event.target.value)}>
          <option value="">Chọn tỉnh/thành phố</option>
          {workProvinces.map((name) => <option key={name}>{name}</option>)}
        </select>
      </label>
      {caseRoleGroups.map((group) => {
        const candidates = available.filter((person) => personRoles(person).includes(group.id));
        return (
          <label key={group.id}>
            {group.name}
            <select aria-label={group.name} value="" disabled={!candidates.length} onChange={(event) => {
              const person = candidates.find((item) => samePersonId(item.id, event.target.value));
              if (person) onChange([...selected, person.id]);
            }}>
              <option value="">{!province ? "Chọn tỉnh/thành phố trước" : candidates.length ? "Chọn người phụ trách" : "Không còn người phù hợp"}</option>
              {candidates.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}
            </select>
          </label>
        );
      })}
      <div className="case-selected-people">
        <p>Đã chọn ({selected.length})</p>
        {selected.length ? <ul>
          {selected.map((id) => {
            const name = selectedName(id);
            return <li key={id}><button type="button" aria-label={`Gỡ ${name}`}
              onClick={() => onChange(selected.filter((item) => !samePersonId(item, id)))}
            >{name} <span aria-hidden="true">×</span></button></li>;
          })}
        </ul> : <p>Có thể lưu vụ việc và phân công sau.</p>}
      </div>
    </div>
  );
}

function FinanceRecipientPicker({ staffList, selected, onChange }) {
  return (
    <div className="case-person-picker finance-recipient-picker">
      {caseRoleGroups.map((group) => {
        const candidates = staffList.filter((person) =>
          personRoles(person).includes(group.id) &&
          !selected.some((id) => samePersonId(id, person.id)),
        );
        return (
          <label key={group.id}>
            {group.name}
            <select
              aria-label={group.name}
              value=""
              disabled={!candidates.length}
              onChange={(event) => {
                const person = candidates.find((item) => samePersonId(item.id, event.target.value));
                if (person) onChange([...selected, person.id]);
              }}
            >
              <option value="">{candidates.length ? "Chọn người nhận" : "Không còn người để chọn"}</option>
              {candidates.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}
            </select>
          </label>
        );
      })}
      <div className="case-selected-people">
        <p aria-live="polite">Đã chọn ({selected.length})</p>
        {selected.length > 0 && (
          <ul>{selected.map((id) => {
            const name = staffList.find((person) => samePersonId(person.id, id))?.name || id;
            return (
              <li key={id}>
                <button type="button" aria-label={`Gỡ ${name}`}
                  onClick={() => onChange(selected.filter((item) => !samePersonId(item, id)))}
                >{name} <span aria-hidden="true">×</span></button>
              </li>
            );
          })}</ul>
        )}
      </div>
    </div>
  );
}

function PersonPicker({ staffList, selected, onChange }) {
  return (
    <div className="member-person-picker">
      {groups.map((group) => {
        const peopleInGroup = staffList.filter((person) =>
          personRoles(person).includes(group.id),
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
  const [rosterOpen, setRosterOpen] = useState(false);
  const [drafts, setDrafts] = useState({});
  const [dialog, setDialog] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [quickText, setQuickText] = useState("");
  const [dialogError, setDialogError] = useState("");
  const [caseName, setCaseName] = useState("");
  const [caseDescription, setCaseDescription] = useState("");
  const [caseAddress, setCaseAddress] = useState("");
  const [sending, setSending] = useState(false);
  const sendingRef = useRef(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [openingId, setOpeningId] = useState(null);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const loadingOlderRef = useRef(false);
  const objectUrls = useRef([]);
  const listHeading = useRef(null);
  const chatShellRef = useRef(null);
  const { showToast } = useToast();
  const openChatPane = () => {
    setConversationOpen(true);
  };
  const closeChatPane = () => {
    setConversationOpen(false);
    requestAnimationFrame(() => {
      listHeading.current?.focus({ preventScroll: true });
    });
  };
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
    liveChat
      ? chatThreads.filter((thread) => thread.type === tab)
      : threads.filter(
          (thread) =>
            thread.type === tab && (admin || thread.members.includes(actorId)),
        ),
  );
  const globalThread =
    chatThreads.find((thread) => thread.type === "global") || null;
  const globalRoster = (globalThread?.memberDetails || []).filter((person) => {
    // Bỏ mục placeholder "Giám đốc" / "Giám đốc Công ty", vẫn giữ thành viên role giám đốc có tên thật.
    if (String(person.id) === "director") return false;
    const name = String(person.name || "")
      .trim()
      .replace(/\s+/g, " ");
    return !/^giám đốc(\s+công ty)?$/i.test(name);
  });
  const active =
    tab === "global"
      ? globalThread
      : available.find((thread) => thread.id === selections[selectionKey]);
  const assigneeGroups =
    admin && active?.type === "cases"
      ? caseRoleGroups.map((group) => ({
          ...group,
          people: active.members.flatMap((id) => {
            const member =
              membersList.find((person) => samePersonId(person.id, id)) ||
              active.memberProfiles?.find((person) =>
                samePersonId(person.id, id),
              );
            return member?.name && personRoles(member).includes(group.id)
              ? [member]
              : [];
          }),
        }))
      : null;
  const showChatPane = tab === "global" || conversationOpen;
  const draftKey = `${actorId}-${active?.id}`;
  const draft = drafts[draftKey] || EMPTY_DRAFT;
  useEffect(() => {
    document.title = "Không gian thành viên — Công ty Luật TNHH MTV Từ Liêm";
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    const syncHeaderOffset = () => {
      const header = document.querySelector(".site-header");
      const height = Math.ceil(header?.getBoundingClientRect().height || 0);
      const mobile = window.matchMedia("(max-width: 900px)").matches;
      // Desktop: +2px tránh cắt mép; mobile: đúng chiều cao header để full height
      root.style.setProperty(
        "--member-header-offset",
        `${(height || (mobile ? 88 : 110)) + (mobile ? 0 : 2)}px`,
      );
    };
    syncHeaderOffset();
    window.addEventListener("resize", syncHeaderOffset);
    const { style } = document.body;
    const prevOverflow = style.overflow;
    style.overflow = "hidden";
    return () => {
      window.removeEventListener("resize", syncHeaderOffset);
      root.style.removeProperty("--member-header-offset");
      style.overflow = prevOverflow;
    };
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
      listIncomeNotices().catch(() => []),
      getGlobalGroup().catch(() => null),
    ])
      .then(([direct, cases, income, globalGroup]) => {
        if (!cancelled) {
          setChatThreads([
            ...direct.map((item) => conversationToThread(item, session.id)),
            ...cases.map((item) => conversationToThread(item, session.id)),
            ...income.map((item) => conversationToThread(item, session.id)),
            ...(globalGroup
              ? [conversationToThread(globalGroup, session.id)]
              : []),
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
              group: person.group || person.role || "lawyer",
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
    if (active?.type === "income" && !admin) return;
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
    setCaseDescription(
      type === "edit" ? active.description || active.subtitle || "" : "",
    );
    setCaseAddress(type === "edit" ? active.address || "" : "");
    setQuickText("");
  };
  const submitDialog = async (event) => {
    event.preventDefault();
    if (!admin) return;
    if ((dialog === "quick" || dialog === "income") && !recipients.length)
      return setDialogError("Vui lòng chọn ít nhất một người.");
    if (dialog === "quick" || dialog === "income") {
      if (!quickText.trim()) return;
      if (dialog === "income" && liveChat) {
        try {
          const memberIds = recipients.filter((id) => isApiMemberId(id));
          if (!memberIds.length) {
            setDialogError("Vui lòng chọn ít nhất một thành viên.");
            return;
          }
          const saved = await sendIncomeNotice({
            content: quickText.trim(),
            memberIds,
          });
          setChatThreads((previous) => {
            const next = [...previous];
            saved.forEach((item) => {
              const thread = conversationToThread(item, session.id);
              const index = next.findIndex((row) => row.uuid === thread.uuid);
              if (index >= 0) next[index] = { ...thread, unread: false };
              else next.unshift(thread);
            });
            return next;
          });
          if (saved[0]?.uuid) {
            setSelections((previous) => ({
              ...previous,
              [selectionKey]: saved[0].uuid,
            }));
            openChatPane();
          }
          setDialog(null);
          showToast("Đã gửi thông báo tài chính.");
        } catch (err) {
          setDialogError(err.message);
        }
        return;
      }
      const message = newMessage(quickText.trim());
      setThreads((previous) =>
        previous.map((thread) =>
          thread.type === (dialog === "income" ? "income" : "messages") &&
          recipients.includes(thread.ownerId)
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
          description: caseDescription.trim(),
          address: caseAddress.trim(),
          memberIds: recipients.filter((id) => isApiMemberId(id)),
        };
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
          openChatPane();
          showToast("Đã tạo vụ việc.");
        }
        setDialog(null);
      } catch (err) {
        setDialogError(err.message);
      }
      return;
    }
    if (dialog === "edit") {
      setThreads((previous) =>
        previous.map((thread) =>
          thread.id === active.id
            ? {
                ...thread,
                name: caseName.trim(),
                description: caseDescription.trim(),
                subtitle: caseDescription.trim(),
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
        description: caseDescription.trim(),
        subtitle: caseDescription.trim(),
        members: ["director", ...recipients],
        messages: [],
      };
      setThreads((previous) => [...previous, thread]);
      setSelections((previous) => ({
        ...previous,
        [selectionKey]: thread.id,
      }));
      openChatPane();
    }
    setDialog(null);
    notify();
  };
  const switchTab = (id) => {
    setTab(id);
    setConversationOpen(id === "global");
    setRosterOpen(false);
  };

  useEffect(() => {
    if (!liveChat || tab !== "global") return undefined;
    let cancelled = false;
    setOpeningId("global");
    getGlobalGroup()
      .then((convo) => {
        if (cancelled || !convo) return;
        const thread = conversationToThread(convo, session.id);
        setChatThreads((previous) => [
          thread,
          ...previous.filter((item) => item.type !== "global"),
        ]);
        setSelections((previous) => ({
          ...previous,
          [`${actorId}-global`]: thread.id,
        }));
        setConversationOpen(true);
      })
      .catch((err) => showToast(err.message))
      .finally(() => {
        if (!cancelled) setOpeningId(null);
      });
    return () => {
      cancelled = true;
    };
  }, [liveChat, tab, session?.id, actorId]);

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
        openChatPane();
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
    openChatPane();
  };

  const handleOpenCaseThread = (caseId) => {
    setTab("cases");
    setSelections((previous) => ({
      ...previous,
      [`${actorId}-cases`]: caseId,
    }));
    openChatPane();
  };

  const availableTabs = [
    ...tabs,
    ...(admin
      ? [
          {
            id: "members",
            name: "Quản lý thành viên",
            shortName: "Thành viên",
            badge: pendingApprovals,
          },
        ]
      : []),
    { id: "settings", name: "Cài đặt", shortName: "Cài đặt" },
  ];
  const railShortNames = {
    messages: "Tin nhắn",
    global: "Toàn thể",
    cases: "Vụ việc",
    income: "Tài chính",
    members: "Thành viên",
    settings: "Cài đặt",
  };

  const title =
    tab === "messages"
      ? admin
        ? "Người trao đổi"
        : "Tin nhắn của tôi"
      : tab === "global"
        ? "Nhóm công ty"
        : tab === "cases"
          ? admin
            ? "Các vụ việc"
            : "Vụ việc tôi tham gia"
          : tab === "income"
            ? admin
              ? "Thông báo lương"
              : "Thông báo lương của tôi"
            : tab === "settings"
              ? "Cài đặt tài khoản"
              : "Quản lý thành viên";

  if (!session) {
    return <Navigate to="/thanh-vien" replace />;
  }

  const railIcons = {
    messages: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7A2.5 2.5 0 0 1 17.5 16H9l-4 3.2V6.5z" />
      </svg>
    ),
    cases: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" />
        <rect x="4" y="7" width="16" height="13" rx="2" />
        <path d="M4 12h16" />
      </svg>
    ),
    income: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v8" />
      </svg>
    ),
    members: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3.5 18c.8-2.8 2.9-4.2 5.5-4.2s4.7 1.4 5.5 4.2" />
        <path d="M14 14.2c1.8-.2 3.4.6 4.2 2.8" />
      </svg>
    ),
    settings: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.3.6.9 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
      </svg>
    ),
    global: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="M4 12h16" />
        <path d="M12 4a14 14 0 0 1 0 16" />
        <path d="M12 4a14 14 0 0 0 0 16" />
      </svg>
    ),
  };

  return (
    <main className="member-page member-page-zalo">
      <h1 className="page-heading-sr-only">Không gian thành viên</h1>
      <div
        className={`member-zalo-shell ${showChatPane ? "is-chat-open" : ""} ${tab === "global" ? "is-global-group" : ""} ${tab === "members" || tab === "settings" ? "is-members" : ""}`}
        ref={chatShellRef}
      >
        <aside className="member-rail" aria-label="Điều hướng thành viên">
          <div
            className="member-rail-role"
            title={`${session.name} · ${memberGroups[session.role] || session.role}`}
          >
            {memberGroups[session.role] || session.role}
          </div>
          <nav className="member-rail-nav" aria-label="Công việc cá nhân">
            {availableTabs.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`member-rail-btn${tab === item.id ? " active" : ""}`}
                aria-pressed={tab === item.id}
                aria-label={item.name}
                title={item.name}
                onClick={() => switchTab(item.id)}
              >
                {railIcons[item.id] || railIcons.messages}
                <span className="member-rail-label">
                  <span className="member-rail-label-full">{item.name}</span>
                  <span className="member-rail-label-short">
                    {item.shortName || railShortNames[item.id] || item.name}
                  </span>
                </span>
                {item.badge != null && item.badge > 0 ? (
                  <i className="member-rail-badge">
                    {item.badge > 9 ? "9+" : item.badge}
                  </i>
                ) : null}
              </button>
            ))}
          </nav>
          <button
            type="button"
            className="member-rail-logout"
            title="Đăng xuất"
            onClick={async () => {
              await logout();
              navigate("/thanh-vien");
            }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M10 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3" />
              <path d="M14 16l4-4-4-4" />
              <path d="M18 12H9" />
            </svg>
            <span>Đăng xuất</span>
          </button>
        </aside>

        {tab === "settings" ? (
          <section className="member-zalo-panel" aria-label="Cài đặt tài khoản">
            <MemberSettings session={session} />
          </section>
        ) : admin && tab === "members" ? (
          <section className="member-zalo-panel" aria-label="Quản lý thành viên">
            <MemberManagement
              members={membersList}
              threads={liveChat ? chatThreads : threads}
              onUpdateMember={handleUpdateMember}
              onToggleStatus={handleToggleStatus}
              onOpenDirectMessage={handleOpenDirectMessage}
              onOpenCaseThread={handleOpenCaseThread}
              onPendingCount={setPendingApprovals}
            />
          </section>
        ) : (
          <div
            className={`member-zalo-main chat-workspace ${showChatPane ? "conversation-open is-chat-open" : ""} ${tab === "global" ? "is-global-chat" : ""}`}
          >
            <aside className="member-zalo-list member-list" aria-label={title}>
              <div className="member-list-heading">
                <h2 ref={listHeading} tabIndex={-1}>
                  {title}
                </h2>
                {tab === "global" ? (
                  <span className="member-text-action member-roster-count">
                    {globalRoster.length} thành viên
                  </span>
                ) : null}
                {admin &&
                  tab !== "global" &&
                  tab !== "settings" &&
                  !(liveChat && tab === "messages") && (
                  <button
                    type="button"
                    className="member-text-action"
                    onClick={() =>
                      openDialog(
                        tab === "cases"
                          ? "create"
                          : tab === "income"
                            ? "income"
                            : "quick",
                      )
                    }
                  >
                    {tab === "cases"
                      ? "+ Tạo vụ việc"
                      : tab === "income"
                        ? "+ Thông báo tài chính"
                        : "+ Gửi nhanh"}
                  </button>
                )}
              </div>
              {tab === "global" ? (
                <div className="member-thread-list global-roster-list">
                  {(listLoading || openingId === "global") && !globalRoster.length ? (
                    <MemberThreadListSkeleton />
                  ) : null}
                  {globalRoster.map((person) => {
                    const isSelf = samePersonId(person.id, session?.id);
                    return (
                      <div
                        key={person.id}
                        className={`member-thread-choice chat-thread-item global-roster-item${isSelf ? " is-self" : ""}`}
                      >
                        <span className="chat-avatar" aria-hidden="true">
                          {chatInitials(person.name)}
                        </span>
                        <span className="chat-thread-main">
                          <span className="chat-thread-top">
                            <strong>
                              {person.name}
                              {isSelf ? " (Bạn)" : ""}
                            </strong>
                          </span>
                          <span className="chat-thread-preview global-roster-role">
                            {memberGroups[person.role] || person.role || "Thành viên"}
                          </span>
                        </span>
                      </div>
                    );
                  })}
                  {!listLoading &&
                    openingId !== "global" &&
                    globalRoster.length === 0 && (
                      <p className="member-empty">
                        Chưa có thành viên trong nhóm công ty.
                      </p>
                    )}
                </div>
              ) : (
                <>
                  <div className="member-thread-list">
                    {listLoading ? <MemberThreadListSkeleton /> : null}
                    {!listLoading &&
                      available.map((thread) => {
                        const name = threadDisplayName(thread, admin);
                        return (
                          <button
                            key={thread.id}
                            type="button"
                            className={`member-thread-choice chat-thread-item ${active?.id === thread.id ? "selected" : ""} ${thread.unread ? "has-unread" : ""}`}
                            aria-pressed={active?.id === thread.id}
                            onClick={async (event) => {
                              event.currentTarget.blur();
                              setSelections((previous) => ({
                                ...previous,
                                [selectionKey]: thread.id,
                              }));
                              openChatPane();
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
                                            ...conversationToThread(
                                              full,
                                              session.id,
                                            ),
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
                                <small>
                                  {thread.members.length} người tham gia
                                </small>
                              )}
                            </span>
                            {thread.unread ? (
                              <i
                                className="member-unread-dot"
                                aria-label="Chưa đọc"
                              />
                            ) : null}
                          </button>
                        );
                      })}
                  </div>
                  {!listLoading && available.length === 0 && (
                    <p className="member-empty">
                      {tab === "messages"
                        ? "Chưa có cuộc trao đổi. Giám đốc mở Nhắn tin riêng từ tab Quản lý thành viên."
                        : tab === "income"
                          ? admin
                            ? "Chưa có thông báo lương. Gửi thông báo chuyển tiền cho thành viên."
                            : "Chưa nhận thông báo lương từ Giám đốc."
                          : "Chưa có vụ việc được phân công."}
                    </p>
                  )}
                </>
              )}
            </aside>

            <section
              className={`member-zalo-chat member-conversation-pane ${showChatPane ? "is-open" : ""}`}
              aria-label="Khung chat"
            >
              {active ? (
                <MemberConversation
                  key={`${actorId}-${active.id}`}
                  thread={active}
                  actorId={active.live ? session.id : actorId}
                  draft={draft}
                  sending={sending}
                  loading={
                    openingId === active.id ||
                    (tab === "global" && openingId === "global")
                  }
                  loadingOlder={loadingOlder}
                  onDraft={updateDraft}
                  onSend={send}
                  onLoadOlder={active.live ? loadOlderMessages : undefined}
                  onNotice={showToast}
                  onDownloadAttachment={
                    active.live
                      ? (file) =>
                          downloadChatAttachment(file.id, file.name).catch(
                            (err) => showToast(err.message),
                          )
                      : undefined
                  }
                  onBack={() => {
                    if (tab === "global") {
                      switchTab("messages");
                      return;
                    }
                    setSelections((previous) => {
                      const next = { ...previous };
                      delete next[selectionKey];
                      return next;
                    });
                    closeChatPane();
                  }}
                  canReply={active.type !== "income" || admin}
                  assigneeGroups={assigneeGroups}
                  onEditMembers={
                    admin && tab === "cases" ? () => openDialog("edit") : null
                  }
                  onOpenRoster={
                    tab === "global" ? () => setRosterOpen(true) : undefined
                  }
                />
              ) : (
                <div className="member-no-selection chat-empty-pane">
                  <p>
                    {tab === "global"
                      ? "Đang mở nhóm công ty…"
                      : tab === "messages"
                        ? "Chọn một cuộc trao đổi bên trái để xem tin nhắn."
                        : tab === "income"
                          ? "Chọn một thông báo lương bên trái để xem."
                          : admin
                            ? "Tạo vụ việc và chọn người phụ trách để bắt đầu."
                            : "Chọn một vụ việc bên trái để xem trao đổi."}
                  </p>
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      <Modal
          open={Boolean(dialog)}
          onClose={() => setDialog(null)}
          title={
            dialog === "quick"
              ? "Gửi tin nhắn nhanh"
              : dialog === "income"
                ? "Thông báo tài chính"
                : dialog === "edit"
                  ? "Thành viên vụ việc"
                  : "Tạo vụ việc"
          }
          className="member-workspace-dialog"
        >
          {dialog && (
            <form onSubmit={submitDialog}>
              {dialog !== "quick" && dialog !== "income" && (
                <>
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
                  <label>
                    Địa chỉ
                    <input
                      name="caseAddress"
                      value={caseAddress}
                      onChange={(event) => setCaseAddress(event.target.value)}
                      maxLength={255}
                      placeholder="Địa chỉ liên quan đến vụ việc"
                    />
                  </label>
                  <label>
                    Mô tả vụ việc
                    <textarea
                      name="caseDescription"
                      value={caseDescription}
                      onChange={(event) => setCaseDescription(event.target.value)}
                      rows={3}
                      maxLength={500}
                      placeholder="Tóm tắt hồ sơ, loại tranh chấp, ghi chú phân công…"
                    />
                  </label>
                </>
              )}
              <p className="member-picker-label">
                {dialog === "quick"
                  ? "Gửi riêng cho những người được chọn"
                  : dialog === "income"
                    ? "Gửi thông báo tài chính cho những người được chọn"
                    : "Chọn hoặc thay đổi người phụ trách"}
              </p>
              {dialog === "quick" ? (
                <PersonPicker staffList={staff} selected={recipients} onChange={setRecipients} />
              ) : dialog === "income" ? (
                <FinanceRecipientPicker
                  staffList={liveChat ? staff.filter((person) => isApiMemberId(person.id)) : staff}
                  selected={recipients}
                  onChange={setRecipients}
                />
              ) : (
                <CasePersonPicker
                  staffList={liveChat ? staff.filter((person) => isApiMemberId(person.id)) : staff}
                  selected={recipients}
                  selectedName={(id) =>
                    membersList.find((person) => samePersonId(person.id, id))?.name ||
                    active?.memberNames?.[active.members.indexOf(id)] ||
                    `Thành viên #${id}`
                  }
                  onChange={setRecipients}
                />
              )}
              {(dialog === "quick" || dialog === "income") && (
                <>
                  {dialog === "quick" && <details className="member-broadcast">
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
                  </details>}
                  <label>
                    {dialog === "income" ? "Nội dung thông báo" : "Nội dung tin nhắn"}
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
                    : dialog === "income"
                      ? "Gửi thông báo"
                      : dialog === "edit"
                        ? "Lưu thành viên"
                        : "Tạo vụ việc"}
                </button>
              </div>
            </form>
          )}
        </Modal>

      <Modal
        open={rosterOpen}
        onClose={() => setRosterOpen(false)}
        title="Thành viên nhóm"
        className="member-workspace-dialog global-roster-dialog"
      >
        <p className="global-roster-dialog-count">
          {globalRoster.length} thành viên
        </p>
        <div className="global-roster-dialog-list" role="list">
          {globalRoster.map((person) => {
            const isSelf = samePersonId(person.id, session?.id);
            return (
              <div
                key={person.id}
                className={`global-roster-dialog-item${isSelf ? " is-self" : ""}`}
                role="listitem"
              >
                <span className="chat-avatar" aria-hidden="true">
                  {chatInitials(person.name)}
                </span>
                <span className="global-roster-dialog-main">
                  <strong>
                    {person.name}
                    {isSelf ? " (Bạn)" : ""}
                  </strong>
                  <span className="global-roster-role">
                    {memberGroups[person.role] || person.role || "Thành viên"}
                  </span>
                </span>
              </div>
            );
          })}
          {!listLoading &&
            openingId !== "global" &&
            globalRoster.length === 0 && (
              <p className="member-empty">
                Chưa có thành viên trong nhóm công ty.
              </p>
            )}
        </div>
      </Modal>
    </main>
  );
}
