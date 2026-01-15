import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayers, useRecords } from '../hooks/useLocalStorage';
import { formatTime } from '../hooks/useTimer';
import { ALL_EVENTS, EVENT_NAMES, type EventType, type TimeRecord } from '../types';

interface RankingEntry {
  playerIds: string[];
  playerNames: string;
  time: number;
}

export default function Ranking() {
  const navigate = useNavigate();
  const { players, getPlayer } = usePlayers();
  const { records } = useRecords();

  const getPlayerNames = (ids: string[]) =>
    ids
      .map((id) => getPlayer(id)?.name)
      .filter(Boolean)
      .join(', ');

  const getBestByEvent = (eventType: EventType): RankingEntry[] => {
    const eventRecords = records.filter((r) => r.eventType === eventType);
    const bestByPlayer: Map<string, TimeRecord> = new Map();

    eventRecords.forEach((record) => {
      const key = [...record.playerIds].sort().join(',');
      const existing = bestByPlayer.get(key);
      if (!existing || record.time < existing.time) {
        bestByPlayer.set(key, record);
      }
    });

    return Array.from(bestByPlayer.values())
      .map((r) => ({
        playerIds: r.playerIds,
        playerNames: getPlayerNames(r.playerIds),
        time: r.time,
      }))
      .sort((a, b) => a.time - b.time);
  };

  const firstPlaceCount = useMemo(() => {
    const counts: Map<string, number> = new Map();

    ALL_EVENTS.forEach((event) => {
      const rankings = getBestByEvent(event);
      if (rankings.length > 0) {
        const winner = rankings[0];
        winner.playerIds.forEach((id) => {
          counts.set(id, (counts.get(id) || 0) + 1);
        });
      }
    });

    return counts;
  }, [records, players]);

  const overallRanking = useMemo(() => {
    return Array.from(firstPlaceCount.entries())
      .map(([id, count]) => ({
        id,
        name: getPlayer(id)?.name || '',
        count,
      }))
      .filter((p) => p.name)
      .sort((a, b) => b.count - a.count);
  }, [firstPlaceCount, getPlayer]);

  return (
    <div className="min-h-full bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <button onClick={() => navigate('/')} className="text-gray-500 mb-4">
          ← 뒤로
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">순위</h1>

        {/* Overall Ranking */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-amber-600 mb-3">
            종합 순위 (1등 개수)
          </h2>
          {overallRanking.length === 0 ? (
            <p className="text-gray-500 text-center py-4">기록이 없습니다</p>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {overallRanking.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between py-3 px-4 ${
                    index > 0 ? 'border-t border-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                        index === 0
                          ? 'bg-amber-400 text-amber-900'
                          : index === 1
                          ? 'bg-gray-300 text-gray-700'
                          : index === 2
                          ? 'bg-amber-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="font-medium">{entry.name}</span>
                  </div>
                  <span className="text-emerald-600 font-bold">
                    {entry.count}개
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Event Rankings */}
        {ALL_EVENTS.map((event) => {
          const rankings = getBestByEvent(event);
          return (
            <section key={event} className="mb-6">
              <h2 className="text-lg font-semibold text-gray-600 mb-3">
                {EVENT_NAMES[event]}
              </h2>
              {rankings.length === 0 ? (
                <p className="text-gray-400 text-sm">기록 없음</p>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {rankings.slice(0, 5).map((entry, index) => (
                    <div
                      key={entry.playerIds.join(',')}
                      className={`flex items-center justify-between py-3 px-4 ${
                        index > 0 ? 'border-t border-gray-100' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold ${
                            index === 0
                              ? 'bg-amber-400 text-amber-900'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span className="font-medium">{entry.playerNames}</span>
                      </div>
                      <span className="font-mono text-gray-600">
                        {formatTime(entry.time)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
