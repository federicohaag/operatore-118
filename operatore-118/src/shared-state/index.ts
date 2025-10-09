// Public API for shared-state module
// Only import from this file, not from internal files directly

// Store and types
export { store } from '../global-state/store';
export type { RootState, AppDispatch } from '../global-state/store';

// Hooks
export { useAppDispatch, useAppSelector } from '../global-state/hooks';

// Actions and selectors
export { 
  setRegion, 
  setDispatchCenter, 
  resetState,
  selectRegion, 
  selectDispatchCenter 
} from '../global-state/slices/localization';

// Utilities (for advanced usage)
export { loadInitialState } from '../global-state/localStorageSyncMiddleware';