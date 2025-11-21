import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { initStateFromStorage, syncStateFromOtherWindow } from '../middlewares/localStorage';
import type { Call } from '../../../model/call';
import type { Event } from '../../../model/event';
import type { Mission } from '../../../model/mission';

export interface GameSlice {
  calls: Call[];
  events: Event[];
}

const initialState: GameSlice = {
  calls: [],
  events: [],
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
    removeMissionFromEvent: (state: GameSlice, action: PayloadAction<{ eventId: string; vehicleRadioName: string }>) => {
      const event = state.events.find(e => e.id === action.payload.eventId);
      if (event) {
        event.missions = event.missions.filter(m => m.vehicle.radioName !== action.payload.vehicleRadioName);
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
    });
    builder.addCase(syncStateFromOtherWindow, (state, action) => {
      // When syncing from other windows, update the game state
      state.calls = action.payload.game.calls;
      state.events = action.payload.game.events.map(event => ({
        ...event,
        missions: event.missions || []
      }));
    });
  },
});

export const { 
  addCall, 
  removeCall, 
  markCallAsProcessed, 
  clearCalls,
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
