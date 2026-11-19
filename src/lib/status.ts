const STATUS_LIMIT = 20;

/** 絵文字を1文字として数え、最大20文字に収める。 */
export function limitStatus(text: string): string {
  return Array.from(text).slice(0, STATUS_LIMIT).join('');
}

export function clampStatus(text: string): string {
  return limitStatus(text.trim());
}

export function statusLength(text: string): number {
  return Array.from(text).length;
}
