import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Brush, Symbol } from '../../shared/types';
import StringUtils from '../../utils/string-utils';

export interface BrushState {
  byId: {
    [key: string]: Brush;
  };
  selectedId: string | null;
}

const initial = (): BrushState => {
  const cross = {
    id: StringUtils.random(5),
    symbol: Symbol.CROSS,
    color: '#000',
  } as Brush;

  return {
    byId: {
      [cross.id]: cross,
    },
    selectedId: cross.id,
  };
};

export const slice = createSlice({
  name: 'brushes',
  initialState: initial(),
  reducers: {
    create: (state, action: PayloadAction<Brush>) => {
      state.byId[action.payload.id] = action.payload;
    },
    update: (state, action: PayloadAction<Brush>) => {
      state.byId[action.payload.id] = action.payload;
    },
    remove: (state, action: PayloadAction<string>) => {
      delete state.byId[action.payload];
    },
    select: (state, action: PayloadAction<string | null>) => {
      state.selectedId = action.payload;
    },
  },
});

export default slice.reducer;
