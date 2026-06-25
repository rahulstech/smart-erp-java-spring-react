import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  ColumnDef
} from '@tanstack/react-table';
import { ErpTableProps } from '../types/component.types';

export default function ErpTable<T>({
  columns,
  data,
  onRowClick,
  onFocusedRowChanged,
  emptyContent,
  searchPlaceholder = 'Search (Alt+F)',
  onFilter,
  render
}: ErpTableProps<T>) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const selectedRowRef = useRef<HTMLTableRowElement | null>(null);
  const onFocusedRowChangedRef = useRef(onFocusedRowChanged);

  useEffect(() => {
    onFocusedRowChangedRef.current = onFocusedRowChanged;
  }, [onFocusedRowChanged]);

  // Convert string columns into TanStack Table column definitions
  const columnDefs = useMemo<ColumnDef<T>[]>(() => {
    return columns.map((colName, colIndex) => ({
      id: colName || `col_${colIndex}`,
      accessorKey: colName,
      header: colName,
      cell: (info) => {
        const item = info.row.original;
        if (render) {
          return render(colIndex, item, info.row.index);
        }
        if (item && typeof item === 'object') {
          const val = (item as any)[colName];
          return val !== undefined && val !== null ? String(val) : '';
        }
        return String(item);
      }
    }));
  }, [columns, render]);

  // Global filter function delegating to onFilter prop or searching object keys
  const globalFilterFn = useCallback((row: any, _columnId: string, filterValue: string) => {
    const item = row.original as T;
    if (onFilter) {
      return onFilter(item, filterValue);
    }
    const query = filterValue.toLowerCase().trim();
    if (!query) return true;
    const keysToSearch = Object.keys(item as object) as (keyof T)[];
    return keysToSearch.some(key => {
      const val = item[key];
      if (val === null || val === undefined) return false;
      return String(val).toLowerCase().includes(query);
    });
  }, [onFilter]);

  const table = useReactTable({
    data,
    columns: columnDefs,
    state: {
      globalFilter
    },
    globalFilterFn,
    getColumnCanGlobalFilter: () => true, // Important for filter enabled
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });

  const rows = table.getRowModel().rows;

  // Reset selection index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [globalFilter]);

  // Sync focused row to parent when rows change or selection changes
  const prevFocusedItemRef = useRef<any>(null);
  const prevSelectedIndexRef = useRef<number>(-1);

  useEffect(() => {
    const currentItem = rows[selectedIndex]?.original;
    if (
      prevFocusedItemRef.current !== currentItem ||
      prevSelectedIndexRef.current !== selectedIndex
    ) {
      prevFocusedItemRef.current = currentItem;
      prevSelectedIndexRef.current = selectedIndex;
      if (onFocusedRowChangedRef.current) {
        onFocusedRowChangedRef.current(selectedIndex, currentItem);
      }
    }
  }, [selectedIndex, rows]);

  // Scroll focused row into view if it goes out of the viewport
  useEffect(() => {
    if (selectedRowRef.current) {
      selectedRowRef.current.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }, [selectedIndex, rows]);

  // Auto-focus search input on mount
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const handleSelectRow = useCallback((item: T, index: number) => {
    setSelectedIndex(index);
    if (onRowClick) {
      onRowClick(item, index);
    }
  }, [onRowClick]);

  // Keyboard navigation & search focus shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey) return;

      if (e.altKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
        return;
      }

      if (rows.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < rows.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < rows.length) {
          handleSelectRow(rows[selectedIndex].original, selectedIndex);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rows, selectedIndex, handleSelectRow]);

  return (
    <>
      {/* Generic Search Input */}
      <input
        ref={searchInputRef}
        type="text"
        placeholder={searchPlaceholder}
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="erp-search-box"
      />

      {/* Reusable Table Container */}
      <div className="erp-table-container">
        {rows.length === 0 && (
          emptyContent || (
            <div className="flex flex-col items-center justify-center p-20 text-center">
              <p className="text-sm text-zinc-500 font-bold">No records found</p>
            </div>
          )
        )}

        {rows.length > 0 && (
          <div tabIndex={0} className="focus:ring-1 focus:ring-[#2563eb] outline-none w-full h-full overflow-auto">
            <table className="erp-table" style={{ minWidth: '100%' }}>
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : typeof header.column.columnDef.header === 'string'
                            ? header.column.columnDef.header
                            : String(header.column.columnDef.header)}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => {
                  const isRowSelected = selectedIndex === rowIndex;
                  const item = row.original;
                  const rowKey = (item as any)?.id || rowIndex;

                  return (
                    <tr
                      key={rowKey}
                      ref={isRowSelected ? selectedRowRef : null}
                      onClick={() => handleSelectRow(item, rowIndex)}
                      className={`cursor-pointer hover:bg-[#f8fafc] ${isRowSelected ? 'selected' : ''}`}
                    >
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>
                          {cell.column.columnDef.cell
                            ? (cell.column.columnDef.cell as any)(cell.getContext())
                            : ''}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts Footer */}
      <div className="erp-table-legend">
        <span className="erp-table-legend-item">↑ ↓ ← → Move</span>
        <span className="erp-table-legend-item">Enter Select</span>
        <span className="erp-table-legend-item">Alt+F Search</span>
      </div>
    </>
  );
}
