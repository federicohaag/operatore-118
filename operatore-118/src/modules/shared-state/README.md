# Shared State Module

## Overview

The Shared State module is a sophisticated Redux-based architecture that enables **real-time cross-window/tab synchronization** for the Operatore 118 application. This system allows multiple browser windows to share and synchronize state changes automatically, creating a seamless multi-window user experience.

## 🏗️ Architecture Components

### Core Files

| File | Purpose | Key Responsibilities |
|------|---------|---------------------|
| `store.ts` | Redux Store Configuration | Central state management, middleware setup |
| `sharedStateSlice.ts` | State Definition & Actions | Redux slice with LocalizationSlice and broadcast-enabled actions |
| `broadcastMiddleware.ts` | Cross-Window Sync Logic | Intercepts actions, handles localStorage & broadcasting |
| `broadcastService.ts` | Communication Service | BroadcastChannel API wrapper for message passing |
| `hooks.ts` | React Integration | Typed hooks for components |
| `constants.ts` | Configuration Values | Storage keys and action types |
| `index.ts` | Public API | Module exports |

## 🔄 Data Flow Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Window A      │    │   Window B      │    │   Window C      │
│   (Main Game)   │    │   (Hospitals)   │    │   (Reports)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Redux Store A  │    │  Redux Store B  │    │  Redux Store C  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Broadcast       │    │ Broadcast       │    │ Broadcast       │
│ Middleware      │    │ Middleware      │    │ Middleware      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────┬───────────┴───────────┬───────────┘
                     ▼                       ▼
            ┌─────────────────┐    ┌─────────────────┐
            │  localStorage   │    │ BroadcastChannel│
            │ Persistence     │    │ Live Messaging  │
            └─────────────────┘    └─────────────────┘
```

## 🎯 How It Works

### 1. State Management
- **Redux Toolkit** manages application state with `LocalizationSlice`
- Current shared state includes:
  - `selectedRegion: string | null`
  - `selectedDispatchCenter: string | null`

### 2. Action Broadcasting System
Actions are enhanced with a `broadcast` flag:
```typescript
// Standard Redux action
{ type: 'sharedState/setRegion', payload: 'calabria' }

// Broadcast-enabled action
{ type: 'sharedState/setRegion', payload: 'calabria', broadcast: true }
```

### 3. Cross-Window Communication Pipeline

**Step 1: Action Dispatch**
```typescript
// Component dispatches action
dispatch(setRegion('calabria'))  // broadcast: true by default
```

**Step 2: Middleware Interception**
```typescript
// broadcastMiddleware.ts intercepts the action
if (action.broadcast) {
  // 1. Save to localStorage for persistence
  localStorage.setItem('operatore-118-state', JSON.stringify(newState))
  
  // 2. Broadcast to other windows
  broadcastService.broadcast({
    type: 'SYNC_STATE_FROM_OTHER_WINDOW',
    payload: { sharedState: newState.sharedState }
  })
}
```

**Step 3: Cross-Window Sync**
```typescript
// Other windows receive broadcast message
broadcastService.addListener((message) => {
  if (message.type === 'SYNC_STATE_FROM_OTHER_WINDOW') {
    // Dispatch sync action to update local Redux store
    store.dispatch(syncStateFromOtherWindow(message.payload))
  }
})
```

**Step 4: UI Re-rendering**
```typescript
// Components using useAppSelector automatically re-render
const selectedRegion = useAppSelector(selectRegion)
// UI updates across all windows ✨
```

## 📁 File Deep Dive

### `broadcastService.ts`
**Purpose**: Abstraction layer over browser's BroadcastChannel API

**Key Features**:
- Creates isolated communication channel (`operatore-118-state-sync`)
- Manages message listeners with automatic cleanup
- Handles broadcast failures gracefully
- Fallback localStorage event system (though currently not fully implemented)

```typescript
// Usage
broadcastService.broadcast({ type: 'ACTION', payload: data })
const unsubscribe = broadcastService.addListener((message) => {
  console.log('Received:', message)
})
```

### `broadcastMiddleware.ts`
**Purpose**: Redux middleware that orchestrates cross-window synchronization

**Key Logic**:
1. **State Change Detection**: Compares previous vs current state
2. **Persistence**: Always saves state changes to localStorage
3. **Selective Broadcasting**: Only broadcasts actions with `broadcast: true`
4. **Cycle Prevention**: Ignores sync actions to prevent infinite loops
5. **Listener Setup**: Registers for incoming broadcasts from other windows

**Critical Features**:
- Deep state comparison using `JSON.stringify`
- Automatic localStorage persistence
- Broadcast message format standardization

### `sharedStateSlice.ts`
**Purpose**: Redux slice with broadcast-enhanced action creators

**Enhanced Action Creators**:
```typescript
// Standard Redux action creator
sharedStateSlice.actions.setRegion(payload)

