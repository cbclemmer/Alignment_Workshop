export interface BaseModel {
  id: number
}

export const ModelFormatKeys: (keyof IModelFormat)[] = ['id', 'name', 'systemMessage', 'userNotation', 'assistantNotation']
export interface IModelFormat extends BaseModel {
  id: number
  name: string
  systemMessage: string
  userNotation: string
  assistantNotation: string
}

export const TuneKeys: (keyof ITune)[] = ['id', 'name']
export interface ITune {
  id: number
  name: string
}

export const TagKeys: (keyof ITag)[] = ['id', 'text', 'conversation_id']
export interface ITag {
  id: number
  conversation_id: number
  text: string
}

export const MessageKeys: (keyof IMessage)[] = ['id', 'conversation_id', 'text', 'isUser']
export interface IMessage {
  id: number
  conversation_id: number
  text: string
  isUser: number // 0: assistant, 1: user
}

export const ConversationKeys: (keyof IConversation)[] = ['id', 'tune_id', 'name']
export interface IConversation {
  id: number
  tune_id: number
  name: string
}