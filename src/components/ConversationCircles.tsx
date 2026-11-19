import { conversationGroups } from '../lib/conversations.ts';
import type { UserPresence } from '../types/presence.ts';

const TONES = {
  emerald: {
    fill: 'rgba(52, 211, 153, 0.18)',
    edge: 'rgba(110, 231, 183, 0.85)',
    label: '#d1fae5',
  },
  amber: {
    fill: 'rgba(255, 177, 90, 0.18)',
    edge: 'rgba(255, 196, 120, 0.9)',
    label: '#ffe7c4',
  },
} as const;

export function ConversationCircles({
  users,
  voiceRoom,
}: {
  users: UserPresence[];
  voiceRoom?: (user: UserPresence) => string;
}) {
  const groups = conversationGroups(users, voiceRoom);

  return (
    <div className="pointer-events-none absolute inset-0">
      {groups.map((group) => {
        const tone = TONES[group.tone];
        return (
            <div key={group.id} data-conversation={group.id} data-count={group.count}>
            <div
              className="talk-aura absolute rounded-full"
              style={{
                left: group.x,
                top: group.y,
                width: group.radius * 2,
                height: group.radius * 2,
                transform: 'translate(-50%, -50%)',
                zIndex: 3,
                background: `radial-gradient(circle, ${tone.fill} 0%, ${tone.fill} 58%, transparent 72%)`,
                boxShadow: `inset 0 0 0 2px ${tone.edge}, 0 0 28px ${tone.fill}`,
              }}
            />
            <div
              className="absolute -translate-x-1/2 rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap shadow-md ring-1 ring-white/20"
              style={{
                left: group.x,
                top: Math.max(18, group.y - group.radius - 8),
                zIndex: 6,
                background: 'rgba(16, 18, 24, 0.82)',
                color: tone.label,
              }}
            >
              💬 {group.count}人で会話中
            </div>
          </div>
        );
      })}
    </div>
  );
}
