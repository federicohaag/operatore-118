import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { initStateFromStorage, syncStateFromOtherWindow } from '../middlewares/localStorage';
import type { City } from '../../../model/location';

export interface SettingsSlice {
  region: string | null;
  dispatchCenter: string | null;
  cities: City[];
  ttsEnabled: boolean;
  callEmissionEnabled: boolean;
}

const initialState: SettingsSlice = {
  region: null,
  dispatchCenter: null,
  cities: [],
  ttsEnabled: false,
  callEmissionEnabled: true,
};

export const settingsSlice = createSlice({
  name: 'localization',
  initialState,
  reducers: {
    setRegion: (state: SettingsSlice, action: PayloadAction<string | null>) => {
      state.region = action.payload;
    },
    setDispatchCenter: (state: SettingsSlice, action: PayloadAction<string | null>) => {
      state.dispatchCenter = action.payload;
    },
    setCities: (state: SettingsSlice, action: PayloadAction<City[]>) => {
      state.cities = action.payload;
    },
    setTtsEnabled: (state: SettingsSlice, action: PayloadAction<boolean>) => {
      state.ttsEnabled = action.payload;
    },
    setCallEmissionEnabled: (state: SettingsSlice, action: PayloadAction<boolean>) => {
      state.callEmissionEnabled = action.payload;
    },
    clearSettings: (state) => {
      state.region = null;
      state.dispatchCenter = null;
      state.cities = [];
      state.ttsEnabled = false;
      state.callEmissionEnabled = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initStateFromStorage, (state, action) => {
      // When loading from storage, replace the entire state
      state.region = action.payload.localization.region;
      state.dispatchCenter = action.payload.localization.dispatchCenter;
      state.cities = action.payload.localization.cities || [];
      state.ttsEnabled = action.payload.localization.ttsEnabled ?? false;
      state.callEmissionEnabled = action.payload.localization.callEmissionEnabled ?? true;
      // Note: vehicles are now in game.vehicles, not here
    });
    builder.addCase(syncStateFromOtherWindow, (state, action) => {
      // When syncing from other windows, update the entire shared state
      const newLocalization = action.payload.localization;
      state.region = newLocalization.region;
      state.dispatchCenter = newLocalization.dispatchCenter;
      state.cities = newLocalization.cities || [];
      state.ttsEnabled = newLocalization.ttsEnabled ?? false;
      state.callEmissionEnabled = newLocalization.callEmissionEnabled ?? true;
      // Note: vehicles are now in game.vehicles, not here
    });
  },
});

export const { setRegion, setDispatchCenter, setCities, setTtsEnabled, setCallEmissionEnabled, clearSettings } = settingsSlice.actions;

// Export selectors
export const selectRegion = (state: RootState) => state.localization.region;
export const selectDispatchCenter = (state: RootState) => state.localization.dispatchCenter;
export const selectCities = (state: RootState) => state.localization.cities;
export const selectTtsEnabled = (state: RootState) => state.localization.ttsEnabled;
export const selectCallEmissionEnabled = (state: RootState) => state.localization.callEmissionEnabled;

// Export slice reducer
export const settingsReducer = settingsSlice.reducer;