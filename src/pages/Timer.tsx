import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTimer, formatTime } from '../hooks/useTimer';
import { usePlayers, useRecords } from '../hooks/useLocalStorage';
import { EVENT_NAMES, type EventType } from '../types';

export default function Timer() {
  const navigate = useNavigate();
  const { eventType } = useParams<{ eventType: EventType }>();
  const [searchParams] = useSearchParams();
  const playerIds = useMemo(() => {
    const param = searchParams.get('players');
    return param ? param.split(',').filter(Boolean) : [];
  }, [searchParams]);
  const touchHandledRef = useRef(false);
  const [savedRecordId, setSavedRecordId] = useState<string | null>(null);

  const { getPlayer } = usePlayers();
  const { addRecord, deleteRecord } = useRecords();
  const { time, state, toggle, reset } = useTimer();

  const playerNames =
    playerIds.length > 0
      ? playerIds
          .map((id) => getPlayer(id)?.name)
          .filter(Boolean)
          .join(', ')
      : '게스트';

  const handleTouch = useCallback(() => {
    if (state === 'stopped') return;
    // Prevent accidental stop within 1 second
    if (state === 'running' && time < 1000) return;

    const finalTime = toggle();
    if (finalTime !== null) {
      const record = addRecord(eventType as EventType, playerIds, finalTime);
      setSavedRecordId(record.id);
    }
  }, [state, time, toggle, addRecord, eventType, playerIds]);

  const handleDeleteRecord = useCallback(() => {
    if (savedRecordId) {
      deleteRecord(savedRecordId);
      setSavedRecordId(null);
    }
    reset();
  }, [savedRecordId, deleteRecord, reset]);

  const handleReset = useCallback(() => {
    setSavedRecordId(null);
    reset();
  }, [reset]);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      touchHandledRef.current = true;
      handleTouch();
      setTimeout(() => {
        touchHandledRef.current = false;
      }, 300);
    },
    [handleTouch]
  );

  const handleClick = useCallback(() => {
    if (touchHandledRef.current) return;
    handleTouch();
  }, [handleTouch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleTouch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTouch]);

  const bgColor =
    state === 'idle'
      ? 'bg-white'
      : state === 'running'
      ? 'bg-emerald-400'
      : 'bg-amber-300';

  const message =
    state === 'idle'
      ? '터치하면 시작'
      : state === 'running'
      ? '터치하면 정지'
      : '기록 저장됨!';

  return (
    <div
      className={`min-h-full ${bgColor} flex flex-col items-center justify-center no-select transition-colors duration-200`}
      onClick={handleClick}
      onTouchEnd={handleTouchEnd}
    >
      <div className="text-center pointer-events-none">
        <p className="text-2xl text-gray-700 mb-2">
          {EVENT_NAMES[eventType as EventType]}
        </p>
        <p className="text-xl text-gray-600 mb-8">{playerNames}</p>

        <p
          className="font-mono font-bold text-gray-800 mb-8"
          style={{ fontSize: 'min(20vw, 120px)' }}
        >
          {formatTime(time)}
        </p>

        <p className="text-xl text-gray-600">{message}</p>
      </div>

      {state === 'stopped' && (
        <div className="absolute bottom-8 flex flex-wrap justify-center gap-3 pointer-events-auto px-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReset();
            }}
            className="py-3 px-5 bg-emerald-500 text-white rounded-xl font-bold"
          >
            다시하기
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteRecord();
            }}
            className="py-3 px-5 bg-red-500 text-white rounded-xl font-bold"
          >
            기록삭제
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate('/');
            }}
            className="py-3 px-5 bg-gray-500 text-white rounded-xl font-bold"
          >
            메인으로
          </button>
        </div>
      )}
    </div>
  );
}
