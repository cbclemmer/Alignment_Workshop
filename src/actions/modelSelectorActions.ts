import { Action, ActionList } from "../types"

export const LOADING = 'LOADING'

export interface ModelSelectorActions extends ActionList {
    LOADING: Action<typeof LOADING, boolean>
}