import { combineReducers } from 'redux';
import languageModelReducer from './Conversation/reducer'
import modelSelectorReducer from './Model_Selector/reducer'
import tuneListReducer from './Tunes/list/reducer'

const rootReducer = combineReducers({
    conversation: languageModelReducer,
    modelSelector: modelSelectorReducer,
    tuneList: tuneListReducer
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;