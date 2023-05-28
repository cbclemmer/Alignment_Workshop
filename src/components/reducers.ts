import { combineReducers } from 'redux';
import languageModelReducer from './Conversation/reducer';

const rootReducer = combineReducers({
    conversation: languageModelReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;