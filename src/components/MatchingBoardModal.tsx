import { useState } from 'react';
import { Modal } from './Modal.tsx';
import type { MatchingPost, MemberProfile } from '../types/community.ts';

export function MatchingBoardModal({
  posts,
  me,
  onClose,
  onPost,
  onSeeking,
}: {
  posts: MatchingPost[];
  me: MemberProfile;
  onClose: () => void;
  onPost: (title: string, body: string) => void;
  onSeeking: (seeking: boolean, seekingText: string) => void;
}) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [seekingText, setSeekingText] = useState(me.seekingText);

  return (
    <Modal title="🤝 協業・企業マッチングボード" onClose={onClose} wide>
      <p className="text-sm text-white/70">こういうことできる企業・パートナーいませんか？</p>
      <label className="mt-3 flex items-start gap-2 rounded-xl bg-[#ffb15a]/10 px-3 py-2 text-sm">
        <input
          type="checkbox"
          checked={me.seeking}
          onChange={(event) => onSeeking(event.target.checked, seekingText.trim().slice(0, 18))}
          className="mt-1 h-4 w-4 accent-[#ffb15a]"
        />
        <span>
          自分の頭上にバッジを立てる
          <span className="mt-1 block font-black text-[#ffd7a8]">【求む】{seekingText || '協業できる企業'}</span>
        </span>
      </label>
      <label className="mt-2 block text-xs font-bold text-white/55">
        バッジの文言
        <input
          value={seekingText}
          onChange={(event) => {
            const next = event.target.value.slice(0, 18);
            setSeekingText(next);
            if (me.seeking) onSeeking(true, next.trim());
          }}
          className="mt-1 h-10 w-full rounded-xl bg-black/30 px-3 text-sm text-white ring-1 ring-white/10 focus:ring-[#ffb15a] focus:outline-none"
        />
      </label>
      <ul className="mt-4 space-y-2">
        {posts.map((post) => (
          <li key={post.id} className="rounded-2xl bg-white/[0.04] px-3 py-3 ring-1 ring-white/10">
            <p className="text-sm font-black">{post.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-white/70">{post.body}</p>
            <p className="mt-2 text-[11px] text-white/40">{post.authorName}</p>
          </li>
        ))}
      </ul>
      <form
        className="mt-4 space-y-2 border-t border-white/10 pt-4"
        onSubmit={(event) => {
          event.preventDefault();
          const nextTitle = title.trim();
          const nextBody = body.trim();
          if (!nextTitle || !nextBody) return;
          onPost(nextTitle, nextBody);
          setTitle('');
          setBody('');
        }}
      >
        <p className="text-xs font-black text-white/55">募集を投稿する</p>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value.slice(0, 60))}
          placeholder="こういう企業を探しています"
          aria-label="募集タイトル"
          className="h-10 w-full rounded-xl bg-black/30 px-3 text-sm ring-1 ring-white/10 focus:ring-[#ffb15a] focus:outline-none"
        />
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value.slice(0, 160))}
          placeholder="どんな相手と、何をしたいか"
          aria-label="募集の詳細"
          rows={3}
          className="w-full resize-none rounded-xl bg-black/30 px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-[#ffb15a] focus:outline-none"
        />
        <button
          type="submit"
          className="h-10 rounded-xl bg-[#ffb15a] px-4 text-sm font-black text-[#2a1c10]"
        >
          投稿する
        </button>
      </form>
    </Modal>
  );
}
