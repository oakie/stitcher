import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, store } from '../store';

type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export const useAppSelector = useSelector.withTypes<RootState>();

export const useStateRef = <T>(selector: (state: RootState) => T) => {
  const state = useAppSelector(selector);
  const ref = React.useRef(state);

  React.useEffect(() => {
    ref.current = state;
  }, [state]);

  return ref;
};
