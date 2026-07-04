import { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { ErpPasswordInputProps } from '../types/component.types';

export default function ErpPasswordInput({
  label,
  name,
  value,
  onChange,
  placeholder = 'Enter password',
  required = false,
  error,
  className = ''
}: ErpPasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggle = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return (
    <div className="flex flex-col mb-1 w-full">
      <label
        className="smarterp-label text-slate-600 mb-1 font-medium text-xs tracking-wider"
        style={{ width: 'auto', paddingTop: 0 }}
      >
        {label}
      </label>
      <div className="smarterp-input-wrapper relative w-full">
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`smarterp-input w-full pr-10 rounded border border-slate-300 shadow-sm focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] ${
            error ? 'has-error' : ''
          } ${className}`}
          required={required}
        />
        <button
          type="button"
          onClick={handleToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#002c66] transition cursor-pointer focus:outline-none"
          title={showPassword ? 'Hide password' : 'Show password'}
        >
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-sm" />
        </button>
      </div>
      {error && <span className="smarterp-field-error mt-1">{error}</span>}
    </div>
  );
}
