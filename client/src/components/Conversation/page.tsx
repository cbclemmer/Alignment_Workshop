import '../../style.css'
import React, { useEffect, useState } from 'react'
import $ from 'jquery'
import { useDispatch, useSelector } from 'react-redux';
import { 
  postMessage, 
  editMessage,
  addEmptyMessage,
  removeLastMessage
} from './actions'

import { setFormat } from '../Format_Selector/actions'
import { AppState, Message, Tune, Conversation, Format } from '../../lib/types'
import { Link, useParams } from 'react-router-dom';
import { getConversation } from '../../actions/conversation';
import { Collection } from '../../lib/collection';

export default () => {
  const { id } = useParams()
  if (!id || isNaN(parseInt(id))) return (<div>Incorrect ID</div>)
  const numId = parseInt(id)
  
  const [input, setInput] = useState('');
  const dispatch = useDispatch()
  const loading = useSelector((state: AppState) => state.messageList.loading)
  const messages = useSelector((state: AppState) => state.messageList.items)
  const conversation = useSelector((state: AppState) => state.currentConversation.conversation)
  const currentFormat = useSelector((state: AppState) => state.formatSelector.currentFormat)
  const tuneCollection = new Collection<Tune, 'TUNE_LIST'>('TUNE_LIST', 'tune', dispatch)
  const convCollection = new Collection<Conversation, 'CONV_LIST'>('CONV_LIST', 'conversation', dispatch)
  const msgCollection = new Collection<Message, 'MESSAGE_LIST'>('MESSAGE_LIST', 'message', dispatch)
  const fmtCollection = new Collection<Format, 'FMT'>('FMT', 'format', dispatch)

  useEffect(() => {
    (async () => {
      getConversation(dispatch, numId)
      const conv = await convCollection.getOne(numId)
      if (conv == null) return
      const tune = await tuneCollection.getOne(conv.tune_id)
      if (tune == null) return
      const format = await fmtCollection.getOne(tune.format_id)
      if (format == null) return
      dispatch(setFormat(format) as any)
  
      msgCollection.getList({ conversation_id: numId })
    })()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    console.log('SUBMIT')
    e.preventDefault();
    if (!input.trim() || currentFormat == null || conversation == null) return
    postMessage(input, currentFormat, conversation, messages, msgCollection);
    setInput('')
  }

  const addEmptyMessageUI = (e: React.FormEvent) => {
    e.preventDefault()
    if (conversation == null) return
    addEmptyMessage(msgCollection, messages, conversation.id)
  }

  const removeLastMessageUI = (e: React.FormEvent) => {
    e.preventDefault()
    if (conversation == null) return
    removeLastMessage(msgCollection, messages, conversation.id)
  }

  const handleMessageChange = (e: any) => {
    const index = $(e.target).data('index')
    const text = e.target.value
    const message = messages[index]
    if (conversation == null) return
    editMessage(conversation.id, text, message, msgCollection)
  }

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to={'/'}>Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/tunes/show/${conversation?.tune_id}`}>Tune</Link>
          </li>
          <li className="breadcrumb-item active" aria-current='page'>
            Edit Conversation
          </li>
        </ol>
      </nav>
      <h2 className="text-center mb-4">Conversation: {conversation?.name}</h2>
      <div className={currentFormat != null && currentFormat.id ? '' : 'hide'}>
        <b>System Message:</b>
        <div className='alert alert-light' role='alert' style={ { marginTop: '15px' } }>
          <p dangerouslySetInnerHTML={{ __html: currentFormat?.formattedSystemMessage ?? '' }}></p>
        </div>
      </div>
      <div className="mb-3">
        {messages.map((message: Message, index: number) => (
          <div key={index}>
            <b>{message.isUser ? currentFormat?.userNotation : currentFormat?.assistantNotation}</b><br></br>
            <textarea
              style={ { width: '100%' } }
              defaultValue={message.text_data}
              data-index={index}
              className={`alert alert-${message.isUser ? 'primary' : 'secondary'}`}
              onBlur={handleMessageChange}  
            />
          </div>
        ))}
      </div>
      <div>
        {loading && <p className="text-info">Loading...</p>}
      </div>
      {!loading && 
      <div>
        <form onSubmit={handleSubmit} className={currentFormat == null ? 'hide' : ''}>
          {/* <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message"
            />
            <button className="btn btn-primary" type="submit">
              Send
            </button>
          </div> */}
        </form>
        <div className='btn-toolbar'>
          <div className='btn-group mr-2'>
            <button className='btn btn-primary' onClick={addEmptyMessageUI}>
              Add Empty Message
            </button>
          </div>
          {messages.length > 0 && <div className='btn-group mr-2' style={ { marginLeft: '15px' } }>
            <button className='btn btn-danger' onClick={removeLastMessageUI}>
              Remove Last Message
            </button>
          </div>}
        </div>
      </div>}
    </div>
  )
}