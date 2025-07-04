/**
 * Chat Session Manager Component
 * 
 * Provides session management controls for the FloatingEpiLogosAgent including
 * session creation, history navigation, context compression, and archival.
 * 
 * Bimba Coordinate: #5-1-4 (Epii Agent UI Component)
 */

import React, { useState, useCallback, useEffect } from 'react';
import { 
  Plus, 
  History, 
  Trash2, 
  Archive, 
  Download, 
  Minimize2,
  Clock,
  MessageCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { AgentSession } from '../0_foundation';
import { sessionHistoryService } from '../3_services/SessionHistoryService';
import { contextCompactingService } from '../3_services/ContextCompactingService';

interface ChatSessionManagerProps {
  currentSession: AgentSession;
  onSessionChange: (sessionId: string) => void;
  onNewSession: () => void;
  onClearSession: () => void;
  onExportSession: (sessionId: string) => void;
  messageCount: number;
  className?: string;
}

interface SessionHistoryItem {
  id: string;
  title: string;
  timestamp: Date;
  messageCount: number;
  sessionType: 'general' | 'document' | 'analysis' | 'coordinate';
  contextIndicator?: string;
  isCompressed: boolean;
}

export const ChatSessionManager: React.FC<ChatSessionManagerProps> = ({
  currentSession,
  onSessionChange,
  onNewSession,
  onClearSession,
  onExportSession,
  messageCount,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<SessionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [showConfirmCompress, setShowConfirmCompress] = useState(false);

  // Load session history
  useEffect(() => {
    loadSessionHistory();
  }, []);

  const loadSessionHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const sessions = await sessionHistoryService.getRecentSessions(10);
      
      const historyItems: SessionHistoryItem[] = sessions.map(session => ({
        id: session.id,
        title: generateSessionTitle(session),
        timestamp: new Date(session.startTime),
        messageCount: session.messageCount || 0,
        sessionType: determineSessionType(session),
        contextIndicator: session.context?.documentId || session.context?.coordinate,
        isCompressed: false // AgentSession doesn't have isCompressed, defaulting to false
      }));

      setSessionHistory(historyItems);
    } catch (error) {
      console.error('[ChatSessionManager] Failed to load session history:', error);
      // Set empty array on error to prevent UI issues
      setSessionHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateSessionTitle = (session: any): string => {
    if (session.context?.documentId) {
      return `Document: ${session.context.documentName || session.context.documentId}`;
    }
    if (session.context?.coordinate) {
      return `Coordinate: ${session.context.coordinate}`;
    }
    if (session.title) {
      return session.title;
    }
    
    // Generate from first message or timestamp
    const date = new Date(session.startTime || session.timestamp);
    return `Session ${date.toLocaleDateString()} ${date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
  };

  const determineSessionType = (session: any): SessionHistoryItem['sessionType'] => {
    if (session.context?.documentId) return 'document';
    if (session.context?.coordinate) return 'coordinate';
    if (session.context?.analysisSessionId) return 'analysis';
    return 'general';
  };

  const handleNewSession = useCallback(() => {
    onNewSession();
    setIsExpanded(false);
  }, [onNewSession]);

  const handleSessionSelect = useCallback((sessionId: string) => {
    onSessionChange(sessionId);
    setIsExpanded(false);
  }, [onSessionChange]);

  const handleClearSession = useCallback(() => {
    if (showConfirmClear) {
      onClearSession();
      setShowConfirmClear(false);
    } else {
      setShowConfirmClear(true);
      // Auto-hide confirm after 3 seconds
      setTimeout(() => setShowConfirmClear(false), 3000);
    }
  }, [onClearSession, showConfirmClear]);

  const handleCompressContext = useCallback(async () => {
    if (showConfirmCompress) {
      try {
        setIsLoading(true);
        await contextCompactingService.compressSession(currentSession.id);
        setShowConfirmCompress(false);
        // Refresh session info
        loadSessionHistory();
        console.log('[ChatSessionManager] Session context compressed successfully');
      } catch (error) {
        console.error('[ChatSessionManager] Failed to compress session:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setShowConfirmCompress(true);
      // Auto-hide confirm after 3 seconds
      setTimeout(() => setShowConfirmCompress(false), 3000);
    }
  }, [currentSession.id, showConfirmCompress, loadSessionHistory]);

  const handleExportSession = useCallback(() => {
    onExportSession(currentSession.id);
  }, [currentSession.id, onExportSession]);

  const getSessionTypeIcon = (type: SessionHistoryItem['sessionType']) => {
    switch (type) {
      case 'document':
        return '📄';
      case 'coordinate':
        return '🎯';
      case 'analysis':
        return '🔍';
      default:
        return '💬';
    }
  };

  const getSessionTypeColor = (type: SessionHistoryItem['sessionType']) => {
    switch (type) {
      case 'document':
        return 'text-blue-400';
      case 'coordinate':
        return 'text-purple-400';
      case 'analysis':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  // Determine if compression should be suggested
  const shouldSuggestCompression = messageCount > 50;

  return (
    <div className={`session-manager ${className}`}>
      {/* Main Controls Bar */}
      <div className="flex items-center justify-between p-2 bg-epii-darker/50 border-b border-epii-neon/20">
        {/* Left: Session Info */}
        <div className="flex items-center space-x-2">
          <MessageCircle size={16} className="text-epii-neon" />
          <span className="text-xs text-gray-300">
            {messageCount} messages
          </span>
          {shouldSuggestCompression && (
            <span className="text-xs text-yellow-400 animate-pulse">
              • Compression suggested
            </span>
          )}
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center space-x-1">
          {/* New Session */}
          <button
            onClick={handleNewSession}
            className="p-1 hover:bg-epii-neon/20 rounded text-epii-neon"
            title="Start new session"
          >
            <Plus size={14} />
          </button>

          {/* History Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-epii-neon/20 rounded text-epii-neon"
            title="Session history"
          >
            <History size={14} />
            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {/* Clear Session */}
          <button
            onClick={handleClearSession}
            className={`p-1 rounded text-xs ${
              showConfirmClear 
                ? 'bg-red-600 text-white' 
                : 'hover:bg-red-500/20 text-red-400'
            }`}
            title={showConfirmClear ? 'Click to confirm' : 'Clear current session'}
          >
            <Trash2 size={14} />
          </button>

          {/* Compress Context */}
          {shouldSuggestCompression && (
            <button
              onClick={handleCompressContext}
              className={`p-1 rounded text-xs ${
                showConfirmCompress 
                  ? 'bg-yellow-600 text-white' 
                  : 'hover:bg-yellow-500/20 text-yellow-400'
              }`}
              title={showConfirmCompress ? 'Click to confirm compression' : 'Compress long conversation'}
            >
              <Minimize2 size={14} />
            </button>
          )}

          {/* Export Session */}
          <button
            onClick={handleExportSession}
            className="p-1 hover:bg-blue-500/20 rounded text-blue-400"
            title="Export session"
          >
            <Download size={14} />
          </button>
        </div>
      </div>

      {/* Expanded Session History */}
      {isExpanded && (
        <div className="session-history bg-epii-darker/80 border-b border-epii-neon/20 max-h-48 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-400">
              <div className="animate-spin h-4 w-4 border-2 border-epii-neon border-t-transparent rounded-full mx-auto"></div>
              <div className="mt-2 text-xs">Loading sessions...</div>
            </div>
          ) : sessionHistory.length === 0 ? (
            <div className="p-4 text-center text-gray-400 text-xs">
              No previous sessions found
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {sessionHistory.map((session) => (
                <div
                  key={session.id}
                  onClick={() => handleSessionSelect(session.id)}
                  className={`p-2 rounded cursor-pointer transition-colors ${
                    session.id === currentSession.id
                      ? 'bg-epii-neon/20 border border-epii-neon/40'
                      : 'hover:bg-epii-neon/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <span className="text-sm">{getSessionTypeIcon(session.sessionType)}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-gray-200 truncate">
                          {session.title}
                        </div>
                        {session.contextIndicator && (
                          <div className={`text-xs ${getSessionTypeColor(session.sessionType)}`}>
                            {session.contextIndicator}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <span>{session.messageCount}m</span>
                      {session.isCompressed && (
                        <Minimize2 size={10} className="text-yellow-400" />
                      )}
                      <Clock size={10} />
                      <span>{session.timestamp.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatSessionManager;