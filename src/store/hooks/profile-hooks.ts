import { Profile } from '@shared/types';
import StringUtils from '@utils/string-utils';
import {
  and,
  collection,
  getDocs,
  limit,
  or,
  query,
  QueryCompositeFilterConstraint,
  QueryFieldFilterConstraint,
  where,
} from 'firebase/firestore';
import React from 'react';
import { database } from '../firebase/setup';
import { convertTimestamps } from '../firebase/utils';
import { slice } from '../slices/profile-slice';
import { useDocumentListener } from './firebase-hooks';
import { useAppSelector } from './store-hooks';

export const useProfileState = () => useAppSelector((state) => state.profile);

export const useProfileActions = () => {
  const search = React.useCallback(async (term: string) => {
    const constraints: Array<QueryCompositeFilterConstraint | QueryFieldFilterConstraint> = [
      and(where('name', '>=', term), where('name', '<=', `${term}\uf8ff`)),
      and(where('email', '>=', term), where('email', '<=', `${term}\uf8ff`)),
    ];

    const keywords = StringUtils.keywords(term);
    if (keywords.length) {
      constraints.push(where('keywords', 'array-contains-any', keywords));
    }

    const q = query(collection(database, 'profiles'), or(...constraints), limit(25));
    const result = await getDocs(q);
    return result.docs.map((x) => convertTimestamps(x.data()) as Profile);
  }, []);

  const filter = React.useCallback(async (filter: string[]) => {
    const q = query(collection(database, 'profiles'), where('userid', 'in', filter));
    const result = await getDocs(q);
    return result.docs.map((x) => convertTimestamps(x.data()) as Profile);
  }, []);

  return React.useMemo(() => ({ search, filter }), [search, filter]);
};

export const useProfileListener = (userid: string | null) => {
  useDocumentListener<Profile>(`profiles/${userid}`, !userid, slice.actions.load);
};
