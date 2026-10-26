import { useEffect, useRef } from "react";
export function Modal({
  open,
  onClose,
  title,
  eyebrow,
  children,
  className = "",
}) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={className}
      aria-labelledby="modal-title"
      onCancel={onClose}
      onClose={onClose}
    >
      <button
        className="dialog-close"
        type="button"
        onClick={onClose}
        aria-label="Đóng"
      >
        ×
      </button>
      {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
      <h2 className="dialog-title" id="modal-title">
        {title}
      </h2>
      {children}
    </dialog>
  );
}
