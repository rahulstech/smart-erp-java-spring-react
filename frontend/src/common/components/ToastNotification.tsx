import { ToastNotificationProps } from '../types/component.types';

export default function ToastNotification({ message }: ToastNotificationProps) {
  return (
    <div className="erp-toast">
      <p className="erp-toast-message">{message}</p>
    </div>
  );
}
