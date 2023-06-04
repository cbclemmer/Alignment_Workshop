import { useNavigate } from 'react-router-dom'
import { getApi, postApi } from "../../lib/api"
import { Format } from "../../lib/types"

export const createFormat = async (navigate: any, data: Format) => {
  const res = await postApi('format/create', data)
  if (!res) {
    console.error('ERROR: creating model failed')
    return
  }
  navigate('/')
}

export const editFormat = async (navigate: any, data: Format) => {
  const res = await postApi('format/edit', data)
  if (!res) {
    console.error('ERROR: creating model failed')
    return
  }
  navigate('/')
}

export const retrieveFormat = async (id: number): Promise<Format | null> => {
  const res = await getApi(`format/get/${id}/`)
  if (res.data.error) {
    console.error('ERROR: ' + res.data.error)
    return null
  }
  return res.data as Format
}