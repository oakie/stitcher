import { Symbols } from '../../shared/constants';
import StringUtils from '../../utils/string-utils';
import { types } from '../actions';

const initial = () => {
  const layer = {
    id: StringUtils.random(5),
    symbol: Symbols.CROSS,
    color: '#000'
  };
  return ({
    byId: {[layer.id]: layer},
    selectedId: layer.id
  });
};

const reducer = (state = initial(), action) => {
  switch (action.type) {
    case types.LAYERS.CREATE:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: action.payload
        },
        selectedId: action.payload.id
      };
    case types.LAYERS.UPDATE:
      if (Array.isArray(action.payload)) {
        const newState = { ...state };
        for (let c of action.payload) {
          newState.byId[c.id] = c;
        }
        return newState;
      } else {
        return {
          ...state,
          byId: {
            ...state.byId,
            [action.payload.id]: action.payload
          }
        };
      }
    case types.LAYERS.REMOVE:
      if (Array.isArray(action.payload)) {
        for (let id of action.payload) {
          delete state.byId[id];
        }
      } else {
        delete state.byId[action.payload];
      }
      return {
        ...state
      };
    case types.LAYERS.SELECT:
      if (!action.payload) {
        return {
          ...state,
          selectedId: null
        };
      } else {
        return {
          ...state,
          selectedId: action.payload
        };
      }
    case types.LAYERS.RESET:
      return initial();
    default:
      return state;
  }
};

export default reducer;
