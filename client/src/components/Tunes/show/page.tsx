import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useParams } from 'react-router-dom'

import { find } from 'lodash'
import $ from 'jquery'

import { AppState, Conversation, Tune } from '../../../lib/types'
import { Collection } from '../../../lib/collection'

export default () => {
  const { id } = useParams()
  if (!id || isNaN(parseInt(id))) return (<div></div>)
  const numId = parseInt(id)
  const [convName, setConvName] = useState('')
  const [editConvId, setEditConvId] = useState(0)
  const [editConvState, setEditConvState] = useState(false)
  
  const conversations = useSelector((state: AppState) => state.conversationList.items)
  const loading = useSelector((state: AppState) => state.conversationList.loading)
  const tuneLoading = useSelector((state: AppState) => state.currentTune.loading)

  const dispatch = useDispatch()
  const collection = new Collection<Conversation, 'CONV_LIST'>('CONV_LIST', 'conversation', dispatch)
  useEffect(() => {
    collection.getList({ tune_id: numId })
  }, [])

  const deleteConvUI = async (e: React.FormEvent) => {
    e.preventDefault()
    const id = $(e.target).data('id')
    const conv = find(conversations, (t: Conversation) => t.id.toString() == id)
    if (!conv) {
      console.error('Could not find tune with id: ' + id)
      return
    }
    await collection.remove(conv)
    await collection.getList({ tune_id: numId })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!convName.trim()) return
    const conv = { id: editConvId, tune_id: numId, name: convName }
    await (!!conv.id ? collection.edit(conv) : collection.create(conv))
    await collection.getList({ tune_id: numId })
    setEditConvState(false)
    setEditConvId(0)
    setConvName('')
  }

  const initEdit = (e: React.FormEvent) => {
    e.preventDefault()
    const id = $(e.target).data('id')
    const tune = find(conversations, (t: Tune) => t.id.toString() == id)
    if (!tune) {
      console.error('Could not find tune with id: ' + id)
      return
    }

    setEditConvState(true)
    setConvName(tune.name)
    setEditConvId(tune.id)
  }

  const stopEditing = (e: React.FormEvent) => {
    e.preventDefault()
    setEditConvId(0)
    setEditConvState(false)
    setConvName('')
  }

  return (
    <div>
      {(loading || tuneLoading) && <div>Loading...</div>}
      {!loading && !tuneLoading && <div>
        <div className={loading ? 'hide' : ''}>
        <form onSubmit={handleSubmit}>
          <div className='input-group mb-3'>
              <div className='input-group-prepend'>
              <span className='input-group-text'>
                  {editConvState ? 'Edit' : 'New'} Conversation Name
              </span>
              </div>
              <input
              type='text'
              className='form-control'
              value={convName}
              onChange={(e) => setConvName(e.target.value)}
              />
          </div>
          <button className="btn btn-primary" type="submit">
            {editConvState ? 'Edit' : 'Create' }
          </button>
        </form>
        {editConvState && <a 
          href='#'
          className='form-floating'
          onClick={stopEditing}
        >
            Stop Editing
        </a>}
      </div>
      <div style={ { marginTop: '15px' } }>
        <h2>Conversations</h2>
        {conversations.map((tune: Tune, index: number) => (
          <div key={index}>
            <Link to={`/tunes/show/${tune.id}`}>{tune.name}</Link>
            <button 
              type='button'
              data-id={tune.id}
              className='btn btn-outline-danger' 
              style={ { marginLeft: '20px' }}
              onClick={deleteConvUI}
            >
              X
            </button>

            <button 
              type='button'
              data-id={tune.id}
              className='btn btn-outline-warning' 
              style={ { marginLeft: '20px' }}
              onClick={initEdit}
            >
              Edit
            </button>
          </div>
        ))}
      </div>
      </div>}
    </div>
  )
}