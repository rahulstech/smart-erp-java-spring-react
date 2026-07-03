import { ErpInputFieldProps } from '../types/component.types';

export default function ErpInputField({
  label,
  error,
  isTextArea = false,
  className = '',
  vertical = false,
  ...props
}: ErpInputFieldProps) {
  return (
    <div
      className={vertical ? "smarterp-form-col" : "smarterp-form-row"}
      style={vertical ? { display: 'flex', flexDirection: 'column', marginBottom: '0.75rem' } : undefined}
    >
      <label
        className="smarterp-label"
        style={vertical ? { width: 'auto', marginBottom: '0.25rem', paddingTop: 0 } : undefined}
      >
        {label}
      </label>
      <div className="smarterp-input-wrapper" style={vertical ? { width: '100%' } : undefined}>
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
