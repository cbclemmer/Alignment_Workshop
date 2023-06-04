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

export interface Format {
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

export type CurrentTuneState = {
  tune: Tune | null,
  loading: boolean
}

export type CurrentConversationState = {
  conversation: Conversation | null,
  loading: boolean
}

export type AppState = {
  formatSelector: FormatSelectorState,
  tuneList: ListState<Tune>
  conversationList: ListState<Conversation>
  messageList: ListState<Message>
  currentTune: CurrentTuneState
  currentConversation: CurrentConversationState
}

export interface FormatSelectorState {
  loading: boolean
  formats: Format[]
  currentFormat: Format | null
}

export interface Action<T, C, P> {
  type: T,
  component: C,
  payload: P
}

export type ActionList = {
  [K: string]: Action<string, string, any>
}