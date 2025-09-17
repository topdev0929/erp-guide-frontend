"use client";

import React, { useState, useEffect } from 'react';
import { useSocketConnection, useSocketEmit, useSocketMessages } from '.';
import { TokenService } from '../api/auth';
import { socketClient } from './socket-client';

const WebSocketChatPage: React.FC = () => {
  const { isConnected } = useSocketConnection();
  const { messages } = useSocketMessages();
  const { emit } = useSocketEmit();
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<string[]>([]);

  // Check if user is authenticated
  useEffect(() => {
    const token = TokenService.getToken();
    if (!token) {
      console.warn("No authentication token found. WebSocket connection may fail.");
    }
  }, []);

  // Add all messages to the chat
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (typeof lastMessage === 'object' && lastMessage !== null) {
        setChatMessages(prev => [...prev, JSON.stringify(lastMessage)]);
      }
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Send message in the format expected by ChatConsumer
      emit('chat_message', { message });
      
      // Add outgoing message to the UI
      setChatMessages(prev => [...prev, JSON.stringify({ 
        message,
        type: 'outgoing'
      })]);
      
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Handle manual connection
  const handleConnect = () => {
    socketClient.connect();
  };

  // Handle manual disconnection
  const handleDisconnect = () => {
    socketClient.disconnect();
  };

  // Clear chat messages
  const handleClearChat = () => {
    setChatMessages([]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">WebSocket Chat</h1>
      
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <span className="mr-2">Status:</span>
          <span className={`px-2 py-1 rounded ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        
        <div className="flex space-x-2 mb-4">
          <button
            onClick={handleConnect}
            disabled={isConnected}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300"
          >
            Connect
          </button>
          <button
            onClick={handleDisconnect}
            disabled={!isConnected}
            className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300"
          >
            Disconnect
          </button>
          <button
            onClick={handleClearChat}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Clear Chat
          </button>
        </div>
        
        <div className="flex mb-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message"
            className="flex-grow p-2 border rounded-l"
          />
          <button
            onClick={handleSendMessage}
            disabled={!isConnected}
            className="px-4 py-2 bg-blue-500 text-white rounded-r disabled:bg-gray-300"
          >
            Send
          </button>
        </div>
      </div>
      
      <div className="border rounded p-4 bg-gray-50 min-h-[400px] max-h-[600px] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-2">Chat Messages:</h2>
        {chatMessages.length === 0 ? (
          <p className="text-gray-500">No messages yet. Start the conversation!</p>
        ) : (
          <ul className="space-y-2">
            {chatMessages.map((msg, index) => {
              let messageObj;
              try {
                messageObj = JSON.parse(msg);
              } catch (e) {
                messageObj = { message: msg };
              }
              
              const isOutgoing = messageObj.type === 'outgoing';
              
              return (
                <li key={index} className={`p-2 border rounded ${isOutgoing ? 'bg-blue-50 text-right' : 'bg-white'}`}>
                  {isOutgoing ? 'You: ' : 'Server: '}
                  {messageObj.message || JSON.stringify(messageObj)}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default WebSocketChatPage; 