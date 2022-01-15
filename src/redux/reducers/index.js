import { combineReducers } from 'redux';
import cells from './cell-reducer';
import brushes from './brush-reducer';

const reducer = combineReducers({ cells, brushes });

export default reducer;
