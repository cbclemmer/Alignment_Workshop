import { LOADING, ModelSelectorActions } from "../actions/modelSelectorActions"
import { Action, ModelSelectorState } from "../types"

const initialState: ModelSelectorState = {
    loading: false
}

export default function modelSelectorReducer(state = initialState, action: Action<keyof ModelSelectorActions, any>): ModelSelectorState {
    switch (action.type) {
        case LOADING:
            return { ...state, loading: action.payload }
        default:
            return state
    }   
}