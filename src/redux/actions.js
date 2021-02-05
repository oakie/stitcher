import React from 'react';
import { useDispatch } from 'react-redux';

export const types = {
  CELLS: {
    CREATE: 'cells.create',
    UPDATE: 'cells.update',
    REMOVE: 'cells.remove',
    RESET: 'cells.reset'
  }
};

const createCell = (payload) => ({ type: types.CELLS.CREATE, payload });

const updateCell = (payload) => ({ type: types.CELLS.UPDATE, payload });

const removeCell = (id) => ({ type: types.CELLS.REMOVE, payload: id });

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
