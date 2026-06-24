import { ErrorRetryProps } from '../types/component.types';

export default function ErrorRetry({ message }: ErrorRetryProps) {
  return (
    <div className="border border-[#b1b5bd] rounded p-5 bg-[#f8fafc] flex flex-col gap-4 max-w-md w-full mx-auto shadow-none">
      <p className="text-sm font-semibold text-zinc-800">{message}</p>
    </div>
  );
}
