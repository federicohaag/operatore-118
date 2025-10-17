import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { initStateFromStorage, syncStateFromOtherWindow } from '../middlewares/localStorage';

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
    clearLocalization: (state) => {
      state.region = null;
      state.dispatchCenter = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initStateFromStorage, (state, action) => {
      // When loading from storage, replace the entire state
      state.region = action.payload.localization.region;
      state.dispatchCenter = action.payload.localization.dispatchCenter;
    });
    builder.addCase(syncStateFromOtherWindow, (state, action) => {
      // When syncing from other windows, update the entire shared state
      const newLocalization = action.payload.localization;
      state.region = newLocalization.region;
      state.dispatchCenter = newLocalization.dispatchCenter;
    });
  },
});

export const { setRegion, setDispatchCenter, clearLocalization } = localizationSlice.actions;

// Export selectors
export const selectRegion = (state: RootState) => state.localization.region;
export const selectDispatchCenter = (state: RootState) => state.localization.dispatchCenter;

// Export slice reducer
export const localizationReducer = localizationSlice.reducer;