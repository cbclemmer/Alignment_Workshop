import '../../style.css'
import React, { useEffect, useState } from 'react'
import $ from 'jquery'
import { useDispatch, useSelector } from 'react-redux';
import { 
  postMessage, 
  editMessage
} from './actions';
import FormatSelector from '../Format_Selector/page';

import { AppState, Conversation, Message } from '../../lib/types'
import { useParams } from 'react-router-dom';
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
  const currentFormat = useSelector((state: AppState) => state.formatSelector.currentFormat)
  const currentConversation = useSelector((state: AppState) => state.currentConversation.conversation)
  const collection = new Collection<Conversation, 'MESSAGE_LIST'>('MESSAGE_LIST', 'message', dispatch)

  useEffect(() => {
    getConversation(dispatch, numId)
    collection.getList({ conversation_id: numId })
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      dispatch(postMessage(input) as any);
      setInput('');
    }
  }

  const handleMessageChange = (e: React.FormEvent) => {
    const index = $(e.target).data('index')
    const text = $(e.target).text()
    dispatch(editMessage(index, text) as any)
  }

  return (
    <div>
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
            <p
              data-index={index}
              className={`alert alert-${message.isUser ? 'primary' : 'secondary'}`}
              onInput={handleMessageChange}
              contentEditable={true}
            >
              {message.content}
            </p>
          </div>
        ))}
      </div>
      <div>
        {loading && <p className="text-info">Loading...</p>}
      </div>
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
    </div>
  )
}