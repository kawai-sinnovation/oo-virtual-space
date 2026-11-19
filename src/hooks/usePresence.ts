import { useCallback, useEffect, useRef, useState } from 'react';
import { BOT_LINES, createInitialUsers, initialMePoint } from '../data/dummyUsers.ts';
import {
  clampPosition,
  clampToRoam,
  detectZone,
  randomPointInZone,
  ZONES,
} from '../data/zones.ts';
import { clampStatus } from '../lib/status.ts';
import type { UserPresence, ZoneType } from '../types/presence.ts';

export type MoveStyle = 'glide' | 'walk';

/** 目的地へ入れてよいか。false のときはその一歩を止める。 */
export type EntryGuard = (x: number, y: number, fromX: number, fromY: number) => boolean;

interface Glide {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  start: number;
  duration: number;
}

/**
 * ローカルモックの在席ストア。
 * users の形は UserPresence[] のままにしてあり、将来はここを
 * Supabase Realtime の subscribe（受信）と track / update（送信）に差し替える。
 */
export function usePresence() {
  const [users, setUsers] = useState(createInitialUsers);
  const [demoMode, setDemoModeState] = useState(true);
  const mePos = useRef(initialMePoint());

  const animRef = useRef<Glide | null>(null);
  const loopRef = useRef(0);
  const entryGuard = useRef<EntryGuard>(() => true);
  const setEntryGuard = useCallback((guard: EntryGuard) => {
    entryGuard.current = guard;
  }, []);

  const commit = useCallback((x: number, y: number) => {
    const next = clampPosition(x, y);
    mePos.current = next;
    const zone = detectZone(next.x, next.y);
    setUsers((prev) =>
      prev.map((user) => (user.isMe ? { ...user, x: next.x, y: next.y, zone } : user)),
    );
    return next;
  }, []);

  const ensureLoop = useCallback(() => {
    if (loopRef.current) return;

    const step = (now: number) => {
      const anim = animRef.current;
      if (!anim) {
        loopRef.current = 0;
        return;
      }
      const t = Math.min(1, (now - anim.start) / anim.duration);
      if (t >= 1) {
        commit(anim.toX, anim.toY);
        animRef.current = null;
        loopRef.current = 0;
        return;
      }
      const eased = 1 - (1 - t) ** 3;
      commit(
        anim.fromX + (anim.toX - anim.fromX) * eased,
        anim.fromY + (anim.toY - anim.fromY) * eased,
      );
      loopRef.current = window.requestAnimationFrame(step);
    };

    loopRef.current = window.requestAnimationFrame(step);
  }, [commit]);

  useEffect(() => {
    return () => {
      if (loopRef.current) window.cancelAnimationFrame(loopRef.current);
    };
  }, []);

  const updateMe = useCallback(
    (x: number, y: number, style: MoveStyle) => {
      const target = clampPosition(x, y);
      const from = mePos.current;
      if (!entryGuard.current(target.x, target.y, from.x, from.y)) {
        return { x: from.x, y: from.y };
      }
      if (style === 'walk') {
        animRef.current = null;
        return commit(target.x, target.y);
      }

      if (Math.hypot(target.x - from.x, target.y - from.y) < 1) {
        animRef.current = null;
        return commit(target.x, target.y);
      }

      animRef.current = {
        fromX: from.x,
        fromY: from.y,
        toX: target.x,
        toY: target.y,
        start: performance.now(),
        duration: 400,
      };
      ensureLoop();
      return target;
    },
    [commit, ensureLoop],
  );

  const setMyStatus = useCallback((text: string) => {
    const statusText = clampStatus(text);
    setUsers((prev) => prev.map((user) => (user.isMe ? { ...user, statusText } : user)));
  }, []);

  const setMyMic = useCallback((isMicOn: boolean) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.isMe ? { ...user, isMicOn, isSpeaking: isMicOn ? user.isSpeaking : false } : user,
      ),
    );
  }, []);

  const setMyCamera = useCallback((isCameraOn: boolean) => {
    setUsers((prev) => prev.map((user) => (user.isMe ? { ...user, isCameraOn } : user)));
  }, []);

  const setMySpeaking = useCallback((isSpeaking: boolean) => {
    setUsers((prev) =>
      prev.map((user) => (user.isMe ? { ...user, isSpeaking: user.isMicOn && isSpeaking } : user)),
    );
  }, []);

  const setDemoMode = useCallback((next: boolean) => {
    setDemoModeState(next);
  }, []);

  useEffect(() => {
    if (!demoMode) return;
    const walkId = window.setInterval(() => {
      setUsers((prev) => {
        const moved = tuneMedia(spreadBots(prev.map((user) => (user.isMe ? user : wander(user)))));
        return moved.map((user) => {
          if (user.isMe) return user;
          const before = prev.find((item) => item.id === user.id);
          if (!before || entryGuard.current(user.x, user.y, before.x, before.y)) return user;
          return { ...user, x: before.x, y: before.y, zone: before.zone };
        });
      });
    }, 2800);
    const speakId = window.setInterval(() => {
      setUsers((prev) => flickerSpeaking(prev));
    }, 1400);
    return () => {
      window.clearInterval(walkId);
      window.clearInterval(speakId);
    };
  }, [demoMode]);

  const me = users.find((user) => user.isMe);
  if (!me) throw new Error('自分の在席データがありません');

  return {
    users,
    me,
    demoMode,
    setDemoMode,
    updateMe,
    setEntryGuard,
    setMyStatus,
    setMyMic,
    setMyCamera,
    setMySpeaking,
  };
}

