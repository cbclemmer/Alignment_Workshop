import { LOADING, COMPONENT, ModelSelectorActions, UPDATE_MODELS, SET_MODEL } from "./actions"
import { Action, ModelSelectorState } from "../../lib/types"

const initialState: ModelSelectorState = {
    loading: true,
    models: [],
    currentModel: null
}

export default function modelSelectorReducer(state = initialState, action: Action<keyof ModelSelectorActions, typeof COMPONENT, any>): ModelSelectorState {
    if (action.component != COMPONENT) return state
    switch (action.type) {
        case LOADING:
            return { ...state, loading: action.payload }
        case UPDATE_MODELS:
            return { ...state, models: action.payload }
        case SET_MODEL:
            return { ...state, currentModel: action.payload }
        default:
            return state
    }   
}