import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { initStateFromStorage, syncStateFromOtherWindow } from '../localStorageSyncMiddleware';

export interface LocalizationSlice {
  region: string | null;
  dispatchCenter: string | null;
}

const initialState: LocalizationSlice = {
  region: null,
  dispatchCenter: null,
};

export const localizationSlice = createSlice({
  name: 'localization',
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
      state.region = action.payload.region;
      state.dispatchCenter = action.payload.dispatchCenter;
    });
    builder.addCase(syncStateFromOtherWindow, (state, action) => {
      // When syncing from other windows, update the entire shared state
      const newLocalization = action.payload.localization;
      state.region = newLocalization.region;
      state.dispatchCenter = newLocalization.dispatchCenter;
    });
  },
});

export const setRegion = (payload: string | null) => 
  localizationSlice.actions.setRegion(payload);

export const setDispatchCenter = (payload: string | null) => 
  localizationSlice.actions.setDispatchCenter(payload);

export const resetState = () => 
  localizationSlice.actions.resetState();

// Export selectors
export const selectRegion = (state: RootState) => state.localization.region;
export const selectDispatchCenter = (state: RootState) => state.localization.dispatchCenter;

// Export slice reducer
export const localizationReducer = localizationSlice.reducer;