function spreadBots(users: UserPresence[]): UserPresence[] {
  const anchors: UserPresence[] = [];
  return users.map((user) => {
    if (user.isMe) {
      anchors.push(user);
      return user;
    }

    let x = user.x;
    let y = user.y;
    for (const other of anchors) {
      if (other.zone !== user.zone) continue;
      const dx = x - other.x;
      const dy = y - other.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 74) {
        const angle = dist < 1 ? Math.random() * Math.PI * 2 : Math.atan2(dy, dx);
        x = other.x + Math.cos(angle) * 74;
        y = other.y + Math.sin(angle) * 74;
      }
    }

    const point = clampToRoam(x, y, user.zone);
    const next = { ...user, x: point.x, y: point.y };
    anchors.push(next);
    return next;
  });
}

function wander(user: UserPresence): UserPresence {
  const roll = Math.random();
  let zone: ZoneType = user.zone;
  let point = { x: user.x, y: user.y };

  if (roll < 0.38) {
    point = { x: user.x, y: user.y };
  } else if (roll < 0.78) {
    point = clampToRoam(
      user.x + (Math.random() - 0.5) * 70,
      user.y + (Math.random() - 0.5) * 48,
      user.zone,
    );
  } else {
    const options = ZONES.map((item) => item.id).filter((id) => id !== user.zone);
    zone = options[Math.floor(Math.random() * options.length)] ?? user.zone;
    point = randomPointInZone(zone);
  }

  const lines = BOT_LINES[user.id];
  const statusText =
    lines && Math.random() < 0.28
      ? (lines[Math.floor(Math.random() * lines.length)] ?? user.statusText)
      : user.statusText;

  return { ...user, x: point.x, y: point.y, zone, statusText };
}

function tuneMedia(users: UserPresence[]): UserPresence[] {
  const micCount = new Map<ZoneType, number>();
  for (const user of users) {
    if (!user.isMicOn) continue;
    micCount.set(user.zone, (micCount.get(user.zone) ?? 0) + 1);
  }

  return users.map((user) => {
    if (user.isMe) return user;

    const quiet = user.id === 'yuki';
    let isMicOn = user.isMicOn;
    let isCameraOn = user.isCameraOn;
    let isSpeaking = user.isSpeaking;
    let zone = user.zone;
    let x = user.x;
    let y = user.y;

    if (isMicOn) {
      if (Math.random() < (quiet ? 0.4 : 0.12)) {
        isMicOn = false;
        isSpeaking = false;
      }
    } else if (Math.random() < (quiet ? 0.08 : 0.3)) {
      isMicOn = true;
    }

    if (Math.random() < (quiet ? 0.05 : 0.14)) isCameraOn = !isCameraOn;
    if (!isMicOn) isSpeaking = false;

    const company = (micCount.get(zone) ?? 0) - (user.isMicOn ? 1 : 0);
    if (isMicOn && company < 1 && Math.random() < 0.55) {
      const host = users.find((other) => other.id !== user.id && other.isMicOn && other.zone !== zone);
      if (host) {
        const point = randomPointInZone(host.zone);
        zone = host.zone;
        x = point.x;
        y = point.y;
      }
    }

    return { ...user, isMicOn, isCameraOn, isSpeaking, zone, x, y };
  });
}

function flickerSpeaking(users: UserPresence[]): UserPresence[] {
  const spoken = new Set<ZoneType>();
  return users.map((user) => {
    if (user.isMe) return user;
    if (!user.isMicOn) return user.isSpeaking ? { ...user, isSpeaking: false } : user;

    let isSpeaking = user.isSpeaking;
    if (Math.random() < 0.55) isSpeaking = !user.isSpeaking;
    if (isSpeaking && spoken.has(user.zone)) isSpeaking = false;
    if (isSpeaking) spoken.add(user.zone);
    return isSpeaking === user.isSpeaking ? user : { ...user, isSpeaking };
  });
}
