import types from '../actions/types';

const initial = () => ({
  byId: {}
});

const reducer = (state = initial(), action) => {
  switch (action.type) {
    case types.CELLS.CREATE:
    case types.CELLS.UPDATE:
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
    case types.CELLS.REMOVE:
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
    case types.CELLS.RESET:
      return initial();
    default:
      return state;
  }
};

export default reducer;
