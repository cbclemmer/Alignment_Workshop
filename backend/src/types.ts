export interface BaseModel {
  id: number
}

export const FormatKeys: (keyof IFormat)[] = ['id', 'name', 'systemMessage', 'userNotation', 'assistantNotation']
export interface IFormat extends BaseModel {
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

export const TagKeys: (keyof ITag)[] = ['id', 'name', 'conversation_id']
export interface ITag {
  id: number
  conversation_id: number
  name: string
}

export const MessageKeys: (keyof IMessage)[] = ['id', 'conversation_id', 'text_data', 'isUser']
export interface IMessage {
  id: number
  conversation_id: number
  text_data: string
  isUser: number // 0: assistant, 1: user
}

export const ConversationKeys: (keyof IConversation)[] = ['id', 'tune_id', 'name']
export interface IConversation {
  id: number
  tune_id: number
  name: string
}

export type Completion = {
  input: string,
  output: string
}