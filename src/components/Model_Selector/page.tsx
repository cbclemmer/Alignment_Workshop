import React, { useState, useEffect } from "react"
import './style.css'
import { useDispatch, useSelector } from 'react-redux'
import { 
  getModels
} from './actions'
import { LanguageModelData, AppState } from "../../types"

const ModelSelector: React.FC = () => {
  const [modelName, setModelName] = useState('model')
  const dispatch = useDispatch()
  const models: LanguageModelData[] = useSelector((state: AppState) => state.modelSelector.models)
  const loading = useSelector((state: AppState) => state.modelSelector.loading);
  useEffect(() => {
    dispatch(getModels as any)
  }, [])

  const selectModel = (e: React.FormEvent) => {
      const name = $(e.target).data('name')
      setModelName(name)
  }

  return (
    <div className="input-group mb-3">
      <b className={loading ? '' : 'hide'}>
        Loading Models...
      </b>
      <div className={loading ? 'hide' : ''}>
        <div className="input-group-prepend">
          <button 
            className="btn btn-outline-secondary dropdown-toggle" 
            type="button" 
            data-toggle="dropdown" 
            aria-haspopup="true" 
            aria-expanded="false"
          >{modelName}</button>
          <div className="dropdown-menu">
            {models.map((model: LanguageModelData) => (
              <a 
                className="dropdown-item" 
                href="#" 
                data-name={model.name}
                onClick={selectModel}
              >{model.name}</a>
            ))}
          </div>
        </div>
      </div>
  </div>
  )
}

export default ModelSelector