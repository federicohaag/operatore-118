import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { initStateFromStorage, syncStateFromOtherWindow } from '../middlewares/localStorage';
import type { Call } from '../../../model/call';

export interface CallsSlice {
  calls: Call[];
}

const initialState: CallsSlice = {
  calls: [],
};

export const callsSlice = createSlice({
  name: 'calls',
  initialState,
  reducers: {
    addCall: (state: CallsSlice, action: PayloadAction<Call>) => {
      state.calls.push(action.payload);
    },
    removeCall: (state: CallsSlice, action: PayloadAction<string>) => {
      state.calls = state.calls.filter(call => call.id !== action.payload);
    },
    clearCalls: (state) => {
      state.calls = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initStateFromStorage, (state, action) => {
      // When loading from storage, replace the calls state
      state.calls = action.payload.calls.calls;
    });
    builder.addCase(syncStateFromOtherWindow, (state, action) => {
      // When syncing from other windows, update the calls state
      state.calls = action.payload.calls.calls;
    });
  },
});

export const { addCall, removeCall, clearCalls } = callsSlice.actions;

export const callsReducer = callsSlice.reducer;

// Selectors
export const selectCalls = (state: RootState) => state.calls.calls;