// Broadcast-enhanced action creator
export const setRegion = (payload: string | null, broadcast = true) => ({
  ...sharedStateSlice.actions.setRegion(payload),
  broadcast  // Adds broadcast flag for middleware
})
```

**Special Reducers**:
- `initStateFromStorage`: Hydrates state from localStorage on startup
- `syncStateFromOtherWindow`: Updates state from cross-window messages

## 🚀 Usage Examples

### Basic Component Integration
```typescript
import { useAppSelector, useAppDispatch } from '../shared-state/hooks'
import { setRegion, selectRegion } from '../shared-state/sharedStateSlice'

function RegionSelector() {
  const dispatch = useAppDispatch()
  const selectedRegion = useAppSelector(selectRegion)
  
  const handleRegionChange = (regionId: string) => {
    // This will broadcast to all windows automatically
    dispatch(setRegion(regionId))
  }
  
  return (
    <select value={selectedRegion || ''} onChange={e => handleRegionChange(e.target.value)}>
      <option value="calabria">Calabria</option>
      <option value="lazio">Lazio</option>
    </select>
  )
}
```

### Local-Only Updates (Rare)
```typescript
// Disable broadcasting for local-only changes
dispatch(setRegion('calabria', false))  // broadcast: false
```

### Custom Hook with Shared State
```typescript
function useRegionSelection() {
  const dispatch = useAppDispatch()
  const selectedRegion = useAppSelector(selectRegion)
  
  const selectRegion = (regionId: string) => {
    dispatch(setRegion(regionId))  // Broadcasts automatically
  }
  
  const clearSelection = () => {
    dispatch(setRegion(null))  // Also broadcasts
  }
  
  return { selectedRegion, selectRegion, clearSelection }
}
```

### Multi-Window Application Setup
```typescript
// main.tsx - Main game window
import { store } from './modules/shared-state/store'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
)

// hospitals.tsx - Hospitals window  
import { store } from './modules/shared-state/store'
import { loadInitialState } from './modules/shared-state/broadcastMiddleware'

