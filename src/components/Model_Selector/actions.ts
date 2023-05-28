import { getApi } from "../../api"
import { createAction } from "../../util"
import { Action, ActionList, LanguageModelData } from "../../types"

export const COMPONENT = 'MODEL_SELECTOR'

export const LOADING = 'LOADING'
export const UPDATE_MODELS = 'UPDATE_MODELS'

export interface ModelSelectorActions extends ActionList {
  LOADING: Action<typeof LOADING, typeof COMPONENT,  boolean>,
  UPDATE_MODELS: Action<typeof UPDATE_MODELS, typeof COMPONENT, LanguageModelData[]>
}

function runAction<K extends keyof ModelSelectorActions>(dispatch: any, type: K, payload: ModelSelectorActions[K]['payload']): Action<K, typeof COMPONENT, ModelSelectorActions[K]['payload']> {
  return dispatch(createAction<ModelSelectorActions, K>(type, COMPONENT, payload))
}

export async function getModels(dispatch: any, getState: any) {
  runAction(dispatch, LOADING, true)
  try {
    const res = await getApi('models')
    runAction(dispatch, UPDATE_MODELS, res.data)
  } finally {
    runAction(dispatch, LOADING, false)
  }
}