// TamylaFileList: 90% reusable file display component
import React from 'react';
import './TamylaFileList.css';

export default function TamylaFileList({ files = [], onSelect, selected = [], showSize = true, ...props }) {
  return (
    <div className="tamyla-file-list" {...props}>
      {files.length === 0 ? (
        <div className="tamyla-file-list-empty">No files found.</div>
      ) : (
        files.map(file => (
          <div
            key={file.id || file.name}
            className={`tamyla-file-list-item${selected.includes(file.id || file.name) ? ' selected' : ''}`}
            onClick={() => onSelect && onSelect(file)}
          >
            <span className="tamyla-file-icon">📄</span>
            <span className="tamyla-file-name">{file.name}</span>
            {showSize && file.size && (
              <span className="tamyla-file-size">{(file.size / 1024).toFixed(1)} KB</span>
            )}
          </div>
        ))
      )}
    </div>
  );
}
