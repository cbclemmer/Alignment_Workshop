import './style.css'
import { find } from 'lodash'
import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import $ from 'jquery'
import { 
  getModels,
  setModel
} from './actions'
import { LanguageModelData, AppState } from "../../lib/types"

const ModelSelector: React.FC = () => {
  const [modelName, setModelName] = useState('Select Model')
  const dispatch = useDispatch()
  const models: LanguageModelData[] = useSelector((state: AppState) => state.modelSelector.models)
  const currentModel: LanguageModelData | null = useSelector((state: AppState) => state.modelSelector.currentModel)
  const loading = useSelector((state: AppState) => state.modelSelector.loading);
  useEffect(() => {
    dispatch(getModels as any)
  }, [])

  const selectModel = (e: React.FormEvent) => {
    e.preventDefault()
    const id = $(e.target).data('id')
    const model = find(models, (m: LanguageModelData) => m.id.toString() == id)
    if (!model) {
      console.error('Could not find model with id: ' + id)
      return
    }
    setModelName(model.name)
    dispatch(setModel(model) as any)
  }

  return (
    <div className="input-group mb-3">
      <b className={loading ? '' : 'hide'}>
        Loading Models...
      </b>
      <div className={loading ? 'hide' : ''}>
        <div className='input-group-prepend'>
          <div className="dropdown">
            <button 
              className="btn btn-secondary dropdown-toggle" 
              type="button" 
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >{modelName}</button>
            <ul className="dropdown-menu">
              {models.map((model: LanguageModelData) => (
                <li 
                  key={model.id} 
                  className="dropdown-item" 
                  data-id={model.id}
                  onClick={selectModel}
                >
                  {model.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className='input-group mb-3'>
        <Link to="/model">Add Model</Link> 
      </div>
      <div className='input-group mb-3'>
        {currentModel != null && <Link to={"/model/" + currentModel.id}>Edit Model</Link>}
      </div>
  </div>
  )
}

export default ModelSelector