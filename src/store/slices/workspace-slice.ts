import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Workspace } from '@shared/types';
import { WorkspaceState } from '../types';

const initial = (): WorkspaceState => {
  return {
    active: null,
    byId: {},
  };
};

export const slice = createSlice({
  name: 'workspaces',
  initialState: initial(),
  reducers: {
    create: (state, action: PayloadAction<Workspace[]>) => {
      action.payload.forEach((x) => (state.byId[x.id] = x));
    },
    update: (state, action: PayloadAction<Workspace[]>) => {
      action.payload.forEach((x) => (state.byId[x.id] = x));
    },
    remove: (state, action: PayloadAction<Workspace[]>) => {
      action.payload.forEach((x) => {
        delete state.byId[x.id];
      });
      if (state.active && !state.byId[state.active.id]) {
        state.active = null;
      }
    },
    select: (state, action: PayloadAction<Workspace | null>) => {
      state.active = action.payload;
    },
  },
});

export default slice.reducer;
