import { LanguageModelActionTypes, POST_MESSAGE, LOADING } from '../actions/languageModelActions';

export interface ConversationState {
  messages: string[];
  loading: boolean;
}

const initialState = {
  messages: [],
  loading: false
};

export default function languageModelReducer(state = initialState, action: LanguageModelActionTypes) {
  switch (action.type) {
    case LOADING:
      return { ...state, loading: true };
    case POST_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, { content: action.payload, isUser: false }],
        loading: false
      };
    default:
      return state;
  }
}