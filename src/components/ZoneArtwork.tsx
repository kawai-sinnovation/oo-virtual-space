import type { ReactNode } from 'react';
import type { ZoneType } from '../types/presence.ts';

export function ZoneArtwork({ activeZone }: { activeZone: ZoneType }) {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <div className="base-floor absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_40%,rgba(0,0,0,0.28)_100%)]" />
      <Hallway />
      <Arcade active={activeZone === 'arcade'} />
      <Counter active={activeZone === 'counter'} />
      <Work active={activeZone === 'work'} />
      <Sofa active={activeZone === 'sofa'} />
      <DoorColumn />
    </div>
  );
}

function Hallway() {
  return (
    <>
      <div
        className="absolute rounded-full"
        style={{
          left: 430,
          top: 408,
          width: 400,
          height: 62,
          background:
            'linear-gradient(90deg, transparent, rgba(126,78,50,0.95) 10%, rgba(92,54,36,0.95) 88%, transparent)',
        }}
      />
      <p
        className="absolute text-[11px] tracking-[0.45em] text-[#f3d7b0]/75"
        style={{ left: 590, top: 430 }}
      >
        通路
      </p>
      <Plant x={448} y={412} />
    </>
  );
}

function DoorColumn() {
  return (
    <>
      <div className="absolute top-0 left-[384px] h-[400px] w-[18px] bg-gradient-to-r from-[#4a3d32] to-[#241c16] shadow-lg" />
      <div className="absolute top-[492px] left-[384px] h-[308px] w-[18px] bg-gradient-to-r from-[#4a3d32] to-[#241c16] shadow-lg" />
      <div className="absolute top-[392px] left-[378px] h-3 w-[30px] rounded-sm bg-[#6a5038]" />
      <div className="absolute top-[486px] left-[378px] h-3 w-[30px] rounded-sm bg-[#6a5038]" />
    </>
  );
}

