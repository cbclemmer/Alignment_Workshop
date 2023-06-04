import { 
  UPDATE, 
  LOADING, 
  COMPONENT, 
  CurrentConversationActions 
} from '../actions/conversation'

import { 
  Action,
  CurrentConversationState,
  Conversation
} from '../lib/types'

const initialState: CurrentConversationState = {
  conversation: null,
  loading: false
}

export default function (state = initialState, action: Action<keyof CurrentConversationActions, typeof COMPONENT, any>): CurrentConversationState {
  if (action.component != COMPONENT) return state
  switch (action.type) {
    case LOADING:
      return { ...state, loading: action.payload as boolean }
    case UPDATE:
      return { ...state, conversation: action.payload as Conversation }
    default:
      return state
  }
}