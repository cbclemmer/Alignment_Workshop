import { useNavigate } from 'react-router-dom'
import { getApi, postApi } from "../../lib/api"
import { LanguageModelData } from "../../lib/types"

export const createModel = async (navigate: any, data: LanguageModelData) => {
  const res = await postApi('create-model', data)
  if (!res) {
    console.error('ERROR: creating model failed')
    return
  }
  navigate('/')
}

export const editModel = async (navigate: any, data: LanguageModelData) => {
  const res = await postApi('edit-model', data)
  if (!res) {
    console.error('ERROR: creating model failed')
    return
  }
  navigate('/')
}

export const retrieveModel = async (id: number): Promise<LanguageModelData | null> => {
  const res = await getApi('models/' + id)
  if (res.data.error) {
    console.error('ERROR: ' + res.data.error)
    return null
  }
  return res.data as LanguageModelData
}