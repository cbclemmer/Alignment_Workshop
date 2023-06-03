import { reject } from "lodash"
import { getApi, postApi } from "../../lib/api"
import { createAction } from "../../lib/util"
import { Action, ActionList, AppState, LanguageModelData } from "../../lib/types"

export const COMPONENT = 'MODEL_SELECTOR'

export const LOADING = 'LOADING'
export const UPDATE_MODELS = 'UPDATE_MODELS'
export const SET_MODEL = 'SET_MODEL'

export interface ModelSelectorActions extends ActionList {
  LOADING: Action<typeof LOADING, typeof COMPONENT,  boolean>,
  UPDATE_MODELS: Action<typeof UPDATE_MODELS, typeof COMPONENT, LanguageModelData[]>
  SET_MODEL: Action<typeof SET_MODEL, typeof COMPONENT, LanguageModelData | null>
}

function runAction<K extends keyof ModelSelectorActions>(dispatch: any, type: K, payload: ModelSelectorActions[K]['payload']): Action<K, typeof COMPONENT, ModelSelectorActions[K]['payload']> {
  return dispatch(createAction<ModelSelectorActions, K>(type, COMPONENT, payload))
}

export async function getModels(dispatch: any, getState: any) {
  runAction(dispatch, LOADING, true)
  try {
    const res = await getApi('model-format/list')
    runAction(dispatch, UPDATE_MODELS, res.data)
  } finally {
    runAction(dispatch, LOADING, false)
  }
}

export const setModel = (model: LanguageModelData | null) => (dispatch: any, getState: any) => {
  runAction(dispatch, SET_MODEL, model)
}

export const deleteModel = (model: LanguageModelData) => async (dispatch: any, getState: any) => {
  runAction(dispatch, LOADING, true)
  try {
    const res = await postApi('model-format/delete', model)
    if (!!res.data.error) {
      console.error(res.data.errror)
    }
    const state: AppState = getState()
    const models = reject(state.modelSelector.models, (m: LanguageModelData) => m.id === model.id)
    runAction(dispatch, UPDATE_MODELS, models)
  } finally {
    runAction(dispatch, LOADING, false)
  }
}