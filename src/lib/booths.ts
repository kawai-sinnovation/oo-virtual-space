import type { BoothState } from '../types/community.ts';

export function containsPoint(booth: BoothState, x: number, y: number): boolean {
  return x >= booth.x && x <= booth.x + booth.w && y >= booth.y && y <= booth.y + booth.h;
}

export function boothAt(x: number, y: number, booths: BoothState[]): BoothState | null {
  return booths.find((booth) => containsPoint(booth, x, y)) ?? null;
}

export function standIn(booth: BoothState): { x: number; y: number } {
  return {
    x: Math.round(booth.x + booth.w / 2),
    y: Math.round(booth.y + booth.h - 36),
  };
}

export function occupantCount(booth: BoothState, people: { x: number; y: number }[]): number {
  return people.filter((person) => containsPoint(booth, person.x, person.y)).length;
}

/** ロック中のブースにいる人は、外の同じゾーンと音声をつなげない。 */
export function voiceRoomId(
  person: { x: number; y: number; zone: string },
  booths: BoothState[],
): string {
  const booth = booths.find((item) => item.locked && containsPoint(item, person.x, person.y));
  return booth ? `booth:${booth.id}` : person.zone;
}

export function canEnterPoint(
  x: number,
  y: number,
  fromX: number,
  fromY: number,
  booths: BoothState[],
  people: { x: number; y: number }[],
): boolean {
  const dest = boothAt(x, y, booths);
  if (!dest) return true;
  const from = boothAt(fromX, fromY, booths);
  if (from?.id === dest.id) return true;
  if (dest.locked) return false;
  return occupantCount(dest, people) < dest.capacity;
}
