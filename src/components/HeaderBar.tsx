import { PanelRightClose, PanelRightOpen, Users } from 'lucide-react';
import { ZONE_BY_ID } from '../data/zones.ts';
import type { ZoneType } from '../types/presence.ts';
import { ZoneIcon } from './zoneIcon.tsx';

export function HeaderBar({
  zone,
  onlineCount,
  sidebarOpen,
  nightMode,
  onToggleSidebar,
  onToggleNight,
}: {
  zone: ZoneType;
  onlineCount: number;
  sidebarOpen: boolean;
  nightMode: boolean;
  onToggleSidebar: () => void;
  onToggleNight: () => void;
}) {
  const current = ZONE_BY_ID[zone];

  return (
    <header
      data-night-mode={nightMode}
      className={`flex h-14 shrink-0 items-center gap-2 border-b border-white/10 px-3 backdrop-blur-md sm:gap-3 sm:px-4 ${
        nightMode ? 'bg-[#24160f]/95' : 'bg-[#14161d]/95'
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="relative h-8 w-8 shrink-0" aria-hidden="true">
          <span className="absolute top-1 left-0 h-6 w-6 rounded-full border-2 border-[#ffb15a]" />
          <span className="absolute top-1 left-2 h-6 w-6 rounded-full border-2 border-white" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-black tracking-wide">
            <span className="sm:hidden">oO 古町</span>
            <span className="hidden sm:inline">oO Virtual SPACE - 古町</span>
          </p>
          <p
            className={`truncate text-[10px] tracking-[0.12em] ${
              nightMode ? 'font-bold text-[#ffd7a8]' : 'hidden text-white/45 sm:block'
            }`}
          >
            {nightMode ? '🍻 オンライン飲み会モード開催中' : 'FURUMACHI COMMUNITY LOUNGE'}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 justify-center">
        <div
          data-zone={zone}
          aria-live="polite"
          className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-xs ring-1 ring-white/10 sm:gap-2 sm:px-3 sm:text-sm"
        >
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: current.accent }} />
          <ZoneIcon zone={zone} size={15} />
          <span className="truncate font-bold md:hidden">{current.shortName}</span>
          <span className="hidden truncate font-bold md:inline">{current.name}</span>
        </div>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <button
          type="button"
          aria-pressed={nightMode}
          aria-label="ナイトモード（夜のゆる〜いオンライン飲み会）"
          onClick={onToggleNight}
          className={`inline-flex h-9 items-center gap-1 rounded-full px-2.5 text-xs font-black ring-1 focus-visible:ring-2 focus-visible:ring-[#ffb15a] focus-visible:outline-none sm:px-3 ${
            nightMode
              ? 'bg-[#ffb15a] text-[#2a1c10] ring-[#ffb15a]'
              : 'bg-white/5 text-white/80 ring-white/10 hover:bg-white/10'
          }`}
        >
          <span aria-hidden="true">🌙</span>
          <span className="hidden md:inline">ナイトモード</span>
        </button>
        <div
          data-online-count={onlineCount}
          className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-xs ring-1 ring-white/10 sm:text-sm"
        >
          <span className="h-2 w-2 rounded-full bg-[#3ddc84]" />
          <Users size={15} aria-hidden="true" />
          <span className="font-bold">{onlineCount}</span>
          <span className="hidden text-white/55 sm:inline">人オンライン</span>
        </div>
        <button
          type="button"
          aria-expanded={sidebarOpen}
          aria-controls="member-sidebar"
          onClick={onToggleSidebar}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-white/80 ring-1 ring-white/10 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#ffb15a] focus-visible:outline-none"
        >
          {sidebarOpen ? (
            <PanelRightClose size={18} aria-hidden="true" />
          ) : (
            <PanelRightOpen size={18} aria-hidden="true" />
          )}
          <span className="sr-only">参加者一覧</span>
        </button>
      </div>
    </header>
  );
}
