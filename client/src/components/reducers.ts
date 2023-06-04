import { combineReducers } from 'redux';
import languageModelReducer from './Conversation/reducer'
import modelSelectorReducer from './Format_Selector/reducer'
import { createCollectionReducer } from '../lib/collection'
import currentTuneReducer from '../reducers/tune'

const rootReducer = combineReducers({
    conversation: languageModelReducer,
    modelSelector: modelSelectorReducer,
    tuneList: createCollectionReducer('TUNE_LIST'),
    conversationList: createCollectionReducer('CONV_LIST'),
    currentTune: currentTuneReducer
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;