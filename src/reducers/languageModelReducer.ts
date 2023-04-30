import { LanguageModelActionTypes, POST_MESSAGE, LOADING, ADD_MESSAGE } from '../actions/languageModelActions';

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
      return { ...state, loading: action.payload };
    case ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    default:
      return state;
  }
}