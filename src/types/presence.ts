/**
 * 在席情報。
 * 将来は Supabase の presence 行へほぼそのまま対応させる想定。
 * avatarColor はモック用。本番では Discord アバター URL に置き換える。
 */
export type ZoneType = 'arcade' | 'counter' | 'work' | 'sofa';

export interface UserPresence {
  id: string;
  name: string;
  avatarColor: string;
  x: number;
  y: number;
  zone: ZoneType;
  statusText: string;
  isMicOn: boolean;
  isCameraOn: boolean;
  isSpeaking: boolean;
  isMe?: boolean;
}
