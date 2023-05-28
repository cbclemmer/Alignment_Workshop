import { Action, ActionList } from "./types"

export function createAction<T extends ActionList, K extends keyof T>(type: K, payload: T[K]['payload']): Action<K, T[K]['payload']> {
  return {
    type: type, 
    payload: payload
  }
}