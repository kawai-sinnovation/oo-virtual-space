import { useState } from 'react';
import { Download } from 'lucide-react';
import { QrMark } from './QrMark.tsx';
import { Modal } from './Modal.tsx';
import { PROVIDER_LABEL } from '../lib/providers.ts';
import { downloadVCard } from '../lib/vcard.ts';
import type { CardExchange, CardProvider, MemberProfile } from '../types/community.ts';

export function ProfileCardModal({
  profile,
  mine,
  exchanged,
  exchanges,
  profiles,
  startEditing,
  onClose,
  onExchange,
  onSave,
}: {
  profile: MemberProfile;
  mine: boolean;
  exchanged: boolean;
  exchanges: CardExchange[];
  profiles: MemberProfile[];
  startEditing: boolean;
  onClose: () => void;
  onExchange: () => void;
  onSave: (patch: Partial<MemberProfile>) => void;
}) {
  const [editing, setEditing] = useState(startEditing);
  const [saved, setSaved] = useState(false);

  return (
    <Modal title={mine ? '自分のデジタル名刺' : `${profile.name}のデジタル名刺`} onClose={onClose}>
      {editing ? (
        <ProfileEditor
          profile={profile}
          saved={saved}
          onSave={(patch) => {
            onSave(patch);
            setSaved(true);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <CardFace
          profile={profile}
          mine={mine}
          exchanged={exchanged}
          onEdit={() => {
            setSaved(false);
            setEditing(true);
          }}
          onExchange={onExchange}
        />
      )}
      {mine ? <ExchangeList exchanges={exchanges} profiles={profiles} /> : null}
    </Modal>
  );
}

function CardFace({
  profile,
  mine,
  exchanged,
  onEdit,
  onExchange,
}: {
  profile: MemberProfile;
  mine: boolean;
  exchanged: boolean;
  onEdit: () => void;
  onExchange: () => void;
}) {
  return (
    <div data-profile-card={profile.userId}>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-lg font-black">{profile.name}</p>
          <p className="mt-0.5 text-sm text-white/70">
            {profile.organization}
            {profile.title ? ` / ${profile.title}` : ''}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {profile.skillTags.map((tag) => (
              <span key={tag} className="rounded-full bg-[#ffb15a]/15 px-2 py-0.5 text-[11px] font-bold text-[#ffd7a8]">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <QrMark seed={`${profile.userId}:${profile.cardUrl}`} />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-white/80">{profile.bio}</p>
      {exchanged ? (
        <p
          data-exchange-done
          className="mt-3 rounded-xl bg-[#3ddc84]/15 px-3 py-2 text-sm font-black text-[#b6f5cf]"
        >
          名刺交換完了！
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {profile.cardUrl ? (
          <a
            href={profile.cardUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center rounded-lg bg-white/10 px-3 text-xs font-bold ring-1 ring-white/10 hover:bg-white/15"
          >
            {PROVIDER_LABEL[profile.cardProvider]}で開く
          </a>
        ) : null}
        <button
          type="button"
          onClick={() => downloadVCard(profile)}
          className="inline-flex h-9 items-center gap-1 rounded-lg bg-white/10 px-3 text-xs font-bold ring-1 ring-white/10 hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-[#ffb15a] focus-visible:outline-none"
        >
          <Download size={14} aria-hidden="true" />
          連絡先(.vcf)をダウンロード
        </button>
      </div>
      <div className="mt-3">
        {mine ? (
          <button
            type="button"
            onClick={onEdit}
            className="h-10 rounded-xl bg-[#ffb15a] px-4 text-sm font-black text-[#2a1c10] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          >
            名刺を編集する
          </button>
        ) : (
          <button
            type="button"
            onClick={onExchange}
            disabled={exchanged}
            className="h-10 rounded-xl bg-[#7c6af7] px-4 text-sm font-black text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:bg-white/10 disabled:text-white/45"
          >
            {exchanged ? '交換済み' : '名刺を交換する'}
          </button>
        )}
      </div>
    </div>
  );
}

function ProfileEditor({
  profile,
  saved,
  onSave,
  onCancel,
}: {
  profile: MemberProfile;
  saved: boolean;
  onSave: (patch: Partial<MemberProfile>) => void;
  onCancel: () => void;
}) {
  const [organization, setOrganization] = useState(profile.organization);
  const [title, setTitle] = useState(profile.title);
  const [bio, setBio] = useState(profile.bio);
  const [tags, setTags] = useState(profile.skillTags.join(' '));
  const [cardUrl, setCardUrl] = useState(profile.cardUrl);
  const [cardProvider, setCardProvider] = useState<CardProvider>(profile.cardProvider);
  const [seeking, setSeeking] = useState(profile.seeking);
  const [seekingText, setSeekingText] = useState(profile.seekingText);

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSave({
          organization: organization.trim(),
          title: title.trim(),
          bio: bio.trim(),
          skillTags: tags
            .split(/[\s,、]+/)
            .map((tag) => tag.replace(/^#/, '').trim())
            .filter(Boolean)
            .slice(0, 6),
          cardUrl: cardUrl.trim(),
          cardProvider,
          seeking,
          seekingText: seekingText.trim().slice(0, 18),
        });
      }}
    >
      <Field label="所属" value={organization} onChange={setOrganization} />
      <Field label="肩書き" value={title} onChange={setTitle} />
      <label className="block text-xs font-bold text-white/55">
        自己紹介
        <textarea
          value={bio}
          onChange={(event) => setBio(event.target.value.slice(0, 120))}
          rows={3}
          className="mt-1 w-full resize-none rounded-xl bg-black/30 px-3 py-2 text-sm text-white ring-1 ring-white/10 focus:ring-[#ffb15a] focus:outline-none"
        />
      </label>
      <Field label="スキルタグ（空白区切り）" value={tags} onChange={setTags} />
      <label className="block text-xs font-bold text-white/55">
        外部名刺アプリ
        <select
          value={cardProvider}
          onChange={(event) => setCardProvider(event.target.value as CardProvider)}
          className="mt-1 h-10 w-full rounded-xl bg-black/30 px-3 text-sm text-white ring-1 ring-white/10 focus:ring-[#ffb15a] focus:outline-none"
        >
          <option value="eight">Eight</option>
          <option value="sansan">Sansan</option>
          <option value="litlink">Lit.link</option>
        </select>
      </label>
      <Field label="名刺URL" value={cardUrl} onChange={setCardUrl} />
      <label className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm">
        <input
          type="checkbox"
          checked={seeking}
          onChange={(event) => setSeeking(event.target.checked)}
          className="h-4 w-4 accent-[#ffb15a]"
        />
        <span>頭上に「【求む】{seekingText || '協業できる企業'}」を出す</span>
      </label>
      <Field label="【求む】の文言" value={seekingText} onChange={(value) => setSeekingText(value.slice(0, 18))} />
      {saved ? <p className="text-xs font-bold text-[#b6f5cf]">保存しました</p> : null}
      <div className="flex gap-2">
        <button
          type="submit"
          className="h-10 rounded-xl bg-[#ffb15a] px-4 text-sm font-black text-[#2a1c10]"
        >
          保存する
        </button>
        <button type="button" onClick={onCancel} className="h-10 rounded-xl bg-white/10 px-4 text-sm font-bold">
          キャンセル
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-xs font-bold text-white/55">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-10 w-full rounded-xl bg-black/30 px-3 text-sm text-white ring-1 ring-white/10 focus:ring-[#ffb15a] focus:outline-none"
      />
    </label>
  );
}

function ExchangeList({
  exchanges,
  profiles,
}: {
  exchanges: CardExchange[];
  profiles: MemberProfile[];
}) {
  return (
    <div className="mt-5 border-t border-white/10 pt-3">
      <p className="text-xs font-black tracking-wide text-white/45">交換した名刺</p>
      {exchanges.length === 0 ? (
        <p className="mt-1 text-xs text-white/45">まだありません。相手の名刺から交換できます。</p>
      ) : (
        <ul className="mt-2 space-y-1">
          {exchanges.map((item) => {
            const profile = profiles.find((entry) => entry.userId === item.userId);
            return (
              <li key={item.userId} className="text-sm">
                {profile ? `${profile.name}（${profile.organization}）` : item.userId}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