function Arcade({ active }: { active: boolean }) {
  return (
    <Zone x={0} y={0} w={400} h={800} accent="#ffb15a" active={active} round="rounded-r-[28px]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#24365c] via-[#1c2838] to-[#6a5c52]" />
      <div className="arcade-floor absolute inset-x-0 top-24 bottom-0" />
      <SkyDots />
      <Dome />
      <div className="absolute top-[68px] right-8 left-8 flex justify-between">
        {Array.from({ length: 7 }, (_, index) => (
          <span
            key={index}
            className="lamp-flicker h-1.5 w-1.5 rounded-full bg-[#ffe1a8] shadow-[0_0_8px_#ffb15a]"
          />
        ))}
      </div>
      <Shop y={128} title="甘味" awning="#e48aa2" window="#ffd6e2" />
      <Shop y={318} title="喫茶" awning="#d8b07a" window="#f3e2c4" />
      <Shop y={520} title="雑貨" awning="#7eb8a8" window="#d5efe6" />
      <StreetLamp x={118} y={188} scale={0.78} />
      <StreetLamp x={118} y={390} scale={0.9} />
      <StreetLamp x={118} y={600} />
      <StreetLamp x={300} y={250} scale={0.84} />
      <StreetLamp x={300} y={470} scale={0.94} />
      <Bench x={292} y={560} />
      <Bench x={292} y={710} />
      <div className="absolute top-24 right-3 flex h-44 w-11 flex-col items-center justify-center gap-1 rounded-md bg-[#9d2b2b] shadow-[0_0_22px_rgba(255,90,90,0.4)] ring-2 ring-[#ffd7a8]/50">
        <span className="text-2xl font-black text-[#ffe7c2]">古</span>
        <span className="text-2xl font-black text-[#ffe7c2]">町</span>
      </div>
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 rounded-full bg-[#1a120f]/80 px-4 py-1 text-[13px] font-black tracking-[0.4em] text-[#ffe1b0] ring-1 ring-[#ffb15a]/50">
        古町モール
      </div>
      <Plate label="古町モール（アーケード）" accent="#ffb15a" className="bottom-4 left-3" />
    </Zone>
  );
}

function Counter({ active }: { active: boolean }) {
  const bottles = [
    { h: 26, c: '#2f6f4e' },
    { h: 36, c: '#7a1f2b' },
    { h: 20, c: '#e6d08a' },
    { h: 32, c: '#1e3a5f' },
    { h: 18, c: '#c47a3a' },
    { h: 28, c: '#4e2c55' },
  ];

  return (
    <Zone x={420} y={50} w={400} h={350} accent="#f0c27a" active={active} round="rounded-[28px]">
      <div className="counter-floor absolute inset-0" />
      <Pendant x={78} />
      <Pendant x={188} />
      <Pendant x={292} />
      <div className="absolute top-11 right-5 left-5 h-[78px] rounded-md bg-[#3f2918] shadow-lg ring-1 ring-black/40">
        <div className="absolute inset-x-0 top-0 h-2.5 rounded-t-md bg-gradient-to-b from-[#f6e0bf] to-[#d7ae74]" />
        <div className="absolute top-5 left-3 flex items-end gap-1.5">
          {bottles.map((bottle) => (
            <span
              key={`${bottle.c}-${bottle.h}`}
              className="w-2.5 rounded-t-full rounded-b-sm"
              style={{ height: bottle.h, background: bottle.c }}
            />
          ))}
        </div>
        <div className="absolute top-4 right-4 text-center">
          <p className="text-[28px] leading-none font-black tracking-tight text-[#f6e2c4]">oO</p>
          <p className="text-[9px] tracking-[0.28em] text-[#f6e2c4]/70">LOUNGE</p>
        </div>
      </div>
      <div className="absolute top-[132px] right-8 left-8 h-[58px]">
        <div className="absolute inset-x-0 top-0 h-4 rounded-sm bg-gradient-to-b from-[#f8e4c4] to-[#e2c08a] shadow-sm" />
        <div className="wood-face absolute inset-x-1 top-4 bottom-0 rounded-b-lg shadow-lg" />
        <span className="absolute top-1 left-8 h-3 w-3 rounded-full bg-white/80" />
        <span className="absolute top-1 left-14 h-3 w-4 rounded-sm bg-[#6b2d2d]" />
      </div>
      {[64, 132, 200, 268, 336].map((x) => (
        <Stool key={x} x={x} y={196} />
      ))}
      <div className="absolute top-[168px] left-3 h-[92px] w-[58px] rounded-sm bg-[#243028] p-1.5 text-[9px] leading-tight text-[#e7f2cf] shadow-md ring-1 ring-black/30">
        <p className="text-center tracking-[0.2em]">MENU</p>
        <p className="mt-1">珈琲</p>
        <p>紅茶</p>
        <p>ソーダ</p>
        <p className="mt-1 text-[#f0d7a0]">oO</p>
      </div>
      <div className="absolute top-[250px] left-1/2 h-10 w-56 -translate-x-1/2 rounded-[50%] bg-[#ffb15a]/20 blur-md" />
      <Plate label="oO カウンター席（雑談歓迎）" accent="#f0c27a" className="top-2.5 left-3" />
    </Zone>
  );
}

function Work({ active }: { active: boolean }) {
  return (
    <Zone x={850} y={50} w={330} h={400} accent="#8fd0ff" active={active} round="rounded-[28px]">
      <div className="work-floor absolute inset-0" />
      <div
        className="absolute inset-x-4 top-11 h-5"
        style={{
          backgroundImage:
            'repeating-linear-gradient(180deg, #314154 0 3px, #1a242f 3px 5px)',
        }}
      />
      <Workstation x={16} y={78} />
      <Workstation x={116} y={78} />
      <Workstation x={214} y={78} />
      <Plant x={248} y={250} scale={0.85} />
      <div className="absolute top-14 right-3 rounded-sm bg-[#10161d] px-2 py-1.5 text-[10px] leading-tight text-[#b7d9ee] ring-1 ring-white/10">
        しずか
        <br />
        作業中
      </div>
      <Plate label="もくもく作業席（集中モード）" accent="#8fd0ff" className="top-2 left-2" />
    </Zone>
  );
}

function Sofa({ active }: { active: boolean }) {
  return (
    <Zone x={450} y={480} w={700} h={280} accent="#ffb0b6" active={active} round="rounded-[28px]">
      <div className="absolute inset-0 bg-[#3a2a28]" />
      <div className="lounge-rug absolute inset-3 rounded-[24px]" />
      <div className="absolute top-11 left-8 h-[92px] w-[340px]">
        <div className="absolute inset-x-8 top-0 h-11 rounded-t-[24px] bg-[#7a3038]" />
        <div className="absolute top-6 left-0 h-14 w-8 rounded-l-2xl bg-[#a84b4d]" />
        <div className="absolute top-6 right-0 h-14 w-8 rounded-r-2xl bg-[#a84b4d]" />
        <div className="absolute inset-x-6 top-8 h-12 rounded-2xl bg-[#d36a66] shadow-lg">
          <span className="absolute top-2 left-3 h-8 w-8 rounded-full bg-[#f3d2ad]" />
          <span className="absolute top-2 left-14 h-8 w-8 rounded-full bg-[#f7efe4]" />
          <span className="absolute top-2 left-24 h-8 w-10 rounded-full bg-[#f0c9c4]" />
        </div>
      </div>
      <div className="absolute top-[104px] left-[168px] h-12 w-32 rounded-[50%] bg-[#e2c08a] shadow-md ring-4 ring-[#a67c45]/50">
        <span className="absolute top-3 left-6 h-4 w-4 rounded-full bg-white/85" />
        <span className="absolute top-4 left-14 h-3.5 w-6 rounded-sm bg-[#6b3a32]" />
      </div>
      <FloorLamp x={470} y={46} />
      <Whiteboard />
      <Plate label="壁打ち・相談ソファ（アイデア相談OK）" accent="#ffb0b6" className="top-2.5 left-3" />
    </Zone>
  );
}

function Whiteboard() {
  return (
    <div className="absolute top-10 right-5 h-40 w-[150px] rounded-md bg-[#f7f4ee] shadow-lg ring-1 ring-black/10">
      <div className="absolute inset-x-0 top-0 h-2 rounded-t-md bg-[#d7d2c8]" />
      <p className="px-3 pt-4 text-[13px] font-black text-[#3c4a5c]">壁打ちメモ</p>
      <div className="mt-1 space-y-1 px-3 text-[10px] text-[#5c6b7a]">
        <p>古町で朝活？</p>
        <p>oO の次の企画</p>
        <p>相談は気軽に</p>
      </div>
      <span className="absolute bottom-4 left-3 h-7 w-12 -rotate-2 bg-[#ffd0dc] shadow-sm" />
      <span className="absolute right-3 bottom-8 h-6 w-10 rotate-3 bg-[#ffe08a] shadow-sm" />
      <span className="absolute bottom-0 left-6 h-3 w-1 bg-[#8d8378]" />
      <span className="absolute right-6 bottom-0 h-3 w-1 bg-[#8d8378]" />
    </div>
  );
}

function Zone({
  x,
  y,
  w,
  h,
  accent,
  active,
  round,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  accent: string;
  active: boolean;
  round: string;
  children: ReactNode;
}) {
  return (
    <section
      className={`absolute overflow-hidden transition-shadow duration-300 ${round}`}
      style={{
        left: x,
        top: y,
        width: w,
        height: h,
        boxShadow: active
          ? `inset 0 0 0 3px ${accent}, inset 0 0 42px ${accent}55, 0 14px 30px rgba(0,0,0,0.28)`
          : `inset 0 0 0 2px ${accent}66, 0 14px 30px rgba(0,0,0,0.28)`,
      }}
    >
      {children}
    </section>
  );
}

function Plate({ label, accent, className }: { label: string; accent: string; className: string }) {
  return (
    <div
      className={`absolute z-[3] flex max-w-[calc(100%-16px)] items-center gap-2 rounded-full bg-[#141820]/80 px-3 py-1 text-[12px] font-bold text-white ring-1 ring-white/15 ${className}`}
    >
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: accent }} />
      <span className="truncate">{label}</span>
    </div>
  );
}

