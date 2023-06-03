export enum ConversationDataProperty {
  System = 'systemMessage',
  User = 'userNotation',
  Assistant = 'assistantNotation'
}

export interface Message {
  content: string;
  isUser: boolean;
}

export interface Conversation {
  id: number
  tune_id: number
  name: string
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

export type ListState<DT> = {
  loading: boolean
  items: DT[]
}

export type AppState = {
  conversation: ConversationState,
  modelSelector: ModelSelectorState,
  tuneList: ListState<Tune>
  conversationList: ListState<Conversation>
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

export interface Action<T, C, P> {
  type: T,
  component: C,
  payload: P
}

export type ActionList = {
  [K: string]: Action<string, string, any>
}