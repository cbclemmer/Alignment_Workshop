import React, { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { Link, useNavigate, useParams } from 'react-router-dom'

import { find } from 'lodash'
import $ from 'jquery'

import { retrieveConversation, createTag } from './actions'
import { AppState, Conversation, Tag } from "../../lib/types"
import { Collection } from "../../lib/collection"
import { useSelector } from "react-redux"

export default () => {
  const { id, tuneid } = useParams()
  const numId = id === undefined ? NaN : parseInt(id)
  const numTuneId = tuneid === undefined ? NaN : parseInt(tuneid)

  const [loading, setLoading] = useState(false)
  const [convTuneId, setTuneId] = useState(0)
  const [nameInput, setNameInput] = useState('')
  const [newTagInput, setNewTagInput] = useState('')
  const tags = useSelector((state: AppState) => state.tagList.items)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const convCollection = new Collection<Conversation, 'CONVERSATION_EDITOR'>('CONVERSATION_EDITOR', 'conversation', dispatch)
  const tagCollection = new Collection<Tag, 'TAG_LIST'>('TAG_LIST', 'tag', dispatch)

  
  useEffect(() => {
    (async () => {
      if (!isNaN(numTuneId)) {
        setTuneId(numTuneId)
      }
      if (!id || isNaN(numId)) return
      setLoading(true)
      const conversation = await retrieveConversation(parseInt(id))
      setLoading(false)
      if (conversation == null) return
      setNameInput(conversation.name)
      setTuneId(conversation.tune_id)
      tagCollection.getList({ conversation_id: numId })
    })()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nameInput.trim()) return
    const conversation: Conversation = {
      id: !!id ? parseInt(id) : 0,
      tune_id: convTuneId,
      name: nameInput
    }
    await (!!id ? convCollection.edit(conversation) : convCollection.create(conversation))
    navigate('/tunes/show/' + conversation.tune_id)
  }

  const addTagUI = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTagInput.trim()) return
    createTag(numId, newTagInput, tagCollection)
    setNewTagInput('')
  }

  const deleteTagUI = async (e: React.FormEvent) => {
    e.preventDefault()
    const id = $(e.target).data('id')
    const tag = find(tags, (tag: Tag) => tag.id == id)
    if (!tag) return
    await tagCollection.remove(tag)
    await tagCollection.getList({ conversation_id: numId })
  }

  return (
    <div>
      <b className={loading ? '' : 'hide'}>
        Loading Formats...
      </b>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to={'/'}>Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={'/tunes/show/' + convTuneId}>Tune</Link>
          </li>
          {id && <li className="breadcrumb-item active" aria-current="page">
            <Link to={`/conversations/show/${id}`}>Conversation</Link>
          </li>}
          {!id && <li className="breadcrumb-item active" aria-current="page">
            New Conversation
          </li>}
          {id && <li className="breadcrumb-item active" aria-current="page">
            Edit Conversation Metadata
          </li>}
        </ol>
      </nav>
      <div className={loading ? 'hide' : ''}>
        <form onSubmit={handleSubmit}>
          <h2 className="text-center mb-4">Conversation</h2>
          <div className='input-group mb-3'>
              <div className='input-group-prepend'>
              <span className='input-group-text'>
                  Conversation Name
              </span>
              </div>
              <input
              type='text'
              className='form-control'
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              />
          </div>
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </form>
        {!!id && <div className='mb-3' style={ { paddingTop: '20px' } }>
          <h4>Tags</h4>
          <div className='input-group-prepend'>
            <span className='input-group-text'>
                Tag Name
            </span>
          </div>
          <input
          type='text'
          className='form-control'
          value={newTagInput}
          onChange={(e) => setNewTagInput(e.target.value)}
          />
          <button 
            className="btn btn-primary"
            onClick={addTagUI}
          >
            Add Tag
          </button>
          <ul>
            {tags.map((tag: Tag, index: number) => (
              <li key={index}>
                #{tag.name}
                <button 
                  data-id={tag.id}
                  className="btn btn-outline-danger"
                  onClick={deleteTagUI}
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        </div>}
      </div>
    </div>
  )
}