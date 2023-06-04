import { useNavigate } from 'react-router-dom'
import { getApi, postApi } from "../../lib/api"
import { Conversation, Tag } from "../../lib/types"
import { Collection } from '../../lib/collection'

export const createConversation = async (navigate: any, data: Conversation) => {
  const res = await postApi('conversation/create', data)
  if (!res) {
    console.error('ERROR: creating conversation failed')
    return
  }
  navigate('/')
}

export const editConversation = async (navigate: any, data: Conversation) => {
  const res = await postApi('conversation/edit', data)
  if (!res) {
    console.error('ERROR: editing conversation failed')
    return
  }
  navigate('/')
}

export const retrieveConversation = async (id: number): Promise<Conversation | null> => {
  const res = await getApi(`conversation/get/${id}/`)
  if (res.data.error) {
    console.error('ERROR: ' + res.data.error)
    return null
  }
  return res.data as Conversation
}

export const createTag = async (convId: number, tagName: string, collection: Collection<Tag, 'TAG_LIST'>) => {
  try {
    await collection.create({
      id: 0,
      name: tagName,
      conversation_id: convId
    })
    await collection.getList({ conversation_id: convId })
  } catch (e) {
    console.error('Error creating tag: ' + e)
  }
}