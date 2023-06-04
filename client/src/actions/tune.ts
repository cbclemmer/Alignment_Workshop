import { createAction } from "../lib/util"
import { Action, ActionList, AppState, Tune } from "../lib/types"
import { getApi } from "../lib/api"

export const COMPONENT = 'CURRENT_TUNE'

export const LOADING = 'LOADING'
export const UPDATE_TUNE = 'UPDATE'

export interface CurrentTuneActions extends ActionList {
  LOADING: Action<typeof LOADING, typeof COMPONENT, boolean>
  UPDATE_TUNE: Action<typeof UPDATE_TUNE, typeof COMPONENT, Tune>
}

function runAction<K extends keyof CurrentTuneActions>(dispatch: any, type: K, payload: CurrentTuneActions[K]['payload']): Action<K, typeof COMPONENT, CurrentTuneActions[K]['payload']> {
  return dispatch(createAction<CurrentTuneActions, K>(type, COMPONENT, payload))
}

export const getTune = async (dispatch: any, id: number) => {
  runAction(dispatch, LOADING, true)
  const res = await getApi(`tune/get/${id}/`)
  runAction(dispatch, LOADING, false)
  if (res.data.error) {
    console.error('ERROR: ' + res.data.error)
    return
  }
  runAction(dispatch, UPDATE_TUNE, res.data as Tune)
}