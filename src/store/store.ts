import { configureStore, Middleware } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import auth from './slices/auth-slice';
import brushes from './slices/brush-slice';
import dialogs from './slices/dialog-slice';
import profile from './slices/profile-slice';
import stitches from './slices/stitch-slice';
import workspaces from './slices/workspace-slice';

const middlewares: Middleware[] = [];

if (import.meta.env.DEV) {
  middlewares.push(logger);
}

export const store = configureStore({
  reducer: {
    auth,
    profile,
    workspaces,
    brushes,
    stitches,
    dialogs,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(middlewares),
});

export type RootState = ReturnType<typeof store.getState>;
