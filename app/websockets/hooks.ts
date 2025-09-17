import { useState, useEffect, useCallback, useRef } from 'react';
import { socketClient, openaiSocketClient } from './socket-client';

// Hook to manage WebSocket connection
export function useSocketConnection() {
  const [isConnected, setIsConnected] = useState(socketClient.isConnected());
  
  useEffect(() => {
    // Connect to the socket server
    socketClient.connect();
    
    // Setup connection status listener
    const handleConnectionChange = (connected: boolean) => {
      setIsConnected(connected);
    };
    
    socketClient.onConnectionChange(handleConnectionChange);
    
    // Cleanup on unmount
    return () => {
      socketClient.offConnectionChange(handleConnectionChange);
    };
  }, []);
  
  return { isConnected };
}

// Hook to listen for specific WebSocket events
export function useSocketEvent<T = any>(eventName: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.event === eventName) {
        setData(message.data);
        setIsLoading(false);
      } else if (message.error && message.event === eventName) {
        setError(new Error(message.error));
        setIsLoading(false);
      }
    };
    
    socketClient.onMessage(handleMessage);
    
    return () => {
      socketClient.offMessage(handleMessage);
    };
  }, [eventName]);
  
  return { data, error, isLoading };
}

// Hook to send WebSocket messages
export function useSocketEmit() {
  const isEmitting = useRef(false);
  
  const emit = useCallback((event: string, data: any) => {
    isEmitting.current = true;
    
    try {
      // If this is a chat message, format it for the ChatConsumer
      if (event === 'chat_message' && data.message) {
        // ChatConsumer expects { message: "text" }
        socketClient.send({ message: data.message });
      } else {
        // Otherwise send in the event/data format
        socketClient.send({
          event,
          data
        });
      }
    } catch (error) {
      console.error(`Error emitting event ${event}:`, error);
    } finally {
      isEmitting.current = false;
    }
  }, []);
  
  return { emit, isEmitting: isEmitting.current };
}

// Hook to listen for all WebSocket messages
export function useSocketMessages<T = any>() {
  const [messages, setMessages] = useState<T[]>([]);
  
  useEffect(() => {
    const handleMessage = (data: T) => {
      setMessages(prev => [...prev, data]);
    };
    
    socketClient.onMessage(handleMessage);
    
    return () => {
      socketClient.offMessage(handleMessage);
    };
  }, []);
  
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);
  
  return { messages, clearMessages };
}

// Hook to manage OpenAI WebSocket connection
export function useOpenAISocketConnection() {
  const [isConnected, setIsConnected] = useState(openaiSocketClient.isConnected());
  const [threadId, setThreadId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  
  useEffect(() => {
    // Connect to the socket server
    openaiSocketClient.connect();
    
    // Setup connection status listener
    const handleConnectionChange = (connected: boolean) => {
      setIsConnected(connected);
    };
    
    // Setup message listener for thread creation
    const handleMessage = (data: any) => {
      if (data.type === 'thread_created') {
        setThreadId(data.thread_id);
        setSessionId(data.session_id);
        console.log('Thread created:', data.thread_id);
        console.log('Session ID:', data.session_id);
      }
    };
    
    openaiSocketClient.onConnectionChange(handleConnectionChange);
    openaiSocketClient.onMessage(handleMessage);
    
    // Cleanup on unmount
    return () => {
      openaiSocketClient.offConnectionChange(handleConnectionChange);
      openaiSocketClient.offMessage(handleMessage);
    };
  }, []);
  
  return { isConnected, threadId, sessionId };
}

// Hook to listen for OpenAI WebSocket events
export function useOpenAISocketEvent<T = any>(eventType: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.type === eventType) {
        setData(message as T);
        setIsLoading(false);
      } else if (message.error && message.type === eventType) {
        setError(new Error(message.error));
        setIsLoading(false);
      }
    };
    
    openaiSocketClient.onMessage(handleMessage);
    
    return () => {
      openaiSocketClient.offMessage(handleMessage);
    };
  }, [eventType]);
  
  return { data, error, isLoading };
}

// Hook to send OpenAI WebSocket messages
export function useOpenAISocketEmit() {
  const isEmitting = useRef(false);
  
  const emit = useCallback((type: string, data: any) => {
    isEmitting.current = true;
    
    try {
      openaiSocketClient.send({
        type,
        ...data
      });
    } catch (error) {
      console.error(`Error emitting event ${type}:`, error);
    } finally {
      isEmitting.current = false;
    }
  }, []);
  
  return { emit, isEmitting: isEmitting.current };
}

// Hook to handle OpenAI message streaming
export function useOpenAIMessageStream() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState('');
  const [completeMessages, setCompleteMessages] = useState<any[]>([]);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  
  useEffect(() => {
    // Setup message listener for thread creation and streaming
    const handleMessage = (data: any) => {
      if (data.type === 'thread_created') {
        setThreadId(data.thread_id);
        setSessionId(data.session_id);
        console.log('Thread created:', data.thread_id);
        console.log('Session ID:', data.session_id);
      } else if (data.type === 'stream_start') {
        setIsStreaming(true);
        setStreamedContent('');
      } else if (data.type === 'stream_content') {
        setStreamedContent(prev => prev + (data.content || ''));
      } else if (data.type === 'stream_end') {
        const finalContent = streamedContent + (data.content || '');
        setCompleteMessages(prev => [...prev, {
          role: 'assistant',
          content: finalContent,
          timestamp: new Date().toISOString()
        }]);
        setIsStreaming(false);
        setStreamedContent('');
      } else if (data.type === 'error') {
        console.error("WebSocket error:", data.message);
        setCompleteMessages(prev => [...prev, {
          role: 'system',
          content: `Error: ${data.message}`,
          timestamp: new Date().toISOString()
        }]);
      }
    };
    
    openaiSocketClient.onMessage(handleMessage);
    
    return () => {
      openaiSocketClient.offMessage(handleMessage);
    };
  }, [streamedContent]);
  
  const sendMessage = useCallback((message: string) => {
    if (!threadId || !sessionId || !message.trim()) return;
    
    // Add user message to the list
    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    
    setCompleteMessages(prev => [...prev, userMessage]);
    
    // Send message to the server with required fields
    openaiSocketClient.send({
      type: 'add_message',
      thread_id: threadId,
      session_id: sessionId,
      role: 'user',
      message
    });
  }, [threadId, sessionId]);
  
  // Connect to the WebSocket
  const connect = useCallback(() => {
    openaiSocketClient.connect();
  }, []);
  
  // Disconnect from the WebSocket
  const disconnect = useCallback(() => {
    openaiSocketClient.disconnect();
  }, []);
  
  return {
    isStreaming,
    streamedContent,
    messages: completeMessages,
    threadId,
    sessionId,
    isConnected: openaiSocketClient.isConnected(),
    sendMessage,
    connect,
    disconnect,
    clearMessages: () => setCompleteMessages([])
  };
} 