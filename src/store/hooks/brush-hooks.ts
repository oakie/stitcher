import React from 'react';
import { Brush } from '../../shared/types';
import { slice } from '../slices/brush-slice';
import { useAppDispatch, useAppSelector } from '../store';

export const useBrushState = () => useAppSelector((state) => state.brushes);

export const useBrushActions = () => {
  const dispatch = useAppDispatch();
  return React.useMemo(
    () => ({
      create: (payload: Brush) => dispatch(slice.actions.create(payload)),
      update: (payload: Brush) => dispatch(slice.actions.update(payload)),
      remove: (id: string) => dispatch(slice.actions.remove(id)),
      select: (id: string | null) => dispatch(slice.actions.select(id)),
    }),
    [dispatch]
  );
};
