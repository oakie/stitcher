import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import auth from './slices/auth-slice';
import brushes from './slices/brush-slice';
import stitches from './slices/stitch-slice';

export const store = configureStore({
  reducer: {
    auth,
    brushes,
    stitches,
  },
});

export type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
