import type { AppToast } from '../types/community.ts';

export function ToastStack({ toasts, onDismiss }: { toasts: AppToast[]; onDismiss: (id: string) => void }) {
  if (toasts.length === 0) return null;
  return (
    <div className="pointer-events-none fixed top-16 right-3 z-[70] flex w-[min(22rem,calc(100vw-1.5rem))] flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          data-toast
          className="pointer-events-auto rounded-2xl bg-[#1e1f22] px-3 py-3 text-sm shadow-2xl ring-1 ring-white/10"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="font-black leading-snug">{toast.title}</p>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="通知を閉じる"
              className="text-xs text-white/50"
            >
              閉じる
            </button>
          </div>
          {toast.body ? <p className="mt-1 text-xs leading-relaxed text-white/70">{toast.body}</p> : null}
        </div>
      ))}
    </div>
  );
}
