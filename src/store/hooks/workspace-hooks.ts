import { Shape, Workspace } from '@shared/types';
import StringUtils from '@utils/string-utils';
import { doc, runTransaction, serverTimestamp, setDoc } from 'firebase/firestore';
import React from 'react';
import { database } from '../firebase/setup';
import { slice } from '../slices/workspace-slice';
import { useAuthState } from './auth-hooks';
import { useDocumentListener, useOwnedCollectionListener } from './firebase-hooks';
import { useAppDispatch, useAppSelector } from './store-hooks';

export const useWorkspaceState = () => useAppSelector((state) => state.workspaces);

export const useWorkspaceActions = () => {
  const auth = useAuthState();

  const create = async (name: string) => {
    if (!auth.user) {
      throw new Error('user is not authenticated');
    }

    const userid = auth.user.userid;

    await runTransaction(database, async (transaction) => {
      const workspace = {
        id: StringUtils.random(16),
        name,
        created: serverTimestamp(),
        updated: serverTimestamp(),
        owners: [userid],
      };
      transaction.set(doc(database, 'workspaces', workspace.id), workspace);

      const brush = {
        id: StringUtils.random(5),
        shape: Shape.CROSS,
        color: '#0f0',
      };
      transaction.set(doc(database, 'brushes', workspace.id), { [brush.id]: brush });
      transaction.set(doc(database, 'profiles', userid), { active: workspace.id }, { merge: true });
    });
  };

  const rename = async (workspaceid: string, name: string) => {
    const docref = doc(database, 'workspaces', workspaceid);
    await setDoc(docref, { name, updated: serverTimestamp() }, { merge: true });
  };

  const select = async (workspaceid: string | null) => {
    if (!auth.user) {
      throw new Error('user is not authenticated');
    }

    const docref = doc(database, 'profiles', auth.user.userid);
    await setDoc(docref, { active: workspaceid }, { merge: true });
  };

  const remove = async (workspaceid: string) => {
    if (!auth.user) {
      throw new Error('user is not authenticated');
    }
    const userid = auth.user.userid;

    await runTransaction(database, async (transaction) => {
      transaction.delete(doc(database, 'stitches', workspaceid));
      transaction.delete(doc(database, 'brushes', workspaceid));
      transaction.delete(doc(database, 'workspaces', workspaceid));
      transaction.set(doc(database, 'profiles', userid), { active: null }, { merge: true });
    });
  };

  return {
    create,
    rename,
    select,
    remove,
  };
};

export const useWorkspaces = () => {
  const state = useWorkspaceState();
  const actions = useWorkspaceActions();
  return React.useMemo(() => ({ state, actions }), [state, actions]);
};

export const useWorkspaceListener = (userid: string | null, workspaceid: string | null) => {
  const dispatch = useAppDispatch();
  useDocumentListener<Workspace>(`workspaces/${workspaceid}`, !workspaceid, slice.actions.select);

  const callback = React.useCallback(
    (type: 'created' | 'updated' | 'removed', data: Workspace[]) => {
      if (type === 'created') {
        dispatch(slice.actions.create(data));
      }
      if (type === 'updated') {
        dispatch(slice.actions.update(data));
      }
      if (type === 'removed') {
        dispatch(slice.actions.remove(data));
      }
    },
    [dispatch]
  );
  useOwnedCollectionListener<Workspace>(userid, 'workspaces', !userid, callback);
};
