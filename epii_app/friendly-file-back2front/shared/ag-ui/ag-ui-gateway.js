/**
 * AG-UI Gateway Component
 * Manages AG-UI event routing, subscriptions, and broadcasting
 * Integrates with existing A2A server infrastructure
 *
 * Bimba Coordinate: #5-4-2
 * Represents the AG-UI gateway within the Siva-Shakti layer
 */

const { v4: uuidv4 } = require('uuid');
const { AGUIEventTypes, createAGUIEvent, validateAGUIEvent } = require('./ag-ui-event-schema');
const { A2AAGUIEventTypes, createAGUIA2AMessage, isAGUIEvent, extractAGUIEventData } = require('../a2a/a2a-message.schema');

/**
 * AG-UI Gateway Class
 * Handles AG-UI event management and WebSocket communication
 */
class AGUIGateway {
  constructor() {
    this.clients = new Map(); // clientId -> { ws, subscriptions, metadata }
    this.subscriptions = new Map(); // subscriptionKey -> Set of clientIds
    this.activeRuns = new Map(); // runId -> { threadId, startTime, status, metadata }
    this.eventHistory = new Map(); // runId -> Array of events
    this.maxHistorySize = 1000; // Maximum events to keep per run
  }

  /**
   * Register a WebSocket client for AG-UI events
   * @param {string} clientId - Unique client identifier
   * @param {WebSocket} ws - WebSocket connection
   * @param {Object} [metadata] - Client metadata
   */
  registerClient(clientId, ws, metadata = {}) {
    console.log(`[AGUIGateway] Registering client: ${clientId}`);
    
    this.clients.set(clientId, {
      ws,
      subscriptions: new Set(),
      metadata: {
        agentId: metadata.agentId || 'unknown',
        agentName: metadata.agentName || 'Unknown Agent',
        capabilities: metadata.capabilities || [],
        registeredAt: new Date().toISOString(),
        ...metadata
      }
    });

    // Send registration confirmation
    this.sendToClient(clientId, {
      type: 'ag-ui-registration-confirmation',
      clientId,
      message: 'Registered for AG-UI events',
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Unregister a client
   * @param {string} clientId - Client identifier
   */
  unregisterClient(clientId) {
    console.log(`[AGUIGateway] Unregistering client: ${clientId}`);
    
    const client = this.clients.get(clientId);
    if (client) {
      // Remove all subscriptions for this client
      for (const subscriptionKey of client.subscriptions) {
        const subscribers = this.subscriptions.get(subscriptionKey);
        if (subscribers) {
          subscribers.delete(clientId);
          if (subscribers.size === 0) {
            this.subscriptions.delete(subscriptionKey);
          }
        }
      }
      
      this.clients.delete(clientId);
    }
  }

  /**
   * Subscribe client to AG-UI events
   * @param {string} clientId - Client identifier
   * @param {string} [runId] - Specific run ID to subscribe to
   * @param {string} [threadId] - Specific thread ID to subscribe to
   * @param {string} [eventType] - Specific event type to subscribe to
   */
  subscribe(clientId, runId = null, threadId = null, eventType = null) {
    const client = this.clients.get(clientId);
    if (!client) {
      console.warn(`[AGUIGateway] Cannot subscribe unknown client: ${clientId}`);
      return;
    }

    // Create subscription key
    const subscriptionKey = this.createSubscriptionKey(runId, threadId, eventType);
    
    console.log(`[AGUIGateway] Client ${clientId} subscribing to: ${subscriptionKey}`);
    
    // Add to client's subscriptions
    client.subscriptions.add(subscriptionKey);
    
    // Add to global subscriptions map
    if (!this.subscriptions.has(subscriptionKey)) {
      this.subscriptions.set(subscriptionKey, new Set());
    }
    this.subscriptions.get(subscriptionKey).add(clientId);

    // Send subscription confirmation
    this.sendToClient(clientId, {
      type: 'ag-ui-subscription-confirmation',
      subscriptionKey,
      runId,
      threadId,
      eventType,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Unsubscribe client from AG-UI events
   * @param {string} clientId - Client identifier
   * @param {string} [runId] - Run ID to unsubscribe from
   * @param {string} [threadId] - Thread ID to unsubscribe from
   * @param {string} [eventType] - Event type to unsubscribe from
   */
  unsubscribe(clientId, runId = null, threadId = null, eventType = null) {
    const client = this.clients.get(clientId);
    if (!client) {
      return;
    }

    const subscriptionKey = this.createSubscriptionKey(runId, threadId, eventType);
    
    console.log(`[AGUIGateway] Client ${clientId} unsubscribing from: ${subscriptionKey}`);
    
    // Remove from client's subscriptions
    client.subscriptions.delete(subscriptionKey);
    
    // Remove from global subscriptions
    const subscribers = this.subscriptions.get(subscriptionKey);
    if (subscribers) {
      subscribers.delete(clientId);
      if (subscribers.size === 0) {
        this.subscriptions.delete(subscriptionKey);
      }
    }
  }

  /**
   * Emit AG-UI event to subscribed clients
   * @param {Object} event - AG-UI event to emit
   * @param {Object} [bimbaMetadata] - Bimba metadata to include
   */
  emitAGUIEvent(event, bimbaMetadata = {}) {
    try {
      // Validate event
      validateAGUIEvent(event);
      
      // Add Bimba metadata if provided
      const enrichedEvent = {
        ...event,
        metadata: {
          ...event.metadata,
          ...bimbaMetadata,
          timestamp: new Date().toISOString()
        }
      };

      console.log(`[AGUIGateway] Emitting AG-UI event: ${event.type}`, {
        runId: event.runId,
        threadId: event.threadId,
        hasMetadata: !!bimbaMetadata.bimbaCoordinates
      });

      // Store event in history
      this.storeEventInHistory(enrichedEvent);

      // Update run status
      this.updateRunStatus(enrichedEvent);

      // Find target clients
      const targetClients = this.findTargetClients(enrichedEvent);
      
      console.log(`[AGUIGateway] Broadcasting to ${targetClients.length} clients`);

      // Send to target clients
      targetClients.forEach(clientId => {
        this.sendToClient(clientId, enrichedEvent);
      });

    } catch (error) {
      console.error('[AGUIGateway] Error emitting AG-UI event:', error);
      
      // Emit error event
      this.emitAGUIEvent(createAGUIEvent(AGUIEventTypes.RUN_ERROR, {
        runId: event.runId,
        message: `Event emission error: ${error.message}`,
        code: 'EVENT_EMISSION_ERROR'
      }));
    }
  }

  /**
   * Process A2A message for AG-UI events
   * @param {Object} message - A2A message
   * @returns {boolean} True if message was processed as AG-UI event
   */
  processA2AMessage(message) {
    if (!isAGUIEvent(message)) {
      return false;
    }

    const eventData = extractAGUIEventData(message);
    if (!eventData) {
      return false;
    }

    console.log(`[AGUIGateway] Processing A2A message as AG-UI event: ${eventData.type}`);

    // Convert A2A message to AG-UI event
    const aguiEvent = {
      type: eventData.type,
      runId: eventData.runId,
      threadId: eventData.threadId,
      stepName: eventData.stepName,
      toolCallId: eventData.toolCallId,
      messageId: eventData.messageId,
      delta: eventData.delta,
      ...eventData.payload,
      metadata: eventData.metadata,
      timestamp: eventData.timestamp
    };

    // Emit the event
    this.emitAGUIEvent(aguiEvent, eventData.metadata);
    
    return true;
  }

  /**
   * Send message to specific client
   * @param {string} clientId - Client identifier
   * @param {Object} message - Message to send
   */
  sendToClient(clientId, message) {
    const client = this.clients.get(clientId);
    if (!client || client.ws.readyState !== 1) { // WebSocket.OPEN = 1
      return false;
    }

    try {
      client.ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error(`[AGUIGateway] Error sending to client ${clientId}:`, error);
      return false;
    }
  }

  /**
   * Create subscription key from parameters
   * @param {string} [runId] - Run ID
   * @param {string} [threadId] - Thread ID
   * @param {string} [eventType] - Event type
   * @returns {string} Subscription key
   */
  createSubscriptionKey(runId, threadId, eventType) {
    const parts = [];
    if (runId) parts.push(`run:${runId}`);
    if (threadId) parts.push(`thread:${threadId}`);
    if (eventType) parts.push(`type:${eventType}`);
    return parts.length > 0 ? parts.join('|') : 'all';
  }

  /**
   * Find target clients for event
   * @param {Object} event - AG-UI event
   * @returns {Array<string>} Array of client IDs
   */
  findTargetClients(event) {
    const targetClients = new Set();

    // Check specific subscriptions
    const subscriptionKeys = [
      this.createSubscriptionKey(event.runId, null, null),
      this.createSubscriptionKey(null, event.threadId, null),
      this.createSubscriptionKey(null, null, event.type),
      this.createSubscriptionKey(event.runId, event.threadId, null),
      'all'
    ];

    subscriptionKeys.forEach(key => {
      const subscribers = this.subscriptions.get(key);
      if (subscribers) {
        subscribers.forEach(clientId => targetClients.add(clientId));
      }
    });

    return Array.from(targetClients);
  }

  /**
   * Store event in history
   * @param {Object} event - AG-UI event
   */
  storeEventInHistory(event) {
    if (!event.runId) return;

    if (!this.eventHistory.has(event.runId)) {
      this.eventHistory.set(event.runId, []);
    }

    const history = this.eventHistory.get(event.runId);
    history.push(event);

    // Limit history size
    if (history.length > this.maxHistorySize) {
      history.splice(0, history.length - this.maxHistorySize);
    }
  }

  /**
   * Update run status based on event
   * @param {Object} event - AG-UI event
   */
  updateRunStatus(event) {
    if (!event.runId) return;

    if (event.type === AGUIEventTypes.RUN_STARTED) {
      this.activeRuns.set(event.runId, {
        threadId: event.threadId,
        startTime: new Date().toISOString(),
        status: 'running',
        metadata: event.metadata || {}
      });
    } else if (event.type === AGUIEventTypes.RUN_FINISHED) {
      const run = this.activeRuns.get(event.runId);
      if (run) {
        run.status = 'completed';
        run.endTime = new Date().toISOString();
      }
    } else if (event.type === AGUIEventTypes.RUN_ERROR) {
      const run = this.activeRuns.get(event.runId);
      if (run) {
        run.status = 'error';
        run.endTime = new Date().toISOString();
        run.error = event.message;
      }
    }
  }

  /**
   * Get run status
   * @param {string} runId - Run ID
   * @returns {Object|null} Run status or null
   */
  getRunStatus(runId) {
    return this.activeRuns.get(runId) || null;
  }

  /**
   * Get event history for run
   * @param {string} runId - Run ID
   * @returns {Array} Array of events
   */
  getEventHistory(runId) {
    return this.eventHistory.get(runId) || [];
  }

  /**
   * Get connected clients info
   * @returns {Array} Array of client info
   */
  getConnectedClients() {
    return Array.from(this.clients.entries()).map(([clientId, client]) => ({
      clientId,
      metadata: client.metadata,
      subscriptions: Array.from(client.subscriptions),
      connected: client.ws.readyState === 1
    }));
  }

  /**
   * Cleanup inactive runs and old history
   */
  cleanup() {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    // Clean up old runs
    for (const [runId, run] of this.activeRuns.entries()) {
      const runTime = new Date(run.startTime).getTime();
      if (now - runTime > maxAge) {
        this.activeRuns.delete(runId);
        this.eventHistory.delete(runId);
      }
    }
  }
}

module.exports = AGUIGateway;
