import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { find } from 'lodash'
import $ from 'jquery'

import { AppState, Tune } from '../../../lib/types'
import { Collection } from '../../../lib/collection'

export default () => {
  const [tuneName, setTuneName] = useState('')
  const [editTuneId, setEditTuneId] = useState(0)
  const [editTuneState, setEditTuneState] = useState(false)
  
  const tunes = useSelector((state: AppState) => state.tuneList.items)
  const loading = useSelector((state: AppState) => state.tuneList.loading)

  const dispatch = useDispatch()
  const collection = new Collection<Tune, 'TUNE_LIST'>('TUNE_LIST', 'tune', dispatch)
  useEffect(() => {
    collection.getList()
  }, [])

  const deleteTuneUI = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!confirm('Delete this tune\'s data?')) {
      return
    }
    const id = $(e.target).data('id')
    const tune = find(tunes, (t: Tune) => t.id.toString() == id)
    if (!tune) {
      console.error('Could not find tune with id: ' + id)
      return
    }
    await collection.remove(tune)
    await collection.getList()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tuneName.trim()) return
    const tune = { id: editTuneId, name: tuneName }
    await (!!tune.id ? collection.edit(tune) : collection.create(tune))
    setEditTuneState(false)
    setEditTuneId(0)
    setTuneName('')
    await collection.getList()
  }

  const initEdit = (e: React.FormEvent) => {
    e.preventDefault()
    const id = $(e.target).data('id')
    const tune = find(tunes, (t: Tune) => t.id.toString() == id)
    if (!tune) {
      console.error('Could not find tune with id: ' + id)
      return
    }

    $('#collapseOne').addClass('show')

    setEditTuneState(true)
    setTuneName(tune.name)
    setEditTuneId(tune.id)
  }

  const stopEditing = (e: React.FormEvent) => {
    e.preventDefault()
    $('#collapseOne').removeClass('show')
    setEditTuneId(0)
    setEditTuneState(false)
    setTuneName('')
  }

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            Home
          </li>
        </ol>
      </nav>
      {loading && <div>Loading...</div>}
      {!loading && <div>
        <div className={loading ? 'hide' : ''}>
        <div className="accordion" id="newTune">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-controls="collapseOne">
                {editTuneState ? 'Edit Tune Name' : 'New Tune' }
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse" data-bs-parent="#newTune">
              <div className="accordion-body">
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
                  {editTuneState && <a 
                  href='#'
                  style={ { marginLeft: '15px' }}
                  className='form-floating btn btn-danger'
                  onClick={stopEditing}
                >
                    Stop Editing
                </a>}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={ { marginTop: '15px' } }>
        <h2>Tunes</h2>
        <ul className='list-group'>
          {tunes.map((tune: Tune, index: number) => (
            <li key={index} className='list-group-item'>
              <h4>
                <Link to={`/tunes/show/${tune.id}`}>{tune.name}</Link>
              </h4>
              <div>
                <button 
                  type='button'
                  data-id={tune.id}
                  className='btn btn-outline-danger'
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
                  Edit Name
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      </div>}
    </div>
  )
}