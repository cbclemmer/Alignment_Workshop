import { reject } from "lodash"
import { getApi, postApi } from "../../lib/api"
import { createAction } from "../../lib/util"
import { Action, ActionList, AppState, Format } from "../../lib/types"

export const COMPONENT = 'FORMAT_SELECTOR'

export const LOADING = 'LOADING'
export const UPDATE_FORMATS = 'UPDATE_MODELS'
export const SET_FORMAT = 'SET_MODEL'

export interface FormatSelectorActions extends ActionList {
  LOADING: Action<typeof LOADING, typeof COMPONENT,  boolean>,
  UPDATE_FORMATS: Action<typeof UPDATE_FORMATS, typeof COMPONENT, Format[]>
  SET_FORMAT: Action<typeof SET_FORMAT, typeof COMPONENT, Format | null>
}

function runAction<K extends keyof FormatSelectorActions>(dispatch: any, type: K, payload: FormatSelectorActions[K]['payload']): Action<K, typeof COMPONENT, FormatSelectorActions[K]['payload']> {
  return dispatch(createAction<FormatSelectorActions, K>(type, COMPONENT, payload))
}

export async function getFormats(dispatch: any, getState: any) {
  runAction(dispatch, LOADING, true)
  try {
    const res = await getApi('format/list')
    runAction(dispatch, UPDATE_FORMATS, res.data)
  } finally {
    runAction(dispatch, LOADING, false)
  }
}

export const setFormat = (model: Format | null) => (dispatch: any, getState: any) => {
  runAction(dispatch, SET_FORMAT, model)
}

export const canDeleteFormat = async (id: number): Promise<boolean> => {
  const { data } = await getApi('format/delete-check', { id: id })
  if (data.error) {
    alert(data.error)
    return false
  }
  if (!data.passed) {
    alert('There is a format associated with a tune, cannot delete format')
    return false
  }
  return true
}

export const deleteFormat = (model: Format) => async (dispatch: any, getState: any) => {
  runAction(dispatch, LOADING, true)
  try {
    const res = await postApi('format/delete', model)
    if (!!res.data.error) {
      console.error(res.data.errror)
      return false
    }
    getFormats(dispatch, getState)
  } finally {
    runAction(dispatch, LOADING, false)
    return true
  }
}