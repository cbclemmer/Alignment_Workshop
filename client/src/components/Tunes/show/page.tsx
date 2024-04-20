import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { download } from '../../../lib/api'

import { find } from 'lodash'
import $ from 'jquery'

import { AppState, Conversation, Tune, Message } from '../../../lib/types'
import { Collection } from '../../../lib/collection'

export default () => {
  const { id } = useParams()
  if (!id || isNaN(parseInt(id))) return (<div></div>)
  const numId = parseInt(id)
  
  const [currentTune, setCurrentTune] = useState('')
  const conversations = useSelector((state: AppState) => state.conversationList.items)
  const loading = useSelector((state: AppState) => state.conversationList.loading)

  const dispatch = useDispatch()
  const collection = new Collection<Conversation, 'CONV_LIST'>('CONV_LIST', 'conversation', dispatch)
  const messageCollection = new Collection<Message, 'MESSAGE_LIST'>('MESSAGE_LIST', 'message', dispatch)
  const tuneCollection = new Collection<Tune, 'TUNE_LIST'>('TUNE_LIST', 'tune', dispatch)
  useEffect(() => {
    (async () => {
      await messageCollection.emptyList()
      await collection.getList({ tune_id: numId })
      const tune = await tuneCollection.getOne(numId)
      if (tune == null) return
      setCurrentTune(tune.name)
    })()
  }, [])

  const deleteConvUI = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!confirm('Delete this conversation?')) {
      return
    }
    const id = $(e.target).data('id')
    const conv = find(conversations, (t: Conversation) => t.id.toString() == id)
    if (!conv) {
      console.error('Could not find tune with id: ' + id)
      return
    }
    await collection.remove(conv)
    await collection.getList({ tune_id: numId })
  }

  const downloadTune = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await download('tunes/download', { tune_id: id })
    } catch (e) {
      console.error('Tune Download Failed: ' + e)
    }
  }
  
  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to={'/'}>Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current='page'>
            Tune
          </li>
        </ol>
      </nav>
      {(loading) && <div>Loading...</div>}
      {!loading && <div>
      <h2>Tune: {currentTune}</h2>
      <button 
        style={ { marginTop: '20px' } }
        className='btn btn-primary'
        onClick={downloadTune}
      >
        Download tune data
      </button>
      
      <div style={ { marginTop: '15px' } }>
        <h2>Conversations</h2>
        <Link to={`/conversations/new/${id}`} className='btn btn-primary'>New Conversation</Link>
        <ul className='list-group' style={ { marginTop: '15px' } }>
          {conversations.map((tune: Conversation, index: number) => (
            <li key={index} className='list-group-item'>
              <h4>
              <Link to={`/conversations/show/${tune.id}`}>{tune.name}</Link>
              </h4>
              <div>       
                <button 
                  type='button'
                  data-id={tune.id}
                  className='btn btn-outline-danger'
                  onClick={deleteConvUI}
                >
                  X
                </button>
                <Link style={ { marginLeft: '15px' } } className='btn btn-outline-warning' to={`/conversations/edit/${tune.id}`}>Edit</Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
      </div>}
    </div>
  )
}