import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Profile } from '@shared/types';
import { ProfileState } from '../types';

const initial = (): ProfileState => {
  return {
    profile: null,
  };
};

export const slice = createSlice({
  name: 'profile',
  initialState: initial(),
  reducers: {
    load: (state, action: PayloadAction<Profile | null>) => {
      state.profile = action.payload;
    },
  },
});

export default slice.reducer;

export const { load } = slice.actions;