function SkyDots() {
  const dots = [
    [40, 18],
    [90, 36],
    [150, 14],
    [210, 40],
    [280, 20],
    [330, 34],
  ];
  return (
    <>
      {dots.map(([x, y]) => (
        <span
          key={`${x}-${y}`}
          className="absolute h-1 w-1 rounded-full bg-white/80"
          style={{ left: x, top: y }}
        />
      ))}
    </>
  );
}

function Dome() {
  return (
    <svg className="absolute inset-x-0 top-0 h-40 w-full" viewBox="0 0 400 150" preserveAspectRatio="none">
      <defs>
        <linearGradient id="arcade-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d7f3ff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#d7f3ff" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {Array.from({ length: 5 }, (_, index) => (
        <path
          key={index}
          d={`M ${6 + index * 78} 150 Q ${46 + index * 78} 8 ${86 + index * 78} 150`}
          fill="url(#arcade-glass)"
          stroke="rgba(255,255,255,0.62)"
          strokeWidth="3"
        />
      ))}
    </svg>
  );
}

function Shop({
  y,
  title,
  awning,
  window,
}: {
  y: number;
  title: string;
  awning: string;
  window: string;
}) {
  return (
    <div className="absolute left-2 w-[104px]" style={{ top: y }}>
      <div className="awning-stripes h-4 rounded-t-sm" style={{ backgroundColor: awning }} />
      <div className="flex h-[70px] flex-col items-center justify-center bg-[#1c2433]/90 ring-1 ring-white/10">
        <span className="h-7 w-12 rounded-sm" style={{ background: window }} />
        <span className="mt-1 text-[11px] tracking-[0.25em] text-white/85">{title}</span>
      </div>
      <div className="h-1.5 bg-[#2a211c]" />
    </div>
  );
}

