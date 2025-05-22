import React, { useRef, useEffect } from 'react';
import { Send, Loader } from 'lucide-react';

interface Message {
  role: string;
  content: string;
}

interface DocumentChatProps {
  messages: Message[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const DocumentChat: React.FC<DocumentChatProps> = ({
  messages,
  inputValue,
  onInputChange,
  onSendMessage,
  isLoading
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input on mount
  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e.target.value);
  };
  
  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !isLoading) {
        onSendMessage(inputValue);
      }
    }
  };
  
  // Handle send button click
  const handleSendClick = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-3 border-b border-epii-dark flex items-center">
        <div className="w-3 h-3 rounded-full bg-epii-neon mr-2"></div>
        <h3 className="font-medium">Document Assistant</h3>
      </div>
      
      {/* Messages container */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user' 
                  ? 'bg-epii-neon text-epii-darker' 
                  : 'bg-epii-dark text-white'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="p-3 border-t border-epii-dark">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Ask about the document or provide feedback..."
            className="w-full bg-epii-dark text-white rounded-lg p-3 pr-10 resize-none focus:outline-none focus:ring-1 focus:ring-epii-neon"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSendClick}
            disabled={!inputValue.trim() || isLoading}
            className={`absolute right-2 bottom-2 p-1 rounded-full ${
              !inputValue.trim() || isLoading 
                ? 'text-gray-500 cursor-not-allowed' 
                : 'text-epii-neon hover:bg-epii-neon/10'
            }`}
          >
            {isLoading ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentChat;
