import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface DocumentViewerProps {
  content: string;
  onChange: (content: string) => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ content, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(content);
  const [fileType, setFileType] = useState<string>('text');
  
  // Update editable content when content prop changes
  useEffect(() => {
    setEditableContent(content);
  }, [content]);
  
  // Detect file type based on content
  useEffect(() => {
    // Simple detection based on content patterns
    if (content.startsWith('{') || content.startsWith('[')) {
      setFileType('json');
    } else if (content.includes('<html') || content.includes('<!DOCTYPE html')) {
      setFileType('html');
    } else if (content.includes('```') || content.includes('#')) {
      setFileType('markdown');
    } else if (content.includes('function') || content.includes('const ') || content.includes('import ')) {
      setFileType('javascript');
    } else if (content.includes('class ') || content.includes('public ') || content.includes('private ')) {
      setFileType('java');
    } else if (content.includes('def ') || content.includes('import ') && content.includes(':')) {
      setFileType('python');
    } else {
      setFileType('text');
    }
  }, [content]);
  
  // Handle edit toggle
  const toggleEdit = () => {
    if (isEditing) {
      // Save changes
      onChange(editableContent);
    }
    setIsEditing(!isEditing);
  };
  
  // Handle content change in textarea
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableContent(e.target.value);
  };
  
  // Render editor or viewer based on state
  return (
    <div className="relative h-full">
      {/* Edit toggle button */}
      <button
        onClick={toggleEdit}
        className="absolute top-2 right-2 z-10 bg-epii-dark text-white px-3 py-1 rounded-md hover:bg-epii-neon hover:text-epii-darker transition-all"
      >
        {isEditing ? 'Save' : 'Edit'}
      </button>
      
      {/* Editor or Viewer */}
      {isEditing ? (
        <textarea
          value={editableContent}
          onChange={handleContentChange}
          className="w-full h-full p-4 bg-epii-darker text-white font-mono resize-none focus:outline-none"
          spellCheck={false}
        />
      ) : (
        <div className="w-full h-full overflow-auto">
          {fileType === 'text' ? (
            <pre className="p-4 whitespace-pre-wrap font-mono text-white">{content}</pre>
          ) : (
            <SyntaxHighlighter
              language={fileType}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: '1rem',
                background: 'transparent',
                height: '100%',
                overflow: 'visible'
              }}
              wrapLongLines={true}
            >
              {content}
            </SyntaxHighlighter>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentViewer;
