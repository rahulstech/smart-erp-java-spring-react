import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { ListProps } from '../types/component.types';

export default function List<T>({
  data,
  renderItem,
  onItemClicked,
  onFocusedItemChanged,
  autoFocus
}: ListProps<T>) {
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const focusedItemRef = useRef<HTMLDivElement | null>(null);

  const isFocusable = Boolean(onItemClicked && onFocusedItemChanged);
  const itemRenderer = renderItem || ((item: T) => <span>{String(item)}</span>);

  // Auto focus container on mount if autoFocus is true
  useEffect(() => {
    if (autoFocus && isFocusable && containerRef.current) {
      containerRef.current.focus();
    }
  }, [autoFocus, isFocusable]);

  // Scroll focused item into view
  useEffect(() => {
    if (isFocusable && focusedItemRef.current) {
      focusedItemRef.current.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }, [focusedIndex, data, isFocusable]);

  // Reset focused index when data changes (using a shallow check of items to avoid resetting on simple reference changes)
  const prevDataRef = useRef<T[]>(data);
  useEffect(() => {
    const hasChanged = prevDataRef.current.length !== data.length ||
                       prevDataRef.current.some((item, index) => item !== data[index]);
    if (hasChanged) {
      setFocusedIndex(0);
      prevDataRef.current = data;
    }
  }, [data]);

  // Notify parent on focused item change
  useEffect(() => {
    if (isFocusable && onFocusedItemChanged) {
      if (data && data.length > 0 && focusedIndex >= 0 && focusedIndex < data.length) {
        onFocusedItemChanged(data[focusedIndex], focusedIndex);
      } else {
        onFocusedItemChanged(undefined as any, -1);
      }
    }
  }, [focusedIndex, data, onFocusedItemChanged, isFocusable]);

  // Handle keyboard navigation (up/down arrows and enter)
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isFocusable || !data || data.length === 0) return;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (focusedIndex === 0) {
        const searchInput = document.querySelector('.erp-search-box') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
          return;
        }
      }
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < data.length - 1 ? prev + 1 : data.length - 1));
    } else if (e.key === 'Enter') {
      if (onItemClicked && focusedIndex >= 0 && focusedIndex < data.length) {
        e.preventDefault();
        onItemClicked(data[focusedIndex]);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex={isFocusable ? 0 : -1}
      onKeyDown={handleKeyDown}
      className={`erp-list-container ${isFocusable ? 'focus:ring-1 focus:ring-[#2563eb]' : ''} outline-none w-full`}
      style={{ overflowY: 'auto', overflowX: 'hidden', height: '100%' }}
    >
      <div className="erp-list w-full flex flex-col">
        {data.map((item, index) => {
          const isFocused = isFocusable && focusedIndex === index;
          const itemKey = (item as any)?.id || index;

          return (
            <div
              key={itemKey}
              ref={isFocused ? focusedItemRef : null}
              onClick={() => {
                if (!isFocusable) return;
                setFocusedIndex(index);
                if (onItemClicked) {
                  onItemClicked(item);
                }
              }}
              className={`erp-list-item ${isFocusable ? 'cursor-pointer hover:bg-[#f8fafc]' : 'cursor-default'} ${isFocused ? 'selected' : ''}`}
            >
              {itemRenderer(item, index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
