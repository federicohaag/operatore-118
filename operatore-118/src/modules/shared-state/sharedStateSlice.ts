import { createSlice, type PayloadAction, createAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { initStateFromStorage } from './broadcastMiddleware';
import { SYNC_STATE_FROM_OTHER_WINDOW } from './constants';

// Create action for syncing state from other windows  
export const syncStateFromOtherWindow = createAction<{ sharedState: SharedStateSlice }>(SYNC_STATE_FROM_OTHER_WINDOW);

// Define the state type for this slice
export interface SharedStateSlice {
  region: string | null;
  dispatchCenter: string | null;
  // Add more shared state properties as needed
}

const initialState: SharedStateSlice = {
  region: null,
  dispatchCenter: null,
};

// Create the slice
export const sharedStateSlice = createSlice({
  name: 'sharedState',
  initialState,
  reducers: {
    setRegion: (state: SharedStateSlice, action: PayloadAction<string | null>) => {
      state.region = action.payload;
    },
    setDispatchCenter: (state: SharedStateSlice, action: PayloadAction<string | null>) => {
      state.dispatchCenter = action.payload;
    },
    resetState: (state) => {
      state.region = null;
      state.dispatchCenter = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initStateFromStorage, (state, action: PayloadAction<SharedStateSlice>) => {
      // When loading from storage, replace the entire state
      state.region = action.payload.region;
      state.dispatchCenter = action.payload.dispatchCenter;
    });
    builder.addCase(syncStateFromOtherWindow, (state, action) => {
      // When syncing from other windows, update the entire shared state
      const newSharedState = action.payload.sharedState;
      state.region = newSharedState.region;
      state.dispatchCenter = newSharedState.dispatchCenter;
    });
  },
});

// Create action creators that include broadcast flag
export const setRegion = (payload: string | null, broadcast = true) => ({
  ...sharedStateSlice.actions.setRegion(payload),
  broadcast
});

export const setDispatchCenter = (payload: string | null, broadcast = true) => ({
  ...sharedStateSlice.actions.setDispatchCenter(payload),
  broadcast
});

export const resetState = () => ({
  ...sharedStateSlice.actions.resetState(),
  broadcast: true
});

// Export selectors
export const selectRegion = (state: RootState) => state.sharedState.region;
export const selectDispatchCenter = (state: RootState) => state.sharedState.dispatchCenter;

// Export reducer with explicit name
export const sharedStateReducer = sharedStateSlice.reducer;