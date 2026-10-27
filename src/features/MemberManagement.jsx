import { useEffect, useMemo, useState } from "react";
import {
  approveMemberApplication,
  getTeamMember,
  listMemberApplications,
  listTeamMembers,
  rejectMemberApplication,
} from "../api/member.js";
import {
  MemberDirectorySkeleton,
  MemberDossierBodySkeleton,
  MemberDossierSkeleton,
  Skeleton,
} from "../components/Skeleton.jsx";
import {
  MemberApplicationDetail,
  MemberApplicationList,
} from "./MemberApproval.jsx";
import { Modal } from "../components/Modal.jsx";
import { useMemberAuth } from "./memberAuth.jsx";
import { useToast } from "../components/toast-context.js";

const ROLE_CONFIG = {
  director: { label: "Giám đốc", badgeClass: "badge-lawyer", desc: "Điều hành đội ngũ và phân công công việc" },
  ctv: { label: "CTV", badgeClass: "badge-support", desc: "Cộng tác viên của công ty" },
  lawyer: { label: "Luật sư", badgeClass: "badge-lawyer", desc: "Phụ trách án & tham gia tố tụng" },
  support: { label: "CTV hỗ trợ", badgeClass: "badge-support", desc: "Hỗ trợ khách hàng & tiếp nhận hồ sơ" },
  legal: { label: "CTV pháp lý", badgeClass: "badge-legal", desc: "Nghiên cứu tài liệu & hồ sơ pháp lý" },
};

function sameId(left, right) {
  return left != null && right != null && String(left) === String(right);
}

function memberGroup(person) {
  return person?.role || person?.group || "ctv";
}

function normalizeMember(item) {
  if (!item) return item;
  return {
    ...item,
    group: memberGroup(item),
  };
}

function isActiveStatus(person) {
  return person?.status !== "inactive";
}

