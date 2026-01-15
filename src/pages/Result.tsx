import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { formatTime } from '../hooks/useTimer';
import { usePlayers, useRecords } from '../hooks/useLocalStorage';
import { EVENT_NAMES, type EventType } from '../types';

export default function Result() {
  const navigate = useNavigate();
  const { eventType } = useParams<{ eventType: EventType }>();
  const [searchParams] = useSearchParams();
  const playerIdsParam = searchParams.get('players');
  const playerIds = playerIdsParam ? playerIdsParam.split(',').filter(Boolean) : [];
  const time = parseInt(searchParams.get('time') || '0', 10);
  const isGuest = playerIds.length === 0;

  const { getPlayer } = usePlayers();
  const { getBestRecord } = useRecords();

  const playerNames = isGuest
    ? '게스트'
    : playerIds
        .map((id) => getPlayer(id)?.name)
        .filter(Boolean)
        .join(', ');

  const bestRecord = isGuest ? undefined : getBestRecord(eventType as EventType, playerIds);
  const isNewBest = !isGuest && bestRecord?.time === time;

  return (
    <div className="min-h-full bg-amber-50 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <p className="text-2xl text-gray-700 mb-2">
          {EVENT_NAMES[eventType as EventType]}
        </p>
        <p className="text-xl text-gray-600 mb-6">{playerNames}</p>

        {isNewBest && (
          <div className="mb-4 py-2 px-4 bg-amber-400 text-amber-900 rounded-full font-bold inline-block">
            최고 기록!
          </div>
        )}

        <p
          className="font-mono font-bold text-gray-800 mb-4"
          style={{ fontSize: 'min(15vw, 80px)' }}
        >
          {formatTime(time)}
        </p>

        {bestRecord && !isNewBest && (
          <p className="text-gray-600 mb-8">
            최고 기록: <span className="font-mono">{formatTime(bestRecord.time)}</span>
          </p>
        )}

        <div className="flex gap-4 justify-center mt-8">
          <button
            onClick={() =>
              navigate(`/timer/${eventType}?players=${playerIds.join(',')}`)
            }
            className="py-3 px-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-colors"
          >
            다시하기
          </button>
          <button
            onClick={() => navigate('/')}
            className="py-3 px-6 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-bold transition-colors"
          >
            메인으로
          </button>
        </div>
      </div>
    </div>
  );
}
