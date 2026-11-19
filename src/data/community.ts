import type { BoothState, EventFlyer, MatchingPost, WaitingNotice } from '../types/community.ts';

const HOUR = 60 * 60 * 1000;
const NOW = Date.UTC(2026, 10, 19, 2, 0, 0);

/** 古町モールと oO の境。扉の右側、通路の上。 */
export const MATCHING_BOARD = { x: 428, y: 386, w: 148, h: 90 };

/** アーケード入口。雑貨店の下、自分の初期位置の左。 */
export const FLYER_BOARD = { x: 16, y: 612, w: 108, h: 100 };

/**
 * マップ奥（作業席の後方）。床は不透明なので、下の絵を部屋として隠す。
 * 足元が y=110 より下になるよう、部屋の下端に立てる。
 */
export function createBooths(): BoothState[] {
  return [
    {
      id: 'deal',
      name: '商談ブース',
      capacity: 4,
      x: 862,
      y: 64,
      w: 156,
      h: 158,
      locked: false,
      knocks: [],
    },
    {
      id: 'vip',
      name: 'VIPブース',
      capacity: 2,
      x: 1030,
      y: 64,
      w: 148,
      h: 158,
      locked: false,
      knocks: [],
    },
  ];
}

export function createMatchingPosts(): MatchingPost[] {
  return [
    {
      id: 'post-shop',
      authorId: 'taro',
      authorName: 'Taro',
      title: '新潟県内で実証実験できる店舗を探しています',
      body: '食品の新しいサービスを、古町周辺の実店舗で2週間ほど試したいです。空いている時間帯だけでも助かります。',
      createdAt: NOW - 5 * HOUR,
    },
    {
      id: 'post-ui',
      authorId: 'miki',
      authorName: 'Miki',
      title: 'アプリのUIデザインができる制作会社を探しています',
      body: '地域の人向けの小さなアプリです。画面の相談から一緒に進めてくれる相手を探しています。',
      createdAt: NOW - 2 * HOUR,
    },
  ];
}

export function createFlyers(): EventFlyer[] {
  return [
    {
      id: 'flyer-night',
      title: '古町ナイト交流会',
      dateLabel: '11/28 19:00',
      summary: 'カウンター席で、近況と次にやってみたいことをゆるく共有します。',
      link: 'https://example.com/events/furumachi-night',
      createdAt: NOW - 26 * HOUR,
    },
    {
      id: 'flyer-moku',
      title: 'oO もくもく会',
      dateLabel: '毎週水 20:00',
      summary: '作業席で各自の作業。区切りの時間だけ雑談します。',
      link: 'https://example.com/events/oo-mokumoku',
      createdAt: NOW - 20 * HOUR,
    },
  ];
}

export function createNotices(): WaitingNotice[] {
  return [
    {
      id: 'notice-ken',
      authorId: 'ken',
      authorName: 'Ken',
      zone: 'counter',
      timeLabel: '今日 21:00〜22:00',
      detail: '新規事業の壁打ち待機してます！',
      createdAt: NOW - HOUR,
    },
  ];
}
