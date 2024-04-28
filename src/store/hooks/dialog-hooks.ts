import { ReactNode } from 'react';
import { slice } from '../slices/dialog-slice';
import { DialogContext } from '../types';
import { useAppDispatch, useAppSelector } from './store-hooks';

export const useDialogState = () => useAppSelector((state) => state.dialogs);

export const useDialogActions = () => {
  const dispatch = useAppDispatch();

  return {
    open: <T>(id: string, component: ReactNode) => {
      const { promise, resolve, reject } = Promise.withResolvers<T>();
      dispatch(slice.actions.push({ id, component, promise, resolve, reject }));
      promise.then(
        () => dispatch(slice.actions.pop()),
        () => dispatch(slice.actions.pop())
      );
      return promise;
    },
  };
};

export const useDialogContext = <TResult>(id: string) => {
  const state = useDialogState();

  const index = state.stack.findIndex((x) => x.id === id);
  if (index === -1) throw new Error('could not find dialog context');

  const context = state.stack[index] as DialogContext<TResult>;
  return {
    id: context.id,
    show: index === 0,
    resolve: context.resolve,
    reject: context.reject,
  };
};
