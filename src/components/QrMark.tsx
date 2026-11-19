export function QrMark({ seed }: { seed: string }) {
  const cells = qrCells(seed);
  return (
    <div
      className="grid shrink-0 gap-px rounded-md bg-white p-1.5 shadow-inner"
      style={{ gridTemplateColumns: 'repeat(13, 6px)' }}
      aria-hidden="true"
      data-qr
    >
      {cells.map((on, index) => (
        <span key={index} className={`h-1.5 w-1.5 ${on ? 'bg-[#16181e]' : 'bg-white'}`} />
      ))}
    </div>
  );
}

function qrCells(seed: string): boolean[] {
  const size = 13;
  const cells = Array.from({ length: size * size }, () => false);
  const paintFinder = (ox: number, oy: number) => {
    for (let y = 0; y < 5; y += 1) {
      for (let x = 0; x < 5; x += 1) {
        const edge = x === 0 || y === 0 || x === 4 || y === 4 || (x >= 1 && x <= 3 && y >= 1 && y <= 3 && x !== 2 && y !== 2);
        const core = x >= 1 && x <= 3 && y >= 1 && y <= 3 && !(x === 2 && y === 2) ? x === 1 || y === 1 || x === 3 || y === 3 : false;
        const block = x === 0 || y === 0 || x === 4 || y === 4 || (x === 2 && y === 2);
        cells[(oy + y) * size + (ox + x)] = block || core || edge;
      }
    }
  };
  paintFinder(0, 0);
  paintFinder(size - 5, 0);
  paintFinder(0, size - 5);
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 33 + seed.charCodeAt(i)) >>> 0;
  for (let i = 0; i < cells.length; i += 1) {
    const x = i % size;
    const y = Math.floor(i / size);
    if (x < 6 && y < 6) continue;
    if (x > size - 6 && y < 6) continue;
    if (x < 6 && y > size - 6) continue;
    hash = (hash * 1664525 + 1013904223) >>> 0;
    cells[i] = hash % 3 !== 0;
  }
  return cells;
}
