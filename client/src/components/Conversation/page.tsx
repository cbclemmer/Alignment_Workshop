import '../../style.css'
import React, { useEffect, useState } from 'react'
import $ from 'jquery'
import { useDispatch, useSelector } from 'react-redux';
import { 
  postMessage, 
  editMessage,
  addEmptyMessage,
  removeLastMessage
} from './actions';
import FormatSelector from '../Format_Selector/page';

import { AppState, Message } from '../../lib/types'
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
  const collection = new Collection<Message, 'MESSAGE_LIST'>('MESSAGE_LIST', 'message', dispatch)

  useEffect(() => {
    getConversation(dispatch, numId)
    collection.getList({ conversation_id: numId })
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    console.log('SUBMIT')
    e.preventDefault();
    if (!input.trim() || currentFormat == null || conversation == null) return
    postMessage(input, currentFormat, conversation, messages, collection);
    setInput('')
  }

  const addEmptyMessageUI = (e: React.FormEvent) => {
    e.preventDefault()
    if (conversation == null) return
    addEmptyMessage(collection, messages, conversation.id)
  }

  const removeLastMessageUI = (e: React.FormEvent) => {
    e.preventDefault()
    if (conversation == null) return
    removeLastMessage(collection, messages, conversation.id)
  }

  const handleMessageChange = (e: any) => {
    const index = $(e.target).data('index')
    const text = e.target.value
    const message = messages[index]
    if (conversation == null) return
    editMessage(conversation.id, text, message, collection)
  }

  return (
    <div>
      <Link to={`/tunes/show/${conversation?.tune_id}`}>Current Tune</Link>
      <h2 className="text-center mb-4">Conversation</h2>
      <FormatSelector />
      <div className={currentFormat == null ? 'hide' : ''}>
        <b>System Message:</b>
        <p dangerouslySetInnerHTML={{ __html: currentFormat?.formattedSystemMessage ?? '' }}>
        </p>
      </div>
      <div className="mb-3">
        {messages.map((message: Message, index: number) => (
          <div key={index}>
            <b>{message.isUser ? currentFormat?.userNotation : currentFormat?.assistantNotation}</b><br></br>
            <input
              style={ { width: '100%' } }
              type="text"
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
          <div className="input-group mb-3">
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
          </div>
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