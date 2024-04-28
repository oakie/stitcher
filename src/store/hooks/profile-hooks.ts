import { Profile } from '@shared/types';
import { slice } from '../slices/profile-slice';
import { useDocumentListener } from './firebase-hooks';
import { useAppSelector } from './store-hooks';

export const useProfileState = () => useAppSelector((state) => state.profile);

export const useProfileActions = () => {};

export const useProfileListener = (userid: string | null) => {
  useDocumentListener<Profile>(`profiles/${userid}`, !userid, slice.actions.load);
};
