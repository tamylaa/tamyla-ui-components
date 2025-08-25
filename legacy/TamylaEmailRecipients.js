// TamylaEmailRecipients: 85% reusable email input management
import React, { useState } from 'react';
import './TamylaEmailRecipients.css';

export default function TamylaEmailRecipients({ value = [], onChange, placeholder = 'Add recipient email', ...props }) {
  const [input, setInput] = useState('');
  const handleAdd = () => {
    const email = input.trim();
    if (email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) && !value.includes(email)) {
      onChange([...value, email]);
      setInput('');
    }
  };
  const handleRemove = (email) => {
    onChange(value.filter(e => e !== email));
  };
  return (
    <div className="tamyla-email-recipients" {...props}>
      {value.map(email => (
        <span className="tamyla-email-chip" key={email}>
          {email}
          <button onClick={() => handleRemove(email)} aria-label="Remove">×</button>
        </span>
      ))}
      <input
        type="email"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => (e.key === 'Enter' ? (handleAdd(), e.preventDefault()) : null)}
        placeholder={placeholder}
        className="tamyla-email-input"
      />
      <button className="tamyla-email-add" onClick={handleAdd} disabled={!input.trim()}>Add</button>
    </div>
  );
}
