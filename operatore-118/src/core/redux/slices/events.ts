import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { initStateFromStorage, syncStateFromOtherWindow } from '../middlewares/localStorage';
import type { Event } from '../../../model/event';
import type { Mission } from '../../../model/mission';

export interface EventsSlice {
  events: Event[];
}

const initialState: EventsSlice = {
  events: [],
};

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    addEvent: (state: EventsSlice, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
    },
    removeEvent: (state: EventsSlice, action: PayloadAction<string>) => {
      state.events = state.events.filter(event => event.id !== action.payload);
    },
    clearEvents: (state) => {
      state.events = [];
    },
    addMissionToEvent: (state: EventsSlice, action: PayloadAction<{ eventId: string; mission: Mission }>) => {
      const event = state.events.find(e => e.id === action.payload.eventId);
      if (event) {
        event.missions.push(action.payload.mission);
      }
    },
    removeMissionFromEvent: (state: EventsSlice, action: PayloadAction<{ eventId: string; vehicleRadioName: string }>) => {
      const event = state.events.find(e => e.id === action.payload.eventId);
      if (event) {
        event.missions = event.missions.filter(m => m.vehicle.radioName !== action.payload.vehicleRadioName);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initStateFromStorage, (state, action) => {
      // When loading from storage, replace the events state and ensure missions array exists
      state.events = action.payload.events.events.map(event => ({
        ...event,
        missions: event.missions || []
      }));
    });
    builder.addCase(syncStateFromOtherWindow, (state, action) => {
      // When syncing from other windows, update the events state and ensure missions array exists
      state.events = action.payload.events.events.map(event => ({
        ...event,
        missions: event.missions || []
      }));
    });
  },
});

export const { addEvent, removeEvent, clearEvents, addMissionToEvent, removeMissionFromEvent } = eventsSlice.actions;

export const eventsReducer = eventsSlice.reducer;

// Selectors
export const selectEvents = (state: RootState) => state.events.events;
