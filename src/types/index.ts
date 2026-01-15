export type EventType = '3-3-3' | '3-6-3' | 'cycle' | 'doubles' | 'team-3-6-3';

export interface Player {
  id: string;
  name: string;
  createdAt: number;
}

export interface TimeRecord {
  id: string;
  eventType: EventType;
  playerIds: string[];
  time: number; // milliseconds
  createdAt: number;
}

export const INDIVIDUAL_EVENTS: EventType[] = ['3-3-3', '3-6-3', 'cycle'];
export const TEAM_EVENTS: EventType[] = ['doubles', 'team-3-6-3'];
export const ALL_EVENTS: EventType[] = [...INDIVIDUAL_EVENTS, ...TEAM_EVENTS];

export const EVENT_NAMES: { [key in EventType]: string } = {
  '3-3-3': '3-3-3',
  '3-6-3': '3-6-3',
  'cycle': '사이클',
  'doubles': '더블',
  'team-3-6-3': '팀 3-6-3',
};

export const EVENT_MIN_PLAYERS: { [key in EventType]: number } = {
  '3-3-3': 1,
  '3-6-3': 1,
  'cycle': 1,
  'doubles': 2,
  'team-3-6-3': 2,
};
