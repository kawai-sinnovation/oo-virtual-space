import { useState } from 'react';
import { ZONES } from '../data/zones.ts';
import { waitingLine } from '../hooks/useCommunity.ts';
import type { EventFlyer, WaitingNotice } from '../types/community.ts';
import type { ZoneType } from '../types/presence.ts';
import { Modal } from './Modal.tsx';

export function FlyerBoardModal({
  flyers,
  notices,
  onClose,
  onAddFlyer,
  onAddNotice,
}: {
  flyers: EventFlyer[];
  notices: WaitingNotice[];
  onClose: () => void;
  onAddFlyer: (flyer: { title: string; dateLabel: string; summary: string; link: string }) => void;
  onAddNotice: (notice: { zone: ZoneType; timeLabel: string; detail: string }) => void;
}) {
  const [tab, setTab] = useState<'flyers' | 'waiting'>('flyers');

  return (
    <Modal title="📌 イベントチラシ ＆ 待機予告ボード" onClose={onClose} wide>
      <div className="mb-4 flex gap-2">
        <TabButton active={tab === 'flyers'} onClick={() => setTab('flyers')}>
          イベントチラシ置き場
        </TabButton>
        <TabButton active={tab === 'waiting'} onClick={() => setTab('waiting')}>
          待機予告リスト
        </TabButton>
      </div>
      {tab === 'flyers' ? (
        <FlyerTab flyers={flyers} onAdd={onAddFlyer} />
      ) : (
        <WaitingTab notices={notices} onAdd={onAddNotice} />
      )}
    </Modal>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-9 rounded-full px-3 text-xs font-black ${
        active ? 'bg-[#ffb15a] text-[#2a1c10]' : 'bg-white/10 text-white/75'
      }`}
    >
      {children}
    </button>
  );
}

function FlyerTab({
  flyers,
  onAdd,
}: {
  flyers: EventFlyer[];
  onAdd: (flyer: { title: string; dateLabel: string; summary: string; link: string }) => void;
}) {
  const [title, setTitle] = useState('');
  const [dateLabel, setDateLabel] = useState('');
  const [summary, setSummary] = useState('');
  const [link, setLink] = useState('https://');

  return (
    <div>
      <ul className="space-y-3">
        {flyers.map((flyer) => (
          <li key={flyer.id} className="overflow-hidden rounded-2xl bg-white/[0.04] ring-1 ring-white/10">
            <div
              data-flyer-image
              className="flex h-24 items-end bg-[linear-gradient(135deg,#ffb15a,#e35d8c_55%,#7c6af7)] px-3 py-2"
            >
              <span className="rounded-md bg-black/35 px-2 py-1 text-xs font-black">{flyer.dateLabel}</span>
            </div>
            <div className="px-3 py-3">
              <p className="text-sm font-black">{flyer.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/70">{flyer.summary}</p>
              <a
                href={flyer.link}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex text-xs font-bold text-[#ffd7a8] underline-offset-2 hover:underline"
              >
                詳細を見る
              </a>
            </div>
          </li>
        ))}
      </ul>
      <form
        className="mt-4 space-y-2 border-t border-white/10 pt-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!title.trim() || !dateLabel.trim() || !summary.trim()) return;
          onAdd({
            title: title.trim(),
            dateLabel: dateLabel.trim(),
            summary: summary.trim(),
            link: link.trim() || 'https://example.com',
          });
          setTitle('');
          setDateLabel('');
          setSummary('');
          setLink('https://');
        }}
      >
        <p className="text-xs font-black text-white/55">チラシを登録する</p>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value.slice(0, 40))}
          placeholder="イベント名"
          aria-label="イベント名"
          className="h-10 w-full rounded-xl bg-black/30 px-3 text-sm ring-1 ring-white/10 focus:ring-[#ffb15a] focus:outline-none"
        />
        <input
          value={dateLabel}
          onChange={(event) => setDateLabel(event.target.value.slice(0, 24))}
          placeholder="日時（例: 12/3 19:00）"
          aria-label="開催日時"
          className="h-10 w-full rounded-xl bg-black/30 px-3 text-sm ring-1 ring-white/10 focus:ring-[#ffb15a] focus:outline-none"
        />
        <textarea
          value={summary}
          onChange={(event) => setSummary(event.target.value.slice(0, 80))}
          placeholder="ひとこと説明"
          aria-label="チラシの説明"
          rows={2}
          className="w-full resize-none rounded-xl bg-black/30 px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-[#ffb15a] focus:outline-none"
        />
        <input
          value={link}
          onChange={(event) => setLink(event.target.value.slice(0, 120))}
          placeholder="詳細リンク"
          aria-label="詳細リンク"
          className="h-10 w-full rounded-xl bg-black/30 px-3 text-sm ring-1 ring-white/10 focus:ring-[#ffb15a] focus:outline-none"
        />
        <button type="submit" className="h-10 rounded-xl bg-[#ffb15a] px-4 text-sm font-black text-[#2a1c10]">
          登録する
        </button>
      </form>
    </div>
  );
}

function WaitingTab({
  notices,
  onAdd,
}: {
  notices: WaitingNotice[];
  onAdd: (notice: { zone: ZoneType; timeLabel: string; detail: string }) => void;
}) {
  const [timeLabel, setTimeLabel] = useState('今日 21:00〜22:00');
  const [zone, setZone] = useState<ZoneType>('counter');
  const [detail, setDetail] = useState('');

  return (
    <div>
      <ul className="space-y-2">
        {notices.map((notice) => (
          <li key={notice.id} className="rounded-2xl bg-white/[0.04] px-3 py-3 ring-1 ring-white/10">
            <p className="text-sm font-black">{waitingLine(notice)}</p>
            <p className="mt-1 text-[11px] text-white/40">{notice.authorName}</p>
          </li>
        ))}
      </ul>
      <form
        className="mt-4 space-y-2 border-t border-white/10 pt-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!timeLabel.trim() || !detail.trim()) return;
          onAdd({ zone, timeLabel: timeLabel.trim(), detail: detail.trim() });
          setDetail('');
        }}
      >
        <p className="text-xs font-black text-white/55">待機予告を投稿する</p>
        <input
          value={timeLabel}
          onChange={(event) => setTimeLabel(event.target.value.slice(0, 28))}
          aria-label="待機する時間"
          className="h-10 w-full rounded-xl bg-black/30 px-3 text-sm ring-1 ring-white/10 focus:ring-[#ffb15a] focus:outline-none"
        />
        <select
          value={zone}
          aria-label="待機する場所"
          onChange={(event) => setZone(event.target.value as ZoneType)}
          className="h-10 w-full rounded-xl bg-black/30 px-3 text-sm ring-1 ring-white/10 focus:ring-[#ffb15a] focus:outline-none"
        >
          {ZONES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.shortName}
            </option>
          ))}
        </select>
        <input
          value={detail}
          onChange={(event) => setDetail(event.target.value.slice(0, 40))}
          placeholder="新規事業の壁打ち待機してます！"
          aria-label="待機の内容"
          className="h-10 w-full rounded-xl bg-black/30 px-3 text-sm ring-1 ring-white/10 focus:ring-[#ffb15a] focus:outline-none"
        />
        <button type="submit" className="h-10 rounded-xl bg-[#7c6af7] px-4 text-sm font-black text-white">
          投稿して通知する
        </button>
      </form>
    </div>
  );
}
