import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Example of a custom hook that uses the shared state
export const useSelectedRegion = () => {
  const dispatch = useAppDispatch();
  const selectedRegion = useAppSelector(state => state.sharedState.selectedRegion);

  const setRegion = (region: string) => {
    dispatch({
      type: 'sharedState/setSelectedRegion',
      payload: region,
      broadcast: true // This will trigger the broadcast to other windows
    });
  };

  return {
    selectedRegion,
    setRegion
  };
};