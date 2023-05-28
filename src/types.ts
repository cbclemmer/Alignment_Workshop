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

export type AppState = {
  conversation: ConversationState,
  modelSelector: ModelSelectorState
}

export interface ConversationState {
  messages: Message[]
  loading: boolean
  data: LanguageModelData
}

export interface ModelSelectorState {
  loading: boolean
  models: LanguageModelData[]
}

export interface Action<T, C, P> {
  type: T,
  component: C,
  payload: P
}

export type ActionList = {
  [K: string]: Action<string, string, any>
}