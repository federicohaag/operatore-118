import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { initStateFromStorage, syncStateFromOtherWindow } from '../middlewares/localStorage';
import type { Call } from '../../../model/call';
import type { Event } from '../../../model/event';
import type { Mission } from '../../../model/mission';
import type { Vehicle } from '../../../model/vehicle';

export interface GameSlice {
  calls: Call[];
  events: Event[];
  vehicles: Vehicle[];
}

const initialState: GameSlice = {
  calls: [],
  events: [],
  vehicles: [],
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // Call actions
    addCall: (state: GameSlice, action: PayloadAction<Call>) => {
      state.calls.push(action.payload);
    },
    removeCall: (state: GameSlice, action: PayloadAction<string>) => {
      state.calls = state.calls.filter(call => call.id !== action.payload);
    },
    markCallAsProcessed: (state: GameSlice, action: PayloadAction<string>) => {
      const call = state.calls.find(call => call.id === action.payload);
      if (call) {
        call.processed = true;
      }
    },
    clearCalls: (state) => {
      state.calls = [];
    },
    // Vehicle actions
    setVehicles: (state: GameSlice, action: PayloadAction<Vehicle[]>) => {
      state.vehicles = action.payload;
    },
    updateVehicleLocation: (state: GameSlice, action: PayloadAction<{ vehicleId: string; location: { latitude: number; longitude: number } }>) => {
      const vehicle = state.vehicles.find(v => v.id === action.payload.vehicleId);
      if (vehicle) {
        vehicle.currentLocation = action.payload.location;
      }
    },
    // Event actions
    addEvent: (state: GameSlice, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
    },
    removeEvent: (state: GameSlice, action: PayloadAction<string>) => {
      state.events = state.events.filter(event => event.id !== action.payload);
    },
    clearEvents: (state) => {
      state.events = [];
    },
    addMissionToEvent: (state: GameSlice, action: PayloadAction<{ eventId: string; mission: Mission }>) => {
      const event = state.events.find(e => e.id === action.payload.eventId);
      if (event) {
        event.missions.push(action.payload.mission);
      }
    },
    removeMissionFromEvent: (state: GameSlice, action: PayloadAction<{ eventId: string; vehicleId: string }>) => {
      const event = state.events.find(e => e.id === action.payload.eventId);
      if (event) {
        event.missions = event.missions.filter(m => m.vehicleId !== action.payload.vehicleId);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initStateFromStorage, (state, action) => {
      // When loading from storage, replace the game state
      state.calls = action.payload.game.calls;
      state.events = action.payload.game.events.map(event => ({
        ...event,
        missions: event.missions || []
      }));
      state.vehicles = action.payload.game.vehicles || [];
    });
    builder.addCase(syncStateFromOtherWindow, (state, action) => {
      // When syncing from other windows, update the game state
      state.calls = action.payload.game.calls;
      state.events = action.payload.game.events.map(event => ({
        ...event,
        missions: event.missions || []
      }));
      state.vehicles = action.payload.game.vehicles || [];
    });
  },
});

export const { 
  addCall, 
  removeCall, 
  markCallAsProcessed, 
  clearCalls,
  setVehicles,
  updateVehicleLocation,
  addEvent,
  removeEvent,
  clearEvents,
  addMissionToEvent,
  removeMissionFromEvent
} = gameSlice.actions;

export const gameReducer = gameSlice.reducer;

// Selectors
export const selectAllCalls = (state: RootState) => state.game.calls;

export const selectCalls = createSelector(
  [selectAllCalls],
  (calls) => calls.filter(call => !call.processed)
);

export const selectCallById = (callId: string) => (state: RootState) => 
  state.game.calls.find(call => call.id === callId);

export const selectEvents = (state: RootState) => state.game.events;

export const selectVehicles = (state: RootState) => state.game.vehicles;

export const selectVehicleById = (vehicleId: string) => (state: RootState) =>
  state.game.vehicles.find(vehicle => vehicle.id === vehicleId);
