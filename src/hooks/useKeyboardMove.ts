import { useEffect, useRef } from 'react';

const MOVE_KEYS = new Set([
  'arrowup',
  'arrowdown',
  'arrowleft',
  'arrowright',
  'w',
  'a',
  's',
  'd',
]);

interface Point {
  x: number;
  y: number;
}

export function useKeyboardMove(getPosition: () => Point, onMove: (x: number, y: number) => void) {
  const getRef = useRef(getPosition);
  const moveRef = useRef(onMove);

  useEffect(() => {
    getRef.current = getPosition;
    moveRef.current = onMove;
  }, [getPosition, onMove]);

  useEffect(() => {
    const pressed = new Set<string>();
    let frame = 0;
    let last = 0;
    const speed = 280;

    const isTyping = () => {
      const el = document.activeElement;
      return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (!isTyping() && pressed.size > 0) {
        let dx = 0;
        let dy = 0;
        if (pressed.has('arrowleft') || pressed.has('a')) dx -= 1;
        if (pressed.has('arrowright') || pressed.has('d')) dx += 1;
        if (pressed.has('arrowup') || pressed.has('w')) dy -= 1;
        if (pressed.has('arrowdown') || pressed.has('s')) dy += 1;
        if (dx !== 0 || dy !== 0) {
          const length = Math.hypot(dx, dy);
          const { x, y } = getRef.current();
          moveRef.current(x + (dx / length) * speed * dt, y + (dy / length) * speed * dt);
        }
      }

      if (pressed.size > 0) frame = window.requestAnimationFrame(tick);
      else frame = 0;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const key = event.key.toLowerCase();
      if (!MOVE_KEYS.has(key) || isTyping()) return;
      event.preventDefault();
      pressed.add(key);
      if (!frame) {
        last = performance.now();
        frame = window.requestAnimationFrame(tick);
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      pressed.delete(event.key.toLowerCase());
    };

    const onBlur = () => {
      pressed.clear();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
}
