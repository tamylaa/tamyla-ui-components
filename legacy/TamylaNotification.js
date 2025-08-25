// TamylaNotification: 100% reusable toast notification system
import React from 'react';
import './TamylaNotification.css';

export default function TamylaNotification({ open, type = 'info', message, onClose, duration = 4000 }) {
  React.useEffect(() => {
    if (open && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);
  if (!open) return null;
  return (
    <div className={`tamyla-notification ${type}`}> 
      <span>{message}</span>
      <button onClick={onClose} aria-label="Close">×</button>
    </div>
  );
}