// Load initial state from localStorage
loadInitialState(store)

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <HospitalsView />
  </Provider>
)
```

## 🔧 Configuration

### Adding New Shared State
1. **Update Interface**:
```typescript
// sharedStateSlice.ts
export interface LocalizationSlice {
  region: string | null
  dispatchCenter: string | null
  newField: string | null  // Add new field
}
```

2. **Add Reducer**:
```typescript
reducers: {
  setNewField: (state, action: PayloadAction<string | null>) => {
    state.newField = action.payload
  }
}
```

3. **Create Action Creator**:
```typescript
export const setNewField = (payload: string | null, broadcast = true) => ({
  ...sharedStateSlice.actions.setNewField(payload),
  broadcast
})
```

4. **Add Selector**:
```typescript
export const selectNewField = (state: RootState) => state.sharedState.newField
```

5. **Update Sync Reducers**:
```typescript
builder.addCase(syncStateFromOtherWindow, (state, action) => {
  const newSharedState = action.payload.sharedState
  state.region = newSharedState.region
  state.dispatchCenter = newSharedState.dispatchCenter
  state.newField = newSharedState.newField  // Add new field
})
```

## ❓ Frequently Asked Questions

### Q: Why do I need to call `loadInitialState(store)` in some windows?
**A**: This ensures that when a new window opens, it loads the latest state from localStorage. Without this, the new window would start with the default initial state instead of the current shared state.

### Q: What happens if localStorage is disabled?
**A**: The application will still work within individual windows, but state won't persist across browser sessions or sync to newly opened windows. Live cross-window sync via BroadcastChannel will still function.

### Q: Can I disable broadcasting for specific actions?
**A**: Yes, set `broadcast: false` when dispatching:
```typescript
dispatch(setRegion('calabria', false))
```

### Q: How do I debug cross-window communication issues?
**A**: 
1. Check browser console for broadcast messages
2. Inspect localStorage for `operatore-118-state` key
3. Verify BroadcastChannel support in browser
4. Use Redux DevTools to see action flow

### Q: What happens when state gets out of sync?
**A**: The next broadcast action will resync all windows. You can also manually trigger a refresh by reloading the window (it will load from localStorage).

### Q: Is there a performance impact?
**A**: Minimal. The system only broadcasts when state actually changes and only for actions marked with `broadcast: true`. State comparison uses JSON.stringify which is efficient for small state objects.

### Q: Should I always use barrel exports?
**A**: Barrel exports are beneficial for:
- **Modules with multiple files** (like shared-state)
- **Stable APIs** that don't change often
- **Reusable modules** used across the app
- **Complex modules** where you want to hide internal structure

Skip barrel exports for:
- **Single-file modules**
- **Rapidly changing APIs**
- **Internal utilities** not used elsewhere

### Q: How do I enforce barrel exports?
**A**: The project includes ESLint rules that prevent direct imports from shared-state files:
```typescript
// ✅ This works
   import { useAppSelector, setRegion } from '../shared-state'// ❌ This will cause ESLint error
import { useAppSelector } from '../shared-state/hooks'
```

## 🚨 Troubleshooting

### State Not Syncing Between Windows
1. **Check Action Broadcasting**: Ensure actions have `broadcast: true` (default)
2. **Verify Console Logs**: Look for "State broadcast for action" messages
3. **Test BroadcastChannel**: Check if browser supports BroadcastChannel API
4. **localStorage Inspection**: Verify state is being saved to localStorage

### New Windows Not Getting Latest State
1. **Confirm loadInitialState**: Ensure `loadInitialState(store)` is called
2. **Check localStorage**: Verify `operatore-118-state` exists and has correct data
3. **Timing Issues**: Make sure loadInitialState is called after store creation

### Infinite Loop/Performance Issues
1. **Check Sync Actions**: Ensure sync actions don't have `broadcast: true`
2. **State Comparison**: Verify state changes are actually meaningful
3. **Action Types**: Check for incorrect action type constants

### Browser Compatibility
- **BroadcastChannel**: Supported in all modern browsers (IE not supported)
- **localStorage**: Universally supported
- **Fallback**: Consider adding localStorage event fallback for older browsers

## 🎯 Best Practices

1. **Use Barrel Exports**: Always import from the module index, never from internal files
   ```typescript
   // ✅ Correct - Use barrel export
   import { useAppSelector, setRegion } from '../shared-state'
   
   // ❌ Wrong - Direct file imports
   import { useAppSelector } from '../shared-state/hooks'
   import { setRegion } from '../shared-state/sharedStateSlice'
   ```

2. **Default to Broadcasting**: Keep `broadcast: true` as default for user actions
3. **Selective Non-Broadcasting**: Only disable broadcasting for internal/transient state
4. **State Shape**: Keep shared state minimal and serializable
5. **Error Handling**: Always wrap localStorage operations in try-catch
6. **Testing**: Test cross-window functionality manually in development
7. **Cleanup**: Properly clean up listeners when components unmount
8. **Performance**: Avoid frequent state changes that trigger broadcasts

## 🔮 Future Enhancements

- **WebSocket Fallback**: For older browsers without BroadcastChannel
- **State Versioning**: Handle schema migrations across app updates
- **Conflict Resolution**: Advanced merging strategies for concurrent updates
- **Partial State Sync**: Only sync specific state slices instead of entire state
- **Message Queuing**: Buffer messages during window transitions
