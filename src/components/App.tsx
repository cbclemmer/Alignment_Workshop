import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import React from 'react';
import Conversation from './Conversation/page'
import ModelEditor from './Model_Editor/page'

const App: React.FC = () => {
  return (
    <div className="container">
      <h1 className="text-center my-4">Language Model App</h1>

      <Router>
        <Routes>
          <Route path="/" element={<Conversation />} />
          <Route path="/model" element={<ModelEditor />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;