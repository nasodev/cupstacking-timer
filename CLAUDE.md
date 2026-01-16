# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cup Stacking Timer (컵쌓기 타이머) - A Korean-language PWA for timing sport stacking (speed stacking) events. The app supports individual events (3-3-3, 3-6-3, Cycle) and team events (Doubles, Team 3-6-3).

## Commands

```bash
npm run dev      # Start Vite dev server with HMR
npm run build    # TypeScript compile + Vite production build
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

## Tech Stack

- React 19 with TypeScript
- Vite 7 with @vitejs/plugin-react
- Tailwind CSS v4 (uses `@import "tailwindcss"` syntax)
- React Router v7 (file-based pages in `src/pages/`)
- PWA via vite-plugin-pwa (auto-update, offline support)

## Architecture

### Routing Structure
Routes are defined in `App.tsx` using React Router:
- `/` → Home (event selection)
- `/select/:eventType` → PlayerSelect (choose players)
- `/timer/:eventType?players=id1,id2` → Timer (full-screen timing interface)
- `/result/:eventType` → Result (show recorded time)
- `/ranking` → Ranking (leaderboards)
- `/players` → PlayerManage (add/remove players)

### State Management
All state is persisted to localStorage via custom hooks in `src/hooks/`:
- `useLocalStorage.ts` exports `usePlayers()` and `useRecords()` for player/record CRUD
- `useTimer.ts` provides timer logic with `requestAnimationFrame` for smooth updates
- Storage keys: `cupstacking_players`, `cupstacking_records`

### Type System
`src/types/index.ts` defines:
- `EventType`: `'3-3-3' | '3-6-3' | 'cycle' | 'doubles' | 'team-3-6-3'`
- `Player`: id, name, createdAt
- `TimeRecord`: id, eventType, playerIds[], time (ms), createdAt
- Constants: `INDIVIDUAL_EVENTS`, `TEAM_EVENTS`, `EVENT_MIN_PLAYERS`

### Timer Interaction
The Timer page uses a full-screen touch/click/spacebar interface:
- Touch or click anywhere to start/stop
- Minimum 1 second before stop is allowed (prevents accidental stops)
- Records auto-save on stop
- Background color indicates state: white (idle), green (running), amber (stopped)

### PWA Configuration
Defined in `vite.config.ts`:
- Auto-update service worker
- Portrait orientation locked
- Theme color: emerald (#10b981)
