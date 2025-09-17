// Export all WebSocket functionality
export { socketClient, chatSocketClient, openaiSocketClient } from './socket-client';
export { 
  useSocketConnection, 
  useSocketEvent, 
  useSocketEmit,
  useSocketMessages,
  // OpenAI WebSocket hooks
  useOpenAISocketConnection,
  useOpenAISocketEvent,
  useOpenAISocketEmit,
  useOpenAIMessageStream
} from './hooks'; 