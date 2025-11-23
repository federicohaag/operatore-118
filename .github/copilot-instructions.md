# Copilot Instructions for Operatore 118

## Project Context
**Operatore 118** is a simulation game for managing emergency dispatch (118) calls in Italy. The monorepo contains:
- **`/operatore-118/`** - Modern React+TypeScript app (active development)
- **Region folders** (`/Calabria/`, `/Emilia Romagna/`, etc.) - Legacy vanilla JS implementations (read-only reference)

When running commands, **always execute from `/workspaces/operatore-118/operatore-118`**.

## Architecture Overview

### Core Simulation System
The app implements a discrete-event simulation using three coordinated utilities:
- **`VirtualClock`** (`src/utils/VirtualClock.ts`) - Provides accelerated time with play/pause/speed control
- **`Scheduler`** (`src/utils/Scheduler.ts`) - Priority queue-based event scheduler that coordinates with VirtualClock
- **`EventQueue`** (`src/utils/EventQueue.ts`) - Min-heap for deterministic event ordering by (time, sequence)
- **`CallGenerator`** (`src/utils/CallGenerator.ts`) - Generates emergency calls using the scheduler

**Critical pattern**: In `Game.tsx`, simulation infrastructure is created in `useState` initialization to survive React Strict Mode double-mounting. Scheduler disposal is delayed using `queueMicrotask()` to prevent premature cleanup.

### State Management (Redux Toolkit)
Located in `src/global-state/`:
- **Redux slices** use `createSlice` with typed hooks (`useAppSelector`, `useAppDispatch`)
- **Cross-tab sync**: `localStorageSyncMiddleware.ts` syncs state via localStorage events across browser tabs/windows
- **Slice pattern**: Export slice reducer, actions, and co-located selectors (e.g., `selectRegion`, `selectCalls`)
- **Extra reducers**: Slices handle `initStateFromStorage` and `syncStateFromOtherWindow` actions for state rehydration

Key slices:
- `localization` - Selected region and dispatch center
- `calls` - Active emergency calls queue

### Multi-Entry Architecture
Vite configured for multiple entry points (see `vite.config.ts`):
- `index.html` → `src/main.tsx` (main game)
- `hospitals.html` → `src/pages/hospitals.tsx` (standalone hospitals view)

Both share the Redux store for consistent state.

### Component Patterns
- **CSS Modules**: Import styles as `import styles from './Component.module.css'` and apply via `className={styles['class-name']}`
- **Typed hooks**: Always use `useAppSelector` and `useAppDispatch` from `src/global-state/hooks.ts`
- **Modal pattern**: `ModalContainer` wraps full-screen overlays (region selector, dialogs)
- **Tab-based UI**: `Game.tsx` manages tabs ('chiamate', 'sanitario', 'logistica') with conditional rendering

### Domain Model (`src/model/`)
- **Region** - Italian regions with `dispatchCenters`, `hospitals`, and `RegionStatus` ('available', 'unavailable', 'work-in-progress')
- **Call** - Emergency calls with `text` and `feedback` (MSB, MSA1, MSA2 codes)
- **Hospital** - With `classification`, `traumaLevel`, and `specialties`
- **Event** - Simulation events typed by `EventType` constant object

Aggregates are centralized in `src/model/aggregates.tsx` (e.g., `REGIONS` array).

## Development Workflows

### Running & Building
```bash
# Development server (port 5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Testing
Uses Vitest with jsdom environment:
```bash
# Run tests
npm test

# UI mode
npm test:ui
```

Tests live in `/tests` directory (e.g., `VirtualClock.test.ts`). Mock `performance.now()` for time-dependent tests using Vitest's `vi.stubGlobal()`.

### Linting
ESLint configured for TypeScript + React:
```bash
npm run lint
```

Config: `eslint.config.js` using flat config format with `typescript-eslint` and React plugins.

## Code Conventions

### Documentation Standards
- Use Doxygen block comments: `/** ... */`
- Start with third-person singular verb ("Returns", "Schedules", "Validates")
- Document parameters: name, type, constraints, purpose
- Specify return type and conditions for each possible value
- Note mutability: explicitly state if arguments are mutated
- List exceptions/errors and triggering conditions
- Document observable behavior, not implementation details
- Maintain consistency with existing patterns in the codebase

Example from `VirtualClock.ts`:
```typescript
/**
 * Gets the current simulation time
 * 
 * @returns Current simulation time in milliseconds
 */
now(): number { ... }
```

### TypeScript Patterns
- Use `as const` for constant objects to create union types (e.g., `RegionStatus`, `EventType`)
- Type imports with `import type` when only importing types
- Export type definitions alongside their constant objects:
  ```typescript
  export const EventType = { CALL_RECEIVED: "CALL_RECEIVED" } as const;
  export type EventType = typeof EventType[keyof typeof EventType];
  ```
- Prefer interfaces for public APIs, types for internal structures

### File Naming
- Components: `PascalCase.tsx` with co-located `PascalCase.module.css`
- Utilities: `PascalCase.ts` for classes (e.g., `VirtualClock.ts`)
- Models: lowercase with extension (e.g., `call.tsx`, `region.tsx`)
- Tests: `{ModuleName}.test.ts` in `/tests` directory

## Key Integration Points

### Adding Redux State
1. Create slice in `src/global-state/slices/`
2. Add to store in `store.ts` reducer config
3. Update `SyncState` type in `localStorageSyncMiddleware.ts`
4. Add `extraReducers` for `initStateFromStorage` and `syncStateFromOtherWindow`
5. Export typed selectors from slice file

### Scheduling Simulation Events
```typescript
scheduler.scheduleIn(delayMs, {
  type: EventType.YOUR_EVENT,
  payload: data,
  handler: (ctx, event) => {
    // Access sim time: ctx.now()
    // Dispatch Redux: ctx.dispatch(action)
  }
});
```

### React Strict Mode Compatibility
For components managing external resources (timers, subscriptions):
- Use `useState` initialization function for one-time setup
- Track mount state with `useRef` to detect true unmount vs. Strict Mode remount
- Delay cleanup with `queueMicrotask()` if needed (see `Game.tsx` scheduler disposal)

## Legacy Systems
Region-named folders (`/Calabria/`, `/Lazio/`, etc.) contain older vanilla JS implementations. These are:
- Read-only reference for feature understanding
- Not actively maintained
- Different architecture (class-based, no bundler)
- Useful for understanding domain requirements
