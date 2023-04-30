import { combineReducers } from 'redux';
import languageModelReducer from './languageModelReducer';

const rootReducer = combineReducers({
    conversation: languageModelReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;