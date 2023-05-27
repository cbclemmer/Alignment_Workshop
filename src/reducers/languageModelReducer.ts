import { 
  LanguageModelActionTypes, 
  LOADING, 
  ADD_MESSAGE, 
  EDIT_MESSAGE, 
  EDIT_CONVERSATION_DATA,
  LOADING_MODELS
} from '../actions/conversationActions';
import { 
  ConversationState, 
  Message,
  ConversationDataProperty
} from '../types';

const initialState: ConversationState = {
  messages: [] as Message[],
  loading: false,
  loadingModels: true,
  data: {
    name: '',
    systemMessage: '',
    userNotation: '###Human:',
    assistantNotation: '###Assistant:'
  }
};

export default function languageModelReducer(state = initialState, action: LanguageModelActionTypes): ConversationState {
  switch (action.type) {
    case LOADING:
      return { ...state, loading: action.payload }
    case LOADING_MODELS:
      return { ...state, loadingModels: action.payload }
    case ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    case EDIT_MESSAGE:
      const index = action.payload.index
      const content = action.payload.content
      const messages = state.messages
      messages[index] = {
        isUser: messages[index].isUser,
        content: content
      }
      return {
        ...state,
        messages
      }
    case EDIT_CONVERSATION_DATA:
      let conversationData = state.data
      conversationData[action.payload.type as ConversationDataProperty] = action.payload.content
      return {
        ...state,
        data: conversationData
      }
    default:
      return state;
  }
}