import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ErpInputField from '../../common/components/ErpInputField';
import ErpChooser from '../../common/components/ErpChooser';
import Popup from '../../common/components/Popup';
import List from '../../common/components/List';
import LoadingPopup from '../../common/components/LoadingPopup';
import { useGetCustomers } from '../../customer/hooks/api.hooks';
import { useNotification } from '../../common/components/NotificationHost';
import ShortcutRow from '../../common/components/ShortcutRow';
import { useShortcuts } from '../../common/hooks/useShortcuts';
import { KeyboardShortcut } from '../../common/types/component.types';
import { APP_ROUTES } from '../../common/constants';
import { Customer } from '../../common/types/model.types';
import { CustomerChooserPopupProps, SaleVoucherInputProps } from '../types/sale.types';

function CustomerChooserPopup({ companyId, onSelect, onClose }: CustomerChooserPopupProps) {
  const { data: customers = [], isLoading, isError } = useGetCustomers(companyId);
  const [query, setQuery] = useState('');
  const [focusedCustomer, setFocusedCustomer] = useState<Customer | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const q = query.toLowerCase().trim();
      if (!q) return true;
      return (
        customer.name.toLowerCase().includes(q) ||
        (customer.phone || '').toLowerCase().includes(q)
      );
    });
  }, [customers, query]);

  if (isLoading) {
    return <LoadingPopup message="Loading customers..." />;
  }

  if (isError) {
    return (
      <Popup title="Error" onClose={onClose} cancelable={true} className="max-w-md w-full">
        <div className="p-4">
          <p className="text-sm text-red-600 font-semibold">Could not load customers.</p>
        </div>
      </Popup>
    );
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const listEl = document.querySelector('.erp-list-container') as HTMLDivElement;
      listEl?.focus();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedCustomer) {
        onSelect(focusedCustomer);
      }
    }
  };

  const footerElement = (
    <div className="erp-table-legend flex justify-start w-full" style={{ padding: '0.25rem 0.5rem', borderTop: '1px solid var(--erp-main-border)', fontSize: '0.7rem', gap: '0.75rem' }}>
      <span className="erp-table-legend-item">Esc : Quit</span>
      <span className="erp-table-legend-item">Alt+F : Search</span>
      <span className="erp-table-legend-item">Arrow Keys : Navigate</span>
      <span className="erp-table-legend-item">Enter : Select</span>
    </div>
  );

  return (
    <Popup title="Choose Customer" onClose={onClose} cancelable={true} footer={footerElement} className="w-[600px]">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '350px' }}>
        <input
          ref={searchInputRef}
          type="text"
          className="erp-search-box"
          style={{ marginBottom: 0 }}
          placeholder="search customer"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
        <div style={{ flex: 1, minHeight: 0 }}>
          <List<Customer>
            data={filteredCustomers}
            autoFocus={true}
            onItemClicked={onSelect}
            onFocusedItemChanged={setFocusedCustomer}
            renderItem={(customer) => (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{customer.phone || '—'}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{customer.name}</span>
              </div>
            )}
          />
        </div>
      </div>
    </Popup>
  );
}

export default function SaleVoucherInput({ onSave, initialData, serverErrors, voucherNumber }: SaleVoucherInputProps) {
  const { company_id } = useParams<{ company_id: string }>();
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const { registerShortcuts, unregisterShortcuts } = useShortcuts();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [voucherDate, setVoucherDate] = useState(() => {
    return new Date().toLocaleDateString('en-CA');
  });
  const [errors, setErrors] = useState<{ customer?: string; voucherDate?: string }>({});

  useEffect(() => {
    if (initialData) {
      setCustomer(initialData.customer);
      setVoucherDate(initialData.voucherDate);
    }
  }, [initialData]);

  // Syncs server-side field validation errors into form error state.
  useEffect(() => {
    if (serverErrors && Object.keys(serverErrors).length > 0) {
      setErrors(prev => ({
        ...prev,
        ...serverErrors
      }));
    }
  }, [serverErrors]);

  const handleSave = useCallback(() => {
    const newErrors: typeof errors = {};

    if (!customer) {
      newErrors.customer = "Customer is required.";
    }

    if (!voucherDate.trim()) {
      newErrors.voucherDate = "Voucher date is required.";
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(voucherDate)) {
      newErrors.voucherDate = "Invalid date format. Expected yyyy-mm-dd.";
    } else {
      const parsedDate = new Date(voucherDate);
      if (isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== voucherDate) {
        newErrors.voucherDate = "Invalid date. Please check the values.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast("Please fix the validation errors before saving.");
      return;
    }

    onSave({
      customer,
      voucherDate
    });
  }, [customer, voucherDate, onSave, showToast]);

  const leftShortcuts = useMemo<KeyboardShortcut[]>(() => [
    {
      combination: 'Alt+L',
      label: 'Sales',
      handler: () => {
        if (company_id && APP_ROUTES.SALE_VOUCHER_LIST.create) {
          navigate(APP_ROUTES.SALE_VOUCHER_LIST.create(company_id));
        }
      }
    }
  ], [company_id, navigate]);

  useEffect(() => {
    registerShortcuts("SaleVoucherLeft", leftShortcuts);
    return () => { unregisterShortcuts("SaleVoucherLeft"); };
  }, [registerShortcuts, unregisterShortcuts, leftShortcuts]);

  useEffect(() => {
    const inputShortcuts: KeyboardShortcut[] = [
      {
        combination: 'Ctrl+S',
        label: 'Save',
        handler: handleSave
      }
    ];
    registerShortcuts('SaleVoucherInput', inputShortcuts);
    return () => { unregisterShortcuts('SaleVoucherInput'); };
  }, [registerShortcuts, unregisterShortcuts, handleSave]);

  return (
    <div className="flex w-full h-full overflow-hidden">
      {/* LEFT PANEL */}
      <aside className="erp-panel-left h-full">
        <div className="erp-shortcut-section">
          <div className="erp-shortcut-list">
            {leftShortcuts.map((shortcut, index) => (
              <ShortcutRow
                key={`left-${shortcut.combination}-${index}`}
                combination={shortcut.combination}
                label={shortcut.label}
                onClick={shortcut.handler}
                variant="light"
              />
            ))}
          </div>
        </div>
      </aside>

      {/* MAIN PANEL */}
      <div className="erp-panel-main flex-1 overflow-y-auto">
        <div className="flex flex-col w-full">
          <div className="smarterp-container">
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="smarterp-box">
              <div className="smarterp-header">
                <span className="smarterp-title">
                  {voucherNumber ? 'Edit Sale Voucher' : 'New Sale Voucher'}
                </span>
                {voucherNumber && (
                  <span className="text-xs text-zinc-500 font-mono">{voucherNumber}</span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                  <ErpInputField
                    label="Voucher Date"
                    name="voucherDate"
                    placeholder="yyyy-mm-dd"
                    required
                    value={voucherDate}
                    onChange={(e) => {
                      setVoucherDate(e.target.value);
                      if (errors.voucherDate) setErrors(prev => ({ ...prev, voucherDate: undefined }));
                    }}
                    error={errors.voucherDate}
                    vertical={true}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <ErpChooser<Customer>
                    label="Customer"
                    value={customer ? customer.name : ''}
                    required
                    onSelect={setCustomer}
                    error={errors.customer}
                    vertical={true}
                    hint="Choose customer"
                    popup={(onSelect, onClose) => (
                      <CustomerChooserPopup
                        companyId={company_id || ''}
                        onSelect={onSelect}
                        onClose={onClose}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="smarterp-footer" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <button type="submit" className="smarterp-btn-save">
                  Save (Ctrl+S)
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
