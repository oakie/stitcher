import React from 'react';
import { Stitch } from '../../shared/types';
import { slice } from '../slices/stitch-slice';
import { useAppDispatch, useAppSelector } from '../store';

export const useStitchState = () => useAppSelector((state) => state.brushes);

export const useStitchActions = () => {
  const dispatch = useAppDispatch();
  return React.useMemo(
    () => ({
      create: (payload: Stitch | Stitch[]) =>
        dispatch(slice.actions.create(payload)),
      update: (payload: Stitch | Stitch[]) =>
        dispatch(slice.actions.update(payload)),
      remove: (id: string | string[]) => dispatch(slice.actions.remove(id)),
    }),
    [dispatch]
  );
};
