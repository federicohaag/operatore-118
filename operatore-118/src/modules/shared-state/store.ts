import { configureStore } from '@reduxjs/toolkit';
import { createBroadcastMiddleware, loadInitialState } from './broadcastMiddleware';
import sharedStateReducer from './sharedStateSlice';

// Create and configure the store
const store = configureStore({
  reducer: {
    sharedState: sharedStateReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(createBroadcastMiddleware())
});

// Infer the `RootState` type from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Export dispatch type
export type AppDispatch = typeof store.dispatch;

// Initialize the state from localStorage after store creation
loadInitialState(store);

export { store };