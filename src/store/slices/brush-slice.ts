import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Brush } from '@shared/types';
import { BrushState } from '../types';

const initial = (): BrushState => {
  return {
    byId: {},
    selected: null,
  };
};

export const slice = createSlice({
  name: 'brushes',
  initialState: initial(),
  reducers: {
    update: (state, action: PayloadAction<Brush>) => {
      state.byId[action.payload.id] = action.payload;
      if (state.selected?.id === action.payload.id) {
        state.selected = action.payload;
      }
    },
    load: (state, action: PayloadAction<{ [key: string]: Brush } | null>) => {
      const empty = Object.keys(state.byId).length === 0;
      state.byId = action.payload ?? {};
      if (state.selected) {
        state.selected = state.byId[state.selected.id] ?? null;
      } else if (empty) {
        const brushes = Object.values(state.byId);
        state.selected = brushes[0];
      }
    },
    select: (state, action: PayloadAction<string | null>) => {
      state.selected = action.payload ? state.byId[action.payload] : null;
    },
  },
});

export default slice.reducer;
