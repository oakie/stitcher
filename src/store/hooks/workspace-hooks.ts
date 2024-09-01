import { colors } from '@shared/constants';
import { Shape, Workspace } from '@shared/types';
import StringUtils from '@utils/string-utils';
import { arrayUnion, doc, runTransaction, serverTimestamp, setDoc } from 'firebase/firestore';
import React from 'react';
import { useNavigate } from 'react-router';
import { database } from '../firebase/setup';
import { slice } from '../slices/workspace-slice';
import { useAuthState } from './auth-hooks';
import { ActionType, useDocumentListener, useOwnedCollectionListener } from './firebase-hooks';
import { useAppDispatch, useAppSelector } from './store-hooks';

export const useWorkspaceState = () => useAppSelector((state) => state.workspaces);

export const useWorkspaceActions = () => {
  const auth = useAuthState();
  const navigate = useNavigate();

  const create = async (name: string) => {
    if (!auth.user) {
      throw new Error('user is not authenticated');
    }

    const userid = auth.user.userid;
    const workspaceid = StringUtils.random(16);

    await runTransaction(database, async (transaction) => {
      const workspace = {
        id: workspaceid,
        name,
        created: serverTimestamp(),
        updated: serverTimestamp(),
        owners: [userid],
      };
      transaction.set(doc(database, 'workspaces', workspace.id), workspace);

      const brush = {
        id: StringUtils.random(5),
        shape: Shape.CROSS,
        color: colors[0],
      };
      transaction.set(doc(database, 'brushes', workspace.id), { [brush.id]: brush });
      transaction.set(doc(database, 'profiles', userid), { updated: serverTimestamp() }, { merge: true });
    });

    navigate(`/workspaces/${workspaceid}`);
  };

  const update = async (workspaceid: string, data: Partial<Workspace>) => {
    const docref = doc(database, 'workspaces', workspaceid);
    await setDoc(docref, { ...data, updated: serverTimestamp() }, { merge: true });
  };

  const remove = async (workspaceid: string) => {
    if (!auth.user) {
      throw new Error('user is not authenticated');
    }
    const userid = auth.user.userid;

    await runTransaction(database, async (transaction) => {
      transaction.set(doc(database, 'profiles', userid), { updated: serverTimestamp() }, { merge: true });
      transaction.delete(doc(database, 'stitches', workspaceid));
      transaction.delete(doc(database, 'brushes', workspaceid));
      transaction.delete(doc(database, 'workspaces', workspaceid));
    });
  };

  const share = async (workspaceid: string, userid: string) => {
    const docref = doc(database, 'workspaces', workspaceid);
    await setDoc(docref, { owners: arrayUnion(userid), updated: serverTimestamp() }, { merge: true });
  };

  return {
    create,
    update,
    remove,
    share,
  };
};

export const useWorkspaces = () => {
  const state = useWorkspaceState();
  const actions = useWorkspaceActions();
  return React.useMemo(() => ({ state, actions }), [state, actions]);
};

export const useOverviewListener = (userid: string | null) => {
  const dispatch = useAppDispatch();

  const callback = React.useCallback(
    (type: ActionType, data: Workspace[]) => {
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

export const useWorkspaceListener = (workspaceid: string | null) => {
  useDocumentListener<Workspace>(`workspaces/${workspaceid}`, !workspaceid, slice.actions.load);
};
