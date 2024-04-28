import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DialogContext, DialogState } from '../types';

const initial = (): DialogState => {
  return {
    stack: [],
  };
};

export const slice = createSlice({
  name: 'dialogs',
  initialState: initial(),
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    push: (state, action: PayloadAction<DialogContext<any>>) => {
      state.stack.unshift(action.payload);
    },
    pop: (state) => {
      state.stack.shift();
    },
  },
});

export default slice.reducer;
