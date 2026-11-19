import type { MemberProfile } from '../types/community.ts';

function escapeVCard(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

export function buildVCard(profile: MemberProfile): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${escapeVCard(profile.name)}`,
    `ORG:${escapeVCard(profile.organization)}`,
    `TITLE:${escapeVCard(profile.title)}`,
    `NOTE:${escapeVCard(profile.bio)}`,
  ];
  if (profile.cardUrl) lines.push(`URL:${profile.cardUrl}`);
  if (profile.skillTags.length > 0) {
    lines.push(`CATEGORIES:${profile.skillTags.map(escapeVCard).join(',')}`);
  }
  lines.push('END:VCARD');
  return `${lines.join('\r\n')}\r\n`;
}

export function downloadVCard(profile: MemberProfile): void {
  const blob = new Blob([buildVCard(profile)], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${profile.name || 'card'}.vcf`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
