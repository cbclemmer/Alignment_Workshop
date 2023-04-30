import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postMessage } from '../../actions/languageModelActions';

interface Message {
  content: string;
  isUser: boolean;
}

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
  };

  return (
    <div>
      <h2 className="text-center mb-4">Conversation</h2>
      <div className="mb-3">
        {messages.map((message: Message, index: number) => (
          <p key={index} className={`text-${message.isUser ? 'primary' : 'success'}`}>
            {message.content}
          </p>
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
  );
};

export default Conversation;

// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../../reducers';
// import { postMessage } from '../../actions/languageModelActions';

// interface Message {
//   content: string;
//   isUser: boolean;
// }

// const Conversation: React.FC = () => {
//   const [input, setInput] = useState('');
//   const dispatch = useDispatch();
//   const messages = useSelector((state: any) => state.conversation.messages);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (input.trim()) {
//       dispatch(postMessage(input) as any);
//       setInput('');
//     }
//   };

//   return (
//     <div>
//       <h2>Conversation</h2>
//       <div>
//         {messages.map((message: Message, index: number) => (
//           <p key={index} style={{ color: message.isUser ? 'blue' : 'green' }}>
//             {message.content}
//           </p>
//         ))}
//       </div>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type your message"
//         />
//         <button type="submit">Send</button>
//       </form>
//     </div>
//   );
// };

// export default Conversation;
