import { Message, ConversationState, Action, ActionList } from '../types'
import { createAction } from '../util'
import axios from 'axios';


export const LOADING = 'LOADING'
export const POST_MESSAGE = 'POST_MESSAGE'
export const ADD_MESSAGE = 'ADD_MESSAGE'
export const EDIT_MESSAGE = 'EDIT_MESSAGE'
export const EDIT_CONVERSATION_DATA = 'EDIT_SYSTEM'

export interface ConversationActions extends ActionList {
  LOADING: Action<typeof LOADING, boolean>,
  ADD_MESSAGE: Action<typeof ADD_MESSAGE, Message>,
  EDIT_MESSAGE: Action<typeof EDIT_MESSAGE, {
    index: number,
    content: string
  }>
}

function runAction<K extends keyof ConversationActions>(dispatch: any, type: K, payload: ConversationActions[K]['payload']): Action<K, ConversationActions[K]['payload']> {
  return dispatch(createAction<ConversationActions, K>(type, payload))
}

const addMessage = (dispatch: any, message: string, isUser: boolean): ConversationActions[typeof ADD_MESSAGE] => {
  return runAction(dispatch, ADD_MESSAGE, { 
    content: message, 
    isUser 
  })
}

export const editMessage = (index: number, content: string): ConversationActions[typeof EDIT_MESSAGE] => {
  return {
    type: EDIT_MESSAGE,
    payload: {
      index,
      content
    }
  }
}

export const postMessage = (message: string) => async (dispatch: any, getState: any) => {
  try {
    runAction(dispatch, LOADING, false)
    addMessage(dispatch, message, true)
    
    const state: ConversationState = getState().conversation
    console.log(state)
    const conversation = state.messages.map((msg: Message) => {
      return (msg.isUser ? state.data.userNotation : state.data.assistantNotation) + msg.content
    })
    console.log(conversation)
    const prompt = state.data.systemMessage + '\n' + conversation.join('\n') + '\n' + state.data.assistantNotation
    console.log(prompt)
    
    const response = await axios.post('http://localhost:4000/api/v1/generate', { prompt })

    addMessage(dispatch, response.data, false)
    runAction(dispatch, LOADING, false)
  } catch (error) {
    console.error('Error posting message:', error);
  }
}

// export const getModels = async (dispatch: any, getState: any) => {
//     dispatch(loadingModels(true))

// }