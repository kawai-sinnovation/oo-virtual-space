import { Mic, MicOff, MousePointerClick, Send, Video, VideoOff } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { QUICK_STATUSES } from '../data/statuses.ts';
import { ZONES } from '../data/zones.ts';
import { clampStatus, limitStatus, statusLength } from '../lib/status.ts';
import type { ZoneType } from '../types/presence.ts';
import { ZoneIcon } from './zoneIcon.tsx';

export function ControlBar({
  statusText,
  activeZone,
  demoMode,
  isMicOn,
  isCameraOn,
        isSpeaking,
        onStatus,
        onMoveZone,
        onToggleDemo,
        onToggleMic,
        onToggleCamera,
        onSpeaking,
        onOpenProfile,
      }: {
  statusText: string;
  activeZone: ZoneType;
  demoMode: boolean;
  isMicOn: boolean;
  isCameraOn: boolean;
  isSpeaking: boolean;
  onStatus: (text: string) => void;
  onMoveZone: (zone: ZoneType) => void;
  onToggleDemo: () => void;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onSpeaking: (speaking: boolean) => void;
  onOpenProfile: () => void;
}) {
  const [draft, setDraft] = useState(statusText);

  const publish = (text: string) => {
    const next = clampStatus(text);
    setDraft(next);
    onStatus(next);
  };

  return (
    <footer className="shrink-0 border-t border-white/10 bg-[#14161d]/95 px-3 py-3 backdrop-blur-md sm:px-4">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        <div className="flex items-center gap-2 self-end pb-0.5">
          <DeviceButton
            on={isMicOn}
            label={isMicOn ? 'マイクをオフにする' : 'マイクをオンにする'}
            onClick={onToggleMic}
          >
            {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
          </DeviceButton>
          <DeviceButton
            on={isCameraOn}
            label={isCameraOn ? 'カメラをオフにする' : 'カメラをオンにする'}
            onClick={onToggleCamera}
          >
            {isCameraOn ? <Video size={18} /> : <VideoOff size={18} />}
          </DeviceButton>
          {isMicOn ? (
            <button
              type="button"
              aria-pressed={isSpeaking}
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                onSpeaking(true);
              }}
              onPointerUp={() => onSpeaking(false)}
              onPointerCancel={() => onSpeaking(false)}
              className={`h-11 rounded-full px-3 text-xs font-black focus-visible:ring-2 focus-visible:ring-[#3ddc84] focus-visible:outline-none ${
                isSpeaking ? 'bg-[#3ddc84] text-[#10281a]' : 'bg-white/10 text-white ring-1 ring-white/10'
              }`}
            >
              話すテスト
            </button>
          ) : null}
          <button
            type="button"
            onClick={onOpenProfile}
            className="h-11 rounded-full bg-white/10 px-3 text-xs font-black text-white ring-1 ring-white/10 hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-[#ffb15a] focus-visible:outline-none"
          >
            名刺
          </button>
        </div>
        <form
          className="min-w-[260px] flex-1"
          onSubmit={(event) => {
            event.preventDefault();
            publish(draft);
          }}
        >
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <label htmlFor="status-text" className="text-[11px] font-bold tracking-wide text-white/50">
              一言ステータス
            </label>
            <span className="inline-flex items-center gap-1 text-[11px] text-white/40">
              <MousePointerClick size={12} aria-hidden="true" />
              クリック / WASD・矢印キーで移動
            </span>
          </div>
          <div className="flex gap-2">
            <input
              id="status-text"
              value={draft}
              autoComplete="off"
              enterKeyHint="send"
              placeholder="いまのひとこと（20文字まで）"
              aria-label="一言ステータス"
              onChange={(event) => {
                const next = event.target.value;
                const native = event.nativeEvent;
                if (native instanceof InputEvent && native.isComposing) {
                  setDraft(next);
                  return;
                }
                setDraft(limitStatus(next));
              }}
              onCompositionEnd={(event) => setDraft(limitStatus(event.currentTarget.value))}
              className="h-10 min-w-0 flex-1 rounded-xl bg-[#0e1016] px-3 text-sm text-white ring-1 ring-white/10 outline-none placeholder:text-white/30 focus:ring-2 focus:ring-[#ffb15a]"
            />
            <button
              type="submit"
              className="inline-flex h-10 shrink-0 items-center gap-1 rounded-xl bg-[#ffb15a] px-3 text-sm font-black text-[#2a1c10] hover:bg-[#ffc27a] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              <Send size={15} aria-hidden="true" />
              表示
            </button>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {QUICK_STATUSES.map((text) => {
              const active = statusText === text;
              return (
                <button
                  key={text}
                  type="button"
                  onClick={() => publish(active ? '' : text)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold focus-visible:ring-2 focus-visible:ring-[#ffb15a] focus-visible:outline-none ${
                    active
                      ? 'bg-[#ffb15a] text-[#2a1c10]'
                      : 'bg-white/5 text-white/80 ring-1 ring-white/10 hover:bg-white/10'
                  }`}
                >
                  {text}
                </button>
              );
            })}
            <span className={`ml-auto text-[11px] ${statusLength(draft) >= 20 ? 'text-[#ffb15a]' : 'text-white/35'}`}>
              {statusLength(draft)}/20
            </span>
          </div>
        </form>

        <div>
          <p className="mb-1.5 text-[11px] font-bold tracking-wide text-white/50">クイック移動</p>
          <div className="flex flex-wrap gap-1.5">
            {ZONES.map((zone) => {
              const active = zone.id === activeZone;
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => onMoveZone(zone.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-bold focus-visible:ring-2 focus-visible:ring-[#ffb15a] focus-visible:outline-none ${
                    active
                      ? 'bg-white text-[#1a140f]'
                      : 'bg-white/5 text-white/85 ring-1 ring-white/10 hover:bg-white/10'
                  }`}
                >
                  <ZoneIcon zone={zone.id} size={14} />
                  {zone.shortName}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 pb-0.5">
          <button
            type="button"
            role="switch"
            aria-checked={demoMode}
            aria-label="デモモード"
            onClick={onToggleDemo}
            className={`relative h-6 w-11 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-[#ffb15a] focus-visible:outline-none ${
              demoMode ? 'bg-[#ffb15a]' : 'bg-white/15'
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${demoMode ? 'left-5' : 'left-0.5'}`}
            />
          </button>
          <div>
            <p className="text-xs font-black">デモモード</p>
            <p className="text-[10px] text-white/45">{demoMode ? 'メンバーが移動中' : '停止中'}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function DeviceButton({
  on,
  label,
  onClick,
  children,
}: {
  on: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`grid h-11 w-11 place-items-center rounded-full focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none ${
        on ? 'bg-[#2b2d31] text-white ring-1 ring-white/10' : 'bg-[#ed4245] text-white'
      }`}
    >
      {children}
    </button>
  );
}
