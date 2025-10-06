import { configureStore } from '@reduxjs/toolkit';
import { createBroadcastMiddleware } from '../broadcastMiddleware';
import { localizationReducer } from './slices/localization';

/**
 * Redux Store
 * 
 * The current Redux application state lives in an object called the store.
 * The store is created by passing in a reducer, and has a method called getState 
 * that returns the current state value.
 * 
 * This store is configured with:
 * - sharedStateReducer: Manages the shared state across the application
 * - broadcastMiddleware: Handles state synchronization across browser tabs/windows
 * 
 * @see https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow#store
 */
export const store = configureStore({
  reducer: {
    localization: localizationReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(createBroadcastMiddleware())
});

/**
 * RootState Type
 * 
 * Inferred type representing the complete state tree of the Redux store.
 * This type is automatically derived from the store's reducer configuration
 * and should be used for typing selectors and other state-dependent code.
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * AppDispatch Type
 * 
 * Type representing the dispatch function of this specific store instance.
 * Use this type when creating typed hooks or when dispatching actions.
 */
export type AppDispatch = typeof store.dispatch;