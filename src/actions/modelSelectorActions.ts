import { Action, ActionList } from "../types"

export const COMPONENT = 'MODEL_SELECTOR'

export const LOADING = 'LOADING'

export interface ModelSelectorActions extends ActionList {
    LOADING: Action<typeof LOADING, typeof COMPONENT,  boolean>
}

export function getModels() {
}