"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useOpenAISocketConnection, useOpenAISocketEmit } from '..';
import { openaiSocketClient } from '../socket-client';

const OpenAIWebSocketTest: React.FC = () => {
  const { isConnected, threadId, sessionId } = useOpenAISocketConnection();
  const { emit } = useOpenAISocketEmit();
  const [messages, setMessages] = useState<any[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState('');
  const [runStatus, setRunStatus] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const messageTimestampRef = useRef<number | null>(null);

  // Listen for all messages
  useEffect(() => {
    const handleMessage = (data: any) => {
      console.log("Message received:", data);
      
      // Calculate response time when first receiving a response
      if (messageTimestampRef.current !== null && 
          (data.event === 'thread.message.delta' || 
           data.event === 'thread.run.update' && data.data?.status === 'in_progress' ||
           data.type === 'stream_start' || 
           data.type === 'stream_content')) {
        const now = Date.now();
        const timeTaken = now - messageTimestampRef.current;
        setResponseTime(timeTaken);
        messageTimestampRef.current = null; // Reset after first response
      }
      
      // Handle different message types
      if (data.event === 'thread.run.update') {
        // Update run status
        setRunStatus(data.data?.status || null);
        
        if (data.data?.status === 'in_progress' && !isStreaming) {
          setIsStreaming(true);
        }
      } 
      else if (data.event === 'thread.message.delta') {
        // Handle streaming content
        const deltaContent = data.data?.delta?.content?.[0]?.text?.value || '';
        if (deltaContent) {
          setStreamedResponse(prev => prev + deltaContent);
        }
      } 
      else if (data.event === 'thread.run.completed') {
        // Handle run completion
        setIsStreaming(false);
        setRunStatus('completed');
        
        // Add the complete message to the messages list if we have streamed content
        if (streamedResponse) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: streamedResponse,
            timestamp: new Date().toISOString()
          }]);
          setStreamedResponse('');
        }
      } 
      else if (data.event === 'thread.run.failed') {
        // Handle run failure
        setIsStreaming(false);
        setRunStatus('failed');
        console.error("Run failed:", data.error);
        
        // Display error in UI
        setMessages(prev => [...prev, {
          role: 'system',
          content: `Error: ${data.error || 'Run failed'}`,
          timestamp: new Date().toISOString()
        }]);
        setStreamedResponse('');
      } 
      else if (data.event === 'thread.run.requires_action') {
        // Handle required actions (tool calls)
        setIsStreaming(false);
        setRunStatus('requires_action');
        console.log("Run requires action:", data.data?.required_action);
        
        // Display in UI
        setMessages(prev => [...prev, {
          role: 'system',
          content: `Run requires action: ${JSON.stringify(data.data?.required_action)}`,
          timestamp: new Date().toISOString()
        }]);
      }
      else if (data.type === 'stream_start') {
        // Legacy handler for backward compatibility
        setIsStreaming(true);
        setStreamedResponse('');
      } 
      else if (data.type === 'stream_content') {
        // Legacy handler for backward compatibility
        setStreamedResponse(prev => prev + (data.content || ''));
      } 
      else if (data.type === 'stream_end') {
        // Legacy handler for backward compatibility
        setIsStreaming(false);
        // Add the complete message to the messages list
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: streamedResponse + (data.content || ''),
          timestamp: new Date().toISOString()
        }]);
        setStreamedResponse('');
      } 
      else if (data.type === 'error') {
        // Handle error
        console.error("WebSocket error:", data.message);
        // Display error in UI
        setMessages(prev => [...prev, {
          role: 'system',
          content: `Error: ${data.message}`,
          timestamp: new Date().toISOString()
        }]);
      } 
      else {
        // Log unknown message types/events
        console.error("Unknown message type/event received:", data);
        
        // Add to messages list with a warning
        // setMessages(prev => [...prev, {
        //   role: 'system',
        //   content: `Received unknown message type: ${JSON.stringify(data)}`,
        //   timestamp: new Date().toISOString()
        // }]);
      }
    };
    
    openaiSocketClient.onMessage(handleMessage);
    
    return () => {
      openaiSocketClient.offMessage(handleMessage);
    };
  }, [streamedResponse, isStreaming]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamedResponse]);

  // Handle manual connection
  const handleConnect = () => {
    openaiSocketClient.connect();
  };

  // Handle manual disconnection
  const handleDisconnect = () => {
    openaiSocketClient.disconnect();
  };

  // Clear messages
  const handleClearMessages = () => {
    setMessages([]);
    setStreamedResponse('');
    setRunStatus(null);
  };

  // Send a message
  const handleSendMessage = () => {
    if (!userInput.trim() || !threadId || !sessionId) return;
    
    // Record timestamp when sending message
    messageTimestampRef.current = Date.now();
    setResponseTime(null);
    
    // Add user message to the list
    const userMessage = {
      role: 'user',
      content: userInput,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Send message to the server with required fields
    emit('add_message', {
      thread_id: threadId,
      session_id: sessionId,
      role: 'user',
      message: userInput
    });
    
    // Clear input
    setUserInput('');
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">OpenAI WebSocket Test</h1>
      
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <span className="mr-2">Status:</span>
          <span className={`px-2 py-1 rounded ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
          
          {runStatus && (
            <span className={`ml-4 px-2 py-1 rounded ${
              runStatus === 'completed' ? 'bg-green-100 text-green-800' : 
              runStatus === 'failed' ? 'bg-red-100 text-red-800' : 
              runStatus === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
              runStatus === 'requires_action' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-gray-100 text-gray-800'
            }`}>
              Run: {runStatus}
            </span>
          )}
          
          {responseTime !== null && (
            <span className="ml-4 px-2 py-1 rounded bg-purple-100 text-purple-800">
              Response time: {responseTime}ms
            </span>
          )}
        </div>
        
        {threadId && (
          <div className="mb-2">
            <span className="font-semibold">Thread ID:</span> {threadId}
          </div>
        )}
        
        {sessionId !== null && (
          <div className="mb-2">
            <span className="font-semibold">Session ID:</span> {sessionId}
          </div>
        )}
        
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
            onClick={handleClearMessages}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Clear Messages
          </button>
        </div>
      </div>
      
      <div className="border rounded p-4 bg-gray-50 h-[500px] flex flex-col">
        <div className="flex-grow overflow-y-auto mb-4">
          {messages.length === 0 && !streamedResponse ? (
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                const isSystem = msg.role === 'system';
                return (
                  <div key={index} className={`p-3 rounded-lg max-w-[80%] ${
                    isUser ? 'ml-auto bg-blue-100' : 
                    isSystem ? 'mx-auto bg-red-100' : 
                    'bg-white border'
                  }`}>
                    <div className="font-semibold mb-1">
                      {isUser ? 'You' : isSystem ? 'System' : 'Assistant'}
                    </div>
                    <div className="whitespace-pre-wrap">
                      {typeof msg.content === 'string' 
                        ? msg.content 
                        : JSON.stringify(msg, null, 2)}
                    </div>
                  </div>
                );
              })}
              
              {streamedResponse && (
                <div className="p-3 rounded-lg max-w-[80%] bg-white border">
                  <div className="font-semibold mb-1">
                    Assistant {isStreaming && (
                      <span className="text-gray-400 inline-flex items-center">
                        <span className="typing-animation ml-1">typing</span>
                      </span>
                    )}
                  </div>
                  <div className="whitespace-pre-wrap">{streamedResponse}</div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        <div className="flex">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            disabled={!isConnected || !threadId || sessionId === null || isStreaming}
            className="flex-grow p-2 border rounded-l resize-none h-20"
          />
          <button
            onClick={handleSendMessage}
            disabled={!isConnected || !threadId || sessionId === null || !userInput.trim() || isStreaming}
            className="px-4 py-2 bg-blue-500 text-white rounded-r disabled:bg-gray-300"
          >
            Send
          </button>
        </div>
      </div>
      
      <div className="mt-4 border rounded p-4 bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">Raw Messages:</h2>
        <div className="max-h-[200px] overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-500">No messages received yet.</p>
          ) : (
            <ul className="space-y-2">
              {messages.map((msg, index) => (
                <li key={index} className="p-2 border rounded bg-white">
                  <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(msg, null, 2)}</pre>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .typing-animation::after {
          content: '...';
          display: inline-block;
          animation: ellipsis 1.5s infinite;
          width: 12px;
          text-align: left;
        }
        
        @keyframes ellipsis {
          0% { content: '.'; }
          33% { content: '..'; }
          66% { content: '...'; }
        }
      `}</style>
    </div>
  );
};

export default OpenAIWebSocketTest; 