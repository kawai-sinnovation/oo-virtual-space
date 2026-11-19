/** 6桁カラーを少し暗くして、体の影色に使う。 */
export function shade(hex: string, amount = 0.22): string {
  const value = hex.replace('#', '');
  const channel = (start: number) => Number.parseInt(value.slice(start, start + 2), 16);
  const mix = (channelValue: number) => Math.round(channelValue * (1 - amount));
  return `rgb(${mix(channel(0))}, ${mix(channel(2))}, ${mix(channel(4))})`;
}
