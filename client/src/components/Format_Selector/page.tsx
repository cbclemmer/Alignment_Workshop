import '../../style.css'
import { find } from 'lodash'
import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import $ from 'jquery'
import { 
  getFormats,
  setFormat,
  deleteFormat,
  canDeleteFormat
} from './actions'
import { Format, AppState } from "../../lib/types"

export default () => {
  const [formatName, setFormatName] = useState('Select Format')
  const dispatch = useDispatch()
  const formats: Format[] = useSelector((state: AppState) => state.formatSelector.formats)
  const currentFormat: Format | null = useSelector((state: AppState) => state.formatSelector.currentFormat)
  const loading = useSelector((state: AppState) => state.formatSelector.loading);
  useEffect(() => {
    dispatch(getFormats as any)
  }, [])

  const selectFormat = (e: React.FormEvent) => {
    e.preventDefault()
    const id = $(e.target).data('id')
    const format = find(formats, (m: Format) => m.id.toString() == id)
    if (!format) {
      console.error('Could not find format with id: ' + id)
      return
    }
    setFormatName(format.name)
    dispatch(setFormat(format) as any)
  }

  const deleteFormatUI = (e: React.FormEvent) => {
    if (!confirm('Delete this format?')) {
      return
    }
    e.preventDefault()
    if (currentFormat == null) return
    (async () => {
      if (!(await canDeleteFormat(currentFormat.id))) {
        return
      }
      dispatch(deleteFormat(currentFormat) as any)
      setFormatName('Select Format')
      dispatch(setFormat(null) as any)
    })()
  }

  return (
    <div>
      <b className={loading ? '' : 'hide'}>
        Loading Formats...
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
                  >Select Format</button>
                  <ul className="dropdown-menu">
                    {formats.map((format: Format) => (
                      <li 
                        key={format.id} 
                        className="dropdown-item" 
                        data-id={format.id}
                        onClick={selectFormat}
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
              <Link to="/formats/new">Add Format</Link> 
            </div> 
          </div>
        </div>
        {currentFormat != null && currentFormat.id != 0 && 
          <div className='alert alert-info' role='alert' style={ { marginTop: '15px' } }>
            <h4>
              Current Format: <b>{currentFormat.name}</b>
            </h4>
            <div className='form-floating'>
              <Link to={"/formats/edit/" + currentFormat.id}>Edit Format</Link>
            </div> 
            <a href='#' className='form-floating' onClick={deleteFormatUI}>
              Delete Format
            </a>
          </div>
        }
      </div>
    </div>
  )
}