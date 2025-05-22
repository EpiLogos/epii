/**
 * WebSocket Service
 * Bimba Coordinate: #5-1-1-2
 *
 * Provides WebSocket connection to the backend for real-time updates.
 */

import documentCacheService from './documentCacheService';

// Define WebSocket message types
interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

// Define WebSocket event types
interface DocumentCacheUpdateEvent {
  type: 'document_cache_update';
  documentId: string;
  analysisResults: any;
  timestamp: string;
}

// WebSocket connection state
let socket: WebSocket | null = null;
let isConnected = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 3000; // 3 seconds

/**
 * Initialize WebSocket connection
 *
 * NOTE: WebSocket connection is currently disabled as we're using bpMCPService for document cache updates.
 * This service will be re-enabled when the A2A server is implemented.
 */
export const initializeWebSocket = (): void => {
  // WebSocket connection is disabled as we're using bpMCPService for document cache updates
  console.log('WebSocket connection is disabled - using bpMCPService for document cache updates');
  isConnected = false;

  // For future implementation:
  // const wsUrl = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3030/mcp';

  // Uncomment the following when A2A server is implemented:
  /*
  // Close existing connection if any
  if (socket) {
    socket.close();
  }

  // Create new WebSocket connection
  socket = new WebSocket(wsUrl);

  // Connection opened
  socket.addEventListener('open', () => {
    console.log('WebSocket connection established');
    isConnected = true;
    reconnectAttempts = 0;
  });

  // Connection closed
  socket.addEventListener('close', (event) => {
    console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
    isConnected = false;

    // Attempt to reconnect if not a normal closure
    if (event.code !== 1000 && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts++;
      console.log(`Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
      setTimeout(initializeWebSocket, RECONNECT_DELAY);
    }
  });

  // Connection error
  socket.addEventListener('error', (event) => {
    console.error('WebSocket error:', event);
  });

  // Listen for messages
  socket.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  });
  */
};

/**
 * Handle WebSocket messages
 * @param data Message data
 */
const handleWebSocketMessage = (data: WebSocketMessage): void => {
  console.log('Received WebSocket message:', data);

  // Handle different message types
  switch (data.type) {
    case 'event':
      // Handle event messages
      handleEventMessage(data.event);
      break;

    case 'document_cache_update':
      // Handle document cache update directly
      handleDocumentCacheUpdate(data as DocumentCacheUpdateEvent);
      break;

    default:
      console.log(`Unhandled WebSocket message type: ${data.type}`);
  }
};

/**
 * Handle event messages
 * @param event Event data
 */
const handleEventMessage = (event: any): void => {
  if (!event || !event.type) {
    console.warn('Received invalid event message:', event);
    return;
  }

  console.log(`Received event: ${event.type}`);

  // Handle different event types
  switch (event.type) {
    case 'document_cache_update':
      handleDocumentCacheUpdate(event as DocumentCacheUpdateEvent);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};

/**
 * Handle document cache update events
 * @param event Document cache update event
 */
const handleDocumentCacheUpdate = (event: DocumentCacheUpdateEvent): void => {
  console.log(`Received document cache update for document ${event.documentId}`);

  // Update the document in the cache
  if (event.documentId && event.analysisResults) {
    documentCacheService.updateDocumentWithAnalysisResults(
      event.documentId,
      event.analysisResults
    );
  }
};

/**
 * Send a message to the WebSocket server
 *
 * NOTE: WebSocket connection is currently disabled as we're using bpMCPService for document cache updates.
 * This function will always return false until the A2A server is implemented.
 *
 * @param message Message to send
 * @returns True if the message was sent successfully
 */
export const sendWebSocketMessage = (message: WebSocketMessage): boolean => {
  // WebSocket connection is disabled as we're using bpMCPService for document cache updates
  console.log('WebSocket connection is disabled - message not sent:', message);
  return false;

  // Uncomment the following when A2A server is implemented:
  /*
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error('WebSocket not connected, cannot send message');
    return false;
  }

  try {
    socket.send(JSON.stringify(message));
    return true;
  } catch (error) {
    console.error('Error sending WebSocket message:', error);
    return false;
  }
  */
};

/**
 * Check if WebSocket is connected
 * @returns True if connected
 */
export const isWebSocketConnected = (): boolean => {
  return isConnected;
};

// Initialize WebSocket connection when the service is imported
initializeWebSocket();

// Export the WebSocket service
const webSocketService = {
  initializeWebSocket,
  sendWebSocketMessage,
  isWebSocketConnected
};

export default webSocketService;
