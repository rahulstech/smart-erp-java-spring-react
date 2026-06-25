import { useCallback } from 'react';
import Dialog from './Dialog';
import { ConfirmationDialogProps } from '../types/component.types';

const CONFIRMATION_BUTTONS = [
  { id: 'No', label: 'No', combination: 'Alt+N' },
  { id: 'Yes', label: 'Yes', combination: 'Alt+Y', isPrimary: true }
];

export default function ConfirmationDialog({ title, children, onYes, onNo }: ConfirmationDialogProps) {
  const buttonClickHandler = useCallback((id: string) => {
    if (id === 'No') {
      onNo?.();
    } else if (id === 'Yes') {
      onYes?.();
    }
  }, [onYes, onNo]);

  return (
    <Dialog
      title={title}
      content={children}
      buttons={CONFIRMATION_BUTTONS}
      onClickButton={buttonClickHandler}
    />
  );
}
