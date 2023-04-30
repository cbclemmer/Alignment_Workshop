import { LanguageModelActionTypes, POST_MESSAGE } from '../actions/languageModelActions';

const initialState = {
  messages: [],
};

export default function languageModelReducer(state = initialState, action: LanguageModelActionTypes) {
  switch (action.type) {
    case POST_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, { content: action.payload, isUser: false }],
      };
    default:
      return state;
  }
}