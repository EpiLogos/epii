import React, { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, MessageSquare, Play, Save } from 'lucide-react';
import DocumentViewer from './DocumentViewer';
import DocumentChat from './DocumentChat';
import DocumentControls from './DocumentControls';

interface DocumentCanvasProps {
  userId: string;
}

const DocumentCanvas: React.FC<DocumentCanvasProps> = ({ userId }) => {
  // Document state
  const [documentContent, setDocumentContent] = useState<string>('');
  const [documentName, setDocumentName] = useState<string>('');
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<Array<{role: string, content: string}>>([]);
  const [chatInput, setChatInput] = useState<string>('');
  
  // Analysis state
  const [targetCoordinate, setTargetCoordinate] = useState<string>('');
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [analysisSessionId, setAnalysisSessionId] = useState<string | null>(null);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle file drop
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setDocumentName(file.name);
    setIsLoading(true);
    
    try {
      // Create form data for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      
      // Upload file
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      setDocumentId(data.file.id);
      
      // Fetch file content
      const contentResponse = await fetch(`/api/files/${data.file.id}`);
      if (!contentResponse.ok) {
        throw new Error(`Failed to fetch file content: ${contentResponse.statusText}`);
      }
      
      const contentData = await contentResponse.json();
      setDocumentContent(contentData.file.textContent);
      
      // Add welcome message to chat
      setChatMessages([
        { 
          role: 'assistant', 
          content: `I've loaded "${file.name}". You can edit the document, ask me questions about it, or start the analysis process when you're ready.` 
        }
      ]);
    } catch (error) {
      console.error('Error handling file:', error);
      setChatMessages([
        { 
          role: 'assistant', 
          content: `There was an error loading the file. Please try again.` 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);
  
  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/html': ['.html', '.htm'],
      'application/json': ['.json'],
      'text/csv': ['.csv'],
      'application/xml': ['.xml'],
      'text/rtf': ['.rtf']
    },
    maxFiles: 1,
    multiple: false
  });
  
  // Handle file button click
  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle file input change
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      await onDrop([files[0]]);
    }
  };
  
  // Handle document content change (editing)
  const handleDocumentChange = (newContent: string) => {
    setDocumentContent(newContent);
  };
  
  // Handle chat message submission
  const handleChatSubmit = async (message: string) => {
    if (!message.trim()) return;
    
    // Add user message to chat
    setChatMessages(prev => [...prev, { role: 'user', content: message }]);
    setChatInput('');
    
    // If we have an active analysis session, send as chat message
    if (analysisSessionId) {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            mode: 'epii',
            chatMessage: message,
            analysisSessionId
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Chat request failed: ${response.statusText}`);
        }
        
        const data = await response.json();
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
        
        // Update analysis if needed
        if (data.updatedAnalysis) {
          setAnalysisResults(data.updatedAnalysis);
        }
      } catch (error) {
        console.error('Error sending chat message:', error);
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Sorry, there was an error processing your message.' 
        }]);
      }
    } else {
      // Simple echo for now, will be replaced with LLM call
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `I'm analyzing your document. You asked: "${message}". When you're ready to start the formal analysis process, please click the Analyze button and provide a target coordinate.` 
        }]);
      }, 500);
    }
  };
  
  // Handle analysis start
  const handleStartAnalysis = async () => {
    if (!documentId || !targetCoordinate) {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Please provide a target coordinate before starting analysis.' 
      }]);
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          mode: 'epii',
          fileId: documentId,
          targetCoordinate
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Analysis request failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      setAnalysisSessionId(data.analysisSessionId);
      
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Analysis started for document "${documentName}" with target coordinate ${targetCoordinate}. You can ask me questions about the analysis as it progresses.` 
      }]);
      
      // If we have analysis results already
      if (data.notionUpdatePayload) {
        setAnalysisResults(data.notionUpdatePayload);
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `Analysis complete! I've identified key mappings and variations in the document. You can now refine the analysis or proceed to crystallization.` 
        }]);
      }
    } catch (error) {
      console.error('Error starting analysis:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, there was an error starting the analysis process.' 
      }]);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Render empty state if no document
  if (!documentContent) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 bg-epii-darker rounded-lg border border-epii-dark">
        <div 
          {...getRootProps()} 
          className={`flex flex-col items-center justify-center w-full max-w-md p-8 border-2 border-dashed rounded-lg transition-all cursor-pointer
            ${isDragActive ? 'border-epii-neon bg-epii-neon/10' : 'border-gray-600 hover:border-epii-neon/50 hover:bg-epii-dark'}`}
        >
          <input {...getInputProps()} />
          <Upload size={48} className={`mb-4 ${isDragActive ? 'text-epii-neon' : 'text-gray-400'}`} />
          <h3 className="text-xl font-semibold mb-2">
            {isDragActive ? 'Drop your document here' : 'Upload a document'}
          </h3>
          <p className="text-center text-gray-400 mb-4">
            Drag and drop a file, or click to select
          </p>
          <button 
            onClick={handleFileButtonClick}
            className="bg-epii-neon text-epii-darker px-4 py-2 rounded-md hover:brightness-110 transition-all"
          >
            Select File
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept=".txt,.md,.pdf,.docx,.doc,.html,.htm,.json,.csv,.xml,.rtf"
          />
        </div>
      </div>
    );
  }
  
  // Render document canvas with loaded document
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
      {/* Document viewer/editor (2/3 width on large screens) */}
      <div className="lg:col-span-2 bg-epii-darker rounded-lg border border-epii-dark overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-3 border-b border-epii-dark">
          <div className="flex items-center">
            <FileText size={18} className="mr-2 text-epii-neon" />
            <h3 className="font-medium truncate">{documentName}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              className="p-1 hover:bg-epii-dark rounded-md transition-all"
              title="Save changes"
            >
              <Save size={18} />
            </button>
          </div>
        </div>
        <div className="flex-grow overflow-auto">
          <DocumentViewer 
            content={documentContent} 
            onChange={handleDocumentChange} 
          />
        </div>
      </div>
      
      {/* Chat and controls (1/3 width on large screens) */}
      <div className="flex flex-col bg-epii-darker rounded-lg border border-epii-dark overflow-hidden">
        {/* Analysis controls */}
        <DocumentControls 
          targetCoordinate={targetCoordinate}
          onTargetCoordinateChange={setTargetCoordinate}
          onStartAnalysis={handleStartAnalysis}
          isAnalyzing={isAnalyzing}
          analysisResults={analysisResults}
        />
        
        {/* Chat interface */}
        <div className="flex-grow overflow-hidden">
          <DocumentChat 
            messages={chatMessages}
            inputValue={chatInput}
            onInputChange={setChatInput}
            onSendMessage={handleChatSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentCanvas;
