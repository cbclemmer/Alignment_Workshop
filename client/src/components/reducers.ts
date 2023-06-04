import { combineReducers } from 'redux';
import languageModelReducer from './Conversation/reducer'
import modelSelectorReducer from './Format_Selector/reducer'
import { createCollectionReducer } from '../lib/collection'
import currentTuneReducer from '../reducers/tune'
import currentConvReducer from '../reducers/conversation'

const rootReducer = combineReducers({
    modelSelector: modelSelectorReducer,
    tuneList: createCollectionReducer('TUNE_LIST'),
    conversationList: createCollectionReducer('CONV_LIST'),
    messageList: createCollectionReducer('MESSAGE_LIST'),
    currentTune: currentTuneReducer,
    currentConversation: currentConvReducer
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;