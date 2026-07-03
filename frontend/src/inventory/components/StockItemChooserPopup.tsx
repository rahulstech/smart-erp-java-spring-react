import { useState, useEffect, useMemo, useRef } from 'react';
import LoadingPopup from '../../common/components/LoadingPopup';
import Popup from '../../common/components/Popup';
import List from '../../common/components/List';
import { useGetStockItems } from '../hooks/api.hooks';
import { StockItem } from '../types/model.types';
import { StockItemChooserPopupProps } from '../types/inventory.types';
import { KeyboardShortcut } from '@/common/types/shortcut.types';
import { useShortcuts } from '@/common/hooks/useShortcuts';

export default function StockItemChooserPopup({ companyId, onSelect, onClose }: StockItemChooserPopupProps) {
  const { data: stockItems = [], isLoading, isError } = useGetStockItems(companyId);
  const [query, setQuery] = useState('');
  const [focusedItem, setFocusedItem] = useState<StockItem | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { registerShortcuts, unregisterShortcuts } = useShortcuts();
  
  const shortcuts: KeyboardShortcut[] = useMemo(()=> [
    {
      combination: 'Alt+F',
      label: "Search",
      handler: ()=> {
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    },
    {
      combination: 'Enter',
      label: "Select",
      handler: ()=> {
        if (focusedItem) {
          onSelect(focusedItem);
        }
      }
    }
  ],[searchInputRef, focusedItem]);
  
  // Handle shortcuts 
  useEffect(() => {
    registerShortcuts('SupplierChooserPopup', shortcuts);
    return ()=> { unregisterShortcuts('SupplierChooserPopup'); };
  }, [registerShortcuts, unregisterShortcuts]);


  const filteredStockItems = useMemo(() => {
    return stockItems.filter(item => {
      const q = query.toLowerCase().trim();
      if (!q) return true;
      return (
        item.itemName.toLowerCase().includes(q) ||
        item.itemCode.toLowerCase().includes(q)
      );
    });
  }, [stockItems, query]);

  if (isLoading) {
    return <LoadingPopup message="Loading stock items..." />;
  }

  if (isError) {
    return (
      <Popup title="Error" onClose={onClose} cancelable={true} className="max-w-md w-full">
        <div className="p-4">
          <p className="text-sm text-red-600 font-semibold">Could not load stock items.</p>
        </div>
      </Popup>
    );
  }

  const footerElement = (
    <div className="erp-table-legend flex justify-start w-full" style={{ padding: '0.25rem 0.5rem', borderTop: '1px solid var(--erp-main-border)', fontSize: '0.7rem', gap: '0.75rem' }}>
      <span className="erp-table-legend-item">Esc : Quit</span>
      <span className="erp-table-legend-item">Alt+F : Search</span>
      <span className="erp-table-legend-item">Arrow Keys : Navigate</span>
      <span className="erp-table-legend-item">Enter : Select</span>
    </div>
  );

  return (
    <Popup title="Choose Stock Item" onClose={onClose} cancelable={true} footer={footerElement} className="w-[600px]">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '350px' }}>
        <input
          ref={searchInputRef}
          type="text"
          className="erp-search-box"
          style={{ marginBottom: 0 }}
          placeholder="search stock item"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div style={{ flex: 1, minHeight: 0 }}>
          <List<StockItem>
            data={filteredStockItems}
            autoFocus={true}
            onItemClicked={onSelect}
            onFocusedItemChanged={setFocusedItem}
            renderItem={(item) => (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.itemCode}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.itemName}</span>
              </div>
            )}
          />
        </div>
      </div>
    </Popup>
  );
}
