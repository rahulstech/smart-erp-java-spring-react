import React, { useState, useRef } from 'react';

interface ErpChooserProps<T> {
  label: string;
  value: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  hint?: string;
  vertical?: boolean;
  onSelect: (item: T) => void;
  popup: (onSelect: (item: T) => void, onClose: () => void) => React.ReactNode;
}

export default function ErpChooser<T>({
  label,
  value,
  placeholder = 'Alt+Enter or click to choose...',
  error,
  required = false,
  hint = 'Alt + Enter : Open Chooser',
  vertical = false,
  onSelect,
  popup
}: ErpChooserProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (item: T) => {
    onSelect(item);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleClose = () => {
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.altKey && e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      setIsOpen(true);
    }
  };

  return (
    <div
      className={vertical ? "smarterp-form-col" : "smarterp-form-row"}
      style={vertical ? { display: 'flex', flexDirection: 'column', marginBottom: '0.75rem' } : undefined}
    >
      {label && (
        <label
          className="smarterp-label"
          style={vertical ? { width: 'auto', marginBottom: '0.25rem', paddingTop: 0 } : undefined}
        >
          {label}
        </label>
      )}
      <div className="smarterp-input-wrapper relative" style={vertical ? { width: '100%' } : undefined}>
        <input
          ref={inputRef}
          type="text"
          className={`smarterp-input cursor-pointer ${error ? 'has-error' : ''}`}
          placeholder={placeholder}
          value={value}
          readOnly
          onClick={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          required={required}
        />
        {hint && (
          <div className="text-[10px] text-zinc-500 mt-1 flex justify-between">
            <span>{hint}</span>
          </div>
        )}
        {error && <span className="smarterp-field-error">{error}</span>}
      </div>

      {isOpen && popup(handleSelect, handleClose)}
    </div>
  );
}
