import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from 'react-router-dom'
import { createModel } from './actions'
import { LanguageModelData } from "../../lib/types"

const ModelEditor: React.FC = () => {
  const [nameInput, setNameInput] = useState('')
  const [systemMessageInput, setSystemMessageInput] = useState('')
  const [userNotationInput, setUserNotationInput] = useState('')
  const [assistantNotationInput, setAssistantNotationInput] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nameInput.trim()) return
    const model: LanguageModelData = {
      id: 0,
      name: nameInput,
      systemMessage: systemMessageInput,
      userNotation: userNotationInput,
      assistantNotation: assistantNotationInput
    }
    dispatch(createModel(navigate, model) as any)
  }

  return (
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
          <h4>
          System Message
          </h4>
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
  )
}

export default ModelEditor