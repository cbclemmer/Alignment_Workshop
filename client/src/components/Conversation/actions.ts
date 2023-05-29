import { Message, ConversationState, Action, ActionList, AppState } from '../../lib/types'
import { createAction } from '../../lib/util'
import axios from 'axios';

export const COMPONENT = 'CONVERSATION'

export const LOADING = 'LOADING'
export const POST_MESSAGE = 'POST_MESSAGE'
export const ADD_MESSAGE = 'ADD_MESSAGE'
export const EDIT_MESSAGE = 'EDIT_MESSAGE'
export const EDIT_CONVERSATION_DATA = 'EDIT_SYSTEM'

export interface ConversationActions extends ActionList {
  LOADING: Action<typeof LOADING, typeof COMPONENT, boolean>,
  ADD_MESSAGE: Action<typeof ADD_MESSAGE, typeof COMPONENT, Message>,
  EDIT_MESSAGE: Action<typeof EDIT_MESSAGE, typeof COMPONENT, {
    index: number,
    content: string
  }>
}

function runAction<K extends keyof ConversationActions>(dispatch: any, type: K, payload: ConversationActions[K]['payload']): Action<K, typeof COMPONENT, ConversationActions[K]['payload']> {
  return dispatch(createAction<ConversationActions, K>(type, COMPONENT, payload))
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
    component: COMPONENT,
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
    
    const state: AppState = getState()
    const model = state.modelSelector.currentModel
    if (model == null) return
    const conversation = state.conversation.messages.map((msg: Message) => {
      return (msg.isUser ? model.userNotation : model.assistantNotation) + msg.content
    })
    console.log(conversation)
    const prompt = model.systemMessage + '\n' + conversation.join('\n') + '\n' + model.assistantNotation
    console.log(prompt)
    
    const response = await axios.post('http://localhost:4000/api/generate', { prompt })

    addMessage(dispatch, response.data, false)
    runAction(dispatch, LOADING, false)
  } catch (error) {
    console.error('Error posting message:', error);
  }
}

// export const getModels = async (dispatch: any, getState: any) => {
//     dispatch(loadingModels(true))

// }