import { useNavigate } from 'react-router-dom'
import { postApi } from "../../lib/api"
import { LanguageModelData } from "../../lib/types"

export const createModel = (navigate: any, data: LanguageModelData) => async (dispatch: any, getState: any) => {
  const res = await postApi('create-model', data)
  if (!res) {
    console.error('ERROR: creating model failed')
    return
  }
  navigate('/')
}