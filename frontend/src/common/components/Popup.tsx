import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useShortcuts } from '../hooks/useShortcuts';
import { KeyboardShortcut, PopupProps } from '../types/component.types';

export default function Popup({
  isOpen,
  onClose,
  title,
  children,
  showBackdrop = false,
  shortcuts = [],
  className = '',
  footerExtra,
  showCloseButton = true
}: PopupProps) {
  // Enforce exactly one child element
  const singleChild = React.Children.only(children);

  const allPopupShortcuts = useMemo<KeyboardShortcut[]>(() => {
    if (onClose) {
      const escShortcut: KeyboardShortcut = {
        combination: 'Escape',
        label: 'Quit',
        handler: onClose
      };
      return [escShortcut, ...shortcuts];
    }
    return shortcuts;
  }, [onClose, shortcuts]);

  const { registerPopupShortcuts, unregisterPopupShortcuts } = useShortcuts();

  useEffect(() => {
    if (isOpen) {
      registerPopupShortcuts(allPopupShortcuts);
    } else {
      unregisterPopupShortcuts();
    }
    return () => {
      unregisterPopupShortcuts();
    };
  }, [isOpen, allPopupShortcuts, registerPopupShortcuts, unregisterPopupShortcuts]);

  if (!isOpen) return null;

  const content = (
    <>
      {showBackdrop && (
        <div className="erp-popup-backdrop" onClick={onClose} />
      )}
      <div className="erp-popup-wrapper">
        <div className={`erp-popup-container ${className}`}>
          {title && (
            <div className="erp-popup-header">
              <span className="erp-popup-title">{title}</span>
              {showCloseButton && onClose && (
                <button 
                  className="erp-popup-close-btn" 
                  onClick={onClose}
                  aria-label="Close popup"
                >
                  &times;
                </button>
              )}
            </div>
          )}
          <div className="erp-popup-content">
            {singleChild}
          </div>
          <div className="erp-popup-footer">
            {onClose && <span className="erp-popup-footer-esc">Esc Quit</span>}
            {footerExtra && (
              <div className="erp-popup-footer-extra">
                {footerExtra}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
}
