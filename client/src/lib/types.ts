export enum ConversationDataProperty {
  System = 'systemMessage',
  User = 'userNotation',
  Assistant = 'assistantNotation'
}

export interface Message {
  content: string;
  isUser: boolean;
}

export interface Tune {
  id: number
  name: string
}

export interface LanguageModelData {
  id: number
  name: string
  systemMessage: string
  formattedSystemMessage?: string
  userNotation: string
  assistantNotation: string
}

export type AppState = {
  conversation: ConversationState,
  modelSelector: ModelSelectorState,
  tuneList: TuneListState
}

export interface ConversationState {
  messages: Message[]
  loading: boolean
}

export interface ModelSelectorState {
  loading: boolean
  models: LanguageModelData[]
  currentModel: LanguageModelData | null
}

export interface TuneListState {
  loading: boolean
  tunes: Tune[]
}

export interface Action<T, C, P> {
  type: T,
  component: C,
  payload: P
}

export type ActionList = {
  [K: string]: Action<string, string, any>
}