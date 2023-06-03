import { reject } from "lodash"
import { getApi, postApi } from "../../../lib/api"
import { createAction } from "../../../lib/util"
import { Action, ActionList, AppState, LanguageModelData, Tune } from "../../../lib/types"

export const COMPONENT = 'MODEL_SELECTOR'

export const LOADING = 'LOADING'
export const UPDATE_TUNES = 'UPDATE_TUNES'

export interface TuneListActions extends ActionList {
  LOADING: Action<typeof LOADING, typeof COMPONENT,  boolean>,
  UPDATE_MODELS: Action<typeof UPDATE_TUNES, typeof COMPONENT, LanguageModelData[]>
}

function runAction<K extends keyof TuneListActions>(dispatch: any, type: K, payload: TuneListActions[K]['payload']): Action<K, typeof COMPONENT, TuneListActions[K]['payload']> {
  return dispatch(createAction<TuneListActions, K>(type, COMPONENT, payload))
}

export async function getTunes(dispatch: any, getState: any) {
  runAction(dispatch, LOADING, true)
  try {
    const res = await getApi('tune/list')
    runAction(dispatch, UPDATE_TUNES, res.data)
  } finally {
    runAction(dispatch, LOADING, false)
  }
}

export const createTune = async (dispatch: any, data: Tune) => {
  runAction(dispatch, LOADING, true)
  const res = await postApi('tune/create', data)
  if (!res) {
    console.error('ERROR: creating model failed')
    return
  }
  getTunes(dispatch, null)
}

export const editTune = async (dispatch: any, data: Tune) => {
  const res = await postApi('tune/edit', data)
  if (!res) {
    console.error('ERROR: creating model failed')
    return
  }
  getTunes(dispatch, null)
}

export const deleteTune = (model: Tune) => async (dispatch: any, getState: any) => {
  runAction(dispatch, LOADING, true)
  try {
    const res = await postApi('tune/delete', model)
    if (!!res.data.error) {
      console.error(res.data.errror)
      return
    }
    const state: AppState = getState()
    const tunes = reject(state.tuneList.tunes, (m: Tune) => m.id === model.id)
    runAction(dispatch, UPDATE_TUNES, tunes)
  } finally {
    runAction(dispatch, LOADING, false)
  }
}