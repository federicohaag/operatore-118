import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

// Define the state type for this slice
interface SharedStateSlice {
  selectedRegion: string | null;
  selectedDispatchCenter: string | null;
  // Add more shared state properties as needed
}

const initialState: SharedStateSlice = {
  selectedRegion: null,
  selectedDispatchCenter: null,
};

// Create the slice
export const sharedStateSlice = createSlice({
  name: 'sharedState',
  initialState,
  reducers: {
    setSelectedRegion: (state: SharedStateSlice, action: PayloadAction<string | null>) => {
      state.selectedRegion = action.payload;
    },
    setSelectedDispatchCenter: (state: SharedStateSlice, action: PayloadAction<string | null>) => {
      state.selectedDispatchCenter = action.payload;
    },
    // Add more reducers as needed
  },
});

// Export actions
export const { setSelectedRegion, setSelectedDispatchCenter } = sharedStateSlice.actions;

// Export selectors
export const selectSelectedRegion = (state: RootState) => state.sharedState.selectedRegion;
export const selectSelectedDispatchCenter = (state: RootState) => state.sharedState.selectedDispatchCenter;

// Export reducer
export default sharedStateSlice.reducer;