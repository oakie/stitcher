import React from 'react';
import { useDispatch } from 'react-redux';
import types from './types';

const createLayer = (payload) => ({ type: types.LAYERS.CREATE, payload });
const updateLayer = (payload) => ({ type: types.LAYERS.UPDATE, payload });
const removeLayer = (payload) => ({ type: types.LAYERS.REMOVE, payload });
const selectLayer = (payload) => ({ type: types.LAYERS.SELECT, payload });
const resetLayers = () => ({ type: types.LAYERS.RESET });

const useLayerActions = () => {
  const dispatch = useDispatch();
  const actions = React.useMemo(
    () => ({
      create: (payload) => dispatch(createLayer(payload)),
      update: (payload) => dispatch(updateLayer(payload)),
      remove: (id) => dispatch(removeLayer(id)),
      select: (id) => dispatch(selectLayer(id)),
      reset: () => dispatch(resetLayers())
    }),
    [dispatch]
  );
  return actions;
};

export default useLayerActions;
