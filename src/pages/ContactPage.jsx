import { useRef, useState } from "react";
import { submitPublicContactMessage } from "../api/public.js";
import { useToast } from "../components/toast-context.js";
import { LineBreaks, useCompanyInfo } from "../features/companyInfo.jsx";
export default function ContactPage() {
  const company = useCompanyInfo();
  const formRef = useRef(null);
  const [fileNames, setFileNames] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = formRef.current || event.currentTarget;
    const payload = new FormData(form);
    setSubmitting(true);
    try {
      await submitPublicContactMessage(payload);
      showToast("Đã gửi yêu cầu liên hệ. Công ty sẽ liên hệ lại sớm.");
      form.reset();
      setFileNames([]);
    } catch (err) {
      showToast(err.message);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="page-contact">
      <main className="main-container">
        <div className="wrap editorial-grid">
          <section className="form-column">
            <h1 className="page-heading-sr-only">
              Liên hệ &amp; đặt lịch tư vấn
            </h1>
            <div className="contact-form-card">
              <h2 className="form-section-title">
                Phiếu tiếp nhận thông tin &amp; yêu cầu hỗ trợ
              </h2>
              <form id="legalConsultationForm" ref={formRef} onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="clientName">
                      Họ và tên của bạn
                      <span className="req">*</span>
                    </label>
                    <input
                      className="form-input"
                      id="clientName"
                      name="fullName"
                      required
                      placeholder="Ví dụ: Nguyễn Văn An"
                      autoComplete="name"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="clientPhone">
                      Số điện thoại liên lạc
                      <span className="req">*</span>
                    </label>
                    <input
                      className="form-input"
                      id="clientPhone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="Ví dụ: 0912 345 678"
                      autoComplete="tel"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="clientEmail">
                      Địa chỉ Email
                    </label>
                    <input
                      className="form-input"
                      id="clientEmail"
                      name="email"
                      type="email"
                      placeholder="Địa chỉ nhận thư trao đổi (nếu có)"
                      autoComplete="email"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="clientAddress">
                      Địa chỉ (Xã/Phường, Tỉnh/Thành phố)
                    </label>
                    <input
                      className="form-input"
                      id="clientAddress"
                      name="address"
                      placeholder="Ví dụ: Xã..., Tỉnh/TP..."
                      autoComplete="street-address"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="issueContent">
                    Tóm tắt sự việc &amp; Yêu cầu cần hỗ trợ
                    <span className="req">*</span>
                  </label>
                  <textarea
                    className="form-textarea"
                    id="issueContent"
                    name="content"
                    required
                    placeholder="Vui lòng tóm tắt ngắn gọn diễn biến sự việc, hiện trạng vụ việc và mong muốn cần luật sư hỗ trợ giải quyết..."
                  ></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Tài liệu, hồ sơ liên quan (nếu có)
                  </label>
                  <div className="upload-wrapper">
                    <label htmlFor="docAttachment">
                      <div className="upload-title">
                        Chọn tệp đính kèm (Ảnh chụp giấy tờ hoặc file PDF)
                      </div>
                      <div className="upload-hint">
                        Hỗ trợ các định dạng: .pdf, .jpg, .jpeg, .png, .doc,
                        .docx (tối đa 25MB)
                      </div>
                      <input
                        type="file"
                        id="docAttachment"
                        name="files[]"
                        style={{ display: "none" }}
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={(event) =>
                          setFileNames(
                            Array.from(event.target.files, (file) => file.name),
                          )
                        }
                      />
                      <div className="file-list-preview" id="fileList">
                        {fileNames.length > 0
                          ? "Đã chọn: " + fileNames.join(", ")
                          : ""}
                      </div>
                    </label>
                  </div>
                </div>
                <div className="privacy-pledge">
                  <b>Cam kết bảo mật thông tin khách hàng:</b> Toàn bộ thông
                  tin, tài liệu bạn gửi tới Công ty Luật Từ Liêm được quản lý và
                  bảo vệ theo Quy tắc đạo đức và ứng xử nghề nghiệp luật sư cùng
                  quy định pháp luật về bảo vệ dữ liệu cá nhân.{" "}
                </div>
                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? "Đang gửi…" : "Gửi thông tin yêu cầu tư vấn ↗"}
                </button>
              </form>
            </div>
          </section>
          <aside className="sidebar">
            <div className="office-card">
              <h3>Thông tin văn phòng</h3>
              <ul className="office-meta-list">
                <li className="office-meta-item">
                  <div>
                    <b>Địa chỉ trụ sở chính:</b>{" "}
                    <p>
                      <LineBreaks text={company.address} />
                    </p>
                  </div>
                </li>
                <li className="office-meta-item">
                  <div>
                    <b>Hotline tiếp nhận 24/7:</b>{" "}
                    <p>
                      <a
                        href={company.phoneHref}
                        style={{
                          color: "var(--blue)",
                          fontWeight: "bold",
                          fontSize: "15px",
                        }}
                      >
                        {company.phone}
                      </a>
                    </p>
                  </div>
                </li>
                <li className="office-meta-item">
                  <div>
                    <b>Hòm thư điện tử:</b>{" "}
                    <p>
                      <a href={`mailto:${company.email}`}>{company.email}</a>
                    </p>
                  </div>
                </li>
                <li className="office-meta-item">
                  <div>
                    <b>Thời gian làm việc:</b>{" "}
                    <p>
                      <LineBreaks text={company.workingHours} />
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="process-box">
              <h4>Quy trình tiếp nhận</h4>
              <div className="process-step">
                <div className="step-badge">1</div>
                <div>
                  <b>Tiếp nhận thông tin:</b> Phân loại hồ sơ và xác định đúng
                  vấn đề pháp lý then chốt.
                </div>
              </div>
              <div className="process-step">
                <div className="step-badge">2</div>
                <div>
                  <b>Luật sư liên hệ trực tiếp:</b> Đánh giá chứng cứ, đề xuất
                  hướng xử lý và lộ trình thực hiện.
                </div>
              </div>
              <div className="process-step">
                <div className="step-badge">3</div>
                <div>
                  <b>Thống nhất công việc:</b> Ký kết văn bản hợp đồng dịch vụ
                  pháp lý minh bạch trước khi triển khai.
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
