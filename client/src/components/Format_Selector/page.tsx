import '../../style.css'
import { find } from 'lodash'
import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import $ from 'jquery'
import { 
  getFormats,
  setFormat,
  deleteFormat
} from './actions'
import { LanguageModelData, AppState } from "../../lib/types"

const ModelSelector: React.FC = () => {
  const [modelName, setModelName] = useState('Select Model')
  const dispatch = useDispatch()
  const models: LanguageModelData[] = useSelector((state: AppState) => state.modelSelector.models)
  const currentModel: LanguageModelData | null = useSelector((state: AppState) => state.modelSelector.currentModel)
  const loading = useSelector((state: AppState) => state.modelSelector.loading);
  useEffect(() => {
    dispatch(getFormats as any)
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
    dispatch(setFormat(model) as any)
  }

  const deleteModelUI = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentModel == null) return
    dispatch(deleteFormat(currentModel) as any)
    setModelName('Select Model')
    dispatch(setFormat(null) as any)
  }

  return (
    <div>
      <b className={loading ? '' : 'hide'}>
        Loading Models...
      </b>
      <div className={loading ? 'hide' : ''}>
        <div className='row g-4'>
          <div className='col-md'>
            <div className='form-floating'>
                {models.length > 0 && <div className="dropdown">
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
                </div>}
            </div>
          </div>
          <div className='col-md'>
            <div className='form-floating'>
              <Link to="/model">Add Model</Link> 
            </div> 
          </div>
          <div className='col-md'>
            <div className='form-floating'>
              {currentModel != null && <Link to={"/model/" + currentModel.id}>Edit Model</Link>}
            </div> 
          </div>
          {currentModel != null && <div className='col-md'>
            <a href='#' className='form-floating' onClick={deleteModelUI}>
              Delete Model
            </a> 
          </div>}
        </div>
      </div>
    </div>
  )
}

export default ModelSelector