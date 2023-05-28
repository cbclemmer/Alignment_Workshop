import React, { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from 'react-router-dom'
import { createModel, editModel, retrieveModel } from './actions'
import { LanguageModelData } from "../../lib/types"

const ModelEditor: React.FC = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [systemMessageInput, setSystemMessageInput] = useState('')
  const [userNotationInput, setUserNotationInput] = useState('')
  const [assistantNotationInput, setAssistantNotationInput] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      if (!id || isNaN(parseInt(id))) return
      setLoading(true)
      const model = await retrieveModel(parseInt(id))
      setLoading(false)
      if (model == null) return
      setNameInput(model.name)
      setSystemMessageInput(model.systemMessage)
      setUserNotationInput(model.userNotation)
      setAssistantNotationInput(model.assistantNotation)
    })()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nameInput.trim()) return
    const model: LanguageModelData = {
      id: !!id ? parseInt(id) : 0,
      name: nameInput,
      systemMessage: systemMessageInput,
      userNotation: userNotationInput,
      assistantNotation: assistantNotationInput
    }
    !!id ? editModel(navigate, model) : createModel(navigate, model)
  }

  return (
    <div>
      <b className={loading ? '' : 'hide'}>
        Loading Models...
      </b>
      <div className={loading ? 'hide' : ''}>
        <form onSubmit={handleSubmit}>
          <h2 className="text-center mb-4">Model</h2>
          <div className='input-group mb-3'>
              <div className='input-group-prepend'>
              <span className='input-group-text'>
                  Model Name
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

export default ModelEditor