import type { Middleware } from 'redux';
import { broadcastService } from './broadcastService';

// Action types for state synchronization
export const SYNC_STATE_FROM_OTHER_WINDOW = 'shared-state/SYNC_STATE_FROM_OTHER_WINDOW';
export const INIT_STATE_FROM_STORAGE = 'shared-state/INIT_STATE_FROM_STORAGE';

// Custom action type for actions that should be broadcast
interface BroadcastAction {
  broadcast?: boolean;
}

const STORAGE_STATE_KEY = 'operatore-118-state';

export const createBroadcastMiddleware = (): Middleware => {
  return store => {
    // Try to load initial state from localStorage
    try {
      const savedState = localStorage.getItem(STORAGE_STATE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        store.dispatch({
          type: INIT_STATE_FROM_STORAGE,
          payload: parsedState
        });
      }
    } catch (error) {
      console.error('Failed to load initial state from localStorage:', error);
    }

    // Subscribe to broadcast messages from other windows
    broadcastService.addListener((message) => {
      if (message.type === SYNC_STATE_FROM_OTHER_WINDOW) {
        store.dispatch(message);
      }
    });

    return next => action => {
      const result = next(action);

      // If the action should be broadcast, send it to other windows
      if ((action as BroadcastAction).broadcast) {
        const state = store.getState();
        // Save to localStorage and broadcast
        try {
          localStorage.setItem(STORAGE_STATE_KEY, JSON.stringify(state));
          broadcastService.broadcast({
            type: SYNC_STATE_FROM_OTHER_WINDOW,
            payload: state
          });
        } catch (error) {
          console.error('Failed to sync state:', error);
        }
      }

      return result;
    };
  };
};