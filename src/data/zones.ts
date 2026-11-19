import type { ZoneType } from '../types/presence.ts';

export const MAP_WIDTH = 1200;
export const MAP_HEIGHT = 800;

export interface ZoneDef {
  id: ZoneType;
  name: string;
  shortName: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /** 人が自然に立てる範囲。Bot の徘徊に使う。 */
  roam: { x: number; y: number; w: number; h: number };
  spawn: { x: number; y: number };
  accent: string;
}

export const ZONES: ZoneDef[] = [
  {
    id: 'arcade',
    name: '古町モール（アーケード）',
    shortName: 'アーケード',
    x: 0,
    y: 0,
    w: 400,
    h: 800,
    roam: { x: 158, y: 230, w: 124, h: 490 },
    spawn: { x: 200, y: 620 },
    accent: '#ffb15a',
  },
  {
    id: 'counter',
    name: 'oO カウンター席（雑談歓迎）',
    shortName: 'カウンター',
    x: 420,
    y: 50,
    w: 400,
    h: 350,
    roam: { x: 470, y: 290, w: 300, h: 90 },
    spawn: { x: 620, y: 330 },
    accent: '#f0c27a',
  },
  {
    id: 'work',
    name: 'もくもく作業席（集中モード）',
    shortName: '作業席',
    x: 850,
    y: 50,
    w: 330,
    h: 400,
    roam: { x: 900, y: 280, w: 230, h: 140 },
    spawn: { x: 1020, y: 350 },
    accent: '#8fd0ff',
  },
  {
    id: 'sofa',
    name: '壁打ち・相談ソファ（アイデア相談OK）',
    shortName: 'ソファ',
    x: 450,
    y: 480,
    w: 700,
    h: 280,
    roam: { x: 540, y: 630, w: 400, h: 100 },
    spawn: { x: 760, y: 690 },
    accent: '#ffb0b6',
  },
];

export const ZONE_BY_ID: Record<ZoneType, ZoneDef> = {
  arcade: ZONES[0],
  counter: ZONES[1],
  work: ZONES[2],
  sofa: ZONES[3],
};

/** 矩形の内側なら距離 0。すき間にいるときは一番近いゾーンを返す。 */
export function detectZone(x: number, y: number): ZoneType {
  let best: ZoneType = 'arcade';
  let bestDist = Number.POSITIVE_INFINITY;

  for (const zone of ZONES) {
    const dx = x < zone.x ? zone.x - x : x > zone.x + zone.w ? x - (zone.x + zone.w) : 0;
    const dy = y < zone.y ? zone.y - y : y > zone.y + zone.h ? y - (zone.y + zone.h) : 0;
    const dist = Math.hypot(dx, dy);
    if (dist < bestDist) {
      bestDist = dist;
      best = zone.id;
    }
  }

  return best;
}

export function clampPosition(x: number, y: number): { x: number; y: number } {
  return {
    x: Math.round(Math.min(MAP_WIDTH - 30, Math.max(30, x))),
    y: Math.round(Math.min(MAP_HEIGHT - 24, Math.max(110, y))),
  };
}

export function clampToRoam(x: number, y: number, zone: ZoneType): { x: number; y: number } {
  const roam = ZONE_BY_ID[zone].roam;
  return {
    x: Math.round(Math.min(roam.x + roam.w, Math.max(roam.x, x))),
    y: Math.round(Math.min(roam.y + roam.h, Math.max(roam.y, y))),
  };
}

export function randomPointInZone(zone: ZoneType): { x: number; y: number } {
  const roam = ZONE_BY_ID[zone].roam;
  return clampToRoam(roam.x + Math.random() * roam.w, roam.y + Math.random() * roam.h, zone);
}

/** 相手の少し手前に立つ。右端では左側に回る。 */
export function approachPosition(x: number, y: number): { x: number; y: number } {
  const side = x > MAP_WIDTH - 100 ? -68 : 68;
  return clampPosition(x + side, y + 12);
}