function StreetLamp({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <div
      className="absolute"
      style={{ left: x, top: y, transform: `scale(${scale})`, transformOrigin: 'bottom center' }}
    >
      <div className="lamp-flicker absolute -top-3 left-1/2 h-10 w-10 -translate-x-1/2 rounded-full bg-[#ffc56d]/40 blur-md" />
      <div className="absolute left-1/2 h-5 w-7 -translate-x-1/2 rounded-t-full rounded-b-md bg-[#ffe1a8] shadow-[0_0_16px_#ffb347]" />
      <div className="absolute top-5 left-1/2 h-14 w-[3px] -translate-x-1/2 bg-[#2a2e38]" />
      <div className="absolute top-[70px] left-1/2 h-2 w-8 -translate-x-1/2 rounded-full bg-black/35 blur-[1px]" />
    </div>
  );
}

function Bench({ x, y }: { x: number; y: number }) {
  return (
    <div className="absolute h-8 w-[74px]" style={{ left: x, top: y }}>
      <div className="absolute inset-x-1 top-0 h-3 rounded-sm bg-[#6d4a32]" />
      <div className="absolute inset-x-0 top-3 h-2 rounded-sm bg-[#a06b45]" />
      <div className="absolute top-3 left-1 h-5 w-1.5 bg-[#2c2824]" />
      <div className="absolute top-3 right-1 h-5 w-1.5 bg-[#2c2824]" />
    </div>
  );
}

function Pendant({ x }: { x: number }) {
  return (
    <div className="absolute top-0" style={{ left: x }}>
      <div className="mx-auto h-10 w-px bg-[#e6d2aa]/80" />
      <div className="lamp-flicker -ml-2.5 h-5 w-5 rounded-full bg-[#ffe1a8] shadow-[0_0_16px_4px_rgba(255,190,90,0.75)]" />
    </div>
  );
}

function Stool({ x, y }: { x: number; y: number }) {
  return (
    <div className="absolute w-9" style={{ left: x, top: y }}>
      <div className="h-3.5 w-9 rounded-[50%] bg-[#5c3a28] shadow-md ring-1 ring-black/20" />
      <div className="mx-auto -mt-1 h-5 w-1 bg-[#d7b57a]" />
      <div className="mx-auto h-1.5 w-8 rounded-[50%] bg-[#c6a36a]/90" />
    </div>
  );
}

function Workstation({ x, y }: { x: number; y: number }) {
  return (
    <div className="absolute w-[100px]" style={{ left: x, top: y }}>
      <div className="relative z-[1] mx-auto -mb-1 h-9 w-[66px] rounded-sm bg-[#101820] shadow-[0_8px_16px_rgba(0,0,0,0.35)] ring-2 ring-[#314256]">
        <div className="screen-glow m-1.5 space-y-1">
          <div className="h-1.5 w-8 rounded-sm bg-[#7ef0c8]" />
          <div className="h-1 w-11 rounded-sm bg-white/35" />
          <div className="h-1 w-6 rounded-sm bg-white/20" />
        </div>
      </div>
      <div className="h-3.5 rounded-sm bg-gradient-to-b from-[#f4f1ea] to-[#d4cfc4]" />
      <div className="mx-2 h-4 rounded-b-sm bg-[#3e362f]" />
      <div className="mx-auto mt-1 h-7 w-10 rounded-t-md bg-[#465062]" />
      <div className="mx-auto h-2.5 w-10 rounded-b-md bg-[#2c3440]" />
    </div>
  );
}

function Plant({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <div
      className="absolute h-14 w-12"
      style={{ left: x, top: y, transform: `scale(${scale})`, transformOrigin: 'bottom center' }}
    >
      <span className="absolute bottom-3 left-0 h-6 w-4 rounded-full bg-[#2f7d4a]" />
      <span className="absolute bottom-4 left-3 h-8 w-5 rounded-full bg-[#3f9a5c]" />
      <span className="absolute bottom-3 left-7 h-5 w-4 rounded-full bg-[#256b3d]" />
      <span className="absolute bottom-0 left-2.5 h-3.5 w-7 rounded-b-md bg-[#c46a3a]" />
    </div>
  );
}

function FloorLamp({ x, y }: { x: number; y: number }) {
  return (
    <div className="absolute" style={{ left: x, top: y }}>
      <div className="lamp-flicker h-7 w-14 rounded-t-full bg-[#ffe7c2]/80 blur-[1px]" />
      <div className="mx-auto h-20 w-[3px] bg-[#2c2622]" />
      <div className="mx-auto h-1.5 w-8 rounded-full bg-black/30" />
    </div>
  );
}
