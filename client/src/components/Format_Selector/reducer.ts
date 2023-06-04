import { LOADING, COMPONENT, FormatSelectorActions, UPDATE_FORMATS, SET_FORMAT } from "./actions"
import { Action, Format, FormatSelectorState } from "../../lib/types"

const initialState: FormatSelectorState = {
    loading: true,
    formats: [],
    currentFormat: {
        id: 0,
        name: 'Default',
        systemMessage: '',
        userNotation: 'User:',
        assistantNotation: 'Assistant:',
    }
}

function formatSystemMessage(systemMessage: string) {
    return systemMessage.split('\n').join('<br />')
}

export default function modelSelectorReducer(state = initialState, action: Action<keyof FormatSelectorActions, typeof COMPONENT, any>): FormatSelectorState {
    if (action.component != COMPONENT) return state
    switch (action.type) {
        case LOADING:
            return { ...state, loading: action.payload }
        case UPDATE_FORMATS:
            return { ...state, formats: action.payload }
        case SET_FORMAT:
            const format: Format = action.payload
            if (format != null) {
                format.formattedSystemMessage = formatSystemMessage(format.systemMessage)
            }
            return { ...state, currentFormat: format }
        default:
            return state
    }   
}