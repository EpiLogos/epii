/**
 * Document viewing and editing component with selection support
 * Bimba Coordinate: #5-3-4.5-3-0
 */

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getLanguageForSyntaxHighlighting } from '../1_utils/epiiHelpers';
import { debounce } from '../1_utils/debounce';
import { Search, Sparkles, Save } from 'lucide-react';
import { useEpii } from '../4_context/EpiiContext';
import { TextSelection } from '../0_foundation/epiiTypes';

interface DocumentViewerProps {
  content: string;
  filename?: string;
  onChange?: (content: string) => void;
  onSelectionChange?: (selection: TextSelection | null) => void;
  onSelectionAction?: (action: 'analyze' | 'crystallize', selection: TextSelection) => void;
  readOnly?: boolean;
  isPratibimba?: boolean;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  content,
  filename = '',
  onChange,
  onSelectionChange,
  onSelectionAction,
  readOnly = false,
  isPratibimba = false
}) => {
  // Get state and dispatch from EpiiContext
  const { state, dispatch } = useEpii();

  const [editorContent, setEditorContent] = useState(content);
  const [language, setLanguage] = useState('text');
  const [selection, setSelection] = useState<TextSelection | null>(null);
  const [selectionPosition, setSelectionPosition] = useState({ top: 0, left: 0 });
  const [showSelectionMenu, setShowSelectionMenu] = useState(false);

  // Use all selections, not just document-specific ones
  // This ensures selections persist across document switches
  const documentSelections = state.selections;

  // Only log selection state in development and when it changes
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`DocumentViewer: ${state.selections.length} selections, document ID: ${state.currentDocumentId || 'none'}`);
    }
  }, [state.selections.length, state.currentDocumentId]);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const highlighterRef = useRef<HTMLDivElement>(null);

  // Update content when prop changes
  useEffect(() => {
    console.log(`DocumentViewer: Content updated, length: ${content.length}`);
    console.log(`DocumentViewer: Content preview: "${content.substring(0, 50)}..."`);
    setEditorContent(content);
    // Clear selection when content changes
    setSelection(null);
    setShowSelectionMenu(false);
    // Don't call onSelectionChange here to avoid infinite loops
  }, [content]);

  // Listen for external selection changes
  useEffect(() => {
    // If selection is cleared externally (e.g., from the chat component)
    const handleSelectionClear = () => {
      console.log('DocumentViewer: Selection cleared externally');
      setSelection(null);
      setShowSelectionMenu(false);

      // Also clear in context
      dispatch({
        type: 'SET_SELECTION',
        payload: null
      });
    };

    // Add event listener for selection clearing
    document.addEventListener('clearSelection', handleSelectionClear as EventListener);

    return () => {
      document.removeEventListener('clearSelection', handleSelectionClear as EventListener);
    };
  }, [dispatch]);

  // We don't clear selection when document changes
  // This allows selections to persist when switching documents

  // Detect language for syntax highlighting
  useEffect(() => {
    setLanguage(getLanguageForSyntaxHighlighting(filename, content));
  }, [filename, content]);

  // Handle content change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setEditorContent(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };

  // Create a debounced version of the text selection handler
  const handleTextAreaSelectionImpl = useCallback(() => {
    if (!textAreaRef.current || !state.currentDocumentId) return;

    const textarea = textAreaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start !== end) {
      const selectedText = textarea.value.substring(start, end);

      // Calculate position for selection menu
      const cursorPosition = getCursorPosition(textarea, end);

      // Get the current document to access its bimbaCoordinate
      const currentDoc = state.documents.find(doc => doc.id === state.currentDocumentId);

      // Create the new selection object with enhanced properties
      const newSelection: TextSelection = {
        id: `sel-${Date.now()}`,
        documentId: state.currentDocumentId,
        start,
        end,
        text: selectedText,
        timestamp: new Date(),
        isPratibimba,
        bimbaCoordinate: currentDoc?.bimbaCoordinate
      };

      // Update local state for UI
      setSelection(newSelection);
      setSelectionPosition(cursorPosition);
      setShowSelectionMenu(true);

      // Update the EpiiContext with the current selection
      dispatch({
        type: 'SET_SELECTION',
        payload: newSelection
      });

      // Notify parent component if needed
      if (onSelectionChange) {
        onSelectionChange(newSelection);
      }
    }
    // We don't clear the selection when clicking elsewhere
    // This allows the selection to persist when clicking on the chat
  }, [state.currentDocumentId, state.documents, isPratibimba, dispatch, onSelectionChange]);

  // Apply debounce to the implementation
  const handleTextAreaSelection = useMemo(() =>
    debounce(handleTextAreaSelectionImpl, 300), // 300ms debounce delay
    [handleTextAreaSelectionImpl]
  );

  // Create a debounced version of the read-only selection handler
  const handleReadOnlySelectionImpl = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !highlighterRef.current || !state.currentDocumentId) return;

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();

    if (selectedText) {
      // This is an approximation as getting exact character positions in syntax highlighter is complex
      // For a production app, we would need a more robust solution
      const start = content.indexOf(selectedText);
      const end = start + selectedText.length;

      if (start >= 0) {
        // Calculate position for selection menu
        const rect = range.getBoundingClientRect();
        const highlighterRect = highlighterRef.current.getBoundingClientRect();

        const position = {
          top: rect.bottom - highlighterRect.top,
          left: rect.left - highlighterRect.left + rect.width / 2
        };

        // Get the current document to access its bimbaCoordinate
        const currentDoc = state.documents.find(doc => doc.id === state.currentDocumentId);

        // Create the new selection object with enhanced properties
        const newSelection: TextSelection = {
          id: `sel-${Date.now()}`,
          documentId: state.currentDocumentId,
          start,
          end,
          text: selectedText,
          timestamp: new Date(),
          isPratibimba,
          bimbaCoordinate: currentDoc?.bimbaCoordinate
        };

        // Update local state for UI
        setSelection(newSelection);
        setSelectionPosition(position);
        setShowSelectionMenu(true);

        // Update the EpiiContext with the current selection
        dispatch({
          type: 'SET_SELECTION',
          payload: newSelection
        });

        // Notify parent component if needed
        if (onSelectionChange) {
          onSelectionChange(newSelection);
        }
      }
    }
    // We don't clear the selection when clicking elsewhere
    // This allows the selection to persist when clicking on the chat
  }, [state.currentDocumentId, state.documents, content, isPratibimba, dispatch, onSelectionChange]);

  // Apply debounce to the implementation
  const handleReadOnlySelection = useMemo(() =>
    debounce(handleReadOnlySelectionImpl, 300), // 300ms debounce delay
    [handleReadOnlySelectionImpl]
  );

  // Helper function to get cursor position in textarea
  const getCursorPosition = (textarea: HTMLTextAreaElement, position: number) => {
    // Create a temporary div with the same styling as the textarea
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    div.style.width = `${textarea.clientWidth}px`;
    div.style.fontSize = window.getComputedStyle(textarea).fontSize;
    div.style.fontFamily = window.getComputedStyle(textarea).fontFamily;
    div.style.lineHeight = window.getComputedStyle(textarea).lineHeight;
    div.style.whiteSpace = 'pre-wrap';

    // Get text up to the cursor position
    const textUpToCursor = textarea.value.substring(0, position);
    div.textContent = textUpToCursor;

    // Add a span at the end to get its position
    const span = document.createElement('span');
    span.textContent = '|';
    div.appendChild(span);

    // Add to document, measure, then remove
    document.body.appendChild(div);
    const rect = span.getBoundingClientRect();
    const textareaRect = textarea.getBoundingClientRect();
    document.body.removeChild(div);

    return {
      top: rect.top - textareaRect.top + textarea.scrollTop + span.offsetHeight,
      left: rect.left - textareaRect.left + textarea.scrollLeft
    };
  };

  // Handle selection action
  const handleSelectionAction = (action: 'analyze' | 'crystallize' | 'save') => {
    if (!selection) return;

    console.log(`Selection action: ${action}`, selection);

    if (action === 'save') {
      console.log('Saving selection:', selection);

      // Get the current document to access its bimbaCoordinate
      const currentDoc = state.documents.find(doc => doc.id === state.currentDocumentId);

      // Create an enhanced selection with all necessary metadata
      const enhancedSelection = {
        ...selection,
        id: selection.id || `sel-${Date.now()}`,
        timestamp: selection.timestamp || new Date(),
        isPratibimba: selection.isPratibimba || currentDoc?.documentType === 'pratibimba',
        bimbaCoordinate: selection.bimbaCoordinate || currentDoc?.bimbaCoordinate
      };

      // Use the batched action to save and clear in one step
      if (process.env.NODE_ENV === 'development') {
        console.log('DocumentViewer: Saving and clearing selection in one step');
      }

      // Use the new batched action
      dispatch({
        type: 'SAVE_AND_CLEAR_SELECTION',
        payload: enhancedSelection
      });

      // Update local state
      setSelection(null);
      setShowSelectionMenu(false);

      // Show success message
      dispatch({
        type: 'SET_STATUS_MESSAGE',
        payload: {
          type: 'success',
          text: 'Selection saved'
        }
      });
    } else {
      // Call the parent handler for analyze or crystallize actions
      if (onSelectionAction) {
        onSelectionAction(action, selection);
      }
    }

    // Hide the menu
    setShowSelectionMenu(false);
  };

  // Render read-only view with syntax highlighting
  if (readOnly) {
    return (
      <div className="h-full overflow-auto relative" ref={highlighterRef}>
        {/* Selection menu for read-only view */}
        {selection && showSelectionMenu && (
          <div
            className="absolute z-10 bg-epii-dark border border-epii-neon rounded-md shadow-lg p-2 flex space-x-2"
            style={{
              top: `${selectionPosition.top}px`,
              left: `${selectionPosition.left}px`,
              transform: 'translateX(-50%)'
            }}
          >
            <button
              className="text-xs px-2 py-1 bg-epii-neon text-epii-darker rounded-md hover:brightness-110 flex items-center"
              onClick={() => handleSelectionAction('analyze')}
              title="Analyze this selection"
            >
              <Search size={12} className="mr-1" />
              Analyze
            </button>
            {/* Only show Crystallize button for bimba documents */}
            {!isPratibimba && (
              <button
                className="text-xs px-2 py-1 bg-purple-700 text-purple-100 rounded-md hover:bg-purple-600 flex items-center"
                onClick={() => handleSelectionAction('crystallize')}
                title="Create a crystallization from this selection"
              >
                <Sparkles size={12} className="mr-1" />
                Crystallize
              </button>
            )}
            <button
              className="text-xs px-2 py-1 bg-blue-600 text-blue-100 rounded-md hover:bg-blue-500 flex items-center"
              onClick={() => handleSelectionAction('save')}
              title="Save this selection for later reference"
            >
              <Save size={12} className="mr-1" />
              Save
            </button>
          </div>
        )}

        {/* No separate selections panel - all selection management is in EpiiChat */}

        <div onMouseUp={handleReadOnlySelection} className="relative">
          {/* Render selection highlights */}
          {documentSelections.map((sel) => (
            <div
              key={sel.id}
              className="absolute bg-purple-500/20 border border-purple-400/50 rounded-sm z-0 pointer-events-none"
              style={{
                // This is a simplified approach - in a real app, you'd need more sophisticated positioning
                top: `${Math.floor(sel.start / content.length * 100)}%`,
                left: '0',
                width: '100%',
                height: '24px',
              }}
            />
          ))}

          {/* Render current selection highlight */}
          {state.currentSelection && state.currentSelection.documentId === state.currentDocumentId && (
            <div
              className="absolute bg-epii-neon/30 border border-epii-neon/50 rounded-sm z-0 pointer-events-none"
              style={{
                // This is a simplified approach - in a real app, you'd need more sophisticated positioning
                top: `${Math.floor(state.currentSelection.start / content.length * 100)}%`,
                left: '0',
                width: '100%',
                height: '24px',
              }}
            />
          )}

          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: '1rem',
              height: '100%',
              fontSize: '0.9rem',
              backgroundColor: 'transparent',
              position: 'relative',
              zIndex: 1
            }}
            showLineNumbers
            wrapLines
          >
            {content}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  }

  // Render editable view
  return (
    <div className="h-full relative">
      {/* Selection menu for editable view */}
      {selection && showSelectionMenu && (
        <div
          className="absolute z-10 bg-epii-dark border border-epii-neon rounded-md shadow-lg p-2 flex space-x-2"
          style={{
            top: `${selectionPosition.top}px`,
            left: `${selectionPosition.left}px`,
            transform: 'translateX(-50%)'
          }}
        >
          <button
            className="text-xs px-2 py-1 bg-epii-neon text-epii-darker rounded-md hover:brightness-110 flex items-center"
            onClick={() => handleSelectionAction('analyze')}
            title="Analyze this selection"
          >
            <Search size={12} className="mr-1" />
            Analyze
          </button>
          {/* Only show Crystallize button for bimba documents */}
          {!isPratibimba && (
            <button
              className="text-xs px-2 py-1 bg-purple-700 text-purple-100 rounded-md hover:bg-purple-600 flex items-center"
              onClick={() => handleSelectionAction('crystallize')}
              title="Create a crystallization from this selection"
            >
              <Sparkles size={12} className="mr-1" />
              Crystallize
            </button>
          )}
          <button
            className="text-xs px-2 py-1 bg-blue-600 text-blue-100 rounded-md hover:bg-blue-500 flex items-center"
            onClick={() => handleSelectionAction('save')}
            title="Save this selection for later reference"
          >
            <Save size={12} className="mr-1" />
            Save
          </button>
        </div>
      )}

      {/* No separate selections panel - all selection management is in EpiiChat */}

      <textarea
        ref={textAreaRef}
        value={editorContent}
        onChange={handleChange}
        onSelect={handleTextAreaSelection}
        onMouseUp={handleTextAreaSelection}
        onKeyUp={handleTextAreaSelection}
        className="w-full h-full p-4 bg-epii-darker text-gray-200 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-epii-neon"
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  );
};

export default DocumentViewer;
