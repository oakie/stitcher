import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Stitch } from '@shared/types';
import { StitchState } from '../types';

const initial = (): StitchState => {
  return {
    byId: {},
  };
};

export const slice = createSlice({
  name: 'stitches',
  initialState: initial(),
  reducers: {
    create: (state, action: PayloadAction<Stitch[]>) => {
      action.payload.forEach((x) => (state.byId[x.id] = x));
    },
    update: (state, action: PayloadAction<Stitch[]>) => {
      action.payload.forEach((x) => (state.byId[x.id] = x));
    },
    remove: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach((x) => delete state.byId[x]);
    },
    load: (state, action: PayloadAction<{ [key: string]: Stitch } | null>) => {
      return {
        ...state,
        byId: action.payload ?? {},
      };
    },
  },
});

export default slice.reducer;
