import { useEffect, useRef, useState } from 'react';
import { BoothDialog } from './components/BoothDialog.tsx';
import { ControlBar } from './components/ControlBar.tsx';
import { DiscordDock } from './components/DiscordDock.tsx';
import { FlyerBoardModal } from './components/FlyerBoardModal.tsx';
import { HeaderBar } from './components/HeaderBar.tsx';
import { MapCanvas } from './components/MapCanvas.tsx';
import { MatchingBoardModal } from './components/MatchingBoardModal.tsx';
import { MemberSidebar } from './components/MemberSidebar.tsx';
import { ProfileCardModal } from './components/ProfileCardModal.tsx';
import { ToastStack } from './components/ToastStack.tsx';
import { approachPosition, clampPosition, ZONE_BY_ID } from './data/zones.ts';
import { useCommunity } from './hooks/useCommunity.ts';
import { useKeyboardMove } from './hooks/useKeyboardMove.ts';
import { usePresence, type MoveStyle } from './hooks/usePresence.ts';
import { boothAt, canEnterPoint, voiceRoomId } from './lib/booths.ts';
import type { UserPresence, ZoneType } from './types/presence.ts';

interface Ping {
  id: number;
  x: number;
  y: number;
}

type CardView = { id: string; edit: boolean };
type BoardView = 'match' | 'flyer' | null;

