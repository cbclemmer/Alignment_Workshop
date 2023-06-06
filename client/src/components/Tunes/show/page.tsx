import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { download } from '../../../lib/api'

import { find } from 'lodash'
import $ from 'jquery'

import { AppState, Conversation, Tune, Message } from '../../../lib/types'
import { Collection } from '../../../lib/collection'
import FormatSelector from '../../Format_Selector/page'

export default () => {
  const { id } = useParams()
  if (!id || isNaN(parseInt(id))) return (<div></div>)
  const numId = parseInt(id)
  
  const [currentTune, setCurrentTune] = useState('')
  const conversations = useSelector((state: AppState) => state.conversationList.items)
  const loading = useSelector((state: AppState) => state.conversationList.loading)
  const currentFormat = useSelector((state: AppState) => state.formatSelector.currentFormat)

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
    if (currentFormat == null || currentFormat.id == 0) return
    try {
      await download('tunes/download', { tune_id: id, format_id: currentFormat.id })
    } catch (e) {
      console.error('Tune Download Failed: ' + e)
    }
  }

  return (
    <div>
      {(loading) && <div>Loading...</div>}
      {!loading && <div>
      <h2>Tune: {currentTune}</h2>
      <FormatSelector />
      {currentFormat != null && currentFormat.id != 0 &&
      <button 
        style={ { marginTop: '20px' } }
        className='btn btn-primary'
        onClick={downloadTune}
      >
        Download
      </button>}
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