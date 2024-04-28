import { Brush } from '@shared/types';
import { deleteField, doc, setDoc } from 'firebase/firestore';
import React from 'react';
import { database } from '../firebase/setup';
import { slice } from '../slices/brush-slice';
import { useDocumentListener } from './firebase-hooks';
import { useAppDispatch, useAppSelector } from './store-hooks';

export const useBrushState = () => useAppSelector((state) => state.brushes);

const throwError = () => {
  throw new Error('no workspace selected');
};
export const useBrushActions = () => {
  const dispatch = useAppDispatch();
  const workspace = useAppSelector((state) => state.workspaces.active);

  return React.useMemo(() => {
    if (!workspace) {
      return { create: throwError, update: throwError, remove: throwError, select: throwError };
    }

    const docref = doc(database, 'brushes', workspace.id);
    return {
      create: async (brush: Brush) => await setDoc(docref, { [brush.id]: brush }, { merge: true }),
      update: async (brush: Brush) => await setDoc(docref, { [brush.id]: brush }, { merge: true }),
      remove: async (id: string) => await setDoc(docref, { [id]: deleteField() }, { merge: true }),
      select: (id: string | null) => dispatch(slice.actions.select(id)),
    };
  }, [workspace, dispatch]);
};

export const useBrushListener = (workspaceid: string | null) => {
  useDocumentListener<{ [key: string]: Brush }>(`brushes/${workspaceid}`, !workspaceid, slice.actions.load);
};
