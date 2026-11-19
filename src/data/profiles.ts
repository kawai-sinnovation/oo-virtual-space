import type { MemberProfile } from '../types/community.ts';

const PROFILES: MemberProfile[] = [
  {
    userId: 'me',
    name: 'あなた',
    organization: 'oO',
    title: 'コミュニティメンバー',
    bio: '古町のバーチャルスペースで、新しい協業のきっかけを探しています。',
    skillTags: ['場づくり', '新規事業'],
    cardUrl: 'https://lit.link/oo-virtual-space',
    cardProvider: 'litlink',
    seeking: false,
    seekingText: '実証実験できる店舗',
  },
  {
    userId: 'taro',
    name: 'Taro',
    organization: '古町商事',
    title: '新規事業担当',
    bio: '新潟の商店街とスタートアップをつなぐ仕事をしています。実証の場をいつも探しています。',
    skillTags: ['新規事業', '店舗開発'],
    cardUrl: 'https://8card.net/p/taro-furumachi',
    cardProvider: 'eight',
    seeking: true,
    seekingText: 'アプリ開発できる企業',
  },
  {
    userId: 'yuki',
    name: 'Yuki',
    organization: '合同会社ミーティア',
    title: 'UIデザイナー',
    bio: 'アプリや店舗サービスの画面をつくっています。古町の現場を見ながらデザインしたいです。',
    skillTags: ['UI/UX', 'デザイン'],
    cardUrl: 'https://lit.link/yuki-ui',
    cardProvider: 'litlink',
    seeking: false,
    seekingText: '開発パートナー',
  },
  {
    userId: 'ken',
    name: 'Ken',
    organization: '株式会社ポート',
    title: 'エンジニア',
    bio: 'Webアプリの実装と、アイデアの技術的な壁打ちが得意です。',
    skillTags: ['エンジニア', 'Web'],
    cardUrl: 'https://ap.sansan.com/v/ken-port',
    cardProvider: 'sansan',
    seeking: false,
    seekingText: 'UIが得意な制作会社',
  },
  {
    userId: 'miki',
    name: 'Miki',
    organization: 'oO',
    title: 'コミュニティマネージャー',
    bio: '古町のイベントと、人と人の出会いをつくっています。',
    skillTags: ['コミュニティ', 'イベント'],
    cardUrl: 'https://lit.link/miki-oo',
    cardProvider: 'litlink',
    seeking: false,
    seekingText: '一緒に企画できる人',
  },
];

export function createProfiles(): MemberProfile[] {
  return PROFILES.map((profile) => ({ ...profile, skillTags: [...profile.skillTags] }));
}
