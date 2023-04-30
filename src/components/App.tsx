import React from 'react';
import Conversation from './conversation/Conversation';

const App: React.FC = () => {
  return (
    <div className="container">
      <h1 className="text-center my-4">Language Model App</h1>
      <Conversation />
    </div>
  );
};

export default App;
