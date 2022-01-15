import React from 'react';
import { useDispatch } from 'react-redux';
import types from './types';

const createBrush = (payload) => ({ type: types.BRUSHES.CREATE, payload });
const updateBrush = (payload) => ({ type: types.BRUSHES.UPDATE, payload });
const removeBrush = (payload) => ({ type: types.BRUSHES.REMOVE, payload });
const selectBrush = (payload) => ({ type: types.BRUSHES.SELECT, payload });
const resetBrushes = () => ({ type: types.BRUSHES.RESET });

const useBrushActions = () => {
  const dispatch = useDispatch();
  const actions = React.useMemo(
    () => ({
      create: (payload) => dispatch(createBrush(payload)),
      update: (payload) => dispatch(updateBrush(payload)),
      remove: (id) => dispatch(removeBrush(id)),
      select: (id) => dispatch(selectBrush(id)),
      reset: () => dispatch(resetBrushes())
    }),
    [dispatch]
  );
  return actions;
};

export default useBrushActions;
