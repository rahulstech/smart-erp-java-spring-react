import { useState, useRef, useEffect, KeyboardEvent, ReactNode } from 'react';

export interface TableProps<T> {
  headers?: string[];
  renderHeaderCell?: (header: string) => ReactNode;
  renederHeaderCell?: (header: string) => ReactNode; // Alias to handle potential typo in prop names
  data: T[];
  renderRowCell?: (row: T, colIndex: number) => ReactNode;
  onRowClicked?: (row: T) => void;
  selectedIndex?: number; // Optional prop to control selection externally (e.g., keyboard navigation)
}

export default function Table<T>({
  headers,
  renderHeaderCell,
  renederHeaderCell,
  data,
  renderRowCell,
  onRowClicked,
  selectedIndex: externalSelectedIndex
}: TableProps<T>) {
  const [localSelectedIndex, setLocalSelectedIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedRowRef = useRef<HTMLTableRowElement | null>(null);

  const headerRenderer = renderHeaderCell || renederHeaderCell || ((h: string) => <strong>{h}</strong>);

  const rowCellRenderer = renderRowCell || ((row: T, colIndex: number) => {
    if (row && typeof row === 'object') {
      const keys = Object.keys(row);
      const key = keys[colIndex];
      const val = (row as any)[key];
      return <span className="text-[#111827]">{val !== undefined && val !== null ? String(val) : ''}</span>;
    }
    return <span className="text-[#111827]">{String(row)}</span>;
  });

  // Handle keyboard arrow key scrolling in both directions
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = 40; // Number of pixels to scroll on arrow key press

    if (e.key === 'ArrowUp') {
      if (container.scrollHeight > container.clientHeight) {
        e.preventDefault();
        container.scrollTop -= scrollAmount;
      }
    } else if (e.key === 'ArrowDown') {
      if (container.scrollHeight > container.clientHeight) {
        e.preventDefault();
        container.scrollTop += scrollAmount;
      }
    } else if (e.key === 'ArrowLeft') {
      if (container.scrollWidth > container.clientWidth) {
        e.preventDefault();
        container.scrollLeft -= scrollAmount;
      }
    } else if (e.key === 'ArrowRight') {
      if (container.scrollWidth > container.clientWidth) {
        e.preventDefault();
        container.scrollLeft += scrollAmount;
      }
    }
  };

  const selectedIndex = externalSelectedIndex !== undefined ? externalSelectedIndex : localSelectedIndex;

  useEffect(() => {
    if (selectedRowRef.current && selectedIndex !== null && selectedIndex !== undefined) {
      selectedRowRef.current.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }, [selectedIndex, data]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="focus:ring-1 focus:ring-[#2563eb] outline-none"
      style={{ overflow: 'auto', width: '100%', height: '100%' }}
    >
      <table className="erp-table" style={{ minWidth: '100%' }}>
        {headers && headers.length > 0 && (
          <thead>
            <tr>
              {headers.map((colHeader, index) => (
                <th key={index}>{headerRenderer(colHeader)}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {data.map((row, rowIndex) => {
            const isRowSelected = selectedIndex === rowIndex;
            const hasClick = !!onRowClicked;
            const rowKey = (row as any).id || rowIndex;

            return (
              <tr
                key={rowKey}
                ref={isRowSelected ? selectedRowRef : null}
                onClick={() => {
                  if (hasClick) {
                    setLocalSelectedIndex(rowIndex);
                    onRowClicked(row);
                  }
                }}
                className={`${hasClick ? 'cursor-pointer hover:bg-[#f8fafc]' : ''} ${isRowSelected ? 'selected' : ''}`}
              >
                {headers && headers.length > 0 ? (
                  headers.map((_, colIndex) => (
                    <td key={colIndex}>
                      {rowCellRenderer(row, colIndex)}
                    </td>
                  ))
                ) : (
                  Object.keys(row as any).map((_, colIndex) => (
                    <td key={colIndex}>
                      {rowCellRenderer(row, colIndex)}
                    </td>
                  ))
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
