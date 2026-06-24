import { useState, useEffect, useMemo, useCallback, useRef, cloneElement, isValidElement } from 'react';
import { ErpTableProps } from '../types/component.types';

export default function ErpTable<T>({
  columns,
  data,
  onRowClick,
  isLoading = false,
  emptyContent,
  loadingContent,
  searchPlaceholder = 'Search (Alt+F)',
  searchKeys,
  onFilter = () => true,
  render,
  contextMenu,
  onClickContextItem
}: ErpTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter data dynamically based on the search query and custom onFilter function
  const filteredData = useMemo(() => {
    const filteredByCustom = data.filter(onFilter);
    const query = searchQuery.toLowerCase().trim();
    if (!query) return filteredByCustom;

    return filteredByCustom.filter(item => {
      const keysToSearch = searchKeys || (Object.keys(item as object) as (keyof T)[]);
      return keysToSearch.some(key => {
        const value = item[key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, searchKeys, onFilter]);

  // Reset selected row index if query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Auto-focus search input on mount
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Row selection handler (mouse click or enter key)
  const handleSelectRow = useCallback((item: T, index: number) => {
    setSelectedIndex(index);
    if (onRowClick) {
      onRowClick(item, index);
    }
  }, [onRowClick]);

  // Keyboard navigation & search focus shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle keys if Context Menu is active/open
      if (isContextMenuOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setIsContextMenuOpen(false);
        }
        return;
      }

      // Ignore keys if Alt+Shift combinations are active (handled globally)
      if (e.altKey && e.shiftKey) return;

      // Alt+F focuses the search input
      if (e.altKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
        return;
      }

      // Alt+M opens context menu
      if (contextMenu && e.altKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        if (filteredData.length > 0 && selectedIndex >= 0 && selectedIndex < filteredData.length) {
          setIsContextMenuOpen(true);
        }
        return;
      }

      if (filteredData.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < filteredData.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredData.length) {
          handleSelectRow(filteredData[selectedIndex], selectedIndex);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredData, selectedIndex, handleSelectRow, isContextMenuOpen, contextMenu]);

  return (
    <>
      {/* Generic Search Input */}
      <input
        ref={searchInputRef}
        type="text"
        placeholder={searchPlaceholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="erp-search-box"
      />

      {/* Reusable Table Container */}
      <div className="erp-table-container">
        {isLoading && (
          loadingContent || (
            <div className="flex flex-col items-center justify-center p-20 gap-3">
              <div className="w-8 h-8 border-4 border-zinc-700 border-t-zinc-200 rounded-full animate-spin"></div>
              <p className="text-sm text-zinc-500 font-medium">Loading rows...</p>
            </div>
          )
        )}

        {!isLoading && filteredData.length === 0 && (
          emptyContent || (
            <div className="flex flex-col items-center justify-center p-20 text-center">
              <p className="text-sm text-zinc-500 font-bold">No records found</p>
            </div>
          )
        )}

        {!isLoading && filteredData.length > 0 && (
          <table className="erp-table">
            <thead>
              <tr>
                {columns.map((colHeader, index) => (
                  <th key={index}>{colHeader}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => {
                const isRowSelected = index === selectedIndex;
                const rowKey = (item as any).id || index;

                return (
                  <tr
                    key={rowKey}
                    onClick={() => handleSelectRow(item, index)}
                    className={isRowSelected ? 'selected' : ''}
                  >
                    {columns.map((_, colIndex) => (
                      <td key={colIndex}>
                        {render ? render(colIndex, item, index) : ''}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Keyboard Shortcuts Footer */}
      <div className="erp-table-legend">
        <span className="erp-table-legend-item">↑ ↓ Move</span>
        <span className="erp-table-legend-item">Enter Select</span>
        <span className="erp-table-legend-item">Alt+F Search</span>
        {contextMenu && (
          <span className="erp-table-legend-item">Alt+M Actions</span>
        )}
      </div>

      {/* Context Menu Rendering */}
      {isContextMenuOpen &&
        contextMenu &&
        filteredData[selectedIndex] &&
        (() => {
          const focusedRow = filteredData[selectedIndex];
          const menuElement = contextMenu(focusedRow);
          if (isValidElement(menuElement)) {
            return cloneElement(menuElement as React.ReactElement<any>, {
              onItemClick: (itemId: string) => {
                setIsContextMenuOpen(false);
                if (onClickContextItem) {
                  onClickContextItem(itemId, focusedRow);
                }
              }
            });
          }
          return null;
        })()}
    </>
  );
}
