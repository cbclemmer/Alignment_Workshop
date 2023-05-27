export enum ConversationDataProperty {
    System = 'systemMessage',
    User = 'userNotation',
    Assistant = 'assistantNotation'
}

export interface Message {
    content: string;
    isUser: boolean;
}

export interface ConversationState {
    messages: Message[];
    loading: boolean;
    data: {
        systemMessage: string,
        userNotation: string,
        assistantNotation: string
    }
  }