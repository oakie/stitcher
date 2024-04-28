import { Stitch } from '@shared/types';
import { deleteField, doc, setDoc } from 'firebase/firestore';
import React from 'react';
import { database } from '../firebase/setup';
import { slice } from '../slices/stitch-slice';
import { useDocumentListener } from './firebase-hooks';
import { useAppSelector } from './store-hooks';

export const useStitchState = () => useAppSelector((state) => state.stitches);

const throwError = () => {
  throw new Error('no workspace selected');
};
export const useStitchActions = () => {
  const workspace = useAppSelector((state) => state.workspaces.active);

  return React.useMemo(() => {
    if (!workspace) {
      return { update: throwError, remove: throwError };
    }

    const docref = doc(database, 'stitches', workspace.id);
    return {
      update: async (payload: Stitch[]) => {
        const map = payload.reduce((map, stitch) => ({ ...map, [stitch.id]: stitch }), {});
        await setDoc(docref, map, { merge: true });
      },
      remove: async (payload: string[]) => {
        const map = payload.reduce((map, id) => ({ ...map, [id]: deleteField() }), {});
        await setDoc(docref, map, { merge: true });
      },
    };
  }, [workspace]);
};

export const useStitchListener = (workspaceid: string | null) => {
  useDocumentListener<{ [key: string]: Stitch }>(`stitches/${workspaceid}`, !workspaceid, slice.actions.load);
};
