import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTimer, formatTime } from '../hooks/useTimer';
import { usePlayers, useRecords } from '../hooks/useLocalStorage';
import { EVENT_NAMES, type EventType } from '../types';

export default function Timer() {
  const navigate = useNavigate();
  const { eventType } = useParams<{ eventType: EventType }>();
  const [searchParams] = useSearchParams();
  const playerIds = searchParams.get('players')?.split(',') || [];

  const { getPlayer } = usePlayers();
  const { addRecord } = useRecords();
  const { time, state, toggle, reset } = useTimer();

  const playerNames = playerIds
    .map((id) => getPlayer(id)?.name)
    .filter(Boolean)
    .join(', ');

  const handleTouch = () => {
    if (state === 'stopped') return;

    const finalTime = toggle();
    if (finalTime !== null) {
      addRecord(eventType as EventType, playerIds, finalTime);
      setTimeout(() => {
        navigate(`/result/${eventType}?players=${playerIds.join(',')}&time=${finalTime}`);
      }, 1500);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleTouch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state]);

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
      onClick={handleTouch}
      onTouchStart={(e) => {
        e.preventDefault();
        handleTouch();
      }}
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
        <div className="absolute bottom-8 flex gap-4 pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              reset();
            }}
            className="py-3 px-6 bg-emerald-500 text-white rounded-xl font-bold"
          >
            다시하기
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate('/');
            }}
            className="py-3 px-6 bg-gray-500 text-white rounded-xl font-bold"
          >
            메인으로
          </button>
        </div>
      )}
    </div>
  );
}
