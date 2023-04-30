import { ThunkAction } from 'redux-thunk';
import { RootState } from '../reducers';
import axios from 'axios';

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, LanguageModelActionTypes>;

export const LOADING = 'LOADING';

export const POST_MESSAGE = 'POST_MESSAGE';

const API_URI = 'http://localhost:5000/api/v1/generate';

interface PostMessageAction {
  type: string;
  payload?: string;
}

export type LanguageModelActionTypes = PostMessageAction;

export const loading = (): LanguageModelActionTypes => {
  return {
    type: LOADING
  };
};

export const postMessage = (message: string): AppThunk => async (dispatch: any) => {
  try {
    dispatch(loading());
    const response = await axios.post('http://localhost:4000/api/v1/generate', { message });
    const result = response.data;

    dispatch({
      type: POST_MESSAGE,
      payload: result,
    });
  } catch (error) {
    console.error('Error posting message:', error);
  }
};
