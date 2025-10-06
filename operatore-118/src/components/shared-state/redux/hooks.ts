import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * Typed Redux Hooks
 * 
 * These hooks provide type-safe alternatives to the standard React-Redux hooks.
 * They are pre-configured with the application's specific RootState and AppDispatch types,
 * enabling better TypeScript integration and developer experience.
 * 
 * @see https://redux-toolkit.js.org/tutorials/typescript#define-typed-hooks
 */

/**
 * Type-safe dispatch hook
 * 
 * Use this hook instead of the plain `useDispatch` from react-redux.
 * It ensures that only valid actions for this specific store can be dispatched
 * and provides proper TypeScript autocomplete and error checking.
 * 
 * @returns {AppDispatch} The typed dispatch function
 * 
 * @example
 * ```tsx
 * const dispatch = useAppDispatch();
 * dispatch(setRegion('calabria')); // ✅ Type-safe
 * dispatch(invalidAction()); // ❌ TypeScript error
 * ```
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

/**
 * Type-safe selector hook
 * 
 * Use this hook instead of the plain `useSelector` from react-redux.
 * It provides autocomplete for the state tree structure and ensures
 * type safety when accessing state properties.
 * 
 * @returns {TypedUseSelectorHook<RootState>} The typed selector function
 * 
 * @example
 * ```tsx
 * const region = useAppSelector(state => state.localization.region); // ✅ Autocomplete
 * const invalid = useAppSelector(state => state.nonExistent); // ❌ TypeScript error
 * ```
 */
export const useAppSelector = useSelector.withTypes<RootState>()
