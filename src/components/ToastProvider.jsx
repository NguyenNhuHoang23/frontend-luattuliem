import { useCallback, useEffect, useRef, useState } from "react";
import { ToastContext } from "./toast-context.js";
export function ToastProvider({ children }) {
  const [message, setMessage] = useState("");
  const timeout = useRef(null);
  const showToast = useCallback((text) => {
    clearTimeout(timeout.current);
    setMessage(text);
    timeout.current = setTimeout(() => setMessage(""), 6000);
  }, []);
  useEffect(() => () => clearTimeout(timeout.current), []);
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message ? (
        <div className="toast" role="status">
          {message}
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}
