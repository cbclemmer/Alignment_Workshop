import { LOADING, COMPONENT, ModelSelectorActions, UPDATE_MODELS } from "./actions"
import { Action, ModelSelectorState } from "../../types"

const initialState: ModelSelectorState = {
    loading: true,
    models: []
}

export default function modelSelectorReducer(state = initialState, action: Action<keyof ModelSelectorActions, typeof COMPONENT, any>): ModelSelectorState {
    if (action.component != COMPONENT) return state
    switch (action.type) {
        case LOADING:
            return { ...state, loading: action.payload }
        case UPDATE_MODELS:
            return { ...state, models: action.payload }
        default:
            return state
    }   
}