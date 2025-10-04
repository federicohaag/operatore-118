import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { initStateFromStorage } from './broadcastMiddleware';

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
  },
});

// Create action creators that include broadcast flag
export const setSelectedRegion = (payload: string | null, broadcast = false) => ({
  ...sharedStateSlice.actions.setSelectedRegion(payload),
  broadcast
});

export const setSelectedDispatchCenter = (payload: string | null, broadcast = false) => ({
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