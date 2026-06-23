import React from 'react';

interface ErpInputFieldProps {
  label: string;
  error?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
  type?: string;
  isTextArea?: boolean;
  className?: string;
}

export default function ErpInputField({
  label,
  error,
  isTextArea = false,
  className = '',
  ...props
}: ErpInputFieldProps) {
  return (
    <div className="smarterp-form-row">
      <label className="smarterp-label">{label}</label>
      <div className="smarterp-input-wrapper">
        {isTextArea ? (
          <textarea
            className={`smarterp-textarea ${error ? 'has-error' : ''} ${className}`}
            {...props}
          />
        ) : (
          <input
            className={`smarterp-input ${error ? 'has-error' : ''} ${className}`}
            {...props}
          />
        )}
        {error && <span className="smarterp-field-error">{error}</span>}
      </div>
    </div>
  );
}
