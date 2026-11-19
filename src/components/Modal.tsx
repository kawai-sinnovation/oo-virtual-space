import type { ReactNode } from 'react';
import { X } from 'lucide-react';

export function Modal({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-3 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className={`max-h-[86vh] w-full overflow-y-auto rounded-2xl bg-[#1c1e27] p-5 text-[#f4efe6] shadow-2xl ring-1 ring-white/10 ${
          wide ? 'max-w-xl' : 'max-w-md'
        }`}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-base font-black leading-snug">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/5 text-white/70 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#ffb15a] focus-visible:outline-none"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
