import Popup from './Popup';
import { LoadingPopupProps } from '../types/component.types';

export default function LoadingPopup({ message }: LoadingPopupProps) {
  // The general Popup component has default CSS styling (like 500px min-width/min-height) to make sure standard dialog boxes look nice and big.
  // But for a loading popup, we want it to look compact and sit in a tight, clean box ("as much as required" by its progress bar and text).
  // Overriding with minWidth: 'auto' and minHeight: 'auto' allows it to shrink fit its children nicely.
  return (
    <Popup 
      cancelable={false} 
      style={{ minWidth: 'auto', minHeight: 'auto' }}
    >
      <div className="flex flex-row items-center p-5 gap-3 w-fit h-fit max-w-[90vw] overflow-hidden">
        <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-700 rounded-full animate-spin shrink-0" />
        <p 
          className="text-sm font-semibold text-zinc-800 truncate flex-1"
          title={message}
        >
          {message}
        </p>
      </div>
    </Popup>
  );
}
