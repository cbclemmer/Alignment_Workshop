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
  
  const conversations = useSelector((state: AppState) => state.conversationList.items)
  const loading = useSelector((state: AppState) => state.conversationList.loading)

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

  return (
    <div>
      {(loading) && <div>Loading...</div>}
      {!loading && <div>
      <div style={ { marginTop: '15px' } }>
        <h2>Conversations</h2>
        <Link to={`/conversations/new/${id}`}>New Conversation</Link>
        {conversations.map((tune: Tune, index: number) => (
          <div key={index}>
            <Link to={`/conversations/show/${tune.id}`}>{tune.name}</Link>
            <button 
              type='button'
              data-id={tune.id}
              className='btn btn-outline-danger' 
              style={ { marginLeft: '20px' }}
              onClick={deleteConvUI}
            >
              X
            </button>

            <Link to={`/conversations/edit/${tune.id}`}>Edit</Link>
          </div>
        ))}
      </div>
      </div>}
    </div>
  )
}