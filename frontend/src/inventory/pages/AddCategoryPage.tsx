import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingPopup from '../../common/components/LoadingPopup';
import ErpInputField from '../../common/components/ErpInputField';
import { useCreateCategory } from '../hooks/api.hooks';
import { useNotification } from '../../common/components/NotificationHost';
import { useShortcuts } from '../../common/hooks/useShortcuts';
import { useScaffoldContext } from '../../common/context/ScaffoldContext';
import { KeyboardShortcut } from '../../common/types/component.types';
import ShortcutRow from '../../common/components/ShortcutRow';
import { APP_ROUTES } from '../../common/constants';

export default function AddCategoryPage() {
  const { company_id } = useParams<{ company_id: string }>();
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const { setTitle, setOnRetry } = useScaffoldContext();
  const { registerShortcuts, unregisterShortcuts } = useShortcuts();

  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string | undefined>(undefined);

  const createMutation = useCreateCategory(company_id || '');

  useEffect(() => {
    setTitle("Add Stock Category");
    setOnRetry(undefined);
  }, [setTitle]);

  const handleSave = useCallback(() => {
    setError(undefined);

    if (!name.trim()) {
      setError('Category Name is required.');
      showToast('Please fix the errors before saving.');
      return;
    }

    createMutation.mutate(
      { name: name.trim() },
      {
        onSuccess: (data) => {
          showToast(`Category "${data.name}" added successfully!`);
          setName('');
        },
        onError: (err: unknown) => {
          if (axios.isAxiosError(err) && err.response?.status === 400) {
            const data = err.response.data;
            if (data && typeof data.reasons === 'object' && data.reasons !== null) {
              const reasons = data.reasons as Record<string, string>;
              if (reasons.name) {
                setError(reasons.name);
              }
              showToast('Validation failed. Please check input fields.');
              return;
            }
          }
          showToast("Could not save the category due to a saving error.");
        }
      }
    );
  }, [name, createMutation, showToast]);

  const leftShortcuts = useMemo<KeyboardShortcut[]>(() => [
    {
      combination: 'Alt+T',
      label: 'Add Category',
      handler: () => {
        showToast('Already on Add Category page');
      }
    },
    {
      combination: 'Alt+U',
      label: 'Add Unit',
      handler: () => {
        if (company_id && APP_ROUTES.ADD_UNIT.create) {
          navigate(APP_ROUTES.ADD_UNIT.create(company_id));
        }
      }
    }
  ], [company_id, navigate, showToast]);

  useEffect(() => {
    const shortcuts: KeyboardShortcut[] = [
      {
        combination: 'Ctrl+S',
        label: 'Save',
        handler: handleSave
      }
    ];

    registerShortcuts('AddCategory', shortcuts);
    registerShortcuts('AddCategoryLeft', leftShortcuts);
    return () => {
      unregisterShortcuts('AddCategory');
      unregisterShortcuts('AddCategoryLeft');
    };
  }, [registerShortcuts, unregisterShortcuts, handleSave, leftShortcuts]);

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
        <div className="smarterp-container">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSave(); }}
            className="smarterp-box flex-1 max-w-[600px] m-0"
          >
            <div className="smarterp-header">
              <span className="smarterp-title">Add New Category</span>
            </div>

            <div className="mb-6">
              <ErpInputField
                label="Category Name"
                name="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(undefined);
                }}
                placeholder="Enter category name..."
                required
                autoFocus
                error={error}
              />
            </div>

            <div className="smarterp-footer" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <button
                type="submit"
                className="smarterp-btn-save"
              >
                Save (Ctrl+S)
              </button>
            </div>
          </form>
        </div>
      </div>
      {createMutation.isPending && <LoadingPopup message="Adding category..." />}
    </div>
  );
}
