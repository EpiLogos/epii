import React, { KeyboardEvent, useState } from "react";
import { Send, FileUp } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  onFileUpload?: (fileId: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  isLoading,
  onFileUpload
}) => {
  const [fileName, setFileName] = useState('');
  const [fileId, setFileId] = useState<string|null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle'|'uploading'|'success'|'error'>('idle');

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };
  
  return (
    <div className="p-4 border-t border-epii-neon/10 bg-epii-darker/30">
      <div className="flex gap-2">
        <div className="flex-grow relative">
          <textarea
            className="w-full px-4 py-3 pr-12 rounded-md bg-epii-dark/80 neo-glow border-epii-neon/20 focus:outline-none focus:ring-2 focus:ring-epii-neon/50 resize-none min-h-[60px] max-h-[160px]"
            placeholder="Ask about documents, explore connections, or inquire about concepts..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
          />
          
          <button 
            className={`absolute right-3 bottom-3 text-epii-neon p-1 rounded-md transition-all
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-epii-neon/10'}`}
            onClick={onSend}
            disabled={isLoading}
          >
            <Send size={20} />
          </button>
        </div>
        
        <div className="relative">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={async (e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                const formData = new FormData();
                formData.append('file', files[0]);
                
                try {
                  console.log('Attempting to upload file:', files[0].name, files[0].size);
                  const response = await fetch('http://localhost:3001/api/chat/upload', {
                    method: 'POST',
                    body: formData,
                    headers: {
                      'Accept': 'application/json'
                    }
                  });

                  if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Upload failed: ${response.status} ${errorText}`);
                  }

                  const result = await response.json();
                  console.log('File upload successful with fileId:', result.fileId);
                  setFileName(files[0].name);
                  setFileId(result.fileId);
                  if (onFileUpload) {
                    onFileUpload(result.fileId);
                  }
                  return result.fileId;
                } catch (error) {
                  console.error('Error uploading file:', error);
                } finally {
                  e.target.value = '';
                }
              }
            }}
          />
          <label
            htmlFor="file-upload"
            className="bg-epii-dark neo-glow rounded-md px-3 py-2 hover:bg-epii-dark/70 transition-all cursor-pointer inline-block"
          >
            <FileUp size={20} />
          </label>
          {fileName && <span className="text-sm text-foreground/70 ml-2">{fileName}</span>}
        </div>
      </div>
      
      <div className="mt-2 text-xs text-foreground/50 text-center">
        epii uses your documents and the knowledge base to provide contextual answers. 
        Responses are generated autonomously and may not be accurate.
      </div>
    </div>
  );
};
