interface ToastNotificationProps {
  message: string;
  onClose?: () => void;
}

export default function ToastNotification({ message }: ToastNotificationProps) {
  return (
    <div className="fixed bottom-12 right-6 bg-zinc-900 border border-zinc-800 text-white rounded shadow-2xl p-3 flex items-center gap-2.5 z-50">
      <p className="text-xs font-mono font-medium">{message}</p>
    </div>
  );
}
