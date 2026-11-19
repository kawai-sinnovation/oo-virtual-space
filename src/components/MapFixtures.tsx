import { FLYER_BOARD, MATCHING_BOARD } from '../data/community.ts';
import type { BoothState } from '../types/community.ts';

const LANTERNS = [
  { x: 180, y: 180 },
  { x: 520, y: 120 },
  { x: 760, y: 560 },
  { x: 1080, y: 260 },
];

export function MapFixtures({
  booths,
  nightMode,
  onOpenMatching,
  onOpenFlyers,
  onOpenBooth,
}: {
  booths: BoothState[];
  nightMode: boolean;
  onOpenMatching: () => void;
  onOpenFlyers: () => void;
  onOpenBooth: (id: string) => void;
}) {
  return (
    <>
      {booths.map((booth) => (
        <div key={booth.id} className="pointer-events-none absolute" style={{ left: booth.x, top: booth.y, zIndex: 2 }}>
          <div
            data-booth={booth.id}
            data-locked={booth.locked}
            className="relative rounded-xl border-x-4 border-t-4 border-[#c9a27a] bg-[#2a211c]/92 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
            style={{ width: booth.w, height: booth.h }}
          >
            <div className="absolute inset-x-3 top-8 bottom-0 rounded-t-md bg-[#3a2c24]" />
            <div className="absolute inset-x-6 top-3 h-10 rounded-full bg-[#ffb15a]/10 blur-md" />
            {booth.locked ? (
              <span className="absolute top-2 left-2 max-w-[calc(100%-10px)] rounded-md bg-[#ed4245] px-1.5 py-0.5 text-[9px] leading-tight font-black text-white">
                🔒 商談中
                <br />
                （ロック中）
              </span>
            ) : (
              <span className="absolute top-2 left-2 rounded-full bg-black/40 px-1.5 py-0.5 text-[10px] font-bold text-white/80">
                最大{booth.capacity}名
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onOpenBooth(booth.id);
            }}
            className="pointer-events-auto absolute -top-9 left-1/2 z-[900] flex w-[132px] -translate-x-1/2 flex-col items-center rounded-lg bg-[#1b140f]/90 px-1.5 py-1 text-center text-[10px] leading-tight font-black text-[#ffe7c4] ring-1 ring-[#ffb15a]/50 focus-visible:ring-2 focus-visible:ring-[#ffb15a] focus-visible:outline-none"
          >
            {booth.locked ? (
              <>
                <span>🔒 商談中</span>
                <span>（ロック中）</span>
              </>
            ) : (
              booth.name
            )}
          </button>
        </div>
      ))}
      <BoardButton
        frame={MATCHING_BOARD}
        marker="data-matching-board"
        label="協業・企業マッチングボードを開く"
        lines={['🤝', '協業・企業', 'マッチングボード']}
        tone="#ffb15a"
        onClick={onOpenMatching}
      />
      <BoardButton
        frame={FLYER_BOARD}
        marker="data-flyer-board"
        label="イベントチラシ ＆ 待機予告ボードを開く"
        lines={['📌', 'イベントチラシ', '待機予告ボード']}
        tone="#f0c27a"
        onClick={onOpenFlyers}
      />
      {nightMode ? (
        <div className="pointer-events-none absolute inset-0 z-[1200]" data-night-overlay>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,14,48,0.55),rgba(42,18,8,0.28)_55%,rgba(18,12,28,0.4))]" />
          {LANTERNS.map((lamp) => (
            <span
              key={`${lamp.x}-${lamp.y}`}
              className="lantern-glow absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                left: lamp.x,
                top: lamp.y,
                background: 'radial-gradient(circle, rgba(255,176,70,0.55) 0%, rgba(255,120,40,0.18) 42%, transparent 70%)',
              }}
            />
          ))}
        </div>
      ) : null}
    </>
  );
}

function BoardButton({
  frame,
  marker,
  label,
  lines,
  tone,
  onClick,
}: {
  frame: { x: number; y: number; w: number; h: number };
  marker: string;
  label: string;
  lines: string[];
  tone: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      {...{ [marker]: '' }}
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className="absolute z-[900] flex flex-col items-center justify-center gap-0.5 rounded-lg px-1.5 py-1 text-center text-[11px] leading-tight font-black text-[#2a1c10] shadow-lg focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
      style={{ left: frame.x, top: frame.y, width: frame.w, height: frame.h, background: tone }}
    >
      {lines.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </button>
  );
}
