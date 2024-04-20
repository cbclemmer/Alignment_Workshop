import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import React, { useState } from 'react'

import { checkPwd } from '../lib/api'

import Password from './Password/page'
import Conversation from './Conversation/page'
import ConversationEditor from './Conversation_Editer/page'

import TuneList from './Tunes/list/page'
import TuneShow from './Tunes/show/page'
import FormatEditor from './Format_Editor/page'

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [validated, setValidated] = useState(false);

  (async () => {
    const pwd = localStorage.getItem('align_pwd')
    if (!pwd) {
      setLoading(false)
      return
    }
    const acceptedPwd = await checkPwd(pwd)
    if (acceptedPwd) {
      setValidated(true)
    }
    setLoading(false)
  })()

  return (
    <div>
      {loading && <span>Loading...</span>}
      {!validated && !loading && <Password />}
      {!loading && validated && 
      <div>
        <nav className='navbar navbar-expand-lg bg-body-tertiary' style={ { backgroundColor: '#e3f2fd' }}>
          <a className='navbar-brand' href='/' style={ { marginLeft: '30px' }}>Home</a>
        </nav>
        <div className="container">
          <div style={ { marginBottom: '20px' } }></div>
          <Router>
            <Routes>
              <Route path="/" element={<TuneList />} />
              <Route path="/tunes/show/:id" element={<TuneShow />} />
              
              <Route path="/conversations/show/:id" element={<Conversation />} />
              <Route path="/conversations/new/:tuneid" element={<ConversationEditor />} />
              <Route path="/conversations/edit/:id" element={<ConversationEditor />} />

              <Route path="/formats/new" element={<FormatEditor />} />
              <Route path="/formats/edit/:id" element={<FormatEditor />} />
            </Routes>
          </Router>
        </div>
      </div>}
    </div>
  );
};

export default App