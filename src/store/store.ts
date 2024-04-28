import { configureStore } from '@reduxjs/toolkit';
import auth from './slices/auth-slice';
import brushes from './slices/brush-slice';
import dialogs from './slices/dialog-slice';
import profile from './slices/profile-slice';
import stitches from './slices/stitch-slice';
import workspaces from './slices/workspace-slice';

export const store = configureStore({
  reducer: {
    auth,
    profile,
    workspaces,
    brushes,
    stitches,
    dialogs,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
