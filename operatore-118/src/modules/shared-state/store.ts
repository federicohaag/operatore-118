import { configureStore } from '@reduxjs/toolkit';
import { createBroadcastMiddleware } from './broadcastMiddleware';
import sharedStateReducer from './sharedStateSlice';

// Create and configure the store
export const store = configureStore({
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