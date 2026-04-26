import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full">
        {toasts.map((toast) => {
          const styles = {
            success: 'bg-green-600 border-green-500',
            error: 'bg-red-600 border-red-500',
            info: 'bg-orange-500 border-orange-400',
          };
          const icons = { success: <CheckCircle size={20} />, error: <AlertCircle size={20} />, info: <Info size={20} /> };
          return (
            <div
              key={toast.id}
              className={`${styles[toast.type] || styles.info} text-white border px-4 py-3 rounded-xl shadow-xl flex items-start gap-3 animate-pulse-once`}
              style={{ animation: 'slideIn 0.3s ease' }}
            >
              <span className="text-lg mt-0.5">{icons[toast.type] || icons.info}</span>
              <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
              <button onClick={() => removeToast(toast.id)} className="text-white opacity-70 hover:opacity-100 text-lg font-bold ml-1">×</button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastContext;
