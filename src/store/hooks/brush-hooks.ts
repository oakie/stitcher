import { Brush } from '@shared/types';
import ImgUtils from '@utils/img-utils';
import { deleteField, doc, setDoc } from 'firebase/firestore';
import React from 'react';
import { database } from '../firebase/setup';
import { slice } from '../slices/brush-slice';
import { useDocumentListener } from './firebase-hooks';
import { useStitchState } from './stitch-hooks';
import { useAppDispatch, useAppSelector, useStateRef } from './store-hooks';
import { useWorkspaces } from './workspace-hooks';

export const useBrushState = () => useAppSelector((state) => state.brushes);

export const useBrushActions = () => {
  const dispatch = useAppDispatch();
  const workspaces = useWorkspaces();
  const stitches = useStitchState();
  const brushes = useStateRef((state) => state.brushes.byId);

  const create = React.useCallback(
    async (brush: Brush) => {
      if (!workspaces.state.active) throw new Error('no workspace selected');
      dispatch(slice.actions.update(brush));
      const docref = doc(database, 'brushes', workspaces.state.active.id);
      await setDoc(docref, { [brush.id]: brush }, { merge: true });
      await workspaces.actions.update(workspaces.state.active.id, {});
    },
    [workspaces.state.active, workspaces.actions, dispatch]
  );

  const update = React.useCallback(
    async (brush: Brush) => {
      if (!workspaces.state.active) throw new Error('no workspace selected');
      dispatch(slice.actions.update(brush));
      const docref = doc(database, 'brushes', workspaces.state.active.id);
      await setDoc(docref, { [brush.id]: brush }, { merge: true });
      const bitmap = await ImgUtils.createBitmap(stitches.byId, brushes.current);
      await workspaces.actions.update(workspaces.state.active.id, { thumbnail: bitmap.uri, size: bitmap.size });
    },
    [workspaces.state.active, workspaces.actions, stitches.byId, brushes, dispatch]
  );

  const remove = React.useCallback(
    async (id: string) => {
      if (!workspaces.state.active) throw new Error('no workspace selected');
      const docref = doc(database, 'brushes', workspaces.state.active.id);
      await setDoc(docref, { [id]: deleteField() }, { merge: true });
      await workspaces.actions.update(workspaces.state.active.id, {});
    },
    [workspaces.state.active, workspaces.actions]
  );

  const select = React.useCallback(
    (id: string | null) => {
      if (!workspaces.state.active) throw new Error('no workspace selected');
      dispatch(slice.actions.select(id));
    },
    [workspaces.state.active, dispatch]
  );

  return React.useMemo(() => {
    return { create, update, remove, select };
  }, [create, update, remove, select]);
};

export const useBrushListener = (workspaceid: string | null) => {
  useDocumentListener<{ [key: string]: Brush }>(`brushes/${workspaceid}`, !workspaceid, slice.actions.load);
};
