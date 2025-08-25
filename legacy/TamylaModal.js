// TamylaModal: 100% reusable modal system for all Tamyla apps
import React from 'react';
import './TamylaModal.css';

export default function TamylaModal({ open, onClose, title, children, actions, size = 'md', ...props }) {
  if (!open) return null;
  return (
    <div className="tamyla-modal-backdrop" onClick={onClose}>
      <div
        className={`tamyla-modal tamyla-modal-${size}`}
        onClick={e => e.stopPropagation()}
        {...props}
      >
        <div className="tamyla-modal-header">
          <h2>{title}</h2>
          <button className="tamyla-modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="tamyla-modal-body">{children}</div>
        {actions && <div className="tamyla-modal-actions">{actions}</div>}
      </div>
    </div>
  );
}
