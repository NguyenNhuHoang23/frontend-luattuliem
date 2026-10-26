import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createDefaultCms } from "./seed.js";
import { CMS_EVENT, loadCms, persistCms } from "./cms.js";

const CmsContext = createContext(null);

export function CmsProvider({ children }) {
  const [data, setData] = useState(loadCms);

  useEffect(() => {
    const sync = () => setData(loadCms());
    window.addEventListener(CMS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CMS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const api = useMemo(() => {
    const commit = (next) => {
      persistCms(next);
      setData(next);
    };
    return {
      data,
      reset: () => commit(createDefaultCms()),
      setCollection: (name, items) => commit({ ...data, [name]: items }),
      updateItem: (name, id, patch) =>
        commit({
          ...data,
          [name]: data[name].map((item) =>
            item.id === id ? { ...item, ...patch } : item,
          ),
        }),
      removeItem: (name, id) =>
        commit({
          ...data,
          [name]: data[name].filter((item) => item.id !== id),
        }),
      addItem: (name, item) =>
        commit({
          ...data,
          [name]: [item, ...data[name]],
        }),
      replaceItem: (name, id, nextItem) =>
        commit({
          ...data,
          [name]: data[name].map((item) => (item.id === id ? nextItem : item)),
        }),
      setValue: (name, value) => commit({ ...data, [name]: value }),
    };
  }, [data]);

  return <CmsContext.Provider value={api}>{children}</CmsContext.Provider>;
}

export function useCms() {
  const value = useContext(CmsContext);
  if (!value) throw new Error("useCms phải dùng trong CmsProvider");
  return value;
}
