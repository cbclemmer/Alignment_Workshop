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
    messages: Message[];
    loading: boolean;
    loadingModels: boolean
    data: LanguageModelData
  }