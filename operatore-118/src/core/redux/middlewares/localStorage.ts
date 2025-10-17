import type { Middleware, Store, MiddlewareAPI } from 'redux';
import { createAction } from '@reduxjs/toolkit';
import type { SettingsSlice } from '../slices/settings';
import type { CallsSlice } from '../slices/calls';
import { STORAGE_STATE_KEY, SYNC_STATE_FROM_OTHER_WINDOW, INIT_STATE_FROM_STORAGE } from '../constants';

/**
 * Shape of the slice(s) that are synchronized across windows/tabs.
 *
 * @remarks
 * Only the parts of the global state that are relevant for cross-tab
 * synchronization should be included here. This keeps the payload small
 * and avoids leaking unrelated runtime data into storage events.
 */
type SyncState = {
  localization: SettingsSlice;
  calls: CallsSlice;
};

/**
 * Redux action dispatched when the app initializes and a saved state exists
 * in localStorage. The payload contains the portions of the state that the
 * application expects to restore from storage.
 *
 * @example
 * store.dispatch(initStateFromStorage({ localization: {...}, calls: {...} }));
 */
export const initStateFromStorage = createAction<SyncState>(INIT_STATE_FROM_STORAGE);

/**
 * Redux action dispatched when another window/tab writes to localStorage and
 * the current window should update its in-memory state to match. The payload
 * contains the portions of the state that are synchronized across windows.
 */
export const syncStateFromOtherWindow = createAction<SyncState>(SYNC_STATE_FROM_OTHER_WINDOW);

/**
 * Loads initial state from localStorage and dispatches an action to hydrate
 * the store if a saved state is present.
 *
 * @param store - The Redux store instance. Only `dispatch` is used by this
 * function but the entire store is accepted for future flexibility.
 *
 * @remarks
 * This method is intended to be called once after store creation to
 * rehydrate persisted state. It uses defensive checks and logs useful
 * diagnostics to aid debugging in development.
 */
export const loadInitialState = (store: Store) => {
  console.log('🔄 Loading initial state from localStorage...');
  try {
    const savedState = localStorage.getItem(STORAGE_STATE_KEY);
    // console.log('📦 Raw localStorage data:', savedState);

    if (savedState) {
      const parsedState = JSON.parse(savedState);
      console.log('📋 Parsed state:', parsedState);

      if (parsedState.localization || parsedState.calls) {
        const stateToLoad: SyncState = {
          localization: parsedState.localization || { region: null, dispatchCenter: null },
          calls: parsedState.calls || { calls: [] }
        };
        console.log('✅ Dispatching initStateFromStorage with:', stateToLoad);
        store.dispatch(initStateFromStorage(stateToLoad));
      } else {
        console.log('❌ No localization or calls property found in saved state');
      }
    } else {
      console.log('❌ No saved state found in localStorage');
    }
  } catch (error) {
    console.error('Failed to load initial state from localStorage:', error);
  }
};

/**
 * Creates a Redux middleware that keeps selected parts of the store in
 * localStorage and synchronizes them across browser windows via the
 * `storage` event.
 *
 * @returns A Redux middleware compatible with the project's store.
 *
 * @remarks
 * - The middleware listens for `storage` events and dispatches
 *   `syncStateFromOtherWindow` to update the store when another tab writes
 *   a new value for `STORAGE_STATE_KEY`.
 * - It writes the entire store to localStorage (filtered by usage) whenever
 *   the in-memory state changes, but avoids writing when the change originated
 *   from a sync action to prevent infinite loops.
 * - The implementation performs a deep-equality check by JSON stringifying
 *   the previous and next states to avoid noisy writes. This is intentionally
 *   simple and deterministic for this simulation app.
 */
export const createLocalStorageSyncMiddleware = (): Middleware => {
  let currentState: unknown = null;

  return (store: MiddlewareAPI) => {
    // Set up storage event listener for cross-window synchronization
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_STATE_KEY && event.newValue) {
        try {
          const newState = JSON.parse(event.newValue);
          if (newState.localization || newState.calls) {
            const syncState: SyncState = {
              localization: newState.localization || { region: null, dispatchCenter: null },
              calls: newState.calls || { calls: [] }
            };
            store.dispatch(syncStateFromOtherWindow(syncState));
          }
        } catch (error) {
          console.error('Failed to parse state from storage event:', error);
        }
      }
    };

    // Add storage event listener
    window.addEventListener('storage', handleStorageChange);

    return (next) => (action) => {
      const result = next(action);

      const newState = store.getState();

      // Only proceed if state has actually changed
      if (JSON.stringify(newState) !== JSON.stringify(currentState)) {
        currentState = JSON.parse(JSON.stringify(newState));

        // Don't save sync actions to prevent cycles
        const actionType = (action as { type: string }).type;
        if (actionType !== SYNC_STATE_FROM_OTHER_WINDOW && actionType !== INIT_STATE_FROM_STORAGE) {
          try {
            // Save state changes to localStorage
            // This will automatically trigger storage events in other windows
            localStorage.setItem(STORAGE_STATE_KEY, JSON.stringify(newState));
          } catch (error) {
            console.error('Failed to save state to localStorage:', error);
          }
        }
      }

      return result;
    };
  };
};