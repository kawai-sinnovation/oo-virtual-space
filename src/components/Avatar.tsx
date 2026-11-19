import { MicOff, Video } from 'lucide-react';
import { shade } from '../lib/color.ts';
import type { UserPresence } from '../types/presence.ts';

export function Avatar({
  user,
  seekingLabel,
  onSelect,
}: {
  user: UserPresence;
  seekingLabel: string | null;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`absolute cursor-pointer border-0 bg-transparent p-0 text-left focus-visible:outline-none ${
        user.isMe ? '' : 'travel-bot'
      }`}
      data-user={user.id}
      data-x={user.x}
      data-y={user.y}
      data-zone={user.zone}
      data-mic={user.isMicOn}
      data-camera={user.isCameraOn}
      data-speaking={user.isSpeaking}
      data-seeking={seekingLabel ? 'true' : 'false'}
      aria-label={`${user.name}の名刺を開く`}
      title={user.name}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      style={{
        left: user.x,
        top: user.y,
        zIndex: Math.round(user.y),
        transform: 'translate(-50%, -100%)',
        transition: user.isMe
          ? undefined
          : 'left 0.9s cubic-bezier(0.22, 0.8, 0.28, 1), top 0.9s cubic-bezier(0.22, 0.8, 0.28, 1)',
      }}
    >
      <div className="relative flex flex-col items-center">
        {seekingLabel ? (
          <span
            className={`absolute left-1/2 z-[3] -translate-x-1/2 rounded-full bg-[#ffb15a] px-2 py-0.5 text-[10px] font-black whitespace-nowrap text-[#2a1c10] shadow-md ring-2 ring-[#2a1c10] ${
              user.statusText ? 'bottom-[calc(100%+1.7rem)]' : 'bottom-full mb-1'
            }`}
          >
            【求む】{seekingLabel}
          </span>
        ) : null}
        {user.statusText ? <Speech text={user.statusText} /> : null}
        {user.isSpeaking ? (
          <>
            <span className="speak-ripple pointer-events-none absolute top-0 left-1/2 h-14 w-14 -translate-x-1/2 rounded-full border-2 border-[#3ddc84]" />
            <span className="speak-ripple speak-ripple-delay pointer-events-none absolute top-0 left-1/2 h-14 w-14 -translate-x-1/2 rounded-full border-2 border-[#3ddc84]" />
          </>
        ) : null}
        <div
          className="relative z-[1] flex h-11 w-11 items-center justify-center rounded-full"
          style={{
            background: `radial-gradient(circle at 32% 30%, #fff6, transparent 36%), ${user.avatarColor}`,
            boxShadow: user.isSpeaking
              ? '0 0 0 3px #3ddc84, 0 0 18px 4px rgba(61, 220, 132, 0.75)'
              : user.isMe
                ? `0 0 0 3px #fff, 0 0 0 6px ${user.avatarColor}`
                : 'inset 0 -6px 0 rgba(0,0,0,0.16)',
          }}
        >
          <span className="absolute left-2 top-2 h-2 w-3 rounded-full bg-white/50" />
          <span className="mt-1 flex gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1c140f]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#1c140f]" />
          </span>
        </div>
        <div
          className="-mt-2 h-7 w-14 rounded-t-2xl rounded-b-xl"
          style={{ background: shade(user.avatarColor, 0.2) }}
        />
        <span className="absolute -bottom-1 left-1/2 h-2.5 w-12 -translate-x-1/2 rounded-[50%] bg-black/40 blur-[1.5px]" />
        <span className="absolute top-full left-1/2 mt-1 -translate-x-1/2 rounded-full bg-[#141820]/80 px-2 py-0.5 text-[11px] font-bold tracking-wide whitespace-nowrap text-white ring-1 ring-white/15">
          {user.name}
        </span>
        <span className="absolute right-[-6px] bottom-5 z-[2] flex flex-col gap-0.5">
          {!user.isMicOn ? (
            <span className="grid h-4 w-4 place-items-center rounded-full bg-[#ed4245] text-white shadow" title="マイクオフ">
              <MicOff size={10} aria-hidden="true" />
            </span>
          ) : null}
          {user.isCameraOn ? (
            <span className="grid h-4 w-4 place-items-center rounded-full bg-[#3ba55d] text-white shadow" title="カメラオン">
              <Video size={10} aria-hidden="true" />
            </span>
          ) : null}
        </span>
      </div>
    </button>
  );
}

function Speech({ text }: { text: string }) {
  return (
    <div className="bubble-pop absolute bottom-full left-1/2 z-[2] mb-2 rounded-2xl bg-white px-2.5 py-1 text-[12px] font-bold whitespace-nowrap text-[#2c241c] shadow-[0_8px_20px_rgba(0,0,0,0.28)]">
      {text}
      <span className="absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 bg-white" />
    </div>
  );
}
