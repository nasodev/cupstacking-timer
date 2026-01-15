import { useMemo, useCallback, useState } from 'react';
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
  const { getPlayer } = usePlayers();
  const { records, clearRecords, clearRecordsByEvent } = useRecords();
  const [confirmEvent, setConfirmEvent] = useState<EventType | 'all' | null>(null);

  const handleClearRecords = () => {
    if (confirmEvent === 'all') {
      clearRecords();
    } else if (confirmEvent) {
      clearRecordsByEvent(confirmEvent);
    }
    setConfirmEvent(null);
  };

  const getPlayerNames = useCallback(
    (ids: string[]) =>
      ids
        .map((id) => getPlayer(id)?.name)
        .filter(Boolean)
        .join(', '),
    [getPlayer]
  );

  const getBestByEvent = useCallback(
    (eventType: EventType): RankingEntry[] => {
      // Filter out guest records (empty playerIds)
      const eventRecords = records.filter(
        (r) => r.eventType === eventType && r.playerIds.length > 0
      );
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
    },
    [records, getPlayerNames]
  );

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
  }, [getBestByEvent]);

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
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-600">
                  {EVENT_NAMES[event]}
                </h2>
                {rankings.length > 0 && (
                  <button
                    onClick={() => setConfirmEvent(event)}
                    className="text-sm text-red-500"
                  >
                    초기화
                  </button>
                )}
              </div>
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

        {/* Reset All Button */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <button
            onClick={() => setConfirmEvent('all')}
            className="w-full py-3 bg-red-500 text-white rounded-xl font-medium"
          >
            전체 초기화
          </button>
        </div>

        {/* Confirm Dialog */}
        {confirmEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {confirmEvent === 'all' ? '전체 초기화' : `${EVENT_NAMES[confirmEvent]} 초기화`}
              </h3>
              <p className="text-gray-600 mb-6">
                {confirmEvent === 'all'
                  ? '모든 기록이 삭제됩니다. 계속하시겠습니까?'
                  : `${EVENT_NAMES[confirmEvent]} 기록이 삭제됩니다. 계속하시겠습니까?`}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmEvent(null)}
                  className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-xl font-medium"
                >
                  취소
                </button>
                <button
                  onClick={handleClearRecords}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
