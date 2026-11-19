import type { ZoneType } from './presence.ts';

/** 名刺。将来は Supabase の profiles 行に対応させる。 */
export type CardProvider = 'eight' | 'sansan' | 'litlink';

export interface MemberProfile {
  userId: string;
  name: string;
  organization: string;
  title: string;
  bio: string;
  skillTags: string[];
  cardUrl: string;
  cardProvider: CardProvider;
  seeking: boolean;
  /** 「【求む】」のうしろに出す文言 */
  seekingText: string;
}

/** 自分と相手のあいだだけに残る交換記録。全体チャットには流さない。 */
export interface CardExchange {
  userId: string;
  exchangedAt: number;
}

export interface MatchingPost {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  body: string;
  createdAt: number;
}

export interface EventFlyer {
  id: string;
  title: string;
  dateLabel: string;
  summary: string;
  link: string;
  createdAt: number;
}

export interface WaitingNotice {
  id: string;
  authorId: string;
  authorName: string;
  zone: ZoneType;
  timeLabel: string;
  detail: string;
  createdAt: number;
}

export interface BoothKnock {
  id: string;
  fromName: string;
  createdAt: number;
}

/** 商談ブース。locked と knocks は後から Realtime で同期する想定。 */
export interface BoothState {
  id: string;
  name: string;
  capacity: number;
  x: number;
  y: number;
  w: number;
  h: number;
  locked: boolean;
  knocks: BoothKnock[];
}

/**
 * Discord Webhook へ送る直前のプレビュー。
 * 本番では content を webhook の JSON に載せる。
 */
export interface DiscordLogEntry {
  id: string;
  channel: string;
  content: string;
  createdAt: number;
}

export interface AppToast {
  id: string;
  title: string;
  body?: string;
}
