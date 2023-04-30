import { ThunkAction } from 'redux-thunk';
import { RootState } from '../reducers';
import { Message } from '../components/conversation/Conversation';
import axios from 'axios';

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, LanguageModelActionTypes>;

export const LOADING = 'LOADING';
export const POST_MESSAGE = 'POST_MESSAGE';
export const ADD_MESSAGE = 'ADD_MESSAGE';

export interface PostMessageAction {
  type: typeof POST_MESSAGE;
  payload: Message;
}

export interface AddMessageAction {
  type: typeof ADD_MESSAGE;
  payload: Message;
}

export interface LoadingAction {
  type: typeof LOADING,
  payload: boolean
}

export type LanguageModelActionTypes = PostMessageAction | AddMessageAction | LoadingAction

export const loading = (isLoading: boolean): LoadingAction => {
  return {
    type: LOADING,
    payload: isLoading
  };
};

export const addMessage = (message: string, isUser: boolean): AddMessageAction => {
  return {
    type: ADD_MESSAGE,
    payload: { 
      content: message, 
      isUser 
    } as Message
  }
}

export const postMessage = (message: string): AppThunk => async (dispatch: any, getState: any) => {
  try {
    dispatch(loading(true));
    dispatch(addMessage(message, true))
    const conversation = getState().conversation.messages.map((msg: Message) => {
      return msg.isUser ? `###User: ${msg.content}` : `###Assistant: ${msg.content}`;
    });
    conversation.push(`###User: ${message}`)
    const prompt = conversation.join('\n') + '\n###Assistant: '
    const response = await axios.post('http://localhost:4000/api/v1/generate', { prompt })

    dispatch(addMessage(response.data, false))
    dispatch(loading(false))
  } catch (error) {
    console.error('Error posting message:', error);
  }
};
