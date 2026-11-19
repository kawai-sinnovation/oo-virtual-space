import { useCallback, useState } from 'react';
import {
  createBooths,
  createFlyers,
  createMatchingPosts,
  createNotices,
} from '../data/community.ts';
import { createProfiles } from '../data/profiles.ts';
import { createId } from '../lib/id.ts';
import type {
  AppToast,
  CardExchange,
  DiscordLogEntry,
  EventFlyer,
  MemberProfile,
  WaitingNotice,
} from '../types/community.ts';
import type { ZoneType } from '../types/presence.ts';

/**
 * 名刺・募集・チラシ・ブース・通知のローカルストア。
 * 在席（座標）とは分けてあり、将来は profiles / posts テーブルと
 * Discord Webhook の送信口に差し替える。
 */
export function useCommunity(myName: string) {
  const [profiles, setProfiles] = useState(createProfiles);
  const [exchanges, setExchanges] = useState<CardExchange[]>([]);
  const [posts, setPosts] = useState(createMatchingPosts);
  const [flyers, setFlyers] = useState(createFlyers);
  const [notices, setNotices] = useState(createNotices);
  const [booths, setBooths] = useState(createBooths);
  const [nightMode, setNightMode] = useState(false);
  const [logs, setLogs] = useState<DiscordLogEntry[]>(() => [
    {
      id: 'log-login',
      channel: '#入室ログ',
      content: `${myName}さんが oO Virtual SPACE にログインしました！`,
      createdAt: Date.now(),
    },
  ]);
  const [toasts, setToasts] = useState<AppToast[]>([]);

  const pushLog = useCallback((channel: string, content: string) => {
    setLogs((prev) => [{ id: createId('log'), channel, content, createdAt: Date.now() }, ...prev].slice(0, 12));
  }, []);

  const pushToast = useCallback((title: string, body?: string) => {
    const id = createId('toast');
    setToasts((prev) => [...prev, { id, title, body }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4600);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const updateMyProfile = useCallback((userId: string, patch: Partial<MemberProfile>) => {
    setProfiles((prev) => prev.map((profile) => (profile.userId === userId ? { ...profile, ...patch } : profile)));
  }, []);

  const exchangeWith = useCallback((userId: string) => {
    setExchanges((prev) => {
      if (prev.some((item) => item.userId === userId)) return prev;
      return [...prev, { userId, exchangedAt: Date.now() }];
    });
  }, []);

  const addPost = useCallback((authorId: string, authorName: string, title: string, body: string) => {
    setPosts((prev) => [{ id: createId('post'), authorId, authorName, title, body, createdAt: Date.now() }, ...prev]);
  }, []);

  const addFlyer = useCallback((flyer: Omit<EventFlyer, 'id' | 'createdAt'>) => {
    setFlyers((prev) => [{ ...flyer, id: createId('flyer'), createdAt: Date.now() }, ...prev]);
  }, []);

  const addNotice = useCallback(
    (notice: Omit<WaitingNotice, 'id' | 'createdAt'>) => {
      setNotices((prev) => [{ ...notice, id: createId('notice'), createdAt: Date.now() }, ...prev]);
      const line = waitingLine(notice);
      pushToast('Discordの通知チャンネルへ自動送信しました（プレビュー表示）', line);
      pushLog('#待機予告', `${notice.authorName}さんが待機予告を投稿しました：${line}`);
    },
    [pushLog, pushToast],
  );

  const toggleBoothLock = useCallback((boothId: string) => {
    setBooths((prev) =>
      prev.map((booth) => (booth.id === boothId ? { ...booth, locked: !booth.locked } : booth)),
    );
  }, []);

  const knockBooth = useCallback(
    (boothId: string, fromName: string) => {
      const boothName = booths.find((booth) => booth.id === boothId)?.name ?? 'ブース';
      const knock = { id: createId('knock'), fromName, createdAt: Date.now() };
      setBooths((prev) =>
        prev.map((booth) =>
          booth.id === boothId ? { ...booth, knocks: [knock, ...booth.knocks].slice(0, 6) } : booth,
        ),
      );
      pushToast(`${boothName}にノックを送りました`, '入室リクエストは、中にいる人にだけ届きます。');
    },
    [booths, pushToast],
  );

  const profileById = useCallback(
    (userId: string) => profiles.find((profile) => profile.userId === userId) ?? null,
    [profiles],
  );

  return {
    profiles,
    exchanges,
    posts,
    flyers,
    notices,
    booths,
    nightMode,
    setNightMode,
    logs,
    toasts,
    dismissToast,
    updateMyProfile,
    exchangeWith,
    addPost,
    addFlyer,
    addNotice,
    toggleBoothLock,
    knockBooth,
    profileById,
  };
}

const PLACE: Record<ZoneType, string> = {
  arcade: 'アーケード',
  counter: 'カウンター席',
  work: '作業席',
  sofa: 'ソファ',
};

export function waitingLine(notice: Pick<WaitingNotice, 'timeLabel' | 'zone' | 'detail'>): string {
  return `${notice.timeLabel} ${PLACE[notice.zone]}で${notice.detail}`;
}
