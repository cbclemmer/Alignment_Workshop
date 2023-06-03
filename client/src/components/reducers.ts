import { combineReducers } from 'redux';
import languageModelReducer from './Conversation/reducer'
import modelSelectorReducer from './Model_Selector/reducer'
import { createCollectionReducer } from '../lib/collection';

const rootReducer = combineReducers({
    conversation: languageModelReducer,
    modelSelector: modelSelectorReducer,
    tuneList: createCollectionReducer('TUNE_LIST'),
    tuneShow: createCollectionReducer('TUNE_SHOW')
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;