import { useState, useEffect } from 'react';
import Popup from './Popup';
import { ContextMenuProps } from '../types/component.types';

export default function ContextMenu({
  items,
  onItemClick,
  title = 'Options'
}: ContextMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Reset selected index when items change
  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  // Handle keyboard navigation
  useEffect(() => {
    if (items.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % items.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const activeItem = items[selectedIndex];
        if (activeItem) {
          onItemClick(activeItem.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedIndex, onItemClick]);

  const handleItemSelect = (id: string) => {
    onItemClick(id);
  };

  return (
    <Popup
      title={title}
      showBackdrop={false}
      className="context-menu-popup"
      footer={
        <span style={{ fontWeight: 'bold', color: '#0c326e' }}>↑ ↓ Move</span>
      }
    >
      <div className="erp-context-menu-list">
        {items.map((item, index) => {
          const isSelected = index === selectedIndex;
          const displaySubtitle = item.subTitle;

          return (
            <div
              key={item.id}
              className={`erp-context-menu-item ${isSelected ? 'selected' : ''}`}
              onClick={() => handleItemSelect(item.id)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <span className="erp-context-menu-item-title">
                {item.title}
              </span>
              {displaySubtitle && (
                <span className="erp-context-menu-item-subtitle">
                  {displaySubtitle}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </Popup>
  );
}
