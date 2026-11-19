import type { UserPresence, ZoneType } from '../types/presence.ts';

export interface ConversationGroup {
  id: string;
  zone: ZoneType;
  count: number;
  x: number;
  y: number;
  radius: number;
  tone: 'emerald' | 'amber';
}

const AMBER_ZONES = new Set<ZoneType>(['arcade', 'sofa']);

type VoiceRoom = (user: UserPresence) => string;

/** 同じ音声部屋でマイクを開いている人が2人以上なら、その人たちを一つの会話にする。 */
export function conversationGroups(
  users: UserPresence[],
  voiceRoom: VoiceRoom = (user) => user.zone,
): ConversationGroup[] {
  const buckets = new Map<string, UserPresence[]>();
  for (const user of users) {
    if (!user.isMicOn) continue;
    const id = voiceRoom(user);
    const group = buckets.get(id) ?? [];
    group.push(user);
    buckets.set(id, group);
  }

  const groups: ConversationGroup[] = [];
  for (const [id, members] of buckets) {
    if (members.length < 2) continue;
    const zone = members[0]?.zone ?? 'arcade';
    const points = members.map((member) => ({ x: member.x, y: member.y - 24 }));
    const x = points.reduce((sum, point) => sum + point.x, 0) / points.length;
    const y = points.reduce((sum, point) => sum + point.y, 0) / points.length;
    let radius = 78;
    for (const point of points) {
      radius = Math.max(radius, Math.hypot(point.x - x, point.y - y) + 62);
    }
    groups.push({
      id,
      zone,
      count: members.length,
      x,
      y,
      radius,
      tone: AMBER_ZONES.has(zone) ? 'amber' : 'emerald',
    });
  }
  return groups;
}

export function isInConversation(
  user: UserPresence,
  users: UserPresence[],
  voiceRoom: VoiceRoom = (person) => person.zone,
): boolean {
  if (!user.isMicOn) return false;
  const room = voiceRoom(user);
  let count = 0;
  for (const other of users) {
    if (other.isMicOn && voiceRoom(other) === room) count += 1;
    if (count >= 2) return true;
  }
  return false;
}
