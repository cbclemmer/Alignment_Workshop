import { useSelector } from 'react-redux'
import $ from 'jquery'
import { AppState, Tune } from '../../../lib/types'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { createConversation, getConversations, deleteTune, editTune } from './actions'
import React from 'react';
import { find } from 'lodash'

export default () => {
  const [tuneName, setTuneName] = useState('')
  const [editTuneId, setEditTuneId] = useState(0)
  const [editTuneState, setEditTuneState] = useState(false)
  
  const tunes = useSelector((state: AppState) => state.tuneList.tunes)
  const loading = useSelector((state: AppState) => state.tuneList.loading)

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getConversations as any)
  }, [])

  const deleteTuneUI = (e: React.FormEvent) => {
    e.preventDefault()
    const id = $(e.target).data('id')
    const tune = find(tunes, (t: Tune) => t.id.toString() == id)
    if (!tune) {
      console.error('Could not find tune with id: ' + id)
      return
    }
    dispatch(deleteTune(tune) as any)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tuneName.trim()) return
    const tune = { id: editTuneId, name: tuneName }
    !!tune.id ? editTune(dispatch, tune) : createConversation(dispatch, tune)
    setEditTuneState(false)
    setEditTuneId(0)
    setTuneName('')
  }

  const initEdit = (e: React.FormEvent) => {
    e.preventDefault()
    const id = $(e.target).data('id')
    const tune = find(tunes, (t: Tune) => t.id.toString() == id)
    if (!tune) {
      console.error('Could not find tune with id: ' + id)
      return
    }

    setEditTuneState(true)
    setTuneName(tune.name)
    setEditTuneId(tune.id)
  }

  const stopEditing = (e: React.FormEvent) => {
    e.preventDefault()
    setEditTuneId(0)
    setEditTuneState(false)
    setTuneName('')
  }

  return (
    <div>
      {loading && <div>Loading...</div>}
      {!loading && <div>
        <div className={loading ? 'hide' : ''}>
        <form onSubmit={handleSubmit}>
          <div className='input-group mb-3'>
              <div className='input-group-prepend'>
              <span className='input-group-text'>
                  {editTuneState ? 'Edit' : 'New'} Tune Name
              </span>
              </div>
              <input
              type='text'
              className='form-control'
              value={tuneName}
              onChange={(e) => setTuneName(e.target.value)}
              />
          </div>
          <button className="btn btn-primary" type="submit">
            {editTuneState ? 'Edit' : 'Create' }
          </button>
        </form>
        {editTuneState && <a 
          href='#'
          className='form-floating'
          onClick={stopEditing}
        >
            Stop Editing
        </a>}
      </div>
      <div style={ { marginTop: '15px' } }>
        <h2>Conversations for {}</h2>
        {tunes.map((tune: Tune, index: number) => (
          <div key={index}>
            <Link to={`/tunes/show/${tune.id}`}>{tune.name}</Link>
            <button 
              type='button'
              data-id={tune.id}
              className='btn btn-outline-danger' 
              style={ { marginLeft: '20px' }}
              onClick={deleteTuneUI}
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