import { Collection } from '../../lib/collection';
import { Message, Action, ActionList, AppState, Conversation, Format } from '../../lib/types'
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

export const editMessage = async (
  convId: number,
  newText: string,
  message: Message,
  collection: Collection<Message, 'MESSAGE_LIST'>
) => {
  try {
    message.text_data = newText
    const edited = await collection.edit(message)
    if (!edited) return
    collection.getList({ conversation_id: convId })
  } catch (e) {
    console.error('Error editing message')
  }
}

export const postMessage = async (
  message: string, 
  format: Format,
  conversation: Conversation,
  messages: Message[],
  collection: Collection<Message, 'MESSAGE_LIST'>
) => {
  try {
    const userMessage = await collection.create({ 
      id: 0, 
      conversation_id: conversation.id, 
      text_data: message, 
      isUser: 1 
    })
    if (userMessage == null) return
    messages.push(userMessage)

    const messagesForPrompt = messages.map((msg: Message) => {
      return (msg.isUser ? format.userNotation : format.assistantNotation) + msg.text_data
    })
    const prompt = format.systemMessage + '\n' + messagesForPrompt.join('\n') + '\n' + format.assistantNotation
    
    const host = window.location.host.split(':')[0]
    const response = await axios.post(host + ':4000/api/generate', { prompt })
    if (response.status != 200) {
      console.error('Error sending message: ' + response.data)
      return
    }
    
    await collection.create({ 
      id: 0, 
      conversation_id: conversation.id, 
      text_data: response.data, 
      isUser: 0 
    })
    collection.getList({ conversation_id: conversation.id })
  } catch (error) {
    console.error('Error posting message:', error);
  }
}

export const addEmptyMessage = async (collection: Collection<Message, 'MESSAGE_LIST'>, messages: Message[], convId: number) => {
  try {
    const lastMessageWasUser = messages.length == 0
      ? false
      : messages[messages.length - 1].isUser == 1
    
    const newMessage = await collection.create({
      id: 0,
      conversation_id: convId,
      text_data: '',
      isUser: lastMessageWasUser ? 0 : 1
    })
    if (newMessage == null) return
    collection.getList({ conversation_id: convId })
  } catch (error) {
    console.error('Error posting message:', error);
  }
}

export const removeLastMessage = async (collection: Collection<Message, 'MESSAGE_LIST'>, messages: Message[], convId: number) => {
  try {
    if (messages.length == 0) return
    const lastMessage = messages[messages.length - 1]
    await collection.remove(lastMessage)
    collection.getList({ conversation_id: convId })
  } catch (error) {
    console.error('Error posting message:', error);
  }
}