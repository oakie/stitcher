import { Stitch } from '@shared/types';
import ImgUtils from '@utils/img-utils';
import { deleteField, doc, setDoc } from 'firebase/firestore';
import React from 'react';
import { database } from '../firebase/setup';
import { slice } from '../slices/stitch-slice';
import { useBrushState } from './brush-hooks';
import { useDocumentListener } from './firebase-hooks';
import { useAppDispatch, useAppSelector, useStateRef } from './store-hooks';
import { useWorkspaces } from './workspace-hooks';

export const useStitchState = () => useAppSelector((state) => state.stitches);

export const useStitchActions = () => {
  const dispatch = useAppDispatch();
  const workspaces = useWorkspaces();
  const stitches = useStateRef((state) => state.stitches.byId);
  const brushes = useBrushState();

  const update = React.useCallback(
    async (draft: Stitch[]) => {
      if (!workspaces.state.active) {
        throw new Error('no workspace selected');
      }

      dispatch(slice.actions.update(draft));

      const map = draft.reduce((map, stitch) => ({ ...map, [stitch.id]: stitch }), {});
      const docref = doc(database, 'stitches', workspaces.state.active.id);
      await setDoc(docref, map, { merge: true });

      const bitmap = await ImgUtils.createBitmap(stitches.current, brushes.byId);
      await workspaces.actions.update(workspaces.state.active.id, { thumbnail: bitmap.uri, size: bitmap.size });
    },
    [workspaces.state.active, workspaces.actions, stitches, brushes, dispatch]
  );

  const remove = React.useCallback(
    async (draft: string[]) => {
      if (!workspaces.state.active) {
        throw new Error('no workspace selected');
      }

      dispatch(slice.actions.remove(draft));

      const docref = doc(database, 'stitches', workspaces.state.active.id);
      const map = draft.reduce((map, id) => ({ ...map, [id]: deleteField() }), {});
      await setDoc(docref, map, { merge: true });

      const bitmap = await ImgUtils.createBitmap(stitches.current, brushes.byId);
      await workspaces.actions.update(workspaces.state.active.id, { thumbnail: bitmap.uri, size: bitmap.size });
    },
    [workspaces.state.active, workspaces.actions, stitches, brushes, dispatch]
  );

  return React.useMemo(() => ({ update, remove }), [update, remove]);
};

export const useStitchListener = (workspaceid: string | null) => {
  useDocumentListener<{ [key: string]: Stitch }>(`stitches/${workspaceid}`, !workspaceid, slice.actions.load);
};
