import type { Middleware, Action } from 'redux';
import { createAction } from '@reduxjs/toolkit';
import { broadcastService } from './broadcastService';
import type { SharedStateSlice } from './sharedStateSlice';
import { syncStateFromOtherWindow } from './sharedStateSlice';
import { STORAGE_STATE_KEY, SYNC_STATE_FROM_OTHER_WINDOW, INIT_STATE_FROM_STORAGE } from './constants';

// Custom action type for actions that should be broadcast
interface BroadcastAction extends Action {
  broadcast?: boolean;
  payload?: any;
}

export const initStateFromStorage = createAction<SharedStateSlice>(INIT_STATE_FROM_STORAGE);

// Function to load initial state after store creation
export const loadInitialState = (store: any) => {
  try {
    const savedState = localStorage.getItem(STORAGE_STATE_KEY);
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      if (parsedState.sharedState) {
        store.dispatch(initStateFromStorage(parsedState.sharedState));
      }
    }
  } catch (error) {
    console.error('Failed to load initial state from localStorage:', error);
  }
};

// Create the broadcast middleware
export const createBroadcastMiddleware = (): Middleware => {
  let currentState: any = null;

  return (store) => {
    // Set up broadcast listener when middleware is created
    broadcastService.addListener((message) => {
      if (message.type === SYNC_STATE_FROM_OTHER_WINDOW) {
        store.dispatch(syncStateFromOtherWindow(message.payload));
      }
    });

    return (next) => (action) => {
      const result = next(action);
      const newState = store.getState();

      // Only proceed if state has actually changed
      if (JSON.stringify(newState) !== JSON.stringify(currentState)) {
        currentState = JSON.parse(JSON.stringify(newState));

        // Don't save sync actions to prevent cycles
        const typedAction = action as BroadcastAction;
        if (typedAction.type !== SYNC_STATE_FROM_OTHER_WINDOW && typedAction.type !== INIT_STATE_FROM_STORAGE) {
          try {
            // Always save state changes to localStorage
            localStorage.setItem(STORAGE_STATE_KEY, JSON.stringify(newState));
            console.log('State saved:', newState);

            // Only broadcast if action is marked for broadcast
            if (typedAction.broadcast) {
              broadcastService.broadcast({
                type: SYNC_STATE_FROM_OTHER_WINDOW,
                payload: { sharedState: newState.sharedState }
              });
              console.log('State broadcast for action:', typedAction.type);
            }
          } catch (error) {
            console.error('Failed to handle state update:', error);
          }
        }
      }

      return result;
    };
  };
};