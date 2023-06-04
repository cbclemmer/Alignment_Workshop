import { Collection } from '../../lib/collection';
import { Message, Action, ActionList, AppState } from '../../lib/types'
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

export const postMessage = (message: string, collection: Collection<Message, 'MESSAGE_LIST'>) => async (dispatch: any, getState: any) => {
  try {
    const state: AppState = getState()
    
    const format = state.formatSelector.currentFormat
    if (format == null) return
    
    const conversation = state.currentConversation.conversation
    if (conversation == null) return
    
    const userMessage = { id: 0, conversation_id: conversation.id, text_data: message, isUser: 1 } as Message
    const messages = state.messageList.items
    messages.push(userMessage)

    const messagesForPrompt = state.messageList.items.map((msg: Message) => {
      return (msg.isUser ? format.userNotation : format.assistantNotation) + msg.text_data
    })
    const prompt = format.systemMessage + '\n' + messagesForPrompt.join('\n') + '\n' + format.assistantNotation
    
    const response = await axios.post('http://localhost:4000/api/generate', { prompt })
    if (response.status != 200) {
      console.error('Error sending message: ' + response.data)
      return
    }
    
    await collection.create(userMessage)

    const assistantMessage = { id: 0, conversation_id: conversation.id, text_data: response.data, isUser: 0 }
    messages.push(assistantMessage)
    collection.runAction('UPDATE', messages)
    await collection.create(assistantMessage)
  } catch (error) {
    console.error('Error posting message:', error);
  }
}