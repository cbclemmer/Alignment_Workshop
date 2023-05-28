export enum ConversationDataProperty {
  System = 'systemMessage',
  User = 'userNotation',
  Assistant = 'assistantNotation'
}

export interface Message {
  content: string;
  isUser: boolean;
}

export interface LanguageModelData {
  name: string
  systemMessage: string,
  userNotation: string,
  assistantNotation: string
}

export interface ConversationState {
  messages: Message[]
  loading: boolean
  data: LanguageModelData
}

export interface ModelSelectorState {
  loading: boolean
}

export interface Action<T, P> {
  type: T,
  payload: P
}

export type ActionList = {
  [K: string]: Action<string, any>
}