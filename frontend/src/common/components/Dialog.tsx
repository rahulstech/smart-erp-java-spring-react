import { useMemo } from 'react';
import Popup from './Popup';
import { DialogProps, KeyboardShortcut } from '../types/component.types';

export default function Dialog({
  isOpen,
  onClose,
  title,
  icon,
  content,
  buttons = [],
  onClickButton
}: DialogProps) {
  const handleButtonClick = (buttonId: string) => {
    onClose();
    if (onClickButton) {
      onClickButton(buttonId);
    }
  };

  const shortcuts = useMemo<KeyboardShortcut[]>(() => {
    if (!buttons) return [];
    return buttons
      .filter(btn => !!btn.combination)
      .map(btn => ({
        combination: btn.combination,
        label: btn.label,
        handler: () => {
          handleButtonClick(btn.id);
        }
      }));
  }, [buttons, onClickButton, onClose]);

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      shortcuts={shortcuts}
      className="erp-dialog-popup"
      showCloseButton={false}
      showBackdrop={true}
    >
      <div className="erp-dialog-container">
        {title && (
          <div className="erp-dialog-header">
            {icon && <span className="erp-dialog-icon">{icon}</span>}
            <span className="erp-dialog-title" title={title}>
              {title}
            </span>
          </div>
        )}
        <div className="erp-dialog-body">{content}</div>
        {buttons && buttons.length > 0 && (
          <div
            className={`erp-dialog-footer ${
              buttons.length > 2 ? 'vertical' : 'horizontal'
            }`}
          >
            {buttons.map(btn => {
              const buttonText = `${btn.label} (${btn.combination})`;
              return (
                <button
                  key={btn.id}
                  className={`erp-dialog-button ${
                    btn.isPrimary ? 'primary' : 'outlined'
                  }`}
                  onClick={() => handleButtonClick(btn.id)}
                >
                  {buttonText}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Popup>
  );
}
