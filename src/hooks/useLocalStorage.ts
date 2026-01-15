import { useState, useEffect, useCallback } from 'react';
import type { Player, TimeRecord } from '../types';

const PLAYERS_KEY = 'cupstacking_players';
const RECORDS_KEY = 'cupstacking_records';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>(() => {
    const stored = localStorage.getItem(PLAYERS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
  }, [players]);

  const addPlayer = useCallback((name: string): Player => {
    const newPlayer: Player = {
      id: generateId(),
      name: name.trim(),
      createdAt: Date.now(),
    };
    setPlayers((prev) => [...prev, newPlayer]);
    return newPlayer;
  }, []);

  const removePlayer = useCallback((id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const getPlayer = useCallback(
    (id: string) => players.find((p) => p.id === id),
    [players]
  );

  return { players, addPlayer, removePlayer, getPlayer };
}

export function useRecords() {
  const [records, setRecords] = useState<TimeRecord[]>(() => {
    const stored = localStorage.getItem(RECORDS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  }, [records]);

  const addRecord = useCallback(
    (eventType: TimeRecord['eventType'], playerIds: string[], time: number): TimeRecord => {
      const newRecord: TimeRecord = {
        id: generateId(),
        eventType,
        playerIds,
        time,
        createdAt: Date.now(),
      };
      setRecords((prev) => [...prev, newRecord]);
      return newRecord;
    },
    []
  );

  const getRecordsByEvent = useCallback(
    (eventType: TimeRecord['eventType']) =>
      records.filter((r) => r.eventType === eventType),
    [records]
  );

  const getBestRecord = useCallback(
    (eventType: TimeRecord['eventType'], playerIds: string[]) => {
      const key = [...playerIds].sort().join(',');
      return records
        .filter(
          (r) =>
            r.eventType === eventType &&
            [...r.playerIds].sort().join(',') === key
        )
        .sort((a, b) => a.time - b.time)[0];
    },
    [records]
  );

  return { records, addRecord, getRecordsByEvent, getBestRecord };
}
