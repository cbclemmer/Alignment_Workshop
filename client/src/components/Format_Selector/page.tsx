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
import { download } from '../../lib/api'

export default ({ tuneId }: { tuneId: number }) => {
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

  const downloadTune = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentFormat == null || currentFormat.id == 0) return
    try {
      await download('tunes/download', { tune_id: tuneId, format_id: currentFormat.id })
    } catch (e) {
      console.error('Tune Download Failed: ' + e)
    }
  }

  const deleteFormatUI = (e: React.FormEvent) => {
    if (!confirm('Delete this format?')) {
      return
    }
    e.preventDefault()
    if (currentFormat == null) return
    dispatch(deleteFormat(currentFormat) as any)
    setFormatName('Select Format')
    dispatch(setFormat(null) as any)
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
                  >{formatName}</button>
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
            <div>
              <button 
                style={ { marginTop: '20px' } }
                className='btn btn-primary'
                onClick={downloadTune}
              >
                Download tune data with this format
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  )
}