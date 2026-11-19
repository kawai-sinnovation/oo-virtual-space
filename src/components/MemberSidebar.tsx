import { Footprints, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { ZONE_BY_ID } from '../data/zones.ts';
import { isInConversation } from '../lib/conversations.ts';
import type { MemberProfile } from '../types/community.ts';
import type { UserPresence } from '../types/presence.ts';
import { ZoneIcon } from './zoneIcon.tsx';

export function MemberSidebar({
  open,
  users,
  profiles,
  voiceRoom,
  onMeet,
  onOpenCard,
  onClose,
}: {
  open: boolean;
  users: UserPresence[];
  profiles: MemberProfile[];
  voiceRoom: (user: UserPresence) => string;
  onMeet: (user: UserPresence) => void;
  onOpenCard: (userId: string) => void;
  onClose: () => void;
}) {
  const members = [...users].sort((a, b) => Number(Boolean(b.isMe)) - Number(Boolean(a.isMe)));

  return (
    <>
      {open ? (
        <button
          type="button"
          className="absolute inset-0 z-10 bg-black/45 lg:hidden"
          aria-label="参加者一覧を閉じる"
          onClick={onClose}
        />
      ) : null}
      <aside
        id="member-sidebar"
        className={`z-20 shrink-0 overflow-hidden border-white/10 bg-[#171922]/95 backdrop-blur-xl transition-[width] duration-300 ease-out max-lg:absolute max-lg:inset-y-0 max-lg:right-0 max-lg:shadow-2xl ${
          open ? 'w-80 border-l max-lg:w-[min(20rem,88vw)]' : 'w-0'
        }`}
      >
        <div className="flex h-full w-80 max-lg:w-[min(20rem,88vw)] flex-col">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-xs tracking-[0.2em] text-white/45">PARTICIPANTS</p>
            <h2 className="text-sm font-black">参加者</h2>
          </div>
          <ul className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
            {members.map((user) => {
              const zone = ZONE_BY_ID[user.zone];
              const talking = isInConversation(user, users, voiceRoom);
              const profile = profiles.find((item) => item.userId === user.id);
              return (
                <li key={user.id} className="rounded-2xl bg-white/[0.04] ring-1 ring-white/5">
                  <button
                    type="button"
                    onClick={() => onOpenCard(user.id)}
                    className="w-full rounded-2xl px-3 py-3 text-left focus-visible:ring-2 focus-visible:ring-[#ffb15a] focus-visible:outline-none"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="relative mt-0.5 h-10 w-10 shrink-0 rounded-full"
                        style={{ background: user.avatarColor }}
                      >
                        {user.isMe ? (
                          <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-[#3ddc84] ring-2 ring-[#171922]" />
                        ) : null}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-black">{user.name}</span>
                          <span
                            className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
                            style={{ background: `${zone.accent}22`, color: zone.accent }}
                          >
                            <ZoneIcon zone={user.zone} size={11} />
                            {zone.shortName}
                          </span>
                        </span>
                        {profile ? (
                          <span className="mt-0.5 block truncate text-[11px] text-white/45">
                            {profile.organization} / {profile.title}
                          </span>
                        ) : null}
                        <span className="mt-1 block truncate text-xs text-white/60">
                          {user.statusText || 'ひとことなし'}
                        </span>
                        <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                              user.isMicOn ? 'bg-white/10 text-white/80' : 'bg-[#ed4245]/20 text-[#ff8d90]'
                            }`}
                          >
                            {user.isMicOn ? <Mic size={11} aria-hidden="true" /> : <MicOff size={11} aria-hidden="true" />}
                            {user.isMicOn ? 'マイク' : 'ミュート'}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                              user.isCameraOn ? 'bg-[#3ba55d]/20 text-[#8ee0a8]' : 'bg-white/5 text-white/40'
                            }`}
                          >
                            {user.isCameraOn ? (
                              <Video size={11} aria-hidden="true" />
                            ) : (
                              <VideoOff size={11} aria-hidden="true" />
                            )}
                            {user.isCameraOn ? 'カメラ' : '映像オフ'}
                          </span>
                          {talking ? (
                            <span className="rounded-full bg-emerald-400/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-200">
                              会話中
                            </span>
                          ) : null}
                          {user.isSpeaking ? (
                            <span className="rounded-full bg-[#3ddc84]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#b6f5cf]">
                              発言中
                            </span>
                          ) : null}
                          {profile?.seeking ? (
                            <span className="rounded-full bg-[#ffb15a]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#ffd7a8]">
                              求む
                            </span>
                          ) : null}
                        </span>
                        {user.isMe ? (
                          <span className="mt-2 block text-[11px] font-bold text-[#ffb15a]">いまここ</span>
                        ) : null}
                      </span>
                    </div>
                  </button>
                  {user.isMe ? null : (
                    <div className="px-3 pb-3">
                      <button
                        type="button"
                        onClick={() => onMeet(user)}
                        className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#ffb15a] hover:text-[#2a1c10] focus-visible:ring-2 focus-visible:ring-[#ffb15a] focus-visible:outline-none"
                      >
                        <Footprints size={12} aria-hidden="true" />
                        会いに行く
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </>
  );
}
