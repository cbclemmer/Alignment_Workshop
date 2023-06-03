import { LOADING, COMPONENT, TuneListActions, UPDATE_TUNES } from "./actions"
import { Action, Tune, TuneListState } from "../../../lib/types"

const initialState: TuneListState = {
    loading: true,
    tunes: []
}

export default function modelSelectorReducer(state = initialState, action: Action<keyof TuneListActions, typeof COMPONENT, any>): TuneListState {
    if (action.component != COMPONENT) return state
    switch (action.type) {
        case LOADING:
            return { ...state, loading: action.payload }
        case UPDATE_TUNES:
            return { ...state, tunes: action.payload }
        default:
            return state
    }   
}