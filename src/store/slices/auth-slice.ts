import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AuthState, User } from '../types';

const initial = (): AuthState => {
  return {
    username: null,
    fullname: null,
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
      state.username = action.payload.email;
      state.fullname = action.payload.name;
      state.loading = false;
    },
    signout: (_) => ({ ...initial(), loading: false }),
  },
});

export default slice.reducer;
