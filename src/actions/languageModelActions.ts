import { ThunkAction } from 'redux-thunk';
import { RootState } from '../reducers';
import { Message, ConversationDataProperty, ConversationState } from '../types'
import axios from 'axios';

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, LanguageModelActionTypes>;

export const LOADING = 'LOADING';
export const POST_MESSAGE = 'POST_MESSAGE';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const EDIT_MESSAGE = 'EDIT_MESSAGE'
export const EDIT_CONVERSATION_DATA = 'EDIT_SYSTEM'

export interface AddMessageAction {
  type: typeof ADD_MESSAGE;
  payload: Message;
}

export interface LoadingAction {
  type: typeof LOADING,
  payload: boolean
}

export interface EditMessageAction {
  type: typeof EDIT_MESSAGE,
  payload: {
    index: number,
    content: string
  }
}

export interface EditConversationData {
  type: typeof EDIT_CONVERSATION_DATA,
  payload: {
    type: ConversationDataProperty,
    content: string
  }
}

export type LanguageModelActionTypes = AddMessageAction | LoadingAction | EditMessageAction | EditConversationData

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

export const editMessage = (index: number, content: string): EditMessageAction => {
  return {
    type: EDIT_MESSAGE,
    payload: {
      index,
      content
    }
  }
}

export const editConversationData = (message: string, type: ConversationDataProperty) => {
  return {
    type: EDIT_CONVERSATION_DATA,
    payload: {
      type,
      content: message
    }
  }
}


export const postMessage = (message: string): AppThunk => async (dispatch: any, getState: any) => {
  try {
    dispatch(loading(true))
    dispatch(addMessage(message, true))
    
    const state: ConversationState = getState().conversation
    console.log(state)
    const conversation = state.messages.map((msg: Message) => {
      return (msg.isUser ? state.data.userNotation : state.data.assistantNotation) + msg.content
    })
    console.log(conversation)
    const prompt = state.data.systemMessage + '\n' + conversation.join('\n') + '\n' + state.data.assistantNotation
    console.log(prompt)
    
    const response = await axios.post('http://localhost:4000/api/v1/generate', { prompt })

    dispatch(addMessage(response.data, false))
    dispatch(loading(false))
  } catch (error) {
    console.error('Error posting message:', error);
  }
}
