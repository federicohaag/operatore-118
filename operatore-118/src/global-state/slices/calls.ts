import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export interface CallsSlice {
  calls: string[];
}

const initialState: CallsSlice = {
  calls: [],
};

export const callsSlice = createSlice({
  name: 'calls',
  initialState,
  reducers: {
    addCall: (state: CallsSlice, action: PayloadAction<string>) => {
      state.calls.push(action.payload);
    },
    removeCall: (state: CallsSlice, action: PayloadAction<string>) => {
      state.calls = state.calls.filter(call => call !== action.payload);
    },
    clearCalls: (state) => {
      state.calls = [];
    },
  },
});

export const { addCall, removeCall, clearCalls } = callsSlice.actions;

export const callsReducer = callsSlice.reducer;

// Selectors
export const selectCalls = (state: RootState) => state.calls.calls;
export const selectCallsCount = (state: RootState) => state.calls.calls.length;