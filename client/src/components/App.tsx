import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import React from 'react';
import Conversation from './Conversation/page'
import ModelEditor from './Format_Editor/page'
import TuneList from './Tunes/list/page'
import TuneShow from './Tunes/show/page'
import FormatEditor from './Format_Editor/page'

const App: React.FC = () => {
  return (
    <div className="container">
      <div style={ { marginBottom: '20px' } }></div>
      <nav>
        <a href='/'>Home</a>
      </nav>
      <Router>
        <Routes>
          <Route path="/" element={<TuneList />} />
          <Route path="/tunes/show/:id" element={<TuneShow />} />
          <Route path="/conversations/show/:id" element={<Conversation />} />
          <Route path="/formats/new" element={<FormatEditor />} />
          <Route path="/formats/edit/:id" element={<FormatEditor />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App