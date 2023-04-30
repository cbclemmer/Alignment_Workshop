import { ThunkAction } from 'redux-thunk';
import { RootState } from '../reducers';
import axios from 'axios';

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, LanguageModelActionTypes>;

export const POST_MESSAGE = 'POST_MESSAGE';

const API_URI = 'http://localhost:5000/api/v1/generate';

interface PostMessageAction {
  type: typeof POST_MESSAGE;
  payload: string;
}

export type LanguageModelActionTypes = PostMessageAction;

export const postMessage = (message: string): AppThunk => async (dispatch: any) => {
  const requestBody = {
    // Add your request parameters here
    prompt: message,
    max_new_tokens: 250,
    do_sample: true,
    temperature: 1.3,
    top_p: 0.1,
    typical_p: 1,
    repetition_penalty: 1.18,
    top_k: 40,
    min_length: 0,
    no_repeat_ngram_size: 0,
    num_beams: 1,
    penalty_alpha: 0,
    length_penalty: 1,
    early_stopping: false,
    seed: -1,
    add_bos_token: true,
    truncation_length: 2048,
    ban_eos_token: false,
    skip_special_tokens: true,
    stopping_strings: []
  };

  try {
    const response = await axios.post(API_URI, requestBody);
    const result = response.data.results[0].text;

    dispatch({
      type: POST_MESSAGE,
      payload: result,
    });
  } catch (error) {
    console.error('Error posting message:', error);
  }
};
