import { ShortcutRowProps } from '../types/component.types';

export default function ShortcutRow({
  combination,
  label,
  onClick,
  selectable = false,
  selected = false,
  variant = 'dark'
}: ShortcutRowProps) {
  const isSelected = selectable && selected;

  return (
    <div
      onClick={onClick}
      className={`erp-shortcut-row variant-${variant} ${isSelected ? 'selected' : ''}`}
      title={`Trigger shortcut: ${combination}`}
    >
      <span className="erp-shortcut-row-action">{label}</span>
      <span className="erp-shortcut-row-key">{combination}</span>
    </div>
  );
}
