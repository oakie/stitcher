import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AuthState, User } from '../types';

const initial = (): AuthState => {
  return {
    user: null,
    loading: true,
  };
};

export const slice = createSlice({
  name: 'auth',
  initialState: initial(),
  reducers: {
    loading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    signin: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.loading = false;
    },
    signout: () => ({ ...initial(), loading: false }),
  },
});

export default slice.reducer;
