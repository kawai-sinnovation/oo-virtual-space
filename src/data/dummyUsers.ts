import type { UserPresence } from '../types/presence.ts';
import { detectZone } from './zones.ts';

const SEEDS: UserPresence[] = [
  {
    id: 'me',
    name: 'あなた',
    avatarColor: '#7c6af7',
    x: 196,
    y: 650,
    zone: 'arcade',
    statusText: '',
    isMicOn: true,
    isCameraOn: false,
    isSpeaking: false,
    isMe: true,
  },
  {
    id: 'miki',
    name: 'Miki',
    avatarColor: '#e35d8c',
    x: 230,
    y: 420,
    zone: 'arcade',
    statusText: 'アーケード好き',
    isMicOn: true,
    isCameraOn: true,
    isSpeaking: false,
  },
  {
    id: 'taro',
    name: 'Taro',
    avatarColor: '#e07a3d',
    x: 600,
    y: 330,
    zone: 'counter',
    statusText: '雑談OK☕',
    isMicOn: true,
    isCameraOn: true,
    isSpeaking: true,
  },
  {
    id: 'yuki',
    name: 'Yuki',
    avatarColor: '#3aa0d8',
    x: 1040,
    y: 350,
    zone: 'work',
    statusText: '作業中💻',
    isMicOn: false,
    isCameraOn: false,
    isSpeaking: false,
  },
  {
    id: 'ken',
    name: 'Ken',
    avatarColor: '#3cbf8e',
    x: 700,
    y: 690,
    zone: 'sofa',
    statusText: '壁打ち歓迎💡',
    isMicOn: true,
    isCameraOn: false,
    isSpeaking: false,
  },
];

export function createInitialUsers(): UserPresence[] {
  return SEEDS.map((user) => ({ ...user, zone: detectZone(user.x, user.y) }));
}

export function initialMePoint(): { x: number; y: number } {
  const me = SEEDS.find((user) => user.isMe);
  return { x: me?.x ?? 0, y: me?.y ?? 0 };
}

export const BOT_LINES: Record<string, readonly string[]> = {
  miki: ['アーケード好き', '看板がきれい', '散歩中'],
  taro: ['雑談OK☕', 'コーヒーどうぞ', '古町は夜が好き'],
  yuki: ['作業中💻', 'あと少し集中', 'レビュー中'],
  ken: ['壁打ち歓迎💡', 'アイデア募集', '相談どうぞ'],
};
