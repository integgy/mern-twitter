import { combineReducers } from 'redux';
import { sessionErrorsReducer } from './sessionReducer';

const errorReducer = combineReducers({
  session: sessionErrorsReducer
});

export default errorReducer
