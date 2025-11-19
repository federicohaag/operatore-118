import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { initStateFromStorage, syncStateFromOtherWindow } from '../middlewares/localStorage';
import type { City } from '../../../model/location';
import type { Vehicle } from '../../../model/vehicle';

export interface SettingsSlice {
  region: string | null;
  dispatchCenter: string | null;
  cities: City[];
  vehicles: Vehicle[];
  ttsEnabled: boolean;
  callEmissionEnabled: boolean;
}

const initialState: SettingsSlice = {
  region: null,
  dispatchCenter: null,
  cities: [],
  vehicles: [],
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
    setVehicles: (state: SettingsSlice, action: PayloadAction<Vehicle[]>) => {
      state.vehicles = action.payload;
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
      state.vehicles = [];
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
      state.vehicles = action.payload.localization.vehicles || [];
      state.ttsEnabled = action.payload.localization.ttsEnabled ?? false;
      state.callEmissionEnabled = action.payload.localization.callEmissionEnabled ?? true;
    });
    builder.addCase(syncStateFromOtherWindow, (state, action) => {
      // When syncing from other windows, update the entire shared state
      const newLocalization = action.payload.localization;
      state.region = newLocalization.region;
      state.dispatchCenter = newLocalization.dispatchCenter;
      state.cities = newLocalization.cities || [];
      state.vehicles = newLocalization.vehicles || [];
      state.ttsEnabled = newLocalization.ttsEnabled ?? false;
      state.callEmissionEnabled = newLocalization.callEmissionEnabled ?? true;
    });
  },
});

export const { setRegion, setDispatchCenter, setCities, setVehicles, setTtsEnabled, setCallEmissionEnabled, clearSettings } = settingsSlice.actions;

// Export selectors
export const selectRegion = (state: RootState) => state.localization.region;
export const selectDispatchCenter = (state: RootState) => state.localization.dispatchCenter;
export const selectCities = (state: RootState) => state.localization.cities;
export const selectVehicles = (state: RootState) => state.localization.vehicles;
export const selectTtsEnabled = (state: RootState) => state.localization.ttsEnabled;
export const selectCallEmissionEnabled = (state: RootState) => state.localization.callEmissionEnabled;

// Export slice reducer
export const settingsReducer = settingsSlice.reducer;