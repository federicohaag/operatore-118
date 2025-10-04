import { createSlice, type PayloadAction, createAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { initStateFromStorage } from './broadcastMiddleware';
import { SYNC_STATE_FROM_OTHER_WINDOW } from './constants';

// Create action for syncing state from other windows  
export const syncStateFromOtherWindow = createAction<{ sharedState: SharedStateSlice }>(SYNC_STATE_FROM_OTHER_WINDOW);

// Define the state type for this slice
export interface SharedStateSlice {
  selectedRegion: string | null;
  selectedDispatchCenter: string | null;
  // Add more shared state properties as needed
}

const initialState: SharedStateSlice = {
  selectedRegion: null,
  selectedDispatchCenter: null,
};

// Create the slice
export const sharedStateSlice = createSlice({
  name: 'sharedState',
  initialState,
  reducers: {
    setSelectedRegion: (state: SharedStateSlice, action: PayloadAction<string | null>) => {
      state.selectedRegion = action.payload;
    },
    setSelectedDispatchCenter: (state: SharedStateSlice, action: PayloadAction<string | null>) => {
      state.selectedDispatchCenter = action.payload;
    },
    resetState: (state) => {
      state.selectedRegion = null;
      state.selectedDispatchCenter = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initStateFromStorage, (state, action: PayloadAction<SharedStateSlice>) => {
      // When loading from storage, replace the entire state
      state.selectedRegion = action.payload.selectedRegion;
      state.selectedDispatchCenter = action.payload.selectedDispatchCenter;
    });
    builder.addCase(syncStateFromOtherWindow, (state, action) => {
      // When syncing from other windows, update the entire shared state
      const newSharedState = action.payload.sharedState;
      state.selectedRegion = newSharedState.selectedRegion;
      state.selectedDispatchCenter = newSharedState.selectedDispatchCenter;
    });
  },
});

// Create action creators that include broadcast flag
export const setSelectedRegion = (payload: string | null, broadcast = true) => ({
  ...sharedStateSlice.actions.setSelectedRegion(payload),
  broadcast
});

export const setSelectedDispatchCenter = (payload: string | null, broadcast = true) => ({
  ...sharedStateSlice.actions.setSelectedDispatchCenter(payload),
  broadcast
});

export const resetState = () => ({
  ...sharedStateSlice.actions.resetState(),
  broadcast: true
});

// Export selectors
export const selectSelectedRegion = (state: RootState) => state.sharedState.selectedRegion;
export const selectSelectedDispatchCenter = (state: RootState) => state.sharedState.selectedDispatchCenter;

// Export reducer
export default sharedStateSlice.reducer;