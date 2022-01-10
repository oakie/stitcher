import React from 'react';
import { useDispatch } from 'react-redux';
import types from './types';

const createCell = (payload) => ({ type: types.CELLS.CREATE, payload });
const updateCell = (payload) => ({ type: types.CELLS.UPDATE, payload });
const removeCell = (payload) => ({ type: types.CELLS.REMOVE, payload });
const resetCells = () => ({ type: types.CELLS.RESET });

const useCellActions = () => {
  const dispatch = useDispatch();
  const actions = React.useMemo(
    () => ({
      create: (payload) => dispatch(createCell(payload)),
      update: (payload) => dispatch(updateCell(payload)),
      remove: (id) => dispatch(removeCell(id)),
      reset: () => dispatch(resetCells())
    }),
    [dispatch]
  );
  return actions;
};

export default useCellActions;
