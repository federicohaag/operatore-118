import type { Middleware } from 'redux';
import { createAction } from '@reduxjs/toolkit';
import type { LocalizationSlice } from '../global-state/slices/localization';
import { STORAGE_STATE_KEY, SYNC_STATE_FROM_OTHER_WINDOW, INIT_STATE_FROM_STORAGE } from '../global-state/constants';



// Actions for state synchronization
export const initStateFromStorage = createAction<LocalizationSlice>(INIT_STATE_FROM_STORAGE);
export const syncStateFromOtherWindow = createAction<{ localization: LocalizationSlice }>(SYNC_STATE_FROM_OTHER_WINDOW);

// Function to load initial state after store creation
export const loadInitialState = (store: any) => {
  try {
    const savedState = localStorage.getItem(STORAGE_STATE_KEY);
    
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      
      if (parsedState.localization) {
        store.dispatch(initStateFromStorage(parsedState.localization));
      }
    }
  } catch (error) {
    console.error('Failed to load initial state from localStorage:', error);
  }
};

// Create the localStorage sync middleware
export const createLocalStorageSyncMiddleware = (): Middleware => {
  let currentState: any = null;

  return (store) => {
    // Set up storage event listener for cross-window synchronization
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_STATE_KEY && event.newValue) {
        try {
          const newState = JSON.parse(event.newValue);
          if (newState.localization) {
            store.dispatch(syncStateFromOtherWindow({ localization: newState.localization }));
          }
        } catch (error) {
          console.error('Failed to parse state from storage event:', error);
        }
      }
    };

    // Add storage event listener
    window.addEventListener('storage', handleStorageChange);

    // Initialize state from localStorage on first load
    loadInitialState(store);

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