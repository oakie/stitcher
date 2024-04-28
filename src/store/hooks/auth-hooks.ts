import { AuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import React from 'react';
import { auth } from '../firebase/setup';
import { slice } from '../slices/auth-slice';
import { useAppDispatch, useAppSelector } from './store-hooks';

export const useAuthState = () => {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(slice.actions.signin({ userid: user.uid, email: user.email ?? '', name: user.displayName ?? '' }));
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
    await signInWithPopup(auth, provider);
  };

  const signout = async () => {
    await signOut(auth);
  };

  return { signin, signout };
};
