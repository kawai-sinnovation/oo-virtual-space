import { Lock, LockOpen } from 'lucide-react';
import { containsPoint, standIn } from '../lib/booths.ts';
import type { BoothState } from '../types/community.ts';
import type { UserPresence } from '../types/presence.ts';
import { Modal } from './Modal.tsx';

export function BoothDialog({
  booth,
  users,
  me,
  onClose,
  onEnter,
  onToggleLock,
  onKnock,
}: {
  booth: BoothState;
  users: UserPresence[];
  me: UserPresence;
  onClose: () => void;
  onEnter: (point: { x: number; y: number }) => void;
  onToggleLock: () => void;
  onKnock: () => void;
}) {
  const inside = users.filter((user) => containsPoint(booth, user.x, user.y));
  const meInside = containsPoint(booth, me.x, me.y);
  const full = inside.length >= booth.capacity && !meInside;

  return (
    <Modal title={`🔒 ${booth.name}（最大${booth.capacity}名）`} onClose={onClose}>
      <p className="text-sm text-white/70">中にいる人の姿は、外からも見えます。</p>
      {booth.locked ? (
        <p className="mt-2 rounded-xl bg-[#ed4245]/15 px-3 py-2 text-sm font-black text-[#ffb4b6]">
          🔒 商談中（ロック中）
        </p>
      ) : (
        <p className="mt-2 text-sm text-white/80">いまは開いています。{inside.length}/{booth.capacity}名</p>
      )}
      <ul className="mt-3 space-y-1 text-sm">
        {inside.length === 0 ? (
          <li className="text-white/45">中には誰もいません。</li>
        ) : (
          inside.map((user) => (
            <li key={user.id}>
              {user.name}
              {user.isSpeaking ? '（発言中）' : user.isMicOn ? '（マイクオン）' : ''}
            </li>
          ))
        )}
      </ul>
      {booth.knocks[0] ? (
        <p className="mt-3 text-xs text-white/55">{booth.knocks[0].fromName}さんがノックしました。</p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {meInside ? (
          <button
            type="button"
            onClick={onToggleLock}
            className="inline-flex h-10 items-center gap-1 rounded-xl bg-[#ffb15a] px-4 text-sm font-black text-[#2a1c10]"
          >
            {booth.locked ? <LockOpen size={15} aria-hidden="true" /> : <Lock size={15} aria-hidden="true" />}
            {booth.locked ? '鍵を開ける' : '鍵をかける'}
          </button>
        ) : null}
        {!meInside && !booth.locked && !full ? (
          <button
            type="button"
            onClick={() => onEnter(standIn(booth))}
            className="h-10 rounded-xl bg-white/10 px-4 text-sm font-bold"
          >
            入室する
          </button>
        ) : null}
        {!meInside && (booth.locked || full) ? (
          <button
            type="button"
            onClick={onKnock}
            className="h-10 rounded-xl bg-[#7c6af7] px-4 text-sm font-black text-white"
          >
            ノック（入室リクエスト）を送る
          </button>
        ) : null}
      </div>
      {!meInside && booth.locked ? (
        <p className="mt-3 text-xs leading-relaxed text-white/50">
          ロック中は入室も、中の人との音声参加もできません。
        </p>
      ) : null}
      {!meInside && full && !booth.locked ? (
        <p className="mt-3 text-xs text-white/50">満室です。空きができてから入れます。</p>
      ) : null}
    </Modal>
  );
}
