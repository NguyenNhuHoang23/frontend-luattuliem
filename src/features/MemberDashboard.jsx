import { useState } from "react";
import { useToast } from "../components/toast-context.js";

function ReplyForm() {
  const [value, setValue] = useState("");
  const [replies, setReplies] = useState([]);
  const reply = (event) => {
    event.preventDefault();
    if (!value.trim()) return;
    setReplies((items) => [...items, value.trim()]);
    setValue("");
  };
  return (
    <>
      {replies.map((text, index) => (
        <p key={index}>Bạn (minh họa): {text}</p>
      ))}
      <form className="reply" onSubmit={reply}>
        <input
          required
          aria-label="Nội dung trả lời"
          placeholder="Nhập nội dung trả lời…"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <button className="btn">Trả lời</button>
      </form>
    </>
  );
}

export default function MemberDashboard({
  admin = false,
  onLogout,
  sidebarTitle = "THÀNH VIÊN",
}) {
  const [caseOpen, setCaseOpen] = useState(false);
  const { showToast } = useToast();
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <b>{admin ? "QUẢN TRỊ" : sidebarTitle}</b>
        <a href="#tin">Tin nhanh</a>
        <a href="#vuviec">Trao đổi vụ việc</a>
        <a href="#taichinh">Thông báo tài chính</a>
        {admin ? <a href="#nhansu">Danh sách nhân sự</a> : null}
        {onLogout ? (
          <button className="inline-link logout" onClick={onLogout}>
            Đăng xuất
          </button>
        ) : null}
      </aside>
      <div>
        <div className="panel" id="tin">
          <h3>Tin nhanh</h3>
          <div className="thread">
            <small>Giám đốc · 08:30, 13/10/2026</small>
            <p>Em lưu ý nộp trước ngày 30/10 nhé.</p>
          </div>
          {admin ? (
            <label>
              Gửi đến
              <select defaultValue="Nguyễn Văn A">
                <option>Nguyễn Văn A</option>
                <option>Nhóm luật sư</option>
                <option>Toàn thể cộng tác viên</option>
              </select>
            </label>
          ) : null}
          <ReplyForm />
        </div>
        <div className="panel" id="vuviec">
          <h3>Các trao đổi vụ việc</h3>
          <p className="notice">
            {admin
              ? "Giám đốc giám sát tất cả nhóm."
              : "Chỉ hiển thị những nhóm bạn được tham gia."}
          </p>
          <button
            className="casebtn"
            aria-expanded={caseOpen}
            aria-controls="caseA"
            onClick={() => setCaseOpen((open) => !open)}
          >
            <b>Vụ bà A</b>
            <span className="tag">
              {caseOpen ? "Đóng trao đổi ↑" : "Mở trao đổi ↓"}
            </span>
          </button>
          <div id="caseA" hidden={!caseOpen}>
            <p className="notice">
              Thành phần minh họa: Giám đốc · Luật sư A · CTV Nguyễn Văn A
            </p>
            <div className="thread">
              <small>Luật sư A · 08:00, 03/09</small>
              <p>A nộp cho anh đơn khởi kiện nhé.</p>
              <small>Nguyễn Văn A · 09:00, 03/09</small>
              <p>Vâng.</p>
              <small>Giám đốc · 21:00, 06/09</small>
              <p>Sao không thấy phiếu tiếp nhận?</p>
            </div>
            <ReplyForm />
            <p className="notice">
              Đính chính bằng phản hồi mới; thành viên không sửa hoặc xóa nội
              dung đã đăng.
            </p>
          </div>
          <button
            className="casebtn"
            onClick={() =>
              showToast("Vụ ông B: chưa có trao đổi trong dữ liệu minh họa.")
            }
          >
            <b>Vụ ông B</b>
            <span>→</span>
          </button>
          {admin ? (
            <details>
              <summary>Tạo vụ việc</summary>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  showToast(
                    "Đã minh họa thao tác tạo nhóm. Không lưu dữ liệu thực tế.",
                  );
                }}
              >
                <label>
                  Tên vụ việc
                  <input required name="caseName" />
                </label>
                <label>
                  Chọn luật sư
                  <select>
                    <option>Luật sư A</option>
                    <option>Luật sư B</option>
                  </select>
                </label>
                <div className="formrow">
                  <label>
                    CTV hỗ trợ
                    <select>
                      <option>Nguyễn Văn A</option>
                      <option>Chưa chọn</option>
                    </select>
                  </label>
                  <label>
                    CTV pháp lý
                    <select>
                      <option>CTV C</option>
                      <option>Chưa chọn</option>
                    </select>
                  </label>
                </div>
                <p className="notice">
                  Giám đốc chỉ tạo nhóm cho vụ việc đã ký HĐ dịch vụ pháp lý.
                </p>
                <button className="btn">Tạo nhóm</button>
              </form>
            </details>
          ) : null}
        </div>
        <div className="panel" id="taichinh">
          <h3>Thông báo tài chính</h3>
          <div className="thread">
            <small>Giám đốc · 10/04/2026</small>
            <p>Đã thanh toán 10 triệu đồng.</p>
          </div>
          <ReplyForm />
          <p className="notice">
            Thông báo nhập thủ công, không phải chức năng chuyển tiền hoặc kế
            toán.
          </p>
        </div>
        {admin ? (
          <div className="panel" id="nhansu">
            <h3>Danh sách nhân sự</h3>
            <p className="notice">Chỉ giám đốc được xem danh sách tổng thể.</p>
            <details>
              <summary>Luật sư</summary>
              <p>Luật sư A · Hà Nội · Tài khoản hoạt động</p>
            </details>
            <details>
              <summary>CTV hỗ trợ</summary>
              <p>Nguyễn Văn A · Hà Nội · Tài khoản hoạt động</p>
            </details>
            <details>
              <summary>CTV pháp lý</summary>
              <p>CTV C · Hà Nội · Tài khoản hoạt động</p>
            </details>
          </div>
        ) : null}
      </div>
    </div>
  );
}
