/**
 * Chat interface for document analysis
 * Bimba Coordinate: #5-3-4.5-3-1
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { ChatMessage } from '../0_foundation/epiiTypes';
import { formatDate } from "../1_services/utils/epiiFormatters';

interface DocumentChatProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  onSendMessage: (message: string) => void;
}

const DocumentChat: React.FC<DocumentChatProps> = ({
  messages,
  isLoading = false,
  onSendMessage
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle send message
  const handleSendMessage = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  // Render message content (simple version without markdown)
  const renderMessageContent = (content: string) => {
    return (
      <div className="whitespace-pre-wrap">
        {content}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${
                message.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-epii-neon/20 text-white'
                    : 'bg-epii-dark text-white'
                }`}
              >
                {renderMessageContent(message.content)}
              </div>
              <span className="text-xs text-gray-400 mt-1">
                {formatDate(message.timestamp)}
              </span>
            </div>
          ))
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-start">
            <div className="bg-epii-dark rounded-lg p-3 flex items-center space-x-2">
              <Loader2 size={16} className="animate-spin text-epii-neon" />
              <span>Thinking...</span>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-epii-dark p-3">
        <div className="flex items-end space-x-2">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-grow bg-epii-dark rounded-lg p-3 resize-none focus:outline-none focus:ring-1 focus:ring-epii-neon min-h-[60px] max-h-[120px]"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className={`p-3 rounded-lg ${
              !inputValue.trim() || isLoading
                ? 'bg-epii-dark text-gray-500 cursor-not-allowed'
                : 'bg-epii-neon text-black hover:bg-epii-neon/80'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentChat;
