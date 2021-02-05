import { types } from '../actions';

const initial = () => ({
  byId: {}
});

const reducer = (state = initial(), action) => {
  switch (action.type) {
    case types.CELLS.CREATE:
    case types.CELLS.UPDATE:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: action.payload
        }
      };
    case types.CELLS.REMOVE:
      delete state.byId[action.payload];
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
