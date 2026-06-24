import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useShortcuts } from '../hooks/useShortcuts';
import { KeyboardShortcut, PopupProps } from '../types/component.types';

// A static, reference-stable EMPTY_SHORTCUTS array is defined outside the component rather than using
// an inline default parameter `shortcuts = []`. This keeps the reference identical across renders, preventing
// allPopupShortcuts from recalculating and triggering an infinite keydown shortcut registration loop in useEffect.
const EMPTY_SHORTCUTS: KeyboardShortcut[] = [];

export default function Popup({
  onClose,
  title,
  children,
  showBackdrop = false,
  shortcuts = EMPTY_SHORTCUTS,
  className = '',
  footer,
  cancelable = true,
  style
}: PopupProps) {
  // Controlling visibility by mounting/unmounting the component ({isOpen && <Popup />}) is preferred
  // over using an 'isOpen' prop. Mounting/unmounting allows cleanup functions (like unregisterPopupShortcuts)
  // to run cleanly in useEffect on unmount, avoiding state synchronization bugs.
  
  // Enforce exactly one child element
  const singleChild = React.Children.only(children);

  const allPopupShortcuts = useMemo<KeyboardShortcut[]>(() => {
    if (onClose && cancelable) {
      const escShortcut: KeyboardShortcut = {
        combination: 'Escape',
        label: 'Quit',
        handler: onClose
      };
      return [escShortcut, ...shortcuts];
    }
    return shortcuts;
  }, [onClose, shortcuts, cancelable]);

  const { registerPopupShortcuts, unregisterPopupShortcuts } = useShortcuts();

  useEffect(() => {
    registerPopupShortcuts(allPopupShortcuts);
    return () => {
      unregisterPopupShortcuts();
    };
  }, [allPopupShortcuts, registerPopupShortcuts, unregisterPopupShortcuts]);

  const content = (
    <>
      {showBackdrop && (
        <div className="erp-popup-backdrop" onClick={cancelable ? onClose : undefined} />
      )}
      <div className="erp-popup-wrapper">
        <div className={`erp-popup-container ${className}`} style={style}>
          {title && (
            <div className="erp-popup-header">
              <span className="erp-popup-title">{title}</span>
            </div>
          )}
          <div className="erp-popup-content">
            {singleChild}
          </div>
          {((cancelable) || footer) && (
            <div className="erp-popup-footer">

              { footer ?? <span className="erp-popup-footer-esc">Esc Quit</span> }
            </div>
          )}
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
}
