/**
 * Epii Chat Component for document analysis conversations
 * Bimba Coordinate: #5-3-5-2
 */

import React, { useState, useEffect } from 'react';
import { useEpii } from '../4_context/EpiiContext';
import { Loader, ChevronDown, ChevronUp, Trash, Save } from 'lucide-react';

interface EpiiChatProps {
  userId: string;
}

const EpiiChat: React.FC<EpiiChatProps> = ({ userId }) => {
  const { state, dispatch } = useEpii();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSelectionsOpen, setIsSelectionsOpen] = useState(false);

  // Memoize document-specific messages to prevent unnecessary filtering on every render
  const documentSpecificMessages = React.useMemo(() =>
    state.chatMessages.filter(msg => msg.documentId === state.currentDocumentId),
    [state.chatMessages, state.currentDocumentId]
  );

  // Memoize current document lookup to prevent unnecessary searches on every render
  const currentDocument = React.useMemo(() =>
    state.documents.find(doc => doc.id === state.currentDocumentId),
    [state.documents, state.currentDocumentId]
  );
  const documentContent = currentDocument?.content || '';

  // Get the current selection if any
  const currentSelection = state.currentSelection;

  // Use all selections, not just document-specific ones
  // This ensures selections persist across document switches
  const documentSelections = state.selections;

  // Only log selection state in development and when it changes
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`EpiiChat: ${documentSelections.length} selections, document ID: ${state.currentDocumentId || 'none'}`);
    }
  }, [documentSelections.length, state.currentDocumentId]);

  // Memoize the multiple selections check to prevent unnecessary recalculations
  const hasMultipleSelections = React.useMemo(() =>
    documentSelections.length > 1,
    [documentSelections.length]
  );

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Create a unique message ID
    const messageId = `msg-${Date.now()}`;

    // Prepare flags for content selection
    let useFullDocument = false;
    let useAllSelections = false;

    // Check if the message is explicitly asking about the whole document
    const wholeDocumentKeywords = [
      'whole document', 'entire document', 'full document',
      'whole content', 'entire content', 'full content',
      'whole canvas', 'entire canvas', 'full canvas'
    ];

    // Check if we have multiple selections that might be useful
    // We're using all selections, not just document-specific ones
    const hasMultipleSelections = documentSelections.length > 1;

    // Check if user is asking about all selections
    const allSelectionsKeywords = [
      'all selections', 'both selections', 'all saved selections',
      'saved selections', 'multiple selections', 'the selections',
      'relay selections', 'relay them', 'list selections'
    ];

    const isAskingAboutAllSelections = allSelectionsKeywords.some(keyword =>
      message.toLowerCase().includes(keyword)
    );

    // If user is asking about all selections
    if (isAskingAboutAllSelections && documentSelections.length > 0) {
      // Don't modify the message content, just set the flag
      console.log('User is asking about all selections');
      useAllSelections = true;
    }
    // If we have a selection but the user is asking about the whole document
    else if (currentSelection && wholeDocumentKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
      useFullDocument = true;
      console.log('User is asking about the whole document despite having a selection');
    }
    // Otherwise, if we have a selection, focus on that
    else if (currentSelection) {
      console.log('User is asking about the current selection');
    }

    // No longer need to add a hint about multiple selections

    // Add user message to chat with document ID - use original message
    dispatch({
      type: 'ADD_CHAT_MESSAGE',
      payload: {
        id: messageId,
        role: 'user',
        content: message, // Use the original message without modifications
        timestamp: new Date(),
        documentId: state.currentDocumentId || undefined
      }
    });

    // Clear input and set loading state
    setMessage('');
    setIsLoading(true);

    try {
      // Call the backend API
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

      // We already set useAllSelections flag above

      // We already have all selections from the EpiiContext state at the top of the component
      // No need to filter or process them again

      // Get the current document to access its bimbaCoordinate
      const currentDoc = state.documents.find(doc => doc.id === state.currentDocumentId);
      const bimbaCoordinate = currentDoc?.bimbaCoordinate;

      // Determine what content to send to the LLM
      let contentToSend;

      // SIMPLE APPROACH: Always include all selections and current selection

      // If explicitly asking about all selections, use them as primary content
      if (isAskingAboutAllSelections && documentSelections.length > 0) {
        // Create a combined text of all selections
        const allSelectionsText = documentSelections.map((sel, index) => {
          return `Selection ${index + 1}: ${sel.text}`;
        }).join('\n\n');

        contentToSend = {
          // Use the combined selections as the document content
          documentContent: allSelectionsText,
          // Include the full document as secondary content
          fullDocumentContent: documentContent,
          documentId: state.currentDocumentId || undefined,
          // Always include current selection if it exists
          selection: currentSelection,
          // Always include all selections
          selections: documentSelections,
          isSelectionOnly: true,
          isExplicitFullDocumentRequest: false,
          useAllSelections: true,
          bimbaCoordinate: bimbaCoordinate || undefined
        };
      }
      // If we have a current selection and not asking for full document, use it as primary content
      else if (currentSelection && !useFullDocument) {
        contentToSend = {
          // Use the current selection as the document content
          documentContent: currentSelection.text,
          // Include the full document as secondary content
          fullDocumentContent: documentContent,
          documentId: state.currentDocumentId || undefined,
          // Always include current selection
          selection: currentSelection,
          // Always include all selections
          selections: documentSelections,
          isSelectionOnly: true,
          isExplicitFullDocumentRequest: false,
          useAllSelections: false,
          bimbaCoordinate: bimbaCoordinate || undefined
        };
      }
      // Otherwise, use the full document as primary content
      else {
        contentToSend = {
          // Use the full document as the document content
          documentContent: documentContent,
          documentId: state.currentDocumentId || undefined,
          // Always include current selection if it exists
          selection: currentSelection,
          // Always include all selections
          selections: documentSelections,
          isSelectionOnly: false,
          isExplicitFullDocumentRequest: useFullDocument,
          useAllSelections: isAskingAboutAllSelections,
          bimbaCoordinate: bimbaCoordinate || undefined
        };
      }

      // Log what we're sending to the backend
      if (isAskingAboutAllSelections && documentSelections.length > 0) {
        console.log(`Sending to backend: All ${documentSelections.length} selections as document content`,
          bimbaCoordinate ? `Bimba coordinate: ${bimbaCoordinate}` : 'No bimba coordinate');
      } else if (currentSelection && !useFullDocument) {
        console.log(`Sending to backend: Current selection as document content, with ${documentSelections.length} saved selections as structured data`,
          bimbaCoordinate ? `Bimba coordinate: ${bimbaCoordinate}` : 'No bimba coordinate');
      } else {
        console.log(`Sending to backend: Full document${useFullDocument ? ' (explicit request)' : ''}, with ${documentSelections.length} saved selections as structured data`,
          bimbaCoordinate ? `Bimba coordinate: ${bimbaCoordinate}` : 'No bimba coordinate');
      }

      // Add selections to the system prompt
      let enhancedMessage = message;

      // If we have selections, add them to the message
      if (documentSelections.length > 0) {
        // Create a formatted string with all selections
        const selectionsInfo = documentSelections.map((sel, index) => {
          return `Selection ${index + 1}: "${sel.text}"`;
        }).join('\n\n');

        // Add selections to the message
        enhancedMessage = `${message}\n\n[SELECTIONS CONTEXT]\n${selectionsInfo}`;
      }

      // Call the A2A service instead of the old backend
      const a2aUrl = 'http://localhost:3033'; // A2A service URL

      // Create WebSocket connection to A2A service for chat
      const ws = new WebSocket(a2aUrl);

      const response = await new Promise((resolve, reject) => {
        let responseData = null;

        ws.onopen = () => {
          // Register as client
          ws.send(JSON.stringify({
            type: 'registration',
            agentId: 'epii-chat-client',
            agentName: 'Epii Chat Client'
          }));
        };

        ws.onmessage = (event) => {
          const message = JSON.parse(event.data);

          if (message.type === 'registration_confirmation') {
            // Send chat request to Epii agent
            ws.send(JSON.stringify({
              jsonrpc: "2.0",
              id: Date.now().toString(),
              method: "executeSkill",
              params: {
                skillId: "epii-chat",
                parameters: {
                  message: enhancedMessage,
                  history: [], // TODO: Add chat history
                  targetCoordinate: contentToSend.bimbaCoordinate || bimbaCoordinate,
                  documentId: contentToSend.documentId,
                  // Don't send full document content - let UnifiedRAG fetch it if needed
                  // documentContent: contentToSend.documentContent
                },
                context: {
                  agentId: "epii-chat-client",
                  userId: userId
                }
              }
            }));
          } else if (message.jsonrpc === "2.0" && (message.result || message.error)) {
            responseData = message;
            ws.close();

            if (message.result && message.result.success) {
              // Handle nested data structure - check multiple possible paths
              let responseMessage = null;

              // Try different possible paths for the message
              if (message.result.data?.message) {
                responseMessage = message.result.data.message;
              } else if (message.result.data?.data?.message) {
                responseMessage = message.result.data.data.message;
              } else if (message.result.data?.result?.data?.message) {
                responseMessage = message.result.data.result.data.message;
              } else {
                responseMessage = "Response received but message format not recognized";
              }

              console.log('A2A Response structure:', JSON.stringify(message.result, null, 2));
              console.log('Extracted message:', responseMessage);

              resolve({
                ok: true,
                json: () => Promise.resolve({
                  message: responseMessage,
                  documentId: message.result.data?.context?.documentId || message.result.data?.data?.context?.documentId,
                  targetCoordinate: message.result.data?.context?.targetCoordinate || message.result.data?.data?.context?.targetCoordinate,
                  tool_calls: null // A2A doesn't use tool_calls format yet
                })
              });
            } else {
              reject(new Error(message.error?.message || message.result?.error || 'Chat failed'));
            }
          }
        };

        ws.onerror = (error) => {
          reject(new Error('WebSocket connection failed'));
        };

        // Timeout after 30 seconds
        setTimeout(() => {
          if (!responseData) {
            ws.close();
            reject(new Error('Chat request timeout'));
          }
        }, 30000);
      });

      if (!response.ok) {
        throw new Error(`Chat request failed: ${response.statusText}`);
      }

      const data = await response.json();

      // Add assistant message to chat with document ID
      dispatch({
        type: 'ADD_CHAT_MESSAGE',
        payload: {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: data.message || data.response || "No response generated",
          timestamp: new Date(),
          documentId: state.currentDocumentId || undefined,
          tool_calls: data.tool_calls || undefined
        }
      });

      // Check if the response includes document content updates
      if (data.tool_calls && Array.isArray(data.tool_calls)) {
        // Look for updateDocumentContent or createDocument tool calls
        const documentUpdateCalls = data.tool_calls.filter(
          tool => tool.name === 'updateDocumentContent' || tool.name === 'createDocument'
        );

        if (documentUpdateCalls.length > 0) {
          console.log('Document update tool calls detected:', documentUpdateCalls);

          // Process each document update
          documentUpdateCalls.forEach(toolCall => {
            try {
              // Parse the result
              const resultStr = toolCall.result;
              console.log(`Tool call result:`, resultStr);

              const result = typeof resultStr === 'string' ? JSON.parse(resultStr) : resultStr;
              console.log(`Parsed result:`, result);

              if (result.success && result.content) {
                console.log(`Processing document tool call: ${toolCall.name}`);

                // Handle updateDocumentContent tool
                if (toolCall.name === 'updateDocumentContent' && result.documentId) {
                  // Check if this was an append operation
                  // First check the result from the backend, then fall back to checking the args
                  const wasAppend = result.appendOnly === true || (toolCall.args && toolCall.args.appendOnly === true);

                  console.log(`Append operation check: result.appendOnly=${result.appendOnly}, toolCall.args=${toolCall.args ? 'defined' : 'undefined'}, wasAppend=${wasAppend}`);

                  // Handle differently based on whether this is an append or replace operation
                  if (wasAppend) {
                    console.log(`This was an append operation.`);

                    // Get the content to append - prefer the appendedContent from the result
                    // The backend should always provide appendedContent for append operations
                    const contentToAppend = result.appendedContent;

                    if (contentToAppend) {
                      console.log(`Appending content to document ${result.documentId}`);
                      console.log(`Content to append: ${contentToAppend.substring(0, 50)}...`);

                      // Use the APPEND_DOCUMENT_CONTENT action
                      dispatch({
                        type: 'APPEND_DOCUMENT_CONTENT',
                        payload: {
                          id: result.documentId,
                          content: contentToAppend,
                          forceSync: true // Force sync to ensure content is saved
                        }
                      });
                    } else {
                      console.warn(`No content to append found in result.appendedContent`);

                      // Fallback to using the content from the result
                      dispatch({
                        type: 'UPDATE_DOCUMENT',
                        payload: {
                          id: result.documentId,
                          content: result.content,
                          forceSync: true // Force sync to ensure content is saved
                        }
                      });
                    }
                  } else {
                    // Regular update (replace)
                    console.log(`Replacing content for document ${result.documentId}`);
                    console.log(`New content length: ${result.content.length} chars`);

                    // Update the document in the context with the content from the result
                    dispatch({
                      type: 'UPDATE_DOCUMENT',
                      payload: {
                        id: result.documentId,
                        content: result.content,
                        forceSync: false // Don't force sync to MongoDB as it was just updated
                      }
                    });
                  }

                  console.log(`Document content update processed for ${result.documentId}`);
                } else if (toolCall.name === 'createDocument' && result.documentId) {
                  // Add the new document to the context
                  dispatch({
                    type: 'ADD_DOCUMENT',
                    payload: {
                      id: result.documentId,
                      name: "Document from Epii Agent",
                      content: result.content,
                      lastModified: new Date()
                    }
                  });
                  console.log(`Added new document from LLM tool call: ${result.documentId}`);
                }
              }
            } catch (error) {
              console.error(`Error processing document update tool call:`, error);
            }
          });
        }
      }
    } catch (error) {
      console.error('Error sending chat message:', error);

      // Show error message
      dispatch({
        type: 'SET_ERROR',
        payload: `Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-grow overflow-y-auto mb-4 p-2">
        {documentSpecificMessages.length === 0 ? (
          <div className="mb-2 p-2 rounded bg-gray-700 text-gray-300 self-start text-sm">
            Start a conversation about the document...
          </div>
        ) : (
          documentSpecificMessages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 p-2 rounded ${
                msg.role === 'user'
                  ? 'bg-epii-neon/20 text-white self-end ml-auto'
                  : 'bg-gray-700 text-gray-300 self-start mr-auto'
              } text-sm max-w-[80%]`}
            >
              <div>{msg.content}</div>

              {/* Display tool calls if available */}
              {msg.tool_calls && msg.tool_calls.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-600">
                  <div className="text-xs text-gray-400 mb-1">Tools used:</div>
                  {msg.tool_calls.map((tool, index) => (
                    <div key={index} className="text-xs bg-gray-800 p-1 rounded mb-1">
                      <span className="text-epii-neon">{tool.name}</span>
                      {tool.result && (
                        <div className="mt-1 text-gray-400 overflow-hidden text-ellipsis">
                          {typeof tool.result === 'string' && tool.result.length > 100
                            ? tool.result.substring(0, 100) + '...'
                            : tool.result}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Chat input */}
      <div className="mt-auto">
        {/* Collapsible Selections Panel */}
        {(currentSelection || documentSelections.length > 0) && (
          <div className="mb-2 border border-purple-600 rounded overflow-hidden">
            {/* Panel Header */}
            <div
              className="flex justify-between items-center p-2 bg-purple-900/50 cursor-pointer"
              onClick={() => setIsSelectionsOpen(!isSelectionsOpen)}
            >
              <div className="flex items-center">
                <span className="font-medium text-purple-100">
                  {currentSelection ? "Active Selection" : "Selections"}
                  {documentSelections.length > 0 &&
                    ` (${documentSelections.length})`
                  }
                </span>
              </div>
              <div className="flex items-center">
                {currentSelection && (
                  <button
                    className="text-xs px-1 mr-2 bg-purple-700 hover:bg-purple-600 rounded text-purple-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('EpiiChat: Clearing current selection');

                      // Clear selection in context
                      dispatch({ type: 'SET_SELECTION', payload: null });

                      // Dispatch custom event to notify DocumentViewer
                      document.dispatchEvent(new Event('clearSelection'));
                    }}
                  >
                    Clear
                  </button>
                )}
                {isSelectionsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>

            {/* Panel Content - only shown when open */}
            {isSelectionsOpen && (
              <div className="p-2 bg-gray-800/80">
                {/* Current Selection */}
                {currentSelection && (
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-purple-100">Active Selection:</span>
                    </div>

                    <div className="p-2 bg-purple-800/50 border border-purple-600 rounded">
                      <div className="flex justify-between items-center mb-1">
                        {/* Document info for current selection */}
                        <div className="flex flex-col">
                          {(() => {
                            const selDoc = state.documents.find(doc => doc.id === currentSelection.documentId);
                            const bimbaCoord = selDoc?.bimbaCoordinate || currentSelection.bimbaCoordinate || 'Unknown';

                            return (
                              <span className="text-[10px] text-blue-300">
                                Current document
                                <span className="ml-1 text-gray-400">({bimbaCoord})</span>
                              </span>
                            );
                          })()}
                        </div>

                        <div className="flex space-x-1">
                          <button
                            className="text-xs p-1 bg-blue-700 hover:bg-blue-600 rounded text-blue-100"
                            onClick={() => {
                              // Save the current selection
                              if (currentSelection) {
                                // Get the current document to access its bimbaCoordinate
                                const currentDoc = state.documents.find(doc => doc.id === state.currentDocumentId);

                                // Create an enhanced selection with all necessary metadata
                                const enhancedSelection = {
                                  ...currentSelection,
                                  id: currentSelection.id || `sel-${Date.now()}`,
                                  timestamp: currentSelection.timestamp || new Date(),
                                  isPratibimba: currentSelection.isPratibimba || currentDoc?.documentType === 'pratibimba',
                                  bimbaCoordinate: currentSelection.bimbaCoordinate || currentDoc?.bimbaCoordinate
                                };

                                // Use the batched action to save and clear in one step
                                if (process.env.NODE_ENV === 'development') {
                                  console.log('EpiiChat: Saving and clearing selection in one step');
                                }

                                // Use the new batched action
                                dispatch({
                                  type: 'SAVE_AND_CLEAR_SELECTION',
                                  payload: enhancedSelection
                                });

                                dispatch({
                                  type: 'SET_STATUS_MESSAGE',
                                  payload: {
                                    type: 'success',
                                    text: 'Selection saved'
                                  }
                                });
                              }
                            }}
                            title="Save this selection"
                          >
                            <Save size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="text-white text-xs">
                        {currentSelection.text.substring(0, 100)}
                        {currentSelection.text.length > 100 ? '...' : ''}
                      </div>
                    </div>
                  </div>
                )}

                {/* Saved Selections */}
                {documentSelections.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-blue-100">Saved Selections:</span>
                      <button
                        className="text-xs px-1 bg-red-700/70 hover:bg-red-600 rounded text-red-100"
                        onClick={() => {
                          // Clear all selections from state
                          if (process.env.NODE_ENV === 'development') {
                            console.log(`EpiiChat: Clearing all selections`);
                          }

                          // Use the CLEAR_SELECTIONS action
                          dispatch({
                            type: 'CLEAR_SELECTIONS',
                            payload: undefined // Clear all selections
                          });
                        }}
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {documentSelections.map((sel: any) => (
                          <div
                            key={sel.id}
                            className={`text-xs p-2 rounded border ${
                              currentSelection?.id === sel.id
                                ? 'bg-blue-800/50 border-blue-500'
                                : 'bg-gray-700/50 border-gray-600 hover:border-blue-500'
                            } cursor-pointer`}
                            onClick={() => {
                              dispatch({
                                type: 'SET_SELECTION',
                                payload: sel
                              });
                            }}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <div className="flex flex-col">
                                {/* Get document info for this selection */}
                                {(() => {
                                  const selDoc = state.documents.find(doc => doc.id === sel.documentId);
                                  const isCurrentDoc = sel.documentId === state.currentDocumentId;
                                  const bimbaCoord = selDoc?.bimbaCoordinate || sel.bimbaCoordinate || 'Unknown';

                                  return (
                                    <span
                                      className={`text-[10px] ${isCurrentDoc ? 'text-blue-300' : 'text-purple-300'} hover:underline cursor-pointer`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (!isCurrentDoc && sel.documentId) {
                                          // Switch to the document this selection belongs to
                                          dispatch({
                                            type: 'SET_CURRENT_DOCUMENT',
                                            payload: sel.documentId
                                          });
                                        }
                                      }}
                                      title={isCurrentDoc ? "Current document" : "Click to switch to this document"}
                                    >
                                      {isCurrentDoc ? 'Current document' : `Doc: ${selDoc?.name || 'Unknown'}`}
                                      <span className="ml-1 text-gray-400">({bimbaCoord})</span>
                                    </span>
                                  );
                                })()}
                              </div>
                              <button
                                className="text-gray-400 hover:text-red-400 p-0.5"
                                onClick={(e) => {
                                  e.stopPropagation();

                                  // Just remove from state
                                  if (process.env.NODE_ENV === 'development') {
                                    console.log(`EpiiChat: Removing selection ${sel.id}`);
                                  }

                                  // Use the REMOVE_SELECTION action instead of SET_SELECTIONS
                                  dispatch({
                                    type: 'REMOVE_SELECTION',
                                    payload: sel.id
                                  });
                                }}
                              >
                                <Trash size={10} />
                              </button>
                            </div>
                            <div className="text-white">
                              {sel.text.substring(0, 60)}{sel.text.length > 60 ? '...' : ''}
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <textarea
          className={`w-full p-2 border ${currentSelection ? 'border-purple-600' : 'border-gray-600'} rounded mb-2 bg-gray-800 text-gray-200 placeholder-gray-500 focus:ring-epii-neon focus:border-epii-neon ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          rows={3}
          placeholder={
            currentSelection
              ? "Ask about the selected text..."
              : documentSelections.length > 0
                ? "Ask about the document or any saved selection..."
                : "Ask about the document analysis..."
          }
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <button
          className={`w-full bg-epii-purple text-white p-2 rounded hover:bg-epii-purple-dark transition-colors duration-200 ${isLoading || !message.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleSendMessage}
          disabled={isLoading || !message.trim()}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader size={16} className="animate-spin mr-2" />
              Processing...
            </span>
          ) : (
            'Send'
          )}
        </button>
      </div>
    </div>
  );
};

export default EpiiChat;
