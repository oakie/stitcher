import { types } from '../actions';

const initial = () => ({
  byId: {},
  selectedId: null
});

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
