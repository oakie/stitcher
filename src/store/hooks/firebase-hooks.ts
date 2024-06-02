import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { DocumentData, QuerySnapshot, collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import React from 'react';
import { database } from '../firebase/setup';
import { useAppDispatch } from './store-hooks';
import { convertTimestamps } from '../firebase/utils';

export const useDocumentListener = <T>(path: string, skip: boolean, action: ActionCreatorWithPayload<T | null>) => {
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    if (skip) {
      dispatch(action(null));
      return;
    }

    const docref = doc(database, path);
    const unsubscribe = onSnapshot(
      docref,
      (snapshot) => {
        const data = convertTimestamps(snapshot.data()) as T;
        dispatch(action(data));
      },
      (error) => console.error(error.toString())
    );

    return unsubscribe;
  }, [path, skip, action, dispatch]);
};

const dispatchActions = <T>(snapshot: QuerySnapshot<DocumentData, DocumentData>, action: (type: 'created' | 'updated' | 'removed', data: T[]) => void) => {
  const changes = snapshot.docChanges();

  const created = changes.filter((x) => x.type === 'added').map((x) => convertTimestamps(x.doc.data()) as T);
  const updated = changes.filter((x) => x.type === 'modified').map((x) => convertTimestamps(x.doc.data()) as T);
  const removed = changes.filter((x) => x.type === 'removed').map((x) => convertTimestamps(x.doc.data()) as T);

  action('created', created);
  action('updated', updated);
  action('removed', removed);
};

export const useCollectionListener = <T>(path: string, skip: boolean, action: (type: string, data: T[]) => void) => {
  React.useEffect(() => {
    if (skip) return;

    const q = collection(database, path);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => dispatchActions(snapshot, action),
      (error) => console.error(error.toString())
    );

    return unsubscribe;
  }, [path, skip, action]);
};

export const useOwnedCollectionListener = <T>(
  userid: string | null,
  path: string,
  skip: boolean,
  action: (type: 'created' | 'updated' | 'removed', data: T[]) => void
) => {
  React.useEffect(() => {
    if (skip) return;

    const q = query(collection(database, path), where('owners', 'array-contains', userid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => dispatchActions(snapshot, action),
      (error) => console.error(error.toString())
    );

    return unsubscribe;
  }, [userid, path, skip, action]);
};
