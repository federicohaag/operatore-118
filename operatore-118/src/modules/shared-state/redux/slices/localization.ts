import { createSlice, type PayloadAction, createAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { initStateFromStorage } from '../../broadcastMiddleware';
import { SYNC_STATE_FROM_OTHER_WINDOW } from '../../constants';

// Create action for syncing state from other windows  
export const syncStateFromOtherWindow = createAction<{ sharedState: LocalizationSlice }>(SYNC_STATE_FROM_OTHER_WINDOW);

// Define the localization state type for this slice
export interface LocalizationSlice {
  region: string | null;
  dispatchCenter: string | null;
  // Add more localization properties as needed
}

const initialState: LocalizationSlice = {
  region: null,
  dispatchCenter: null,
};

// Create the slice
export const localizationSlice = createSlice({
  name: 'sharedState',
  initialState,
  reducers: {
    setRegion: (state: LocalizationSlice, action: PayloadAction<string | null>) => {
      state.region = action.payload;
    },
    setDispatchCenter: (state: LocalizationSlice, action: PayloadAction<string | null>) => {
      state.dispatchCenter = action.payload;
    },
    resetState: (state) => {
      state.region = null;
      state.dispatchCenter = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initStateFromStorage, (state, action: PayloadAction<LocalizationSlice>) => {
      // When loading from storage, replace the entire state
      console.log('🔄 initStateFromStorage reducer called with:', action.payload);
      state.region = action.payload.region;
      state.dispatchCenter = action.payload.dispatchCenter;
      console.log('✅ State updated to:', { region: state.region, dispatchCenter: state.dispatchCenter });
    });
    builder.addCase(syncStateFromOtherWindow, (state, action) => {
      // When syncing from other windows, update the entire shared state
      const newSharedState = action.payload.sharedState;
      state.region = newSharedState.region;
      state.dispatchCenter = newSharedState.dispatchCenter;
    });
  },
});

export const setRegion = (payload: string | null) => ({
  ...localizationSlice.actions.setRegion(payload),
  broadcast: false
});

export const setDispatchCenter = (payload: string | null) => ({
  ...localizationSlice.actions.setDispatchCenter(payload),
  broadcast: true
});

export const resetState = () => ({
  ...localizationSlice.actions.resetState(),
  broadcast: true
});

// Export selectors
export const selectRegion = (state: RootState) => state.localization.region;
export const selectDispatchCenter = (state: RootState) => state.localization.dispatchCenter;

// Export slice reducer
export const localizationReducer = localizationSlice.reducer;