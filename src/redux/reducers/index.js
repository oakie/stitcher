import { combineReducers } from 'redux';
import cells from './cell-reducer';
import layers from './layer-reducer';

const reducer = combineReducers({ cells, layers });

export default reducer;
