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
import { Format, AppState } from "../../lib/types"

const ModelSelector: React.FC = () => {
  const [formatName, setModelName] = useState('Select Model')
  const dispatch = useDispatch()
  const formats: Format[] = useSelector((state: AppState) => state.formatSelector.formats)
  const currentModel: Format | null = useSelector((state: AppState) => state.formatSelector.currentFormat)
  const loading = useSelector((state: AppState) => state.formatSelector.loading);
  useEffect(() => {
    dispatch(getFormats as any)
  }, [])

  const selectModel = (e: React.FormEvent) => {
    e.preventDefault()
    const id = $(e.target).data('id')
    const format = find(formats, (m: Format) => m.id.toString() == id)
    if (!format) {
      console.error('Could not find format with id: ' + id)
      return
    }
    setModelName(format.name)
    dispatch(setFormat(format) as any)
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
                {formats.length > 0 && <div className="dropdown">
                  <button 
                    className="btn btn-secondary dropdown-toggle" 
                    type="button" 
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >{formatName}</button>
                  <ul className="dropdown-menu">
                    {formats.map((format: Format) => (
                      <li 
                        key={format.id} 
                        className="dropdown-item" 
                        data-id={format.id}
                        onClick={selectModel}
                      >
                        {format.name}
                      </li>
                    ))}
                  </ul>
                </div>}
            </div>
          </div>
          <div className='col-md'>
            <div className='form-floating'>
              <Link to="/formats/new">Add Model</Link> 
            </div> 
          </div>
          <div className='col-md'>
            <div className='form-floating'>
              {currentModel != null && <Link to={"/format/" + currentModel.id}>Edit Model</Link>}
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