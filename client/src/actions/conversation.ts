import { createAction } from "../lib/util"
import { Action, ActionList, AppState, Conversation, Tune } from "../lib/types"
import { getApi } from "../lib/api"

export const COMPONENT = 'CURRENT_CONVERSATION'

export const LOADING = 'LOADING'
export const UPDATE = 'UPDATE'

export interface CurrentConversationActions extends ActionList {
  LOADING: Action<typeof LOADING, typeof COMPONENT, boolean>
  UPDATE_CONV: Action<typeof UPDATE, typeof COMPONENT, Tune>
}

function runAction<K extends keyof CurrentConversationActions>(dispatch: any, type: K, payload: CurrentConversationActions[K]['payload']): Action<K, typeof COMPONENT, CurrentConversationActions[K]['payload']> {
  return dispatch(createAction<CurrentConversationActions, K>(type, COMPONENT, payload))
}

export const getConversation = async (dispatch: any, id: number) => {
  runAction(dispatch, LOADING, true)
  const res = await getApi(`conversation/get/${id}/`)
  runAction(dispatch, LOADING, false)
  if (res.data.error) {
    console.error('ERROR: ' + res.data.error)
    return
  }
  runAction(dispatch, UPDATE, res.data as Conversation)
}