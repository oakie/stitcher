import StringUtils from '@utils/string-utils';
import { AuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import React from 'react';
import { auth, database } from '../firebase/setup';
import { slice } from '../slices/auth-slice';
import { useAppDispatch, useAppSelector } from './store-hooks';

export const useAuthState = () => useAppSelector((state) => state.auth);

export const useAuthActions = () => {
  const dispatch = useAppDispatch();

  const signin = async (provider: AuthProvider) => {
    dispatch(slice.actions.loading(true));
    const credential = await signInWithPopup(auth, provider);
    if (!credential.user) {
      return;
    }

    const keywords = StringUtils.keywords(credential.user.email ?? '', credential.user.displayName ?? '');

    const profile = {
      userid: credential.user.uid,
      email: credential.user.email,
      name: credential.user.displayName,
      avatar: credential.user.photoURL,
      keywords,
      updated: serverTimestamp(),
    };

    const docref = doc(database, 'profiles', profile.userid);
    await setDoc(docref, profile, { merge: true });
  };

  const signout = async () => {
    await signOut(auth);
  };

  return { signin, signout };
};

export const useAuthListener = () => {
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
};
