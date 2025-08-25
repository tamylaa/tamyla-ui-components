// TamylaInputGroup: 95% reusable form input group
import React from 'react';
import './TamylaInputGroup.css';

export default function TamylaInputGroup({ label, children, error, ...props }) {
  return (
    <div className={`tamyla-input-group${error ? ' error' : ''}`}> 
      {label && <label className="tamyla-input-label">{label}</label>}
      <div className="tamyla-input-children">{children}</div>
      {error && <div className="tamyla-input-error">{error}</div>}
    </div>
  );
}
