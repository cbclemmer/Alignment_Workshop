import React, { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from 'react-router-dom'
import { createFormat, editFormat, retrieveFormat } from './actions'
import { Format } from "../../lib/types"
import { Collection } from "../../lib/collection"

export default () => {
  const { id } = useParams()
  const numId = id === undefined ? NaN : parseInt(id)

  const [loading, setLoading] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [systemMessageInput, setSystemMessageInput] = useState('')
  const [userNotationInput, setUserNotationInput] = useState('')
  const [assistantNotationInput, setAssistantNotationInput] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const collection = new Collection<Format, 'FORMAT_EDITOR'>('FORMAT_EDITOR', 'format', dispatch)

  useEffect(() => {
    (async () => {
      if (!id || isNaN(parseInt(id))) return
      setLoading(true)
      const format = await retrieveFormat(parseInt(id))
      setLoading(false)
      if (format == null) return
      setNameInput(format.name)
      setSystemMessageInput(format.systemMessage)
      setUserNotationInput(format.userNotation)
      setAssistantNotationInput(format.assistantNotation)
    })()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nameInput.trim()) return
    const format: Format = {
      id: !!id ? parseInt(id) : 0,
      name: nameInput,
      systemMessage: systemMessageInput,
      userNotation: userNotationInput,
      assistantNotation: assistantNotationInput
    }
    await (!!id ? collection.edit(format) : collection.create(format))
    navigate('/')
  }

  return (
    <div>
      <b className={loading ? '' : 'hide'}>
        Loading Formats...
      </b>
      <div className={loading ? 'hide' : ''}>
        <form onSubmit={handleSubmit}>
          <h2 className="text-center mb-4">Format</h2>
          <div className='input-group mb-3'>
              <div className='input-group-prepend'>
              <span className='input-group-text'>
                  Format Name
              </span>
              </div>
              <input
              type='text'
              className='form-control'
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              />
          </div>
          <div className='mb-3'>
              <label className="input-group-text">
              System Message
              </label>
              <textarea
              className='form-control'
              value={systemMessageInput}
              onChange={(e) => setSystemMessageInput(e.target.value)}
              ></textarea>
          </div>
          <div className='input-group mb-3'>
              <div className='input-group-prepend'>
              <span className='input-group-text'>
                  User Notation
              </span>
              </div>
              <input
              type='text'
              className='form-control'
              value={userNotationInput}
              onChange={(e) => setUserNotationInput(e.target.value)}
              />
          </div>
          <div className='input-group mb-3'>
              <div className='input-group-prepend'>
              <span className='input-group-text'>
                  Assistant Notation
              </span>
              </div>
              <input
              type='text'
              className='form-control'
              value={assistantNotationInput}
              onChange={(e) => setAssistantNotationInput(e.target.value)}
              />
          </div>
          <button className="btn btn-primary" type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  )
}