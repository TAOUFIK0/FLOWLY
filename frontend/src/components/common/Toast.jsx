/* ========================================
   Toast — Notifications globales
   ======================================== */

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearToast } from '../../app/uiSlice';
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi';

const ICONS = {
  success: <FiCheckCircle size={20} color="#10B981" />,
  error: <FiXCircle size={20} color="#EF4444" />,
  warning: <FiAlertTriangle size={20} color="#F59E0B" />,
  info: <FiInfo size={20} color="#06B6D4" />,
};

function Toast() {
  const dispatch = useDispatch();
  const toast = useSelector((state) => state.ui.toast);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        dispatch(clearToast());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, dispatch]);

  if (!toast) return null;

  return (
    <div className="toast-container">
      <div className={`toast toast-${toast.type}`}>
        {ICONS[toast.type]}
        <span style={{ fontSize: '14px', fontWeight: 500 }}>{toast.message}</span>
      </div>
    </div>
  );
}

export function ToastContainer() {
  return <Toast />;
}

export default Toast;
