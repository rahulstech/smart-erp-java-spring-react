import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useShortcuts } from '../hooks/useShortcuts';
import { KeyboardShortcut, PopupProps } from '../types/component.types';

// A static, reference-stable EMPTY_SHORTCUTS array is defined outside the component rather than using
// an inline default parameter `shortcuts = []`. This keeps the reference identical across renders, preventing
// allPopupShortcuts from recalculating and triggering an infinite keydown shortcut registration loop in useEffect.
const EMPTY_SHORTCUTS: KeyboardShortcut[] = [];

type PopupPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center';

const getPositionStyles = (pos: PopupPosition): React.CSSProperties => {
  const styles: React.CSSProperties = {
    padding: '1.5rem',
    boxSizing: 'border-box'
  };

  switch (pos) {
    case 'top-left':
      styles.justifyContent = 'flex-start';
      styles.alignItems = 'flex-start';
      break;
    case 'top-center':
      styles.justifyContent = 'center';
      styles.alignItems = 'flex-start';
      break;
    case 'top-right':
      styles.justifyContent = 'flex-end';
      styles.alignItems = 'flex-start';
      break;
    case 'bottom-left':
      styles.justifyContent = 'flex-start';
      styles.alignItems = 'flex-end';
      break;
    case 'bottom-center':
      styles.justifyContent = 'center';
      styles.alignItems = 'flex-end';
      break;
    case 'bottom-right':
      styles.justifyContent = 'flex-end';
      styles.alignItems = 'flex-end';
      break;
    case 'center':
    default:
      styles.justifyContent = 'center';
      styles.alignItems = 'center';
      break;
  }

  return styles;
};

export default function Popup({
  onClose,
  title,
  children,
  showBackdrop = false,
  shortcuts = EMPTY_SHORTCUTS,
  className = '',
  footer,
  cancelable = true,
  style,
  position = 'center'
}: PopupProps) {
  // Controlling visibility by mounting/unmounting the component ({isOpen && <Popup />}) is preferred
  // over using an 'isOpen' prop. Mounting/unmounting allows cleanup functions (like unregisterPopupShortcuts)
  // to run cleanly in useEffect on unmount, avoiding state synchronization bugs.
  
  // Enforce exactly one child element
  const singleChild = React.Children.only(children);

  const allPopupShortcuts = useMemo<KeyboardShortcut[]>(() => {
    if (cancelable) {
      const escShortcut: KeyboardShortcut = {
        combination: 'Escape',
        label: 'Quit',
        handler: () => onClose?.()
      };
      return [escShortcut, ...shortcuts];
    }
    return shortcuts;
  }, [onClose, shortcuts, cancelable]);

  const { registerShortcuts, unregisterShortcuts } = useShortcuts();

  useEffect(() => {
    registerShortcuts('popup', allPopupShortcuts);
    return () => {
      unregisterShortcuts('popup');
    };
  }, [allPopupShortcuts, registerShortcuts, unregisterShortcuts]);

  const content = (
    <>
      {showBackdrop && (
        <div className="erp-popup-backdrop" onClick={cancelable ? onClose : undefined} />
      )}
      <div className="erp-popup-wrapper" style={getPositionStyles(position)}>
        <div className={`erp-popup-container ${className}`} style={style}>
          {title && (
            <div className="erp-popup-header">
              <span className="erp-popup-title">{title}</span>
            </div>
          )}
          <div className="erp-popup-content">
            {singleChild}
          </div>
          {footer && (
            <div className="erp-popup-footer">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
}
