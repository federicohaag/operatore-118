import type { Middleware, Action } from 'redux';
import { createAction } from '@reduxjs/toolkit';
import type { LocalizationSlice } from '../global-state/slices/localization';
import { STORAGE_STATE_KEY, SYNC_STATE_FROM_OTHER_WINDOW, INIT_STATE_FROM_STORAGE } from './constants';

// Custom action type for actions that should be broadcast
interface BroadcastAction extends Action {
  payload?: any;
}

// Actions for state synchronization
export const initStateFromStorage = createAction<LocalizationSlice>(INIT_STATE_FROM_STORAGE);
export const syncStateFromOtherWindow = createAction<{ localization: LocalizationSlice }>(SYNC_STATE_FROM_OTHER_WINDOW);

// Function to load initial state after store creation
export const loadInitialState = (store: any) => {
  console.log('🔄 loadInitialState called');
  
  // Debug: List all localStorage keys
  console.log('🗂️ All localStorage keys:', Object.keys(localStorage));
  
  try {
    const savedState = localStorage.getItem(STORAGE_STATE_KEY);
    console.log('📦 Raw localStorage data:', savedState);
    console.log('🔑 Storage key used:', STORAGE_STATE_KEY);
    
    // Also check if there's data under a different key
    const alternativeData = localStorage.getItem('operatore-118-shared-state');
    if (alternativeData) {
      console.log('🔍 Found data under alternative key:', alternativeData);
    }
    
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      console.log('📋 Parsed state:', parsedState);
      
      if (parsedState.localization) {
        console.log('✅ Dispatching initStateFromStorage with:', parsedState.localization);
        store.dispatch(initStateFromStorage(parsedState.localization));
      } else {
        console.log('❌ No localization property found in saved state');
      }
    } else {
      console.log('❌ No saved state found in localStorage');
    }
  } catch (error) {
    console.error('Failed to load initial state from localStorage:', error);
  }
};

// Create the broadcast middleware
export const createBroadcastMiddleware = (): Middleware => {
  let currentState: any = null;
  let isInitialized = false;

  return (store) => {
    console.log('🏗️ Broadcast middleware setup started');
    
    // Set up storage event listener for cross-window synchronization
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_STATE_KEY && event.newValue) {
        try {
          const newState = JSON.parse(event.newValue);
          if (newState.localization) {
            console.log('📡 Storage event detected, syncing state from other window:', newState.localization);
            store.dispatch(syncStateFromOtherWindow({ localization: newState.localization }));
          }
        } catch (error) {
          console.error('Failed to parse state from storage event:', error);
        }
      }
    };

    // Add storage event listener
    window.addEventListener('storage', handleStorageChange);

    // Try to initialize after a brief delay to ensure store is ready
    setTimeout(() => {
      if (!isInitialized) {
        console.log('⏰ Timeout initialization fallback triggered');
        loadInitialState(store);
        isInitialized = true;
      }
    }, 0);

    return (next) => (action) => {
      const result = next(action);
      
      // Auto-load initial state on first action (when store is fully ready)
      // But skip if this IS the initialization action to prevent infinite loop
      const typedAction = action as BroadcastAction;
      if (!isInitialized && typedAction.type !== INIT_STATE_FROM_STORAGE) {
        console.log('🚀 First action detected, initializing from localStorage. Action:', typedAction.type);
        loadInitialState(store);
        isInitialized = true;
      }
      
      const newState = store.getState();

      // Only proceed if state has actually changed
      if (JSON.stringify(newState) !== JSON.stringify(currentState)) {
        currentState = JSON.parse(JSON.stringify(newState));

        // Don't save sync actions to prevent cycles
        const typedAction = action as BroadcastAction;
        if (typedAction.type !== SYNC_STATE_FROM_OTHER_WINDOW && typedAction.type !== INIT_STATE_FROM_STORAGE) {
          try {
            // Always save state changes to localStorage
            // This will automatically trigger storage events in other windows
            localStorage.setItem(STORAGE_STATE_KEY, JSON.stringify(newState));
            console.log('💾 State saved to localStorage:', newState);
          } catch (error) {
            console.error('Failed to save state to localStorage:', error);
          }
        }
      }

      return result;
    };
  };
};