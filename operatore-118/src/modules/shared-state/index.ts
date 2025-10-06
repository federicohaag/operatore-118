// Public API for shared-state module
// Only import from this file, not from internal files directly

// Store and types
export { store } from './redux/store';
export type { RootState, AppDispatch } from './redux/store';

// Hooks
export { useAppDispatch, useAppSelector } from './redux/hooks';

// Actions and selectors
export { 
  setRegion, 
  setDispatchCenter, 
  resetState,
  selectRegion, 
  selectDispatchCenter 
} from './redux/slices/localization';

// Utilities (for advanced usage)
export { loadInitialState } from './broadcastMiddleware';