export default function MemberManagement({
  members = [],
  threads = [],
  onUpdateMember,
  onToggleStatus,
  onOpenDirectMessage,
  onOpenCaseThread,
  onPendingCount,
}) {
  const { session } = useMemberAuth();
  const { showToast } = useToast();
  const isDirectorAccount = session?.role === "director";
  const [apiMembers, setApiMembers] = useState(null);
  const [listError, setListError] = useState("");
  const [listLoading, setListLoading] = useState(false);
  const [detailMember, setDetailMember] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [viewMode, setViewMode] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [formError, setFormError] = useState("");
  const [applications, setApplications] = useState([]);
  const [applicationError, setApplicationError] = useState("");
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [applicationFilter, setApplicationFilter] = useState("pending");
  const [applicationSearch, setApplicationSearch] = useState("");
  const [selectedApplicationId, setSelectedApplicationId] = useState("");
  const [applicationSaving, setApplicationSaving] = useState(false);
  const [applicationFormError, setApplicationFormError] = useState("");
  const [pauseConfirm, setPauseConfirm] = useState(null);

  useEffect(() => {
    if (!isDirectorAccount) {
      setApiMembers(null);
      setListError("");
      setListLoading(false);
      return undefined;
    }
    let cancelled = false;
    setListLoading(true);
    setListError("");
    listTeamMembers()
      .then((list) => {
        if (!cancelled) setApiMembers(list.map(normalizeMember));
      })
      .catch((err) => {
        if (!cancelled) {
          setListError(err.message);
          setApiMembers([]);
        }
      })
      .finally(() => {
        if (!cancelled) setListLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isDirectorAccount]);

  useEffect(() => {
    if (!isDirectorAccount) {
      setApplications([]);
      onPendingCount?.(0);
      return undefined;
    }
    let cancelled = false;
    setApplicationLoading(true);
    setApplicationError("");
    listMemberApplications()
      .then(({ items, pendingCount }) => {
        if (cancelled) return;
        setApplications(items);
        onPendingCount?.(pendingCount);
      })
      .catch((err) => {
        if (!cancelled) {
          setApplicationError(err.message);
          setApplications([]);
        }
      })
      .finally(() => {
        if (!cancelled) setApplicationLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isDirectorAccount, onPendingCount]);

  // Chỉ lấy nhân sự, loại trừ Giám đốc
  const staffMembers = useMemo(() => {
    const source = isDirectorAccount
      ? Array.isArray(apiMembers)
        ? apiMembers
        : []
      : members;
    return source
      .map(normalizeMember)
      .filter((person) => {
        if (person.id === "director" || memberGroup(person) === "director") {
          return false;
        }
        if (session?.id != null && sameId(person.id, session.id)) {
          return false;
        }
        return true;
      });
  }, [apiMembers, isDirectorAccount, members, session?.id]);

  // Lọc danh sách thành viên ở cột trái theo từ khóa và vai trò
  const filteredMembers = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return staffMembers.filter((person) => {
      const matchSearch =
        !term ||
        person.name.toLowerCase().includes(term) ||
        (person.username && person.username.toLowerCase().includes(term)) ||
        (person.phone && person.phone.includes(term)) ||
        (person.email && person.email.toLowerCase().includes(term)) ||
        (person.area && person.area.toLowerCase().includes(term));

      const matchRole = roleFilter === "all" || memberGroup(person) === roleFilter;
      const matchStatus =
        viewMode === "inactive" ? !isActiveStatus(person) : isActiveStatus(person);
      return matchSearch && matchRole && matchStatus;
    });
  }, [staffMembers, searchTerm, roleFilter, viewMode]);

  const activeCount = staffMembers.filter(isActiveStatus).length;
  const inactiveCount = staffMembers.length - activeCount;
  const pendingCount = applications.filter((item) => item.status === "pending").length;
  const selectedApplication =
    applications.find((item) => sameId(item.id, selectedApplicationId)) || null;
  const isPendingTab = viewMode === "pending";

  // Thành viên đang được chọn hiển thị ở cột phải
  const activeMember = useMemo(() => {
    const selected =
      (detailMember && sameId(detailMember.id, selectedMemberId)
        ? detailMember
        : null) ||
      filteredMembers.find((person) => sameId(person.id, selectedMemberId)) ||
      filteredMembers[0] ||
      null;
    return normalizeMember(selected);
  }, [detailMember, selectedMemberId, filteredMembers]);

  // Danh sách các vụ việc mà thành viên đang chọn tham gia
  const memberCases = useMemo(() => {
    if (!activeMember) return [];
    return threads.filter(
      (t) => t.type === "cases" && t.members.includes(activeMember.id),
    );
  }, [threads, activeMember]);

  useEffect(() => {
    const stillVisible = filteredMembers.some((person) =>
      sameId(person.id, selectedMemberId),
    );
    if (!stillVisible) {
      setSelectedMemberId(filteredMembers[0]?.id || "");
      setIsEditing(false);
    }
  }, [filteredMembers, selectedMemberId]);

  useEffect(() => {
    if (!isDirectorAccount || activeMember?.id == null) {
      if (detailMember) setDetailMember(null);
      setDetailLoading(false);
      return undefined;
    }
    let cancelled = false;
    setDetailLoading(true);
    getTeamMember(activeMember.id)
      .then((item) => {
        if (!cancelled) setDetailMember(normalizeMember(item));
      })
      .catch(() => {
        if (!cancelled) setDetailMember(null);
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isDirectorAccount, activeMember?.id]);

  const getInitials = (name) => {
    if (!name) return "TV";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleSelectApplication = (id) => {
    setSelectedApplicationId(id);
    setIsMobileDetailOpen(true);
    setApplicationFormError("");
  };

  const handleApproveApplication = async ({ username, password, area }) => {
    if (!selectedApplication) return;
    setApplicationSaving(true);
    setApplicationFormError("");
    try {
      const { application, member, message } = await approveMemberApplication(
        selectedApplication.id,
        { username, password, area },
      );
      setApplications((prev) =>
        prev.map((item) => (sameId(item.id, application.id) ? application : item)),
      );
      if (member) {
        setApiMembers((prev) =>
          Array.isArray(prev) ? [normalizeMember(member), ...prev] : [normalizeMember(member)],
        );
      }
      onPendingCount?.(Math.max(0, pendingCount - 1));
      showToast(
        `${message || "Đã duyệt thành viên."} Tài khoản: ${username} / ${password}`,
      );
    } catch (err) {
      setApplicationFormError(err.message);
    } finally {
      setApplicationSaving(false);
    }
  };

  const handleRejectApplication = async (note) => {
    if (!selectedApplication) return;
    setApplicationSaving(true);
    setApplicationFormError("");
    try {
      const application = await rejectMemberApplication(selectedApplication.id, note);
      setApplications((prev) =>
        prev.map((item) => (sameId(item.id, application.id) ? application : item)),
      );
      onPendingCount?.(Math.max(0, pendingCount - 1));
      showToast("Đã từ chối hồ sơ ứng tuyển.");
    } catch (err) {
      setApplicationFormError(err.message);
    } finally {
      setApplicationSaving(false);
    }
  };

  // Bắt đầu chỉnh sửa hồ sơ
  const handleStartEdit = () => {
    if (!activeMember) return;
    setEditFormData({
      id: activeMember.id,
      name: activeMember.name,
      group: activeMember.group,
      phone: activeMember.phone || "",
      email: activeMember.email || "",
      area: activeMember.area || "Hà Nội",
      status: activeMember.status || "active",
    });
    setFormError("");
    setIsEditing(true);
  };

  const handleSelectMember = (id) => {
    setSelectedMemberId(id);
    setIsMobileDetailOpen(true);
    setIsEditing(false);
    setFormError("");
  };

  const handleToggleMemberStatus = (id) => {
    onToggleStatus?.(id);
    const flipStatus = (status) =>
      status === "inactive" ? "active" : "inactive";
    setApiMembers((prev) =>
      Array.isArray(prev)
        ? prev.map((person) =>
            sameId(person.id, id)
              ? { ...person, status: flipStatus(person.status) }
              : person,
          )
        : prev,
    );
    setDetailMember((prev) =>
      prev && sameId(prev.id, id)
        ? { ...prev, status: flipStatus(prev.status) }
        : prev,
    );
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editFormData.name?.trim()) {
      setFormError("Vui lòng nhập họ và tên thành viên.");
      return;
    }
    if (!editFormData.phone?.trim()) {
      setFormError("Vui lòng nhập số điện thoại.");
      return;
    }
    onUpdateMember({
      ...editFormData,
      name: editFormData.name.trim(),
      phone: editFormData.phone.trim(),
      email: editFormData.email.trim(),
      area: editFormData.area.trim(),
    });
    setIsEditing(false);
    setFormError("");
  };

  const roleInfo = activeMember
    ? ROLE_CONFIG[memberGroup(activeMember)] || {
        label: "Thành viên",
        badgeClass: "badge-default",
      }
    : null;

  return (
    <div
      className={`member-workspace member-master-detail-workspace ${
        isMobileDetailOpen ? "conversation-open" : ""
      }`}
    >
      {/* ============================================================
          CỘT TRÁI: DANH BẠ THEO TRẠNG THÁI HOẠT ĐỘNG
         ============================================================ */}
      <aside
        className="member-list member-directory-sidebar"
        aria-label={
          isPendingTab
            ? "Duyệt thành viên"
            : viewMode === "inactive"
              ? "Thành viên không hoạt động"
              : "Thành viên đang hoạt động"
        }
      >
        <div className="member-list-heading directory-heading">
          <h2>
            {isPendingTab
              ? "Duyệt thành viên"
              : viewMode === "inactive"
                ? "Không hoạt động"
                : "Đang hoạt động"}
          </h2>
        </div>

        <div
          className="directory-subtabs"
          role="tablist"
          aria-label="Lọc danh sách thành viên"
        >
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === "active"}
            className={`directory-subtab-btn ${viewMode === "active" ? "active" : ""}`}
            onClick={() => {
              setViewMode("active");
              setIsMobileDetailOpen(false);
            }}
          >
            Hoạt động ({activeCount})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === "inactive"}
            className={`directory-subtab-btn ${viewMode === "inactive" ? "active" : ""}`}
            onClick={() => {
              setViewMode("inactive");
              setIsMobileDetailOpen(false);
            }}
          >
            Tạm dừng ({inactiveCount})
          </button>
          {isDirectorAccount ? (
            <button
              type="button"
              role="tab"
              aria-selected={isPendingTab}
              className={`directory-subtab-btn ${isPendingTab ? "active" : ""}`}
              onClick={() => {
                setViewMode("pending");
                setIsMobileDetailOpen(false);
                setApplicationFormError("");
              }}
            >
              Duyệt thành viên
              {pendingCount > 0 ? (
                <span className="subtab-counter">{pendingCount}</span>
              ) : null}
            </button>
          ) : null}
        </div>
        {isPendingTab ? (
          <MemberApplicationList
            applications={applications}
            loading={applicationLoading}
            error={applicationError}
            selectedId={selectedApplication?.id}
            statusFilter={applicationFilter}
            searchTerm={applicationSearch}
            onSearch={setApplicationSearch}
            onStatusFilter={(value) => {
              setApplicationFilter(value);
              setSelectedApplicationId("");
              setIsMobileDetailOpen(false);
            }}
            onSelect={handleSelectApplication}
          />
        ) : (
          <>
            {/* Thanh tìm kiếm nhanh */}
            <div className="directory-search-box">
              <div className="directory-search-input-wrap">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="search-icon"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="search"
                  placeholder="Tìm theo tên, số điện thoại..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Tìm kiếm thành viên"
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={() => setSearchTerm("")}
                    aria-label="Xóa từ khóa tìm kiếm"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Thanh nút bấm (Pills) 1 hàng lọc theo vai trò */}
            <div
              className="directory-filter-chips"
              role="tablist"
              aria-label="Lọc theo vai trò"
            >
              <button
                type="button"
                className={`directory-chip ${roleFilter === "all" ? "active" : ""}`}
                onClick={() => setRoleFilter("all")}
              >
                Tất cả
              </button>
              {isDirectorAccount ? (
                <button
                  type="button"
                  className={`directory-chip ${roleFilter === "ctv" ? "active" : ""}`}
                  onClick={() => setRoleFilter("ctv")}
                >
                  CTV
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className={`directory-chip ${roleFilter === "lawyer" ? "active" : ""}`}
                    onClick={() => setRoleFilter("lawyer")}
                  >
                    Luật sư
                  </button>
                  <button
                    type="button"
                    className={`directory-chip ${roleFilter === "support" ? "active" : ""}`}
                    onClick={() => setRoleFilter("support")}
                  >
                    CTV hỗ trợ
                  </button>
                  <button
                    type="button"
                    className={`directory-chip ${roleFilter === "legal" ? "active" : ""}`}
                    onClick={() => setRoleFilter("legal")}
                  >
                    CTV pháp lý
                  </button>
                </>
              )}
            </div>

            {/* Danh sách thành viên bên trái */}
            {listError ? (
              <p className="member-empty" role="alert">
                {listError}
              </p>
            ) : null}
            {listLoading ? <MemberDirectorySkeleton /> : (
            <div className="member-thread-list directory-list">
              {!listLoading && filteredMembers.length > 0 ? (
                filteredMembers.map((person) => {
                  const isSelected = sameId(activeMember?.id, person.id);
                  const personRole = ROLE_CONFIG[memberGroup(person)] || {
                    label: "Thành viên",
                    badgeClass: "badge-default",
                  };
                  const isActive = person.status !== "inactive";
                  const casesCount = threads.filter(
                    (t) => t.type === "cases" && t.members.includes(person.id),
                  ).length;

                  return (
                    <button
                      key={person.id}
                      type="button"
                      className={`member-thread-choice directory-item ${
                        isSelected ? "selected" : ""
                      } ${!isActive ? "item-inactive" : ""}`}
                      aria-pressed={isSelected}
                      onClick={() => handleSelectMember(person.id)}
                    >
                      <div className="directory-item-avatar">
                        {getInitials(person.name)}
                      </div>
                      <div className="directory-item-info">
                        <div className="directory-item-row-top">
                          <strong>{person.name}</strong>
                          <span
                            className={`mini-status-dot ${
                              isActive ? "status-online" : "status-paused"
                            }`}
                            title={isActive ? "Đang hoạt động" : "Tạm dừng"}
                          ></span>
                        </div>
                        <div className="directory-item-row-meta">
                          <span className={`role-badge-mini ${personRole.badgeClass}`}>
                            {personRole.label}
                          </span>
                          <span className="directory-case-count">
                            {casesCount > 0 ? `${casesCount} vụ việc` : "—"}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <p className="member-empty">
                  {viewMode === "inactive"
                    ? "Không có thành viên ngừng hoạt động."
                    : "Không tìm thấy thành viên phù hợp."}
                </p>
              )}
            </div>
            )}
          </>
        )}
      </aside>

      {/* ============================================================
          CỘT PHẢI: CHI TIẾT HỒ SƠ THÀNH VIÊN
         ============================================================ */}
      {isPendingTab ? (
        <MemberApplicationDetail
          application={selectedApplication}
          loading={applicationLoading}
          saving={applicationSaving}
          error={applicationFormError}
          onApprove={handleApproveApplication}
          onReject={handleRejectApplication}
          onBack={() => setIsMobileDetailOpen(false)}
        />
      ) : listLoading && !activeMember ? (
        <MemberDossierSkeleton />
      ) : activeMember ? (
          <section
            className="member-dossier-panel"
            aria-label={`Hồ sơ thành viên ${activeMember.name}`}
          >
            {/* Nút quay lại trên Mobile */}
            <button
              type="button"
              className="member-back"
              onClick={() => setIsMobileDetailOpen(false)}
            >
              ← Danh sách thành viên
            </button>

            {/* Header Hồ Sơ */}
            <div className="dossier-hero-header">
              <div className="dossier-hero-left">
                <div className="dossier-main-avatar">
                  {getInitials(activeMember.name)}
                </div>
                <div>
                  <div className="dossier-title-row">
                    <h2>{activeMember.name}</h2>
                    <span className={`role-badge ${roleInfo?.badgeClass}`}>
                      {roleInfo?.label}
                    </span>
                    <span
                      className={`status-pill ${
                        activeMember.status !== "inactive"
                          ? "status-active"
                          : "status-inactive"
                      }`}
                    >
                      <span className="status-dot"></span>
                      {activeMember.status !== "inactive"
                        ? "Đang hoạt động"
                        : "Tạm dừng"}
                    </span>
                  </div>
                  {detailLoading ? (
                    <p className="pending-subtitle">
                      <Skeleton className="sk-line sk-line-sm" style={{ width: "180px" }} />
                    </p>
                  ) : activeMember.username ? (
                    <p className="pending-subtitle">
                      Tên đăng nhập: {activeMember.username}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Các nút hành động chính */}
              <div className="dossier-hero-actions">
                <button
                  type="button"
                  className="btn-dossier-action btn-dossier-chat"
                  onClick={() => onOpenDirectMessage(activeMember.id)}
                  title="Mở tin nhắn trao đổi riêng"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Nhắn tin riêng
                </button>

                <button
                  type="button"
                  className={`btn-dossier-action ${
                    activeMember.status !== "inactive"
                      ? "btn-dossier-pause"
                      : "btn-dossier-activate"
                  }`}
                  onClick={() => {
                    if (activeMember.status !== "inactive") {
                      setPauseConfirm(activeMember);
                      return;
                    }
                    handleToggleMemberStatus(activeMember.id);
                  }}
                >
                  {activeMember.status !== "inactive" ? (
                    <>
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                      </svg>
                      Tạm dừng
                    </>
                  ) : (
                    <>
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      Kích hoạt
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className={`btn-dossier-action ${
                    isEditing ? "btn-dossier-cancel" : "btn-dossier-edit"
                  }`}
                  onClick={
                    isEditing
                      ? () => setIsEditing(false)
                      : handleStartEdit
                  }
                >
                  {isEditing ? (
                    <>
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      Đóng sửa
                    </>
                  ) : (
                    <>
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Sửa hồ sơ
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Thân hồ sơ: Chế độ xem hoặc Chế độ sửa */}
            <div className="dossier-content-body">
              {isEditing ? (
                /* FORM CHỈNH SỬA */
                <div className="dossier-inline-edit-box">
                  <h3 className="section-dossier-title">
                    Chỉnh sửa thông tin hồ sơ
                  </h3>
                  <form onSubmit={handleSaveEdit} className="dossier-edit-form">
                    <div className="form-group-item">
                      <label htmlFor="editName">Họ và tên thành viên *</label>
                      <input
                        id="editName"
                        value={editFormData.name}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group-item">
                        <label htmlFor="editGroup">Phân nhóm vai trò *</label>
                        <select
                          id="editGroup"
                          value={editFormData.group}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              group: e.target.value,
                            })
                          }
                        >
                          <option value="lawyer">Luật sư</option>
                          <option value="support">CTV hỗ trợ</option>
                          <option value="legal">CTV pháp lý</option>
                        </select>
                      </div>

                      <div className="form-group-item">
                        <label htmlFor="editPhone">Số điện thoại *</label>
                        <input
                          id="editPhone"
                          type="tel"
                          value={editFormData.phone}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              phone: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group-item">
                        <label htmlFor="editEmail">Địa chỉ Email</label>
                        <input
                          id="editEmail"
                          type="email"
                          value={editFormData.email}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="form-group-item">
                        <label htmlFor="editArea">Địa bàn công tác</label>
                        <input
                          id="editArea"
                          value={editFormData.area}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              area: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="form-group-item">
                      <label htmlFor="editStatus">Trạng thái làm việc</label>
                      <select
                        id="editStatus"
                        value={editFormData.status}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="active">Đang hoạt động (sẵn sàng nhận việc)</option>
                        <option value="inactive">Tạm dừng tiếp nhận</option>
                      </select>
                    </div>

                    {formError && (
                      <p role="alert" className="member-dialog-error">
                        {formError}
                      </p>
                    )}

                    <div className="inline-edit-actions">
                      <button
                        type="button"
                        className="btn-cancel-inline"
                        onClick={() => setIsEditing(false)}
                      >
                        Hủy bỏ
                      </button>
                      <button type="submit" className="member-primary">
                        Lưu thay đổi hồ sơ
                      </button>
                    </div>
                  </form>
                </div>
              ) : detailLoading ? (
                <MemberDossierBodySkeleton />
              ) : (
                /* CHẾ ĐỘ XEM HỒ SƠ TINH GỌN */
                <div className="dossier-view-container">
                  {/* Thông tin liên hệ và công tác */}
                  <div className="dossier-meta-card">
                    <h3 className="section-dossier-title">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                      Thông tin liên hệ &amp; công tác
                    </h3>
                    <div className="dossier-meta-grid">
                      {activeMember.username ? (
                        <div className="meta-tile">
                          <span className="meta-tile-label">Tên đăng nhập</span>
                          <strong className="meta-tile-value">
                            {activeMember.username}
                          </strong>
                        </div>
                      ) : null}
                      <div className="meta-tile">
                        <span className="meta-tile-label">
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                          Số điện thoại
                        </span>
                        <strong className="meta-tile-value">
                          <a href={`tel:${activeMember.phone}`}>
                            {activeMember.phone || "—"}
                          </a>
                        </strong>
                      </div>

                      <div className="meta-tile">
                        <span className="meta-tile-label">
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                          Hòm thư điện tử
                        </span>
                        <strong className="meta-tile-value">
                          {activeMember.email ? (
                            <a href={`mailto:${activeMember.email}`}>
                              {activeMember.email}
                            </a>
                          ) : (
                            "—"
                          )}
                        </strong>
                      </div>

                      <div className="meta-tile">
                        <span className="meta-tile-label">
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          Địa bàn hoạt động
                        </span>
                        <strong className="meta-tile-value">
                          {activeMember.area || "Hà Nội"}
                        </strong>
                      </div>
                      {activeMember.joinDate ? (
                        <div className="meta-tile">
                          <span className="meta-tile-label">Ngày tham gia</span>
                          <strong className="meta-tile-value">
                            {activeMember.joinDate}
                          </strong>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Danh sách các vụ việc đang tham gia */}
                  <div className="dossier-cases-card">
                    <div className="cases-card-header">
                      <h3 className="section-dossier-title">
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                        </svg>
                        Vụ việc đang tham gia ({memberCases.length})
                      </h3>
                    </div>

                    {memberCases.length > 0 ? (
                      <div className="dossier-cases-list">
                        {memberCases.map((caseItem) => (
                          <div key={caseItem.id} className="dossier-case-item">
                            <div className="case-item-main">
                              <span className="case-item-badge">Vụ án</span>
                              <div>
                                <strong className="case-item-title">
                                  {caseItem.name}
                                </strong>
                                {caseItem.subtitle && (
                                  <p className="case-item-sub">
                                    {caseItem.subtitle}
                                  </p>
                                )}
                              </div>
                            </div>
                            {onOpenCaseThread && (
                              <button
                                type="button"
                                className="btn-goto-case"
                                onClick={() => onOpenCaseThread(caseItem.id)}
                              >
                                Xem trao đổi ↗
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="dossier-no-cases-box">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="empty-case-icon"
                          aria-hidden="true"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="12" y1="18" x2="12" y2="12" />
                          <line x1="9" y1="15" x2="15" y2="15" />
                        </svg>
                        <p className="dossier-no-cases-simple">
                          Hiện chưa tham gia vụ việc nào.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        ) : (
          <div className="member-no-selection">
            {viewMode === "inactive"
              ? "Không có thành viên ngừng hoạt động."
              : "Chọn một thành viên trong danh bạ bên trái để xem hồ sơ chi tiết."}
          </div>
        )}
      <Modal
        open={Boolean(pauseConfirm)}
        onClose={() => setPauseConfirm(null)}
        title="Tạm dừng thành viên"
        className="member-workspace-dialog"
      >
        {pauseConfirm ? (
          <>
            <p className="member-confirm-copy">
              Tạm dừng tài khoản <strong>{pauseConfirm.name}</strong>? Thành viên
              sẽ không đăng nhập được cho đến khi được kích hoạt lại.
            </p>
            <div className="member-dialog-actions">
              <button type="button" onClick={() => setPauseConfirm(null)}>
                Hủy
              </button>
              <button
                type="button"
                className="member-confirm-pause"
                onClick={() => {
                  handleToggleMemberStatus(pauseConfirm.id);
                  setPauseConfirm(null);
                }}
              >
                Tạm dừng
              </button>
            </div>
          </>
        ) : null}
      </Modal>
    </div>
  );
}
