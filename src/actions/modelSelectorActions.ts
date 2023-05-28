import { Action, ActionList } from "../types"

export const LOADING = 'LOADING'
export const PAGE = 'MODEL_SELECTOR'

export interface ModelSelectorActions extends ActionList {
    LOADING: Action<typeof LOADING, typeof PAGE,  boolean>
}

export function getModels() {
}