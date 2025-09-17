class WebSocketClient {
  private socket: WebSocket | null = null;
  private messageListeners: Set<(data: any) => void> = new Set();
  private connectionListeners: Set<(isConnected: boolean) => void> = new Set();
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor(baseUrl: string, path: string = '/ws/chat/') {
    // Extract the domain without any path
    const urlObj = new URL(baseUrl);
    
    // Use wss for https, ws for http
    const wsProtocol = urlObj.protocol === 'https:' ? 'wss:' : 'ws:';
    this.url = `${wsProtocol}//${urlObj.host}${path}`;
  }

  // Initialize and connect to the WebSocket server
  connect(): void {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      console.log("WebSocket already connected or connecting");
      return;
    }

    try {
      // Get token from localStorage
      const token = localStorage.getItem('authToken');
      const connectionUrl = token ? `${this.url}?token=${token}` : this.url;
      
      console.log("Connecting to WebSocket at:", connectionUrl);
      this.socket = new WebSocket(connectionUrl);
      
      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onerror = this.handleError.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
      
      console.log("WebSocket connecting...");
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
    }
  }

  private handleOpen(event: Event): void {
    console.log("🔌 WebSocket connected");
    this.reconnectAttempts = 0;
    this.notifyConnectionListeners(true);
  }

  private handleClose(event: CloseEvent): void {
    console.log(`🔌 WebSocket disconnected: ${event.reason || 'Unknown reason'} (${event.code})`);
    this.notifyConnectionListeners(false);
    
    // Attempt to reconnect if not closed cleanly
    if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
      this.attemptReconnect();
    }
  }

  private handleError(event: Event): void {
    console.error("❌ WebSocket error:", event);
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      console.log("📥 WebSocket message received:", data);
      this.notifyMessageListeners(data);
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error, event.data);
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms...`);
    
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  // Disconnect from the WebSocket server
  disconnect(): void {
    if (this.socket) {
      this.socket.close(1000, "Client disconnected");
      this.socket = null;
      
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
      
      console.log("🔌 WebSocket disconnected by client");
    }
  }

  // Send a message to the server
  send(data: any): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn("Cannot send message: socket not connected");
      return;
    }

    const message = typeof data === 'string' ? data : JSON.stringify(data);
    
    console.log("📤 WebSocket sending message:", data);
    this.socket.send(message);
  }

  // Register a message listener
  onMessage(callback: (data: any) => void): void {
    this.messageListeners.add(callback);
  }

  // Remove a message listener
  offMessage(callback: (data: any) => void): void {
    this.messageListeners.delete(callback);
  }

  // Register a connection status listener
  onConnectionChange(callback: (isConnected: boolean) => void): void {
    this.connectionListeners.add(callback);
    // Immediately notify with current status if connected
    if (this.isConnected()) {
      callback(true);
    }
  }

  // Remove a connection status listener
  offConnectionChange(callback: (isConnected: boolean) => void): void {
    this.connectionListeners.delete(callback);
  }

  // Notify all message listeners
  private notifyMessageListeners(data: any): void {
    this.messageListeners.forEach(callback => callback(data));
  }

  // Notify all connection listeners
  private notifyConnectionListeners(isConnected: boolean): void {
    this.connectionListeners.forEach(callback => callback(isConnected));
  }

  // Check if socket is connected
  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

// Import API URL from your auth module
import { API_URL } from "../api/auth";

// Export singleton instances for different WebSocket endpoints
export const chatSocketClient = new WebSocketClient(API_URL, '/ws/chat/');
export const openaiSocketClient = new WebSocketClient(API_URL, '/ws/openai/');

// For backward compatibility
export const socketClient = chatSocketClient; 