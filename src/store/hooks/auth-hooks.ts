import { auth } from '@store';
import {
  AuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import React from 'react';
import { slice } from '../slices/auth-slice';
import { useAppDispatch, useAppSelector } from '../store';

export const useAuthState = () => {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          slice.actions.signin({ email: user.email, name: user.displayName })
        );
      } else {
        dispatch(slice.actions.signout());
      }
    });
  }, [dispatch]);

  return useAppSelector((state) => state.auth);
};

export const useAuthActions = () => {
  const dispatch = useAppDispatch();

  const signin = async (provider: AuthProvider) => {
    dispatch(slice.actions.loading(true));
    const result = await signInWithPopup(auth, provider);
    console.log(result);
  };

  const signout = async () => {
    const result = await signOut(auth);
    console.log(result);
  };

  return { signin, signout };
};
