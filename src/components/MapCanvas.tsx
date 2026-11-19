import { useLayoutEffect, useRef, useState, type MouseEvent, type RefObject } from 'react';
import { MAP_HEIGHT, MAP_WIDTH } from '../data/zones.ts';
import type { BoothState } from '../types/community.ts';
import type { UserPresence, ZoneType } from '../types/presence.ts';
import { Avatar } from './Avatar.tsx';
import { ConversationCircles } from './ConversationCircles.tsx';
import { MapFixtures } from './MapFixtures.tsx';
import { ZoneArtwork } from './ZoneArtwork.tsx';

interface MapPing {
  id: number;
  x: number;
  y: number;
}

export function MapCanvas({
  users,
  activeZone,
  ping,
  booths,
  nightMode,
  seekingOf,
  voiceRoom,
  onMove,
  onSelectUser,
  onOpenMatching,
  onOpenFlyers,
  onOpenBooth,
}: {
  users: UserPresence[];
  activeZone: ZoneType;
  ping: MapPing | null;
  booths: BoothState[];
  nightMode: boolean;
  seekingOf: (userId: string) => string | null;
  voiceRoom: (user: UserPresence) => string;
  onMove: (x: number, y: number) => void;
  onSelectUser: (userId: string) => void;
  onOpenMatching: () => void;
  onOpenFlyers: () => void;
  onOpenBooth: (id: string) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const frame = useMapFrame(wrapRef);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const x = ((event.clientX - rect.left) / rect.width) * MAP_WIDTH;
    const y = ((event.clientY - rect.top) / rect.height) * MAP_HEIGHT;
    onMove(x, y);
    const active = document.activeElement;
    if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) {
      active.blur();
    }
  };

  const ordered = [...users].sort((a, b) => a.y - b.y);

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_top,#2a241c,#101218_58%)]"
    >
      <div
        role="application"
        aria-label="古町のバーチャルマップ。クリックした地点へ移動します。"
        onClick={handleClick}
        className="absolute cursor-pointer overflow-hidden rounded-md shadow-[0_24px_60px_rgba(0,0,0,0.45)] ring-1 ring-white/10 select-none"
        style={{
          width: MAP_WIDTH,
          height: MAP_HEIGHT,
          transform: `translate(${frame.x}px, ${frame.y}px) scale(${frame.scale})`,
          transformOrigin: 'top left',
          opacity: frame.ready ? 1 : 0,
        }}
      >
        <ZoneArtwork activeZone={activeZone} />
        <MapFixtures
          booths={booths}
          nightMode={nightMode}
          onOpenMatching={onOpenMatching}
          onOpenFlyers={onOpenFlyers}
          onOpenBooth={onOpenBooth}
        />
        <ConversationCircles users={users} voiceRoom={voiceRoom} />
        {ping ? (
          <span
            key={ping.id}
            className="ping-ring pointer-events-none absolute z-[4] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#ffb15a]"
            style={{ left: ping.x, top: ping.y }}
          />
        ) : null}
        {ordered.map((user) => (
          <Avatar
            key={user.id}
            user={user}
            seekingLabel={seekingOf(user.id)}
            onSelect={() => onSelectUser(user.id)}
          />
        ))}
      </div>
    </div>
  );
}

function useMapFrame(ref: RefObject<HTMLDivElement | null>) {
  const [frame, setFrame] = useState({ scale: 1, x: 0, y: 0, ready: false });

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = () => {
      const { width, height } = element.getBoundingClientRect();
      const availableW = Math.max(1, width - 20);
      const availableH = Math.max(1, height - 20);
      const scale = Math.min(availableW / MAP_WIDTH, availableH / MAP_HEIGHT);
      setFrame({
        scale,
        x: (width - MAP_WIDTH * scale) / 2,
        y: (height - MAP_HEIGHT * scale) / 2,
        ready: true,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return frame;
}
