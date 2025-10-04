// Public API for shared-state module
// Only import from this file, not from internal files directly

// Store and types
export { store } from './store';
export type { RootState, AppDispatch } from './store';

// Hooks
export { useAppDispatch, useAppSelector } from './hooks';

// Actions and selectors
export { 
  setSelectedRegion, 
  setSelectedDispatchCenter, 
  resetState,
  selectSelectedRegion, 
  selectSelectedDispatchCenter 
} from './sharedStateSlice';

// Utilities (for advanced usage)
export { loadInitialState } from './broadcastMiddleware';