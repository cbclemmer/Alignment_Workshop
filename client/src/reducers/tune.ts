import { 
  UPDATE_TUNE,
  COMPONENT,
  CurrentTuneActions,
  LOADING
} from '../actions/tune';
import { 
  Tune,
  Action,
  CurrentTuneState
} from '../lib/types';

const initialState: CurrentTuneState = {
  tune: null,
  loading: false
}

export default function (state = initialState, action: Action<keyof CurrentTuneActions, typeof COMPONENT, any>): CurrentTuneState {
  if (action.component != COMPONENT) return state
  switch (action.type) {
    case LOADING:
      return { ...state, loading: action.payload as boolean }
    case UPDATE_TUNE:
      return { ...state, tune: action.payload as Tune }
    default:
      return state
  }
}