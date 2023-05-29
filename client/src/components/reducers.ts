import { combineReducers } from 'redux';
import languageModelReducer from './Conversation/reducer'
import modelSelectorReducer from './Model_Selector/reducer'

const rootReducer = combineReducers({
    conversation: languageModelReducer,
    modelSelector: modelSelectorReducer
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;