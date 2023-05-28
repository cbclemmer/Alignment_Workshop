import React, { useState } from 'react'
import $ from 'jquery'
import { useDispatch, useSelector } from 'react-redux';
import { 
  postMessage, 
  editMessage
} from './actions';
import ModelSelector from '../Model_Selector/page';

import { Message } from '../../types';

const Conversation: React.FC = () => {
  const [input, setInput] = useState('');
  const dispatch = useDispatch();
  const messages = useSelector((state: any) => state.conversation.messages);
  const loading = useSelector((state: any) => state.conversation.loading);

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
      <ModelSelector />
      <div className="mb-3">
        {messages.map((message: Message, index: number) => (
          <div>
            <b>{message.isUser ? 'User' : 'Assistant'}: </b><br></br>
            <p
              key={index}
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
      <form onSubmit={handleSubmit}>
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

export default Conversation
