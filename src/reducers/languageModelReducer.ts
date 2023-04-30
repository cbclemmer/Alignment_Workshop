import { LanguageModelActionTypes, LOADING, ADD_MESSAGE, EDIT_MESSAGE } from '../actions/languageModelActions';
import { Message } from '../components/conversation/Conversation';

export interface ConversationState {
  messages: Message[];
  loading: boolean;
}

const initialState = {
  messages: [] as Message[],
  loading: false
};

export default function languageModelReducer(state = initialState, action: LanguageModelActionTypes) {
  switch (action.type) {
    case LOADING:
      return { ...state, loading: action.payload };
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
    default:
      return state;
  }
}