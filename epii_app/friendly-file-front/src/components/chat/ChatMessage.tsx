
import React from "react";
import { FileText, User, Bot, ExternalLink } from "lucide-react";
import { Message } from "../../pages/Chat";

interface ChatMessageProps {
  message: Message;
  setActiveVisualData: (data: Message["visualData"] | null) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, setActiveVisualData }) => {
  const { content, sender, timestamp, references } = message;
  
  return (
    <div 
      className={`mb-6 flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div 
        className={`max-w-3xl rounded-lg p-4 ${
          sender === 'user' 
            ? 'bg-epii-neon/10 border border-epii-neon/30' 
            : 'bg-epii-darker/70 border border-epii-neon/20'
        }`}
      >
        <div className="flex items-center mb-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            sender === 'user' 
              ? 'bg-epii-neon/20 text-epii-neon' 
              : 'bg-epii-dark text-epii-neon'
          }`}>
            {sender === 'user' ? <User size={16} /> : <Bot size={16} />}
          </div>
          <div className="ml-2 text-sm opacity-70">
            {sender === 'user' ? 'You' : 'epii'} • {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        
        <div className="text-foreground whitespace-pre-wrap">{content}</div>
        
        {/* References section */}
        {references && references.length > 0 && (
          <div className="mt-3 pt-3 border-t border-epii-neon/10">
            <div className="text-xs text-epii-neon mb-2">Referenced Sources:</div>
            <div className="flex flex-wrap gap-2">
              {references.map((ref, idx) => (
                <div 
                  key={idx} 
                  className="bg-epii-dark/70 px-3 py-1 rounded-full text-sm flex items-center cursor-pointer hover:bg-epii-neon/20 transition-all"
                  onClick={() => message.visualData && setActiveVisualData(message.visualData)}
                >
                  {ref.type === 'file' && <FileText size={14} className="mr-1" />}
                  {ref.type === 'web' && <ExternalLink size={14} className="mr-1" />}
                  <span className="truncate max-w-[150px]">{ref.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Visualization trigger - if the message has visual data */}
        {message.visualData && (
          <div 
            className="mt-3 text-sm text-epii-neon cursor-pointer hover:underline flex items-center"
            onClick={() => setActiveVisualData(message.visualData)}
          >
            <span>View {message.visualData.type} visualization</span>
            <ExternalLink size={14} className="ml-1" />
          </div>
        )}
      </div>
    </div>
  );
};
