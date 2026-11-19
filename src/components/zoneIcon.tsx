import { Coffee, Lamp, Monitor, Sofa, type LucideIcon } from 'lucide-react';
import type { ZoneType } from '../types/presence.ts';

const ICONS: Record<ZoneType, LucideIcon> = {
  arcade: Lamp,
  counter: Coffee,
  work: Monitor,
  sofa: Sofa,
};

export function ZoneIcon({ zone, size = 16 }: { zone: ZoneType; size?: number }) {
  const Icon = ICONS[zone];
  return <Icon size={size} aria-hidden="true" />;
}
