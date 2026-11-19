import type { DiscordLogEntry } from '../types/community.ts';

export function DiscordDock({
  open,
  logs,
  onToggle,
}: {
  open: boolean;
  logs: DiscordLogEntry[];
  onToggle: () => void;
}) {
  if (!open) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className="absolute bottom-3 left-3 z-30 rounded-full bg-[#313338] px-3 py-2 text-xs font-black text-white shadow-lg ring-1 ring-white/10 focus-visible:ring-2 focus-visible:ring-[#ffb15a] focus-visible:outline-none"
      >
        Discord通知ログ
      </button>
    );
  }

  return (
    <section
      data-discord-log
      className="absolute bottom-3 left-3 z-30 flex max-h-52 w-[min(20rem,calc(100%-1.5rem))] flex-col overflow-hidden rounded-2xl bg-[#313338] text-white shadow-2xl ring-1 ring-black/40"
    >
      <header className="flex items-center justify-between gap-2 border-b border-black/30 px-3 py-2">
        <p className="text-xs font-black">Discord通知ログ（プレビュー）</p>
        <button
          type="button"
          onClick={onToggle}
          className="text-[11px] font-bold text-white/60 hover:text-white"
        >
          閉じる
        </button>
      </header>
      <ul className="flex-1 space-y-2 overflow-y-auto px-3 py-2">
        {logs.length === 0 ? <li className="text-xs text-white/45">まだ通知はありません。</li> : null}
        {logs.map((entry) => (
          <li key={entry.id} className="text-xs leading-relaxed">
            <span className="font-black text-[#8ea1e1]">{entry.channel}</span>
            <span className="mt-0.5 block text-white/90">{entry.content}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
