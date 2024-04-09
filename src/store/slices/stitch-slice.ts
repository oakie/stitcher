import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Stitch } from '@shared/types';

export interface StitchState {
  byId: {
    [key: string]: Stitch;
  };
}

const initial = (): StitchState => {
  return {
    byId: {},
  };
};

export const slice = createSlice({
  name: 'stitches',
  initialState: initial(),
  reducers: {
    create: (state, action: PayloadAction<Stitch | Stitch[]>) => {
      if (Array.isArray(action.payload)) {
        for (let c of action.payload) {
          state.byId[c.id] = c;
        }
      } else {
        state.byId[action.payload.id] = action.payload;
      }
    },
    update: (state, action: PayloadAction<Stitch | Stitch[]>) => {
      if (Array.isArray(action.payload)) {
        for (let c of action.payload) {
          state.byId[c.id] = c;
        }
      } else {
        state.byId[action.payload.id] = action.payload;
      }
    },
    remove: (state, action: PayloadAction<string | string[]>) => {
      if (Array.isArray(action.payload)) {
        for (let c of action.payload) {
          delete state.byId[c];
        }
      } else {
        delete state.byId[action.payload];
      }
    },
  },
});

export default slice.reducer;
