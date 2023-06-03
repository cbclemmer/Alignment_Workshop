import { LOADING, COMPONENT, ModelSelectorActions, UPDATE_MODELS, SET_MODEL } from "./actions"
import { Action, LanguageModelData, ModelSelectorState } from "../../lib/types"

const initialState: ModelSelectorState = {
    loading: true,
    models: [],
    currentModel: null
}

function formatSystemMessage(systemMessage: string) {
    return systemMessage.split('\n').join('<br />')
}

export default function modelSelectorReducer(state = initialState, action: Action<keyof ModelSelectorActions, typeof COMPONENT, any>): ModelSelectorState {
    if (action.component != COMPONENT) return state
    switch (action.type) {
        case LOADING:
            return { ...state, loading: action.payload }
        case UPDATE_MODELS:
            return { ...state, models: action.payload }
        case SET_MODEL:
            const model: LanguageModelData = action.payload
            model.formattedSystemMessage = formatSystemMessage(model.systemMessage)
            return { ...state, currentModel: model }
        default:
            return state
    }   
}