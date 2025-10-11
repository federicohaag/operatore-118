import type { Middleware } from 'redux';
import { createAction } from '@reduxjs/toolkit';
import type { LocalizationSlice } from './slices/localization';
import type { CallsSlice } from './slices/calls';
import { STORAGE_STATE_KEY, SYNC_STATE_FROM_OTHER_WINDOW, INIT_STATE_FROM_STORAGE } from './constants';

type SyncState = {
  localization: LocalizationSlice;
  calls: CallsSlice;
};

// Actions for state synchronization
export const initStateFromStorage = createAction<SyncState>(INIT_STATE_FROM_STORAGE);
export const syncStateFromOtherWindow = createAction<SyncState>(SYNC_STATE_FROM_OTHER_WINDOW);

// Function to load initial state after store creation
export const loadInitialState = (store: any) => {
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

// Create the localStorage sync middleware
export const createLocalStorageSyncMiddleware = (): Middleware => {
  let currentState: any = null;

  return (store) => {
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