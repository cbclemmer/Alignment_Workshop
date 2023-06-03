import { combineReducers } from 'redux';
import languageModelReducer from './Conversation/reducer'
import modelSelectorReducer from './Model_Selector/reducer'
import { createCollectionReducer } from '../lib/collection';

const rootReducer = combineReducers({
    conversation: languageModelReducer,
    modelSelector: modelSelectorReducer,
    tuneList: createCollectionReducer('TUNE_LIST'),
    conversationList: createCollectionReducer('CONV_LIST')
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;