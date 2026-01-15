import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePlayers } from '../hooks/useLocalStorage';
import { EVENT_NAMES, EVENT_MIN_PLAYERS, type EventType } from '../types';

export default function PlayerSelect() {
  const navigate = useNavigate();
  const { eventType } = useParams<{ eventType: EventType }>();
  const { players } = usePlayers();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const minPlayers = EVENT_MIN_PLAYERS[eventType as EventType] || 1;
  const isTeamEvent = minPlayers > 1;

  const togglePlayer = (id: string) => {
    if (isTeamEvent) {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
      );
    } else {
      setSelectedIds([id]);
    }
  };

  const handleStart = () => {
    if (selectedIds.length >= minPlayers) {
      const playerIdsParam = selectedIds.join(',');
      navigate(`/timer/${eventType}?players=${playerIdsParam}`);
    }
  };

  const canStart = selectedIds.length >= minPlayers;

  return (
    <div className="min-h-full bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => navigate('/')}
          className="text-gray-500 mb-4"
        >
          ← 뒤로
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {EVENT_NAMES[eventType as EventType]}
        </h1>
        <p className="text-gray-600 mb-6">
          {isTeamEvent
            ? `${minPlayers}명 이상 선택하세요`
            : '선수를 선택하세요'}
        </p>

        {players.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">등록된 선수가 없습니다</p>
            <button
              onClick={() => navigate('/players')}
              className="py-2 px-4 bg-emerald-500 text-white rounded-lg"
            >
              선수 등록하기
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-2 mb-6">
              {players.map((player) => (
                <button
                  key={player.id}
                  onClick={() => togglePlayer(player.id)}
                  className={`w-full py-3 px-4 rounded-xl text-left font-medium transition-colors ${
                    selectedIds.includes(player.id)
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  {player.name}
                  {selectedIds.includes(player.id) && (
                    <span className="float-right">✓</span>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={handleStart}
              disabled={!canStart}
              className={`w-full py-4 rounded-xl text-xl font-bold transition-colors ${
                canStart
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              시작하기
            </button>
          </>
        )}
      </div>
    </div>
  );
}
