import { LOADING, COMPONENT, ModelSelectorActions } from "./actions"
import { Action, ModelSelectorState } from "../../types"

const initialState: ModelSelectorState = {
    loading: false
}

export default function modelSelectorReducer(state = initialState, action: Action<keyof ModelSelectorActions, typeof COMPONENT, any>): ModelSelectorState {
    switch (action.action) {
        case LOADING:
            return { ...state, loading: action.payload }
        default:
            return state
    }   
}