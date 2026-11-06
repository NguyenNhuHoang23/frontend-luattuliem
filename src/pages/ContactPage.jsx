import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { submitPublicContactMessage } from "../api/public.js";
import { IconArrowExternal } from "../components/IconArrow.jsx";
import { Modal } from "../components/Modal.jsx";
import { useToast } from "../components/toast-context.js";
import { LineBreaks, useCompanyInfo } from "../features/companyInfo.jsx";

const CLIENT_GUIDE_STEPS = [
  {
    title: "Tiếp nhận & trao đổi thông tin với CTV / công ty",
    body: "Khách hàng có thể tự gửi yêu cầu qua biểu mẫu bên dưới, hoặc được CTV hướng dẫn gửi thông tin.",
    points: [
      "Trao đổi nội dung vụ việc, giấy tờ liên quan và mong muốn hỗ trợ.",
      "CTV chỉ hỗ trợ hướng dẫn quy trình; tư vấn pháp lý và quyết định chuyên môn do công ty / luật sư phụ trách.",
      "Mọi thông tin gửi về công ty được bảo mật theo quy tắc nghề nghiệp luật sư.",
    ],
  },
  {
    title: "Gửi tài liệu / yêu cầu chính thức",
    body: "Điền đầy đủ biểu mẫu liên hệ và đính kèm hồ sơ (ảnh, PDF, Word…) nếu có.",
    points: [
      "Ghi rõ họ tên, số điện thoại và tóm tắt sự việc.",
      "Đính kèm giấy tờ then chốt để công ty đánh giá nhanh hơn.",
      "Sau khi gửi, công ty tiếp nhận, phân loại và liên hệ lại trong thời gian sớm nhất.",
    ],
  },
  {
    title: "Nhận báo phí & thống nhất phạm vi công việc",
    body: "Luật sư / công ty đánh giá hồ sơ, đề xuất hướng xử lý và gửi báo phí minh bạch.",
    points: [
      "Báo phí nêu rõ phạm vi dịch vụ, cách tính và các khoản liên quan (nếu có).",
      "Khách hàng chỉ triển khai khi đã đồng ý nội dung và mức phí.",
    ],
  },
  {
    title: "Ký hợp đồng dịch vụ pháp lý",
    body: "Hai bên ký hợp đồng trước khi công ty triển khai công việc.",
    points: [
      "Hợp đồng ghi rõ quyền – nghĩa vụ, phạm vi dịch vụ, thời hạn và điều khoản thanh toán.",
      "Có thể ký trực tiếp hoặc theo hình thức công ty hướng dẫn (bản giấy / bản điện tử).",
      "CTV có thể hỗ trợ khách chuẩn bị hồ sơ ký, nhưng bên ký với công ty là khách hàng.",
    ],
  },
  {
    title: "Chuyển tiền về công ty",
    body: "Khách hàng thanh toán đúng theo hợp đồng, chuyển về tài khoản / hình thức do công ty chỉ định.",
    points: [
      "Chỉ chuyển tiền theo thông tin thanh toán chính thức của Công ty Luật TNHH MTV Từ Liêm.",
      "Nội dung chuyển khoản ghi rõ họ tên khách hàng và số / mã hợp đồng (nếu có).",
      "Giữ biên lai hoặc ảnh xác nhận chuyển khoản để đối chiếu.",
      "Không chuyển tiền cá nhân cho CTV dưới danh nghĩa phí dịch vụ của công ty.",
    ],
  },
  {
    title: "Hóa đơn VAT",
    body: "Công ty xuất hóa đơn theo quy định pháp luật và theo thỏa thuận trong hợp đồng.",
    points: [
      "Khách hàng cung cấp thông tin xuất hóa đơn (cá nhân / tổ chức) ngay khi ký hoặc khi thanh toán.",
      "Hóa đơn được xuất sau khi đủ điều kiện theo quy định và tiến độ thanh toán đã thỏa thuận.",
      "Mọi thắc mắc về hóa đơn liên hệ trực tiếp công ty qua hotline hoặc email trên trang này.",
    ],
  },
  {
    title: "Thực hiện & theo dõi công việc",
    body: "Sau khi hợp đồng và thanh toán (theo thỏa thuận) hoàn tất, công ty triển khai công việc và cập nhật tiến độ.",
    points: [
      "Luật sư / bộ phận phụ trách trao đổi, bổ sung chứng cứ và cập nhật kết quả từng giai đoạn.",
      "Khách hàng (hoặc CTV được ủy quyền hỗ trợ) theo dõi qua kênh liên hệ chính thức của công ty.",
      "Mọi thay đổi phạm vi công việc cần thống nhất bổ sung trước khi thực hiện.",
    ],
  },
];

export default function ContactPage() {
  const company = useCompanyInfo();
  const location = useLocation();
  const formRef = useRef(null);
  const guideRef = useRef(null);
  const [fileNames, setFileNames] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const hash = String(location.hash || "").replace(/^#/, "");
    if (hash === "huong-dan" || hash === "huong-dan-khach-hang") {
      setGuideOpen(true);
      requestAnimationFrame(() => {
        guideRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [location.hash]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = formRef.current || event.currentTarget;
    const payload = new FormData(form);
    setSubmitting(true);
    try {
      await submitPublicContactMessage(payload);
      form.reset();
      setFileNames([]);
      setSuccessOpen(true);
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

              <div
                className="contact-client-guide"
                id="huong-dan"
                ref={guideRef}
              >
                <p className="contact-guide-note">
                  Quý khách vui lòng đọc hướng dẫn trước khi gửi yêu cầu. CTV
                  sử dụng hướng dẫn này để hỗ trợ khách hàng thống nhất với quy
                  trình của công ty. Link gửi khách:{" "}
                  <Link to="/lien-he#huong-dan">/lien-he#huong-dan</Link>
                </p>
                <button
                  type="button"
                  className="contact-guide-toggle"
                  aria-expanded={guideOpen}
                  aria-controls="contact-client-guide-panel"
                  onClick={() => setGuideOpen((value) => !value)}
                >
                  <span>Hướng dẫn làm việc và ký hợp đồng với công ty</span>
                  <svg
                    className={`contact-guide-chevron${guideOpen ? " is-open" : ""}`}
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div
                  id="contact-client-guide-panel"
                  className="contact-guide-panel"
                  hidden={!guideOpen}
                >
                  <p className="contact-guide-intro">
                    Lưu trình chuẩn từ lúc trao đổi thông tin đến khi hoàn thành
                    công việc: khách hàng và CTV cùng bám theo các bước dưới đây
                    để thống nhất với quy trình của công ty.
                  </p>
                  <ol className="contact-guide-steps">
                    {CLIENT_GUIDE_STEPS.map((step, index) => (
                      <li key={step.title}>
                        <span className="contact-guide-step-num">
                          {index + 1}
                        </span>
                        <div>
                          <strong>{step.title}</strong>
                          <p>{step.body}</p>
                          {step.points?.length ? (
                            <ul className="contact-guide-points">
                              {step.points.map((point) => (
                                <li key={point}>{point}</li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

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
                <button
                  type="submit"
                  className="btn-submit btn-with-arrow"
                  disabled={submitting}
                >
                  {submitting ? (
                    "Đang gửi…"
                  ) : (
                    <>
                      <span>Gửi thông tin yêu cầu tư vấn</span>
                      <IconArrowExternal size={14} />
                    </>
                  )}
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

      <Modal
        className="contact-success-dialog"
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        eyebrow="Gửi thành công"
        title="Cảm ơn"
      >
        <p className="contact-success-message">
          Chúng tôi sẽ liên hệ lại với bạn sớm nhất.
        </p>
        <div className="contact-success-actions">
          <Link className="btn contact-success-home" to="/" onClick={() => setSuccessOpen(false)}>
            Quay về trang chủ
          </Link>
          <button
            className="btn ghost"
            type="button"
            onClick={() => setSuccessOpen(false)}
          >
            Đóng
          </button>
        </div>
      </Modal>
    </div>
  );
}
