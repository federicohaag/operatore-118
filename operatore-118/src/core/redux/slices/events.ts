import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { initStateFromStorage, syncStateFromOtherWindow } from '../middlewares/localStorage';
import type { Event } from '../../../model/event';

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
  },
  extraReducers: (builder) => {
    builder.addCase(initStateFromStorage, (state, action) => {
      // When loading from storage, replace the events state
      state.events = action.payload.events.events;
    });
    builder.addCase(syncStateFromOtherWindow, (state, action) => {
      // When syncing from other windows, update the events state
      state.events = action.payload.events.events;
    });
  },
});

export const { addEvent, removeEvent, clearEvents } = eventsSlice.actions;

export const eventsReducer = eventsSlice.reducer;

// Selectors
export const selectEvents = (state: RootState) => state.events.events;