export default function App() {
  const { users, me, demoMode, setDemoMode, updateMe, setEntryGuard, setMyStatus, setMyMic, setMyCamera, setMySpeaking } =
    usePresence();
  const community = useCommunity(me.name);
  const [sidebarOpen, setSidebarOpen] = useState(
    () => window.matchMedia('(min-width: 1024px)').matches,
  );
  const [ping, setPing] = useState<Ping | null>(null);
  const [card, setCard] = useState<CardView | null>(null);
  const [board, setBoard] = useState<BoardView>(null);
  const [boothId, setBoothId] = useState<string | null>(null);
  const [logOpen, setLogOpen] = useState(true);
  const pingId = useRef(0);

  useEffect(() => {
    setEntryGuard((x, y, fromX, fromY) => canEnterPoint(x, y, fromX, fromY, community.booths, users));
  }, [community.booths, users, setEntryGuard]);

  const showPing = (point: { x: number; y: number }) => {
    pingId.current += 1;
    const id = pingId.current;
    setPing({ x: point.x, y: point.y, id });
    window.setTimeout(() => {
      setPing((current) => (current?.id === id ? null : current));
    }, 700);
  };

  const travel = (x: number, y: number, style: MoveStyle) => {
    const target = clampPosition(x, y);
    const allowed = canEnterPoint(target.x, target.y, me.x, me.y, community.booths, users);
    if (!allowed) {
      const blocked = boothAt(target.x, target.y, community.booths);
      if (blocked) setBoothId(blocked.id);
      return;
    }
    const point = updateMe(x, y, style);
    if (style === 'glide') showPing(point);
    else setPing(null);
  };

  useKeyboardMove(
    () => ({ x: me.x, y: me.y }),
    (x, y) => travel(x, y, 'walk'),
  );

  const moveToZone = (zone: ZoneType) => {
    const spawn = ZONE_BY_ID[zone].spawn;
    travel(spawn.x, spawn.y, 'glide');
  };

  const meet = (user: UserPresence) => {
    const point = approachPosition(user.x, user.y);
    travel(point.x, point.y, 'glide');
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const voiceRoom = (user: UserPresence) => voiceRoomId(user, community.booths);
  const seekingOf = (userId: string) => {
    const profile = community.profileById(userId);
    if (!profile?.seeking) return null;
    return profile.seekingText || '協業できる企業';
  };

  const activeProfile = card ? community.profileById(card.id) : null;
  const activeBooth = community.booths.find((booth) => booth.id === boothId) ?? null;
  const myProfile = community.profileById(me.id);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#101218] text-[#f4efe6]">
      <HeaderBar
        zone={me.zone}
        onlineCount={users.length}
        sidebarOpen={sidebarOpen}
        nightMode={community.nightMode}
        onToggleSidebar={() => setSidebarOpen((open) => !open)}
        onToggleNight={() => community.setNightMode((on) => !on)}
      />
      <div className="relative flex min-h-0 flex-1">
        <main className="relative min-w-0 flex-1">
          <MapCanvas
            users={users}
            activeZone={me.zone}
            ping={ping}
            booths={community.booths}
            nightMode={community.nightMode}
            seekingOf={seekingOf}
            voiceRoom={voiceRoom}
            onMove={(x, y) => travel(x, y, 'glide')}
            onSelectUser={(id) => setCard({ id, edit: false })}
            onOpenMatching={() => setBoard('match')}
            onOpenFlyers={() => setBoard('flyer')}
            onOpenBooth={setBoothId}
          />
          <DiscordDock open={logOpen} logs={community.logs} onToggle={() => setLogOpen((open) => !open)} />
        </main>
        <MemberSidebar
          open={sidebarOpen}
          users={users}
          profiles={community.profiles}
          voiceRoom={voiceRoom}
          onMeet={meet}
          onOpenCard={(id) => setCard({ id, edit: false })}
          onClose={() => setSidebarOpen(false)}
        />
      </div>
      <ControlBar
        statusText={me.statusText}
        activeZone={me.zone}
        demoMode={demoMode}
        isMicOn={me.isMicOn}
        isCameraOn={me.isCameraOn}
        isSpeaking={me.isSpeaking}
        onStatus={setMyStatus}
        onMoveZone={moveToZone}
        onToggleDemo={() => setDemoMode(!demoMode)}
        onToggleMic={() => setMyMic(!me.isMicOn)}
        onToggleCamera={() => setMyCamera(!me.isCameraOn)}
        onSpeaking={setMySpeaking}
        onOpenProfile={() => setCard({ id: me.id, edit: true })}
      />
      <ToastStack toasts={community.toasts} onDismiss={community.dismissToast} />
      {activeProfile && card ? (
        <ProfileCardModal
          key={`${card.id}-${card.edit ? 'edit' : 'view'}`}
          profile={activeProfile}
          mine={activeProfile.userId === me.id}
          exchanged={community.exchanges.some((item) => item.userId === activeProfile.userId)}
          exchanges={community.exchanges}
          profiles={community.profiles}
          startEditing={card.edit}
          onClose={() => setCard(null)}
          onExchange={() => community.exchangeWith(activeProfile.userId)}
          onSave={(patch) => community.updateMyProfile(me.id, patch)}
        />
      ) : null}
      {board === 'match' && myProfile ? (
        <MatchingBoardModal
          posts={community.posts}
          me={myProfile}
          onClose={() => setBoard(null)}
          onPost={(title, body) => community.addPost(me.id, me.name, title, body)}
          onSeeking={(seeking, seekingText) => community.updateMyProfile(me.id, { seeking, seekingText })}
        />
      ) : null}
      {board === 'flyer' ? (
        <FlyerBoardModal
          flyers={community.flyers}
          notices={community.notices}
          onClose={() => setBoard(null)}
          onAddFlyer={community.addFlyer}
          onAddNotice={(notice) =>
            community.addNotice({ ...notice, authorId: me.id, authorName: me.name })
          }
        />
      ) : null}
      {activeBooth ? (
        <BoothDialog
          booth={activeBooth}
          users={users}
          me={me}
          onClose={() => setBoothId(null)}
          onEnter={(point) => {
            setBoothId(null);
            travel(point.x, point.y, 'glide');
          }}
          onToggleLock={() => community.toggleBoothLock(activeBooth.id)}
          onKnock={() => community.knockBooth(activeBooth.id, me.name)}
        />
      ) : null}
    </div>
  );
}
