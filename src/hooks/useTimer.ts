import { useState, useRef, useCallback, useEffect } from 'react';

export type TimerState = 'idle' | 'running' | 'stopped';

export function useTimer() {
  const [time, setTime] = useState(0);
  const [state, setState] = useState<TimerState>('idle');
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (state !== 'running') return;

    const updateTime = () => {
      const elapsed = Date.now() - startTimeRef.current;
      setTime(elapsed);
      rafRef.current = requestAnimationFrame(updateTime);
    };

    rafRef.current = requestAnimationFrame(updateTime);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [state]);

  const start = useCallback(() => {
    startTimeRef.current = Date.now();
    setState('running');
  }, []);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const finalTime = Date.now() - startTimeRef.current;
    setTime(finalTime);
    setState('stopped');
    return finalTime;
  }, []);

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setTime(0);
    setState('idle');
  }, []);

  const toggle = useCallback(() => {
    if (state === 'idle') {
      start();
      return null;
    } else if (state === 'running') {
      return stop();
    }
    return null;
  }, [state, start, stop]);

  return { time, state, start, stop, reset, toggle };
}

export function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const milliseconds = ms % 1000;
  return `${seconds}.${milliseconds.toString().padStart(3, '0')}`;
}
