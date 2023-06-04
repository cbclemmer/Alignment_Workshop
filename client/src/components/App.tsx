import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import React from 'react';
import Conversation from './Conversation/page'
import ModelEditor from './Model_Editor/page'
import TuneList from './Tunes/list/page'
import TuneShow from './Tunes/show/page'

const App: React.FC = () => {
  return (
    <div className="container">
      <div style={ { marginBottom: '20px' } }></div>
      <Router>
        <Routes>
          {/* <Route path="/" element={<Conversation />} />
          <Route path="/model" element={<ModelEditor />} />
          <Route path="/model/:id" element={<ModelEditor />} /> */}
          
          <Route path="/" element={<TuneList />} />
          <Route path="/tunes/show/:id" element={<TuneShow />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;