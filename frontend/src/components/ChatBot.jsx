import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ChatBot.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setIsLoading(true);
    setError(null);

    try {
      console.log('📩 Sending message:', userMessage);
      const response = await axios.post('http://localhost:5000/api/chatbot/chat', {
        message: userMessage
      });

      console.log('🤖 Chatbot Response:', response.data);

      if (response.data && response.data.response) {
        setMessages(prev => [...prev, { text: response.data.response, sender: 'bot' }]);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('🚨 Chatbot Error:', error);
      let errorMessage = 'Sorry, an error occurred. Please try again.';

      if (error.response) {
        console.error('Error response:', error.response.data);
        errorMessage = `Error: ${error.response.data.error || errorMessage}`;
      } else if (error.request) {
        errorMessage = 'No response from server. Ensure the backend is running.';
      }
      
      setError(errorMessage);
      setMessages(prev => [...prev, { text: errorMessage, sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>AI Assistant</h2>
      </div>
      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
            <div className="message-content">{message.text}</div>
          </div>
        ))}
        {isLoading && <div className="message bot-message"><div className="message-content loading">...</div></div>}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="chatbot-input-form">
        <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..." disabled={isLoading} />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
};

export default ChatBot